import { useState } from 'react';
import { REACT_APP_ENV, ERRORS } from '../config/constants';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { executeCallbackForDateRange, useConfig } from '../utils';

export default function AddTasks({ tasks, setTasks, startDate, endDate }) {
  const { db, setError } = useConfig();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Add a new task
  const addTask = async () => {
    if (!input.trim() || loading) return;

    if (!db) {
      setError(ERRORS.FIREBASE);
      return;
    }

    const taskText = input.trim();
    setInput(''); // Clear input immediately for better UX
    setError(null);
    setLoading(true);

    try {
      const bulkId = taskText.toLowerCase().replace(/\W/g, '-');
      const tasksCollection = collection(db, 'env', REACT_APP_ENV, 'tasks');
      await executeCallbackForDateRange(startDate, endDate, async (date) => {
        const newTask = {
          text: taskText,
          date: date,
          completed: false,
          bulkId: bulkId,
          createdAt: Timestamp.now(),
        };
        await addDoc(tasksCollection, newTask)
          .then((doc) => (newTask.id = doc.id))
          .then(() => setTasks([...tasks, newTask]));
      });
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Error adding task: ' + err.message);
      setInput(taskText); // Restore input text on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="input-section">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTask()}
        placeholder="Add a new task..."
        className="item-input"
      />
      <button onClick={addTask} id="btn" className="btn btn-primary" disabled={!input.trim() || loading}>
        {loading ? (
          <span className="button-content">
            <span className="spinner"></span>
            Adding...
          </span>
        ) : (
          'Add Task'
        )}
      </button>
    </div>
  );
}
