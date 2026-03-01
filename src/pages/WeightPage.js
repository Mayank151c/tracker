import { useState } from 'react';
import { EmptyList } from '../utils';
import WeightList from '../components/WeightList';
import AddWeight from '../components/AddWeight';

export default function WeightPage() {
  const [weights, setWeights] = useState([]);

  return (
    <div style={{ marginTop: '20px' }}>
      <AddWeight weight={weights} setWeight={setWeights} />
      <WeightList weights={weights} setWeights={setWeights} />
      {EmptyList(weights.length === 0, 'No weight check.')}
    </div>
  );
}
