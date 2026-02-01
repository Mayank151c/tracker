import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import Section from './Section';
import { REACT_APP_ENV, ERRORS, COLLECTIONS } from '../config/constants';
import { getTodayDatetimeString, useConfig } from '../utils';

export default function DailySummary({ selectedDate }) {
  const { db, setError, navigate } = useConfig();

  const [enable, setEnable] = useState(false);
  const [dailySummary, setDailySummary] = useState('');

  // Save daily summary
  const saveSummary = async () => {
    setError(null);
    try {
      const summaryDocRef = doc(db, 'env', REACT_APP_ENV, COLLECTIONS.DAILY_SUMMARIES, selectedDate);
      await setDoc(
        summaryDocRef,
        {
          date: selectedDate,
          summary: dailySummary.trim(),
          updatedAt: getTodayDatetimeString(),
        },
        { merge: true },
      );
      setEnable(false);
    } catch (err) {
      setError(err.message);
      console.error('Error saving summary:', err);
    }
  };

  // Load summary for selected date
  const loadSummary = useCallback(async () => {
    if (!db) {
      setError(ERRORS.FIREBASE);
      return navigate('');
    }

    setError(null);

    try {
      // Load summary for selected date
      const summaryDocRef = doc(db, 'env', REACT_APP_ENV, COLLECTIONS.DAILY_SUMMARIES, selectedDate);
      const summaryDoc = await getDoc(summaryDocRef);
      if (summaryDoc.exists()) {
        setDailySummary(summaryDoc.data().summary || '');
      } else {
        setDailySummary('');
      }
    } catch (err) {
      // Provide specific error messages based on error code
      console.error('Firestore Error:', {
        code: err.code,
        message: err.message,
        stack: err.stack,
      });
      setError(err.message);
    }
  }, [db, selectedDate, navigate, setError]);

  const handleSummaryUpdate = (e) => {
    setDailySummary(e.target.value);
    setEnable(true);
  };

  useEffect(() => {
    loadSummary();
  }, [selectedDate, loadSummary]);

  return (
    <>
      <h2>Daily Summary</h2>
      <Section>
        <textarea
          value={dailySummary}
          onChange={handleSummaryUpdate}
          placeholder="Write a summary of your day..."
          className="summary-textarea"
          rows={dailySummary.split('\n').length}
        />
        <button onClick={saveSummary} className="btn btn-primary" disabled={!enable}>
          Save Summary
        </button>
      </Section>
    </>
  );
}
