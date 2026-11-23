import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

// These values identify the project; they are not secrets. Access is controlled by firestore.rules.
const firebaseConfig = {
  apiKey: 'AIzaSyA8NAbkXbdX4zI1ThhrUCFIhVirNwEGcQ0',
  authDomain: 'apal-be8eb.firebaseapp.com',
  projectId: 'apal-be8eb',
  storageBucket: 'apal-be8eb.firebasestorage.app',
  messagingSenderId: '949219250504',
  appId: '1:949219250504:web:0d563a69af190ae1b1e37d',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Keeps a copy of the data on the device, so the app works offline and syncs when back online.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

/** Student accounts get a made-up address on the project's own domain. No email is ever sent. */
export const STUDENT_EMAIL_DOMAIN = 'students.apal-be8eb.firebaseapp.com';
