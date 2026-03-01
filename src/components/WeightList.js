import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where, orderBy, documentId, onSnapshot } from 'firebase/firestore';
import { COLLECTIONS } from '../config/constants';
import { getTodayDatetimeString, useConfig } from '../utils';
import './TaskList.css';

export default function WeightList({ weights, setWeights }) {
  const { db, setError, deleteIcon, checkDbConnection } = useConfig();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const weightCollection = collection(db, COLLECTIONS.ROUTINE);
      const weightQuery = query(weightCollection, where(documentId(), '>=', 'weight'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(weightQuery, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setWeights(data); // Automatically updates UI when collection changes
      });
      return () => unsubscribe(); // Cleanup listener on unmount
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message);
    }
  }, [db, setError, setWeights]);

  // Load weights for selected date
  const loadWeights = useCallback(async () => {
    setLoading(true);
    try {
      checkDbConnection();
      const weightCollection = collection(db, COLLECTIONS.ROUTINE);
      // where id string start with 'weight-'
      const weightQuery = query(weightCollection, where(documentId(), '>=', 'weight-'), orderBy('updatedAt', 'desc'));
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

  // Delete a task
  const deleteWeight = async (id) => {
    setLoading(true);
    try {
      checkDbConnection();
      const taskDoc = doc(db, COLLECTIONS.ROUTINE, id);
      await deleteDoc(taskDoc);
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
      {!loading &&
        weights.map((weightRecord) => (
          <div key={weightRecord.id} className="task-item">
            <div className="task-text">
              <b>Weight:</b> {weightRecord.weight} <b>Kg</b>
            </div>
            <div>{getTodayDatetimeString(new Date(weightRecord.updatedAt))}</div>
            {/* Delete button */}
            <button onClick={() => deleteWeight(weightRecord.id)} id="btn-delete">
              <img src={deleteIcon} alt="delete--v1" width={20} height={24} />
            </button>
          </div>
        ))}
    </div>
  );
}
