import { useEffect, useState } from 'react';
import { initFirebase, getFirebaseConfig } from '../config/firebase';
import { collection, addDoc, getDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import './HealthCheck.css';

const healthCheckType = {
  CONNECTION: 'connection',
  WRITE: 'write',
  READ: 'read',
}

export default function HealthCheck({ onSuccess }) {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [error, setError] = useState(null);

  // Check if .env config exists
  const envConfig = getFirebaseConfig();
  const hasEnvConfig = !!envConfig;

  const addTestResult = (id, test, status, message) => {
    setTestResults(prev => {
      const index = prev.findIndex(result => result?.id == id);
      if(index != -1) {
        prev[index] = { id, test, status, message, timestamp: new Date() };
        return prev;
      } else {
        return [...prev, { id, test, status, message, timestamp: new Date() }]
      }
    });
  };

  const runConnectionTest = async (firestoreDb) => {
    // Test 1: Write to Firestore (quick test)
    addTestResult(healthCheckType.WRITE, 'Testing Write', 'testing', 'Writing test document...');
    const testCollection = collection(firestoreDb, 'healthCheck');
    const testDoc = await Promise.race([
      addDoc(testCollection, {
        timestamp: Timestamp.now(),
        test: 'health-check'
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Write operation timed out')), 10000)
      )
    ]);
    addTestResult(healthCheckType.WRITE, 'Write Test', 'success', 'Write successful', true);

    // Test 2: Read from Firestore (quick test using getDoc)
    addTestResult(healthCheckType.READ, 'Testing Read', 'testing', 'Reading test document...');
    const testDocRef = doc(firestoreDb, 'env', process.env.NODE_ENV, '_connectionTest', testDoc.id);
    const docSnapshot = await Promise.race([
      getDoc(testDocRef),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Read operation timed out')), 10000)
      )
    ]);

    if (docSnapshot.exists()) {
      addTestResult(healthCheckType.READ, 'Read Test', 'success', 'Read successful', true);
    } else {
      throw new Error('Could not read the test document');
    }

    // Cleanup: Delete test document (non-blocking, don't wait for it)
    deleteDoc(testDocRef).catch(() => {
      // Ignore cleanup errors
    });

    return true;
  };

  const testConfiguration = async (firebaseConfig) => {
    setTesting(true);
    setTestResults([]);
    setError(null);

    try {
      // Test 1: Initialize Firebase (with timeout)
      addTestResult(healthCheckType.CONNECTION, 'Initializing Firebase', 'testing', 'Connecting to Firebase...');
      const initPromise = initFirebase(firebaseConfig);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firebase initialization timed out')), 15000)
      );

      const { db: firestoreDb } = await Promise.race([initPromise, timeoutPromise]);
      addTestResult(healthCheckType.CONNECTION, 'Initialized Firebase', 'success', 'Firebase connected', true);

      // Test 2: Quick Firestore connection test
      await runConnectionTest(firestoreDb);

      // Return the db instance for the main app
      return firestoreDb;
    } catch (err) {
      console.error('Configuration check failed:', err);

      let errorMessage = 'Configuration check failed. ';

      if (err.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your Firestore security rules. ' +
          'Update rules to allow read/write: rules_version = \'2\'; service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if true; } } }';
      } else if (err.code === 'unavailable') {
        errorMessage = 'Firestore unavailable. Please ensure: 1) Firestore Database is enabled in Firebase Console, 2) Your network connection is working, 3) Firebase configuration is correct.';
      } else if (err.code === 'invalid-argument' || err.message?.includes('API key')) {
        errorMessage = 'Invalid Firebase configuration. Please verify: 1) API Key is correct, 2) Project ID matches your Firebase project, 3) App ID is correct.';
      } else {
        errorMessage += err.message || 'Please check your Firebase configuration and try again.';
      }

      setError(errorMessage);
      return null;
    } finally {
      setTesting(false);
    }
  };

  const handleTestFromEnv = async () => {
    if (!hasEnvConfig) {
      setError('Not found .env configuration file.');
      return;
    }

    const firestoreDb = await testConfiguration(envConfig);
    if (firestoreDb) {
      // Launch immediately after success
      setTimeout(() => onSuccess(firestoreDb, envConfig), 500);
    }
  };

  useEffect(() => {
    handleTestFromEnv();
  }, [])

  return (
    <div className="connection-test">
      <div className="connection-test-container">
        <h1>Perform Health Check</h1>

        {(!testing || !error) && (
          <div className="test-progress">
            <h3>Running Tests...</h3>
            <div className="test-results">
              {testResults.map((result, index) => (
                <div key={index} className={`test-result test-result-${result.status}`}>
                  <span className="test-status">
                    {result.status === 'success' && '✅'}
                    {result.status === 'error' && '❌'}
                    {result.status === 'testing' && '⏳'}
                  </span>
                  <div className="test-info">
                    <div className="test-name">{result.test}</div>
                    <div className="test-message">{result.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <h3>❌ Configuration Error</h3>
            <p>{error}</p>
            <p className="error-help">
              See <strong>TROUBLESHOOTING.md</strong> for detailed solutions.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

