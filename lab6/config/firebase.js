import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB7QnCcE-nXB_IJqwVTScqD0wHkjX8tacI",
  authDomain: "mobilelab6-3122a.firebaseapp.com",
  projectId: "mobilelab6-3122a",
  storageBucket: "mobilelab6-3122a.firebasestorage.app",
  messagingSenderId: "926545672414",
  appId: "1:926545672414:web:f67b529c7b67dcd1426a4f",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);