import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

/**
 * Firebase web config. These values are public by design (security comes from Firestore rules
 * and Auth), they only live in env vars so they're easy to swap. See `.env.example`.
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Object.values(config).every(Boolean);

const init = () => {
  const app = initializeApp(config);
  return {
    auth: getAuth(app),
    // The persistent cache keeps a copy in IndexedDB, so the app works offline and syncs later.
    db: initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      ignoreUndefinedProperties: true,
    }),
  };
};

/** `null` when no Firebase config is set: the app then runs purely on localStorage, without accounts. */
export const firebase = isConfigured ? init() : null;
