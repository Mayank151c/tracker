import { useState } from 'react';
import DailySummary from '../components/DailySummary';
import Section from '../components/Section';
import Routine from '../components/Routine';
import DatePicker from '../components/DatePicker';
import TaskList from '../components/TaskList';
import { getTodayDateString } from '../utils';

export default function DailyTaskPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [tasks, setTasks] = useState([]);

  return (
    <div>
      <Section horizontal={true}>
        <DatePicker label="Select Date:" date={selectedDate} setDate={setSelectedDate} />
      </Section>

      {/* My Tasks Section */}
      <div className="tasks-section">
        <h2>Todo</h2>
        <TaskList tasks={tasks} setTasks={setTasks} startDate={selectedDate} endDate={selectedDate} delBtn={false} isDailyPage={true} />
      </div>

      <Routine startDate={selectedDate} endDate={selectedDate} />
      <DailySummary selectedDate={selectedDate} />
    </div>
  );
}
