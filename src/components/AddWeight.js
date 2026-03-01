import { useState } from 'react';
import { COLLECTIONS } from '../config/constants';
import { getRecord, getTodayDateString, setRecord, useConfig } from '../utils';

export default function AddWeight() {
  const { db, setError, checkDbConnection } = useConfig();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addWeight = async () => {
    if (!input || loading) return;
    setLoading(true);
    const parsedInput = Number(input);

    try {
      if (isNaN(parsedInput)) throw new Error('Invalid input');
      checkDbConnection();
      const date = getTodayDateString();
      let [count, weight] = [1, parsedInput];
      // update weight if it already exists
      const weightDoc = await getRecord(db, COLLECTIONS.ROUTINE, `weight-${date}`);
      if (weightDoc) {
        weight = weightDoc.weight * weightDoc.count + parsedInput;
        count = weightDoc.count + 1;
        weight = parseInt((weight * 100) / count) / 100; // average weight
      }
      const updatedRecordFields = {
        date: date,
        type: 'weight',
        weight: weight,
        count: count,
      };
      await setRecord(db, COLLECTIONS.ROUTINE, updatedRecordFields, `weight-${date}`);
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
