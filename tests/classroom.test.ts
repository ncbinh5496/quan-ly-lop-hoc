import test from 'node:test';
import assert from 'node:assert/strict';
import { createClassroomStore } from '../src/store/index';
import { STORAGE_KEY, type SyncStorage } from '../src/store/persistence';
import { encodeBackup, parseBackup } from '../src/store/validation';
import { classroomDate, periodStart } from '../src/utils/dates';
import { getLevelForPoints } from '../src/utils/helpers';
import { DEFAULT_LEVELS } from '../src/utils/defaults';
import { getRankedStudents } from '../src/utils/scoreCalculator';
import type { ClassData, Student } from '../src/types';
class MemoryStorage implements SyncStorage {
  value: string | null = null; writes = 0; fail = false;
  getItem(key: string) { assert.equal(key,STORAGE_KEY); return this.value; }
  setItem(key: string,value: string) { assert.equal(key,STORAGE_KEY); if (this.fail) throw new DOMException('Full','QuotaExceededError'); this.value=value; this.writes++; }
}
function fixture(count=2) {
  const storage = new MemoryStorage();
  const store=createClassroomStore(storage);
  const students: Student[]=Array.from({length:count},(_,i)=>({id:`s${i}`,name:`HS ${i}`,gender:'Nam',avatarId:'boy-1',points:0,totalPositivePoints:0,totalNegativePoints:0,badgeIds:[],status:'active'}));
  const c: ClassData={id:'c1',name:'Lớp thử',students,groups:[{id:'g1',name:'Tổ 1'}],transactions:[],rewardTransactions:[],badges:[],attendanceRecords:[]};
  store.setState({classes:[c],activeClassId:c.id});storage.writes=0;
  const current=()=>store.getState().classes[0];
  const attendance=(statuses: Record<string,'present'|'late'|'excused'|'unexcused'>,reward=true)=>store.getState().saveAttendance('c1',{date:'2026-09-06',studentStatuses:statuses,totalStudents:count,presentCount:0,lateCount:0,absentCount:0},reward);
  return {store,storage,current,attendance};
}

