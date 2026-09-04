import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import config from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(config);

// Support custom firestoreDatabaseId if configured in config
export const db = config.firestoreDatabaseId 
  ? initializeFirestore(app, {}, config.firestoreDatabaseId)
  : getFirestore(app);

export { app };
