import { useState } from 'react';
import { COLLECTIONS } from '../config/constants';
import { getRecordByField, getTodayDateString, setRecord, useConfig } from '../utils';

const parseWeight = (weight) => Number(weight.toFixed(2));

function createWeightRecord(weight, weightDoc = null) {
  if (weightDoc) {
    weight += weightDoc.weight * weightDoc.count;
    weightDoc.count += 1;
    return {
      ...weightDoc,
      weight: parseWeight(weight / weightDoc.count),
    };
  } else {
    return {
      date: getTodayDateString(),
      type: 'weight',
      count: 1,
      weight: parseWeight(weight),
    };
  }
}

export default function AddWeight({ weights, setWeights }) {
  const { db, setError, checkDbConnection } = useConfig();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addWeight = async () => {
    setLoading(true);
    const weight = Number(input);
    const date = getTodayDateString();
    try {
      checkDbConnection();
      if (isNaN(weight)) throw new Error('Invalid input');
      // Update weight if it already exists
      const weightDoc = await getRecordByField(db, COLLECTIONS.ROUTINE, 'date', date, 'type', 'weight');
      const updatedRecordFields = createWeightRecord(weight, weightDoc);
      await setRecord(db, COLLECTIONS.ROUTINE, updatedRecordFields, weightDoc?.id).then((docId) => {
        updatedRecordFields.id = docId;
        setWeights(weights.filter((weight) => weight.id !== docId).insert(0, updatedRecordFields));
      });
    } catch (err) {
      console.error('Error adding weight:', err);
      setError('Error adding weight: ' + err.message);
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
      <button onClick={addWeight} id="btn-add" className="btn btn-primary" disabled={loading || !input}>
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
