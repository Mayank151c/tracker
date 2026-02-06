import { useState } from "react";
import AddTasks from "../components/AddTasks";
import { EmptyList, getTodayDateString } from "../utils";
import Section from "../components/Section";
import TaskList from "../components/TaskList";

export default function WeightPage() {
	const [tasks, setTasks] = useState([]);
	const [startDate, setStartDate] = useState(getTodayDateString());

	const averageWeight = 0;
  return (
    <div style={{marginTop: "20px"}}>
			<AddTasks tasks={tasks} setTasks={setTasks} startDate={startDate} endDate={startDate} />
			<Section horizontal={true}>Average Weight: {averageWeight}</Section>
			<TaskList tasks={tasks} setTasks={setTasks} startDate={'2026-01-15'} endDate={startDate} />
			{EmptyList(tasks.length === 0, 'No weight check.')}
    </div>
  );
}