test('renaming through legacy createClass preserves the only class, students and history',()=>{
  const {store,current}=fixture();store.getState().addPoints('s0',3,'Điểm');
  const students=current().students,transactions=current().transactions;
  store.getState().createClass('Lớp đổi tên');
  assert.equal(current().id,'c1');assert.equal(current().name,'Lớp đổi tên');assert.equal(current().students,students);assert.equal(current().transactions,transactions);assert.equal(store.getState().classes.length,1);
});
test('invalid class selection cannot orphan active state',()=>{const {store}=fixture();store.getState().setActiveClass('missing');assert.equal(store.getState().activeClassId,'c1')});
test('attendance rewards are idempotent and store computed headcounts',()=>{
  const {current,attendance,storage}=fixture();assert(attendance({s0:'present',s1:'late'}));assert(attendance({s0:'present',s1:'late'}));
  assert.deepEqual(current().students.map(s=>s.points),[2,1]);assert.equal(current().transactions.length,2);assert.equal(current().attendanceRecords!.length,1);assert.equal(current().attendanceRecords![0].presentCount,1);assert.equal(current().attendanceRecords![0].lateCount,1);assert.equal(storage.writes,1);
});
test('attendance correction adjusts awarded points, not disciplinary totals',()=>{
  const {current,attendance}=fixture();attendance({s0:'present',s1:'present'});attendance({s0:'late',s1:'excused'});
  assert.deepEqual(current().students.map(s=>[s.points,s.totalPositivePoints,s.totalNegativePoints]),[[1,1,0],[0,0,0]]);
  assert.equal(current().transactions.length,1);assert.equal(current().transactions[0].amount,1);
});
test('disabling attendance rewards removes only that date rewards',()=>{
  const {store,current,attendance}=fixture();store.getState().addPoints('s0',5,'Bài tập');attendance({s0:'present',s1:'present'});attendance({s0:'present',s1:'present'},false);
  assert.deepEqual(current().students.map(s=>s.points),[5,0]);assert.equal(current().transactions.length,1);
});
test('undo attendance reverses entire batch and permits a later explicit award',()=>{
  const {store,current,attendance}=fixture();attendance({s0:'present',s1:'late'});store.getState().undoLastTransaction();assert.deepEqual(current().students.map(s=>s.points),[0,0]);
  assert.equal(current().attendanceRecords!.length,1);attendance({s0:'present',s1:'late'});assert.deepEqual(current().students.map(s=>s.points),[2,1]);
});
test('legacy attendance is never guessed or awarded again',()=>{
  const {store,current,attendance}=fixture();store.setState({classes:[{...current(),attendanceRecords:[{id:'old',date:'2026-09-06',studentStatuses:{s0:'present',s1:'present'},presentCount:2,lateCount:0,absentCount:0,totalStudents:2,timestamp:0}]}]});
  attendance({s0:'late',s1:'present'});assert.deepEqual(current().students.map(s=>s.points),[0,0]);assert.equal(current().transactions.length,0);
});
test('forty-student attendance writes once; toast/modal changes never write',()=>{
  const {store,current,attendance,storage}=fixture(40);attendance(Object.fromEntries(current().students.map(s=>[s.id,'present'])));
  assert.equal(storage.writes,1);store.getState().showToast('Đã lưu');store.getState().hideToast();store.getState().setPointModal({studentId:'s0',type:'positive'});store.getState().setPointModal(null);assert.equal(storage.writes,1);
});
test('failed storage write preserves both memory and disk and reports failure',()=>{
  const {store,storage,current,attendance}=fixture();const before=storage.value;storage.fail=true;
  assert.equal(attendance({s0:'present',s1:'late'}),false);assert.deepEqual(current().students.map(s=>s.points),[0,0]);assert.equal(storage.value,before);assert(store.getState().storageError);
  store.getState().showToast('Thành công');assert.equal(store.getState().toast!.type,'error');
  storage.fail=false;attendance({s0:'present',s1:'late'});assert.equal(store.getState().storageError,null);assert.equal(current().students[0].points,2);
});
test('concurrent window cannot overwrite a newer stored record',()=>{
  const {store,storage,current}=fixture();const second=createClassroomStore(storage);second.getState().addPoints('s0',5,'Cửa sổ 2');const latest=storage.value;
  store.getState().addPoints('s0',1,'Cửa sổ 1');assert.equal(storage.value,latest);assert.equal(current().students[0].points,0);assert.match(store.getState().storageError!,/cửa sổ khác/);
});
test('invalid restore leaves original class and saved bytes intact',()=>{
  const {store,storage,current}=fixture();const before=storage.value,old=current();assert.equal(store.getState().restoreData({classes:{bad:true}}),false);assert.equal(current(),old);assert.equal(storage.value,before);
});
test('restore whitelists data and cannot overwrite actions',()=>{
  const {store}=fixture();const data=JSON.parse(encodeBackup(store.getState())).state;const action=store.getState().showToast;
  assert.equal(store.getState().restoreData({...data,showToast:'corrupt',toast:'corrupt'}),true);assert.equal(store.getState().showToast,action);assert.equal(store.getState().toast,null);
});
test('legacy backups load and additional classes are archived, never discarded',()=>{
  const {store,storage,current}=fixture();const state=JSON.parse(encodeBackup(store.getState())).state;state.classes.push({...current(),id:'c2',name:'Lớp cũ'});
  storage.value=JSON.stringify({state,version:0});const reloaded=createClassroomStore(storage);assert.equal(reloaded.getState().classes.length,1);assert.equal(reloaded.getState().archivedClasses.length,1);assert.equal(reloaded.getState().archivedClasses[0].id,'c2');assert.equal(reloaded.getState().storageBlocked,false);
  reloaded.getState().addPoints('s0',1,'Bài tập');assert.equal(parseBackup(storage.value!).archivedClasses.length,1);
});
test('malformed and future-version stored backups block writes without destroying originals',()=>{
  for (const raw of ['{bad',JSON.stringify({version:99,state:{}})]) {const storage=new MemoryStorage();storage.value=raw;const store=createClassroomStore(storage);assert(store.getState().storageBlocked);store.getState().addStudent({name:'HS',gender:'Nam',avatarId:'boy-1',status:'active'});assert.equal(storage.value,raw);assert.equal(storage.writes,0);}
});
test('backup rejects duplicate IDs and nonfinite or missing core values',()=>{
  const {store}=fixture();const data=JSON.parse(encodeBackup(store.getState()));data.state.classes[0].students.push(data.state.classes[0].students[0]);assert.throws(()=>parseBackup(JSON.stringify(data)));
  const valid=JSON.parse(encodeBackup(store.getState()));valid.state.classes[0].students[0].points=null;assert.throws(()=>parseBackup(JSON.stringify(valid)));
});
test('Excel import maps existing and new group names in one write',()=>{
  const {store,current,storage}=fixture();store.getState().importStudents([{name:'HS A',gender:'Nam',avatarId:'boy-1',groupName:' tổ  1 '},{name:'HS B',gender:'Nữ',avatarId:'girl-1',groupName:'Tổ mới'}]);
  assert.equal(current().students[2].groupId,'g1');assert(current().groups.some(g=>g.id===current().students[3].groupId&&g.name==='Tổ mới'));assert.equal(storage.writes,1);
});
test('replace roster archives old points and clears active orphan history',()=>{
  const {store,current}=fixture();store.getState().addPoints('s0',10,'Cũ');store.getState().importStudents([{name:'Mới',gender:'Nam',avatarId:'boy-1'}],{replace:true});
  assert.equal(current().students.length,1);assert.equal(current().transactions.length,0);assert.equal(current().attendanceRecords!.length,0);assert.equal(store.getState().archivedClasses[0].transactions[0].amount,10);assert.equal(store.getState().archivedClasses[0].students[0].id,'s0');assert.doesNotThrow(()=>parseBackup(encodeBackup(store.getState())));
});
test('full reset removes customization and archived records',()=>{
  const {store}=fixture();store.getState().setHeaderCoverUrl('custom');store.getState().addCustomRewardIcon({url:'data:image/png;base64,A'});store.getState().resetData();assert.notEqual(store.getState().headerCoverUrl,'custom');assert.equal(store.getState().customRewardIcons!.length,0);assert.equal(store.getState().archivedClasses.length,0);assert.equal(store.getState().classes.length,1);
});
test('negative and boundary scores receive the correct level',()=>{
  for (const [score,id] of [[-10,'l1'],[0,'l1'],[19,'l1'],[20,'l2'],[100,'l6'],[10000,'l6']] as const) assert.equal(getLevelForPoints(score,DEFAULT_LEVELS).id,id);
});
test('Vietnam dates and Monday/month boundaries ignore the device timezone',()=>{
  const date=new Date('2026-09-06T06:30:00+07:00');assert.equal(classroomDate(date),'2026-09-06');assert.equal(classroomDate(periodStart('week',date)),'2026-08-31');assert.equal(classroomDate(periodStart('month',date)),'2026-09-01');assert.equal(classroomDate(periodStart('today',date)),'2026-09-06');
});
test('period rankings give zero to students with no transactions in period',()=>{const {current}=fixture();const students=current().students.map(s=>({...s,points:50}));assert.equal(getRankedStudents(students,[],'today')[0].periodScore,0)});
test('reward balance and inactive rewards are enforced inside the store',()=>{
  const {store,current}=fixture();const reward=store.getState().rewards[0];assert.equal(store.getState().redeemReward('s0',reward.id),false);assert.equal(current().students[0].points,0);
  store.getState().addPoints('s0',reward.cost,'Đủ điểm');store.getState().updateReward(reward.id,{isActive:false});assert.equal(store.getState().redeemReward('s0',reward.id),false);
  store.getState().updateReward(reward.id,{isActive:true});assert.equal(store.getState().redeemReward('s0',reward.id),true);assert.equal(current().students[0].points,0);assert.equal(current().rewardTransactions[0].rewardName,reward.name);
});
test('group replacement clears deleted references and persists leader metadata',()=>{
  const {store,current}=fixture();store.getState().assignStudentToGroup('s0','g1');store.getState().batchApplyGroups([{id:'new',name:'Mới',leaderId:'s1',icon:'⭐'}],{s1:'new'});assert.equal(current().students[0].groupId,undefined);assert.equal(current().groups[0].leaderId,'s1');
});
