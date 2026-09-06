import * as XLSX from 'xlsx';
import { Gender } from '../types';

export interface ParsedStudentItem {
  id: string;
  name: string;
  gender: Gender;
  groupName?: string;
  originalRowIndex: number;
  isSelected: boolean;
}

export interface DetectedMapping {
  headerRowIndex: number;
  nameMode: 'single' | 'split';
  fullNameColIndex: number;
  lastNameColIndex: number;
  firstNameColIndex: number;
  genderMode: 'gender_col' | 'female_mark' | 'all_male' | 'all_female';
  genderColIndex: number;
  femaleMarkColIndex: number;
  groupColIndex: number;
}

// Common Vietnamese female middle names for guessing if gender is missing
const FEMALE_MIDDLE_NAMES = [
  'thị', 'ngọc', 'như', 'thảo', 'linh', 'mai', 'hương', 'lan', 'hà', 'trang', 
  'quỳnh', 'huyền', 'phương', 'my', 'châu', 'an', 'anh', 'tuyết', 'yến', 'ngân'
];

/**
 * Download a standardized sample Excel template
 */
export function downloadSampleStudentExcel() {
  const sampleData = [
    {
      'STT': 1,
      'Họ và tên': 'Nguyễn Văn An',
      'Giới tính': 'Nam',
      'Tổ / Nhóm': 'Tổ 1',
      'Ghi chú': 'Lớp trưởng'
    },
    {
      'STT': 2,
      'Họ và tên': 'Trần Thị Bình',
      'Giới tính': 'Nữ',
      'Tổ / Nhóm': 'Tổ 1',
      'Ghi chú': 'Lớp phó'
    },
    {
      'STT': 3,
      'Họ và tên': 'Lê Hoàng Cúc',
      'Giới tính': 'Nữ',
      'Tổ / Nhóm': 'Tổ 2',
      'Ghi chú': ''
    },
    {
      'STT': 4,
      'Họ và tên': 'Phạm Minh Dũng',
      'Giới tính': 'Nam',
      'Tổ / Nhóm': 'Tổ 2',
      'Ghi chú': ''
    },
    {
      'STT': 5,
      'Họ và tên': 'Vũ Hải Yến',
      'Giới tính': 'Nữ',
      'Tổ / Nhóm': 'Tổ 3',
      'Ghi chú': ''
    },
    {
      'STT': 6,
      'Họ và tên': 'Đặng Quốc Huy',
      'Giới tính': 'Nam',
      'Tổ / Nhóm': 'Tổ 3',
      'Ghi chú': ''
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 8 },  // STT
    { wch: 26 }, // Họ và tên
    { wch: 12 }, // Giới tính
    { wch: 14 }, // Tổ / Nhóm
    { wch: 18 }, // Ghi chú
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách học sinh');
  XLSX.writeFile(workbook, 'Mau_Danh_Sach_Hoc_Sinh.xlsx');
}

/**
 * Read File into XLSX Workbook with modern ArrayBuffer
 */
export async function readExcelWorkbook(file: File): Promise<XLSX.WorkBook> {
  let arrayBuffer: ArrayBuffer;
  if (typeof file.arrayBuffer === 'function') {
    arrayBuffer = await file.arrayBuffer();
  } else {
    arrayBuffer = await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as ArrayBuffer);
      fr.onerror = () => reject(new Error('Không thể đọc dữ liệu file.'));
      fr.readAsArrayBuffer(file);
    });
  }

  const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
    type: 'array',
    cellDates: true,
  });

  return workbook;
}

/**
 * Extract 2D raw rows from a sheet
 */
export function getSheetRawRows(worksheet: XLSX.WorkSheet): any[][] {
  const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
    blankrows: false,
  });
  return rawRows;
}

/**
 * Smartly detect which row is the header row
 */
