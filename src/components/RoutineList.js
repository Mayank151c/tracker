import { useState, useEffect, useCallback } from 'react';
import { ERRORS, COLLECTIONS } from '../config/constants';
import { getRecord, getTodayDateString, useConfig } from '../utils';
import './RoutineList.css';

export default function RoutineList() {
  const { navigate } = useConfig();

  return (
    <div id="routine-list">
      <div className="routine-item" onClick={() => navigate('hydrate-routine')}>
        <HydrateRoutine />
      </div>
    </div>
  );
}

function HydrateRoutine() {
  const [hydrateLevel, setHydrateLevel] = useState(0);
  const { db, setError, navigate } = useConfig();

  // 	Get hydrate routine for today
  const getHydrate = useCallback(async () => {
    if (!db) {
      setError(ERRORS.FIREBASE);
      return navigate('');
    }
    setError(null);

    try {
      const record = await getRecord(db, COLLECTIONS.ROUTINE);
      setHydrateLevel(record?.level ?? 0);
    } catch (err) {
      console.error('Error getting hydrate routine:', err);
      setError(err.message);
    }
  }, [db, setError, navigate]);

  useEffect(() => {
    getHydrate();
  }, [getHydrate]);

  return (
    <div>
      <div>
        Hydrate for {getTodayDateString()}: (Level: {hydrateLevel})
      </div>
    </div>
  );
}
