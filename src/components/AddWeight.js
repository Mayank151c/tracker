import { useState } from 'react';
import { ERRORS, COLLECTIONS } from '../config/constants';
import { getTodayDateString, getTodayDatetimeString, setRecord, useConfig } from '../utils';

export default function AddWeight() {
  const { db, setError } = useConfig();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addWeight = async () => {
    if (!input || loading) return;
    if (!db) throw new Error(ERRORS.FIREBASE);

    const parsedInput = Number(input);
    if (isNaN(parsedInput)) throw new Error('Invalid input');

    setError(null);
    setLoading(true);

    try {
      const datetime = getTodayDatetimeString();
      const newRecord = {
        date: getTodayDateString(),
        type: 'weight',
        value: parsedInput,
      };
      await setRecord(db, COLLECTIONS.ROUTINE, newRecord, `weight-${datetime}`);
    } catch (err) {
      console.error('Error adding weight:', err);
      setError('Error adding weight: ' + err.message);
      setInput(parsedInput); // Restore input text on error
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="input-section">
      <input
        type="number"
        step="0.01"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addWeight()}
        placeholder="Add Weight..."
        className="item-input"
      />
      <button onClick={addWeight} id="btn" className="btn btn-primary" disabled={loading}>
        {loading ? (
          <span className="button-content">
            <span className="spinner"></span>
            Adding...
          </span>
        ) : (
          'Add Weight'
        )}
      </button>
    </div>
  );
}
