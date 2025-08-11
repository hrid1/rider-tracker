import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBEXACT-KEY-YOU-COPY',
  authDomain: 'fcmdem-bda98.firebaseapp.com',
  projectId: 'fcmdem-bda98',
  storageBucket: 'fcmdem-bda98.appspot.com',
  messagingSenderId: '355569403620',
  appId: '1:355569403620:web:YOUR_APP_ID_HERE',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