export function detectHeaderRowIndex(rawRows: any[][]): number {
  if (!rawRows || rawRows.length === 0) return 0;

  const maxScanRows = Math.min(rawRows.length, 25);
  let bestRowIndex = 0;
  let highestScore = -999;

  for (let r = 0; r < maxScanRows; r++) {
    const row = rawRows[r] || [];
    const nonBlankCells = row.filter((cell: any) => String(cell || '').trim().length > 0);
    if (nonBlankCells.length === 0) continue;

    const rowText = row.map((cell: any) => String(cell || '').toLowerCase().trim()).join(' ');

    let score = nonBlankCells.length;

    // Check for core keyword indicators of a header row
    const hasNameKeyword = /họ\s*(và|v&)?\s*tên|họ\s*tên|tên\s*học\s*sinh|họ\s*đệm|họ\s*và\s*chữ\s*đệm|họ\s*lót|^tên$|student\s*name|full\s*name/i.test(rowText);
    const hasGenderKeyword = /giới\s*tính|^nữ$|^nữ\s*\(|phái|gender|sex/i.test(rowText);
    const hasSttKeyword = /\bstt\b|số\s*thứ\s*tự|mã\s*hs|mã\s*học\s*sinh/i.test(rowText);
    const hasDobKeyword = /ngày\s*sinh|năm\s*sinh|dob|birth/i.test(rowText);
    const hasGroupKeyword = /tổ|nhóm|lớp|class|group/i.test(rowText);

    if (hasNameKeyword) score += 20;
    if (hasGenderKeyword) score += 15;
    if (hasSttKeyword) score += 10;
    if (hasDobKeyword) score += 5;
    if (hasGroupKeyword) score += 5;

    // Heavy penalty for single-cell rows that are obviously document banners/titles
    if (nonBlankCells.length <= 1) {
      score -= 25;
    }
    // Heavy penalty if row looks like school banner or header metadata
    if (/trường\s*tiểu\s*học|phòng\s*giáo\s*dục|sở\s*giáo\s*dục|bộ\s*giáo\s*dục|năm\s*học\s*20\d\d/i.test(rowText) && !hasNameKeyword) {
      score -= 30;
    }

    if (score > highestScore) {
      highestScore = score;
      bestRowIndex = r;
    }
  }

  // If score is reasonable, return detected row. Otherwise fallback to first row with >= 2 cells
  if (highestScore > 5) {
    return bestRowIndex;
  }

  const firstMultiCellRow = rawRows.findIndex(r => (r || []).filter((c: any) => String(c || '').trim()).length >= 2);
  return firstMultiCellRow >= 0 ? firstMultiCellRow : 0;
}

/**
 * Detect column mapping from a chosen header row
 */
export function detectColumnMapping(
  rawHeaders: string[],
  rawRows: any[][],
  headerRowIndex: number
): DetectedMapping {
  const headersLower = rawHeaders.map(h => String(h || '').toLowerCase().trim());

  let fullNameColIndex = -1;
  let lastNameColIndex = -1;
  let firstNameColIndex = -1;
  let genderColIndex = -1;
  let femaleMarkColIndex = -1;
  let groupColIndex = -1;

  headersLower.forEach((h, idx) => {
    if (!h) return;

    // Full name column
    if (/họ\s*(và|v&)?\s*tên|họ\s*tên|tên\s*học\s*sinh|full\s*name|student\s*name/i.test(h)) {
      if (fullNameColIndex === -1) fullNameColIndex = idx;
    }

    // Split: Last name / Họ đệm
    if (/họ\s*(và|v&)?\s*(chữ\s*)?đệm|họ\s*đệm|họ\s*lót|^họ$|last\s*name/i.test(h)) {
      if (lastNameColIndex === -1) lastNameColIndex = idx;
    }

    // Split: First name / Tên
    if (/^tên$|^tên\s*gọi|^tên\s*khai\s*sinh|first\s*name/i.test(h)) {
      if (firstNameColIndex === -1) firstNameColIndex = idx;
    }

    // Gender column
    if (/giới\s*tính|phái|gender|sex/i.test(h)) {
      if (genderColIndex === -1) genderColIndex = idx;
    }

    // Female check column ('Nữ')
    if (/^nữ(\s*\(?x\)?)?$|^nữ\?$/i.test(h)) {
      if (femaleMarkColIndex === -1) femaleMarkColIndex = idx;
    }

    // Group column
    if (/^tổ$|^nhóm$|tổ\s*\/|tổ\s*học\s*tập|nhóm\s*học\s*tập|^group$|^team$/i.test(h)) {
      if (groupColIndex === -1) groupColIndex = idx;
    }
  });

  // Determine Name Mode
  let nameMode: 'single' | 'split' = 'single';
  if (lastNameColIndex !== -1 && firstNameColIndex !== -1 && fullNameColIndex === -1) {
    nameMode = 'split';
  } else if (fullNameColIndex !== -1) {
    nameMode = 'single';
  } else if (firstNameColIndex !== -1 && lastNameColIndex === -1) {
    fullNameColIndex = firstNameColIndex;
    nameMode = 'single';
  } else {
    // Fallback heuristic: search in data rows for a column containing Vietnamese full names
    const sampleRow = rawRows[headerRowIndex + 1] || [];
    let detectedCol = -1;
    for (let c = 0; c < sampleRow.length; c++) {
      const val = String(sampleRow[c] || '').trim();
      if (val.split(/\s+/).length >= 2 && !/^\d+$/.test(val)) {
        detectedCol = c;
        break;
      }
    }
    fullNameColIndex = detectedCol >= 0 ? detectedCol : 1;
    nameMode = 'single';
  }

  // Determine Gender Mode
  let genderMode: 'gender_col' | 'female_mark' | 'all_male' | 'all_female' = 'gender_col';
  if (femaleMarkColIndex !== -1 && genderColIndex === -1) {
    genderMode = 'female_mark';
  } else if (genderColIndex !== -1) {
    genderMode = 'gender_col';
  } else {
    // Check if any column contains words like 'Nam' or 'Nữ'
    const sampleRows = rawRows.slice(headerRowIndex + 1, headerRowIndex + 5);
    for (let c = 0; c < (rawHeaders.length || 10); c++) {
      const hasGenderValues = sampleRows.some(row => {
        const cell = String(row?.[c] || '').toLowerCase().trim();
        return cell === 'nam' || cell === 'nữ' || cell === 'boy' || cell === 'girl';
      });
      if (hasGenderValues) {
        genderColIndex = c;
        genderMode = 'gender_col';
        break;
      }
    }
  }

  return {
    headerRowIndex,
    nameMode,
    fullNameColIndex,
    lastNameColIndex,
    firstNameColIndex,
    genderMode,
    genderColIndex,
    femaleMarkColIndex,
    groupColIndex,
  };
}

/**
 * Check if a raw text looks like footer or invalid non-student row
 */
function isNoiseRow(name: string): boolean {
  if (!name) return true;
  const lower = name.toLowerCase().trim();
  if (lower.length < 2) return true;

  // Pure digits or symbols
  if (/^[\d\s.,\-_/\\()]+$/.test(lower)) return true;

  // Header/footer keywords
  const noiseKeywords = [
    'tổng số', 'tổng cộng', 'giáo viên', 'hiệu trưởng', 'chủ nhiệm',
    'ban giám hiệu', 'ký và ghi rõ', 'ký tên', 'ghi chú', 'thống kê',
    'họ và tên', 'họ tên', 'stt', 'ngày ... tháng', 'ngày tháng năm',
    'xác nhận', 'danh sách lớp'
  ];

  return noiseKeywords.some(kw => lower.includes(kw));
}

/**
 * Parse rows into Student List using mapping
 */
export function extractStudentsFromRawRows(
  rawRows: any[][],
  mapping: DetectedMapping
): ParsedStudentItem[] {
  const result: ParsedStudentItem[] = [];
  const startIndex = mapping.headerRowIndex + 1;

  for (let r = startIndex; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!row || row.length === 0) continue;

    // Extract name
    let studentName = '';
    if (mapping.nameMode === 'split') {
      const last = String(row[mapping.lastNameColIndex] || '').trim();
      const first = String(row[mapping.firstNameColIndex] || '').trim();
      studentName = `${last} ${first}`.trim();
    } else {
      studentName = String(row[mapping.fullNameColIndex] || '').trim();
    }

    // Skip noise rows
    if (isNoiseRow(studentName)) continue;

    // Extract gender
    let gender: Gender = 'Nam';
    if (mapping.genderMode === 'all_male') {
      gender = 'Nam';
    } else if (mapping.genderMode === 'all_female') {
      gender = 'Nữ';
    } else if (mapping.genderMode === 'female_mark') {
      const mark = String(row[mapping.femaleMarkColIndex] || '').trim().toLowerCase();
      const isFemale = ['x', '1', 'v', 'nữ', 'yes', 'true', 'x '].includes(mark);
      gender = isFemale ? 'Nữ' : 'Nam';
    } else if (mapping.genderColIndex !== -1) {
      const genderRaw = String(row[mapping.genderColIndex] || '').trim().toLowerCase();
      if (
        genderRaw.includes('nữ') ||
        genderRaw.includes('nu') ||
        genderRaw === 'gái' ||
        genderRaw === 'girl' ||
        genderRaw === 'f' ||
        genderRaw === '2'
      ) {
        gender = 'Nữ';
      } else if (
        genderRaw.includes('nam') ||
        genderRaw === 'trai' ||
        genderRaw === 'boy' ||
        genderRaw === 'm' ||
        genderRaw === '1'
      ) {
        gender = 'Nam';
      } else {
        // Fallback: guess by Vietnamese middle names
        const words = studentName.toLowerCase().split(/\s+/);
        const hasFemaleMiddle = words.some(w => FEMALE_MIDDLE_NAMES.includes(w));
        gender = hasFemaleMiddle ? 'Nữ' : 'Nam';
      }
    } else {
      // Guess by name
      const words = studentName.toLowerCase().split(/\s+/);
      const hasFemaleMiddle = words.some(w => FEMALE_MIDDLE_NAMES.includes(w));
      gender = hasFemaleMiddle ? 'Nữ' : 'Nam';
    }

    // Extract group
    let groupName: string | undefined = undefined;
    if (mapping.groupColIndex !== -1 && row[mapping.groupColIndex]) {
      const grp = String(row[mapping.groupColIndex]).trim();
      if (grp) groupName = grp;
    }

    result.push({
      id: `row-${r}-${Math.random().toString(36).substring(2, 6)}`,
      name: studentName,
      gender,
      groupName,
      originalRowIndex: r,
      isSelected: true,
    });
  }

  return result;
}

