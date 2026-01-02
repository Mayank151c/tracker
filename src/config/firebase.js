// Firebase Configuration
// Reads from .env file automatically

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Get Firebase config from environment variables
export const getFirebaseConfig = () => {
  const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
  const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
  const appId = process.env.REACT_APP_FIREBASE_APP_ID;
  
  if (!apiKey || !projectId || !appId) {
    return null;
  }

  return {
    apiKey: apiKey,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId: projectId,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
    appId: appId
  };
};

// Initialize Firebase instances
let app = null;
let db = null;

export const initFirebase = async (config) => {
  try {
    if (app) {
      // Already initialized, return existing instances
      return { app, db };
    }
    
    app = initializeApp(config);
    db = getFirestore(app);
    
    return { app, db };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

