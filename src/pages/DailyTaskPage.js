import { useState } from 'react';

import DailySummary from '../components/DailySummary';
import Section from '../components/Section';
import TaskSection from '../components/TaskSection';
import Routine from '../components/Routine';
import DatePicker from '../components/DatePicker';
import { getTodayDateString } from '../utils';

export default function DailyTaskPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  return (
    <div>
      <Section horizontal={true}>
        <DatePicker label="Select Date:" date={selectedDate} setDate={setSelectedDate} />
      </Section>

      <TaskSection startDate={selectedDate} endDate={selectedDate} />
      <Routine startDate={selectedDate} endDate={selectedDate} />
      <DailySummary selectedDate={selectedDate} />
    </div>
  );
}