/**
 * Parse pasted text list (e.g. copied from Zalo, Word, Excel)
 */
export function parsePastedText(text: string): ParsedStudentItem[] {
  if (!text || !text.trim()) return [];

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const result: ParsedStudentItem[] = [];

  lines.forEach((line, idx) => {
    // Handle tab-separated lines (e.g. copied straight from Excel or Google Sheets)
    if (line.includes('\t')) {
      const parts = line.split('\t').map(p => p.trim()).filter(Boolean);
      let namePart = parts[0];
      let genderPart = parts[1] || '';

      // If parts[0] is just STT number like "1"
      if (/^\d+$/.test(parts[0]) && parts.length >= 2) {
        namePart = parts[1];
        genderPart = parts[2] || '';
      }

      if (namePart && !isNoiseRow(namePart)) {
        const isBoy =
          genderPart.toLowerCase().includes('nam') ||
          genderPart.toLowerCase() === 'm' ||
          genderPart.toLowerCase() === 'trai';
        const isGirl =
          genderPart.toLowerCase().includes('nữ') ||
          genderPart.toLowerCase().includes('nu') ||
          genderPart.toLowerCase() === 'f' ||
          genderPart.toLowerCase() === 'gái';

        let gender: Gender = 'Nam';
        if (isGirl) gender = 'Nữ';
        else if (isBoy) gender = 'Nam';
        else {
          const hasFemaleMiddle = namePart.toLowerCase().split(/\s+/).some(w => FEMALE_MIDDLE_NAMES.includes(w));
          gender = hasFemaleMiddle ? 'Nữ' : 'Nam';
        }

        result.push({
          id: `paste-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          name: namePart,
          gender,
          originalRowIndex: idx,
          isSelected: true,
        });
        return;
      }
    }

    // Remove leading numbering like "1.", "1/", "1 -", "[1]"
    let cleanLine = line.replace(/^\s*\[?\d+[.)\-\]/:]*\s*/, '').trim();
    if (!cleanLine) return;

    // Check for delimiter like " - ", " : ", " , ", " | "
    let name = cleanLine;
    let gender: Gender = 'Nam';

    const matchDelimiter = cleanLine.match(/^(.*?)\s*[-–|,:;]\s*(nam|nữ|nu|trai|gái|boy|girl)\s*$/i);
    if (matchDelimiter) {
      name = matchDelimiter[1].trim();
      const gStr = matchDelimiter[2].toLowerCase();
      gender = (gStr.includes('nữ') || gStr.includes('nu') || gStr === 'gái' || gStr === 'girl') ? 'Nữ' : 'Nam';
    } else {
      // Guess gender by middle name
      const words = name.toLowerCase().split(/\s+/);
      const hasFemaleMiddle = words.some(w => FEMALE_MIDDLE_NAMES.includes(w));
      gender = hasFemaleMiddle ? 'Nữ' : 'Nam';
    }

    if (!isNoiseRow(name)) {
      result.push({
        id: `paste-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        name,
        gender,
        originalRowIndex: idx,
        isSelected: true,
      });
    }
  });

  return result;
}
