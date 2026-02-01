import { useState } from 'react';
import TaskList from './TaskList';

export default function Routine({ startDate, endDate }) {
  const [tasks, setTasks] = useState([]);

  return (
    <div className="tasks-section">
      <h2>Routine</h2>
      <TaskList tasks={tasks} setTasks={setTasks} startDate={startDate} endDate={endDate} />
      {tasks.length === 0 && <div id="empty-list">No Fitness routine tasks setup</div>}
    </div>
  );
}
