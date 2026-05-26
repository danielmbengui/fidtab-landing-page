import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  browserPopupRedirectResolver,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { firebasePublicConfig } from "@/lib/firebasePublicConfig";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = firebasePublicConfig;

if (typeof window !== "undefined") {
  const required = ["apiKey", "authDomain", "projectId", "appId"];
  const missing = required.filter((key) => !firebaseConfig[key]);
  if (missing.length > 0) {
    console.error(
      "[Vaakai Auth] Config Firebase incomplète:",
      missing.join(", "),
      "— vérifiez .env.local et redémarrez npm run dev.",
    );
  }
}

/** Une seule app Firebase (évite les doubles init au HMR Next.js / rechargements). */
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * Auth : persistance figée à l’init (pas de `setPersistence` async après coup).
 * - Navigateur : IndexedDB d’abord, puis localStorage — meilleure tenue en WebView Capacitor.
 * - SSR / Node : `getAuth` uniquement (pas de stockage local).
 * - Hot reload : `initializeAuth` a déjà tourné → on retombe sur `getAuth`.
 */
function getOrCreateAuth() {
  if (typeof window === "undefined") {
    return getAuth(app);
  }
  try {
    return initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence],
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch (err) {
    const code = /** @type {{ code?: string }} */ (err)?.code;
    if (code !== "auth/already-initialized") {
      console.warn("[PlayPad] Firebase Auth init fallback getAuth:", code ?? err);
    }
    return getAuth(app);
  }
}

const auth = getOrCreateAuth();

const firestore = getFirestore(app);
const storage = getStorage(app);

/** Realtime Database — uniquement si databaseURL est configurée. */
const database = firebaseConfig.databaseURL ? getDatabase(app) : null;

let messagingPromise = null;

/** Messaging FCM — initialisation lazy côté client uniquement. */
export async function getFirebaseMessaging() {
  if (typeof window === "undefined") return null;

  if (!messagingPromise) {
    messagingPromise = (async () => {
      const { isSupported, getMessaging } = await import("firebase/messaging");
      if (!(await isSupported())) return null;
      return getMessaging(app);
    })();
  }

  return messagingPromise;
}

export { app, auth, firestore, database, storage };
