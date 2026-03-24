import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { COLLECTIONS } from '../config/constants';
import { getSubtractedDateString, getTodayDatetimeString, useConfig } from '../utils';
import DeleteBtn from './elements/DeleteBtn';
import TextUI from './elements/TextUI';
import './TaskList.css';

export default function WeightList({ weights, setWeights }) {
  const { db, setError, checkDbConnection } = useConfig();
  const [loading, setLoading] = useState(false);

  // Load weights for last 10 days from current date
  const loadWeights = useCallback(async () => {
    setLoading(true);
    try {
      checkDbConnection();
      const weightCollection = collection(db, COLLECTIONS.ROUTINE);
      const weightQuery = query(weightCollection, where('date', '>=', getSubtractedDateString(10)), where('type', '==', 'weight'), orderBy('date', 'desc'));
      const weightList = await getDocs(weightQuery).then((snapshot) => {
        const list = [];
        snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
        return list;
      });
      setWeights(weightList);
    } catch (err) {
      console.error('Error loading task:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [db, setError, setWeights, checkDbConnection]);

  const deleteWeight = async (id) => {
    setLoading(true);
    try {
      checkDbConnection();
      const taskDoc = doc(db, COLLECTIONS.ROUTINE, id);
      await deleteDoc(taskDoc);
      setWeights(weights.filter((weight) => weight.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reload data when date changes or when db becomes available
  useEffect(() => {
    loadWeights();
  }, [loadWeights]);

  return (
    <div className="tasks-list">
      {weights.map((weightRecord) => (
        <div key={weightRecord.id} className="task-item">
          <div className="task-text">
            <b>Weight:</b> {weightRecord.weight} <b>Kg</b>
          </div>
          <TextUI text={getTodayDatetimeString(new Date(weightRecord.updatedAt))} />

          {/* Delete button */}
          <DeleteBtn deleteOnClick={() => deleteWeight(weightRecord.id)} loading={loading} />
        </div>
      ))}
    </div>
  );
}
