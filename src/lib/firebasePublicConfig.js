/** Config Firebase côté client (variables NEXT_PUBLIC_* dans .env.local). */
export const firebasePublicConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    ?? process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? process.env.NEXT_PUBLIC_APP_ID,
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? process.env.NEXT_PUBLIC_DATABASE_URL,
}
