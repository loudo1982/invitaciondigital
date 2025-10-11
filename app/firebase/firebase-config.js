import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKkOnMNcbTzj8j1k_gpnIfXd9EQ5yGHHk",
  authDomain: "invitacion-digital-31a78.firebaseapp.com",
  projectId: "invitacion-digital-31a78",
  storageBucket: "invitacion-digital-31a78.firebasestorage.app",
  messagingSenderId: "440728409571",
  appId: "1:440728409571:web:c435959025a749e42bfcd6"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
