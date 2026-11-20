import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

const STORAGE_FIREBASE_CONFIG_KEY = 'prep_tracker_firebase_config';

export function getActiveFirebaseConfig(): FirebaseConfig | null {
  // 1. Check Vite Environment variables (Vercel)
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
  }

  // 2. Check LocalStorage fallback for user-entered config
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(STORAGE_FIREBASE_CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.apiKey && parsed.projectId) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
  }

  return null;
}

export function saveUserFirebaseConfig(config: FirebaseConfig | null): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  if (!config) {
    localStorage.removeItem(STORAGE_FIREBASE_CONFIG_KEY);
  } else {
    localStorage.setItem(STORAGE_FIREBASE_CONFIG_KEY, JSON.stringify(config));
  }
}

let firestoreInstance: Firestore | null = null;

export function getFirebaseDb(): Firestore | null {
  if (firestoreInstance) return firestoreInstance;

  const config = getActiveFirebaseConfig();
  if (!config) return null;

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    firestoreInstance = getFirestore(app);
    return firestoreInstance;
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
    return null;
  }
}
