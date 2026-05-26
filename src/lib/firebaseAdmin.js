import admin from "firebase-admin";

function parseServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    console.error("[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_KEY JSON invalide");
    return null;
  }
}

/** @returns {admin.app.App} */
export function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccount = parseServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY manquante — ajoutez le JSON du compte de service dans .env.local",
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId:
      process.env.NEXT_PUBLIC_PROJECT_ID?.trim() || serviceAccount.project_id,
  });
}

export function getAdminAuth() {
  getFirebaseAdminApp();
  return admin.auth();
}

export function getAdminFirestore() {
  getFirebaseAdminApp();
  return admin.firestore();
}

export function getAdminMessaging() {
  getFirebaseAdminApp();
  return admin.messaging();
}
