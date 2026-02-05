import { useCallback, useEffect, useState } from 'react';

import Section from './Section';
import { ERRORS, COLLECTIONS } from '../config/constants';
import { useConfig, getRecord, setRecord } from '../utils';

export default function DailySummary({ selectedDate }) {
  const { db, setError, navigate } = useConfig();

  const [enable, setEnable] = useState(false);
  const [dailySummary, setDailySummary] = useState('');

  const setSummary = async () => {
    try {
      const updateRecordFields = {
        summary: dailySummary.trim(),
      };
      await setRecord(db, COLLECTIONS.DAILY_SUMMARIES, updateRecordFields, selectedDate);
      setEnable(false);
    } catch (err) {
      setError(err.message);
      console.error('Error saving summary:', err);
    }
  };

  const getSummary = useCallback(async () => {
    if (!db) {
      setError(ERRORS.FIREBASE);
      return navigate('');
    }

    setError(null);

    try {
      // Get summary for selected date
      const summaryDoc = await getRecord(db, COLLECTIONS.DAILY_SUMMARIES, selectedDate);
      setDailySummary(summaryDoc?.summary ?? '');
    } catch (err) {
      setError(err.message);
      console.error('Error getting summary:', err);
    }
  }, [db, selectedDate, navigate, setError]);

  const handleSummaryUpdate = (e) => {
    setDailySummary(e.target.value);
    setEnable(true);
  };

  useEffect(() => {
    getSummary();
  }, [getSummary]);

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
        <button onClick={setSummary} className="btn btn-primary" disabled={!enable}>
          Save Summary
        </button>
      </Section>
    </>
  );
}
