import { useState } from 'react';
import AddTasks from '../components/AddTasks';
import TaskList from '../components/TaskList';
import DatePicker from '../components/DatePicker';
import { EmptyList, getTodayDateString } from '../utils';
import Section from '../components/Section';

export default function BulkTask() {
  const [tasks, setTasks] = useState([]);
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());

  return (
    <div>
      <Section horizontal={true}>
        <DatePicker label="Start Date" date={startDate} setDate={setStartDate} max={endDate} />
        <DatePicker
          label="End Date"
          date={endDate}
          setDate={setEndDate}
          min={startDate}
          max={getTodayDateString(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))}
        />
      </Section>
      <AddTasks tasks={tasks} setTasks={setTasks} startDate={startDate} endDate={endDate} />

      <TaskList bulk={true} startDate={startDate} endDate={endDate} tasks={tasks} setTasks={setTasks} />

      {EmptyList(tasks.length === 0, 'No tasks for this day. Add one above!')}
    </div>
  );
}
