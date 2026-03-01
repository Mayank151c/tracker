import { useState, useEffect, useCallback } from 'react';
import { COLLECTIONS } from '../config/constants';
import { getRecord, getTodayDateString, useConfig } from '../utils';
import './RoutineList.css';

export default function RoutineList() {
  return (
    <div id="routine-list">
      <HydrateRoutine />
      <WeightRoutine />
    </div>
  );
}

function RoutineItem(props) {
  const { navigate } = useConfig();
  return (
    <div className="routine-item" onClick={() => navigate(props.path)}>
      {props.children}
    </div>
  );
}

function HydrateRoutine() {
  const [hydrateLevel, setHydrateLevel] = useState(0);
  const { db, setError, checkDbConnection } = useConfig();

  // 	Get hydrate routine for today
  const getHydrate = useCallback(async () => {
    try {
      checkDbConnection();
      const record = await getRecord(db, COLLECTIONS.ROUTINE, `hydrate-${getTodayDateString()}`);
      setHydrateLevel(record?.level ?? 0);
    } catch (err) {
      console.error('Error getting hydrate routine:', err);
      setError(err.message);
    }
  }, [db, setError, checkDbConnection]);

  useEffect(() => {
    getHydrate();
  }, [getHydrate]);

  return (
    <RoutineItem path="hydrate-routine">
      Hydrate Monitor ({getTodayDateString()}) ({hydrateLevel}/12)
    </RoutineItem>
  );
}

function WeightRoutine() {
  return <RoutineItem path="weight-routine">Weight Monitor</RoutineItem>;
}
