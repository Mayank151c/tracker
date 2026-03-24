import { useState, useEffect, useCallback } from 'react';
import { COLLECTIONS } from '../config/constants';
import { getRecordByField, getTodayDateString, useConfig } from '../utils';
import './RoutineList.css';
import TextUI from './elements/TextUI';

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
      const record = await getRecordByField(db, COLLECTIONS.ROUTINE, 'date', getTodayDateString(), 'type', 'hydrate');
      setHydrateLevel(record?.level ?? 0);
    } catch (err) {
      console.error('Error getting hydrate routine:', err);
      setError(err.message);
    }
  }, [db, setError, checkDbConnection]);

  useEffect(() => {
    getHydrate();
  }, [getHydrate]);

  const showIconText = (text = '') => {
    for (let i = 0; i < 12; i++) {
      text += i < hydrateLevel ? '●' : '○';
    }
    return text;
  };
  return (
    <RoutineItem path="hydrate-routine">
      Hydrate Monitor
      <TextUI text={showIconText()} />
    </RoutineItem>
  );
}

function WeightRoutine() {
  const [weight, setWeight] = useState(0);
  const { db, setError, checkDbConnection } = useConfig();

  // 	Get hydrate routine for today
  const getWeight = useCallback(async () => {
    try {
      checkDbConnection();
      const record = await getRecordByField(db, COLLECTIONS.ROUTINE, 'date', getTodayDateString(), 'type', 'weight');
      setWeight(record?.weight ?? 0);
    } catch (err) {
      console.error('Error getting hydrate routine:', err);
      setError(err.message);
    }
  }, [db, setError, checkDbConnection]);

  useEffect(() => {
    getWeight();
  }, [getWeight]);

  return (
    <RoutineItem path="weight-routine">
      Weight Monitor <TextUI text={weight ? `${weight} Kg` : 'N/A'} />
    </RoutineItem>
  );
}
