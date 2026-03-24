import { useState } from 'react';
import DatePicker from '../components/DatePicker';
import ErrorSection from '../components/ErrorSection';
import Section from '../components/Section';
import Spinner from '../components/Spinner';
import TaskList from '../components/TaskList';
import { COLLECTIONS } from '../config/constants';
import { executeCallbackForDateRange, getRecordByField, getTodayDateString, setRecord, useConfig } from '../utils';

function createTaskPoolItem(taskText) {
  return {
    text: taskText,
    createdAt: getTodayDateString(),
    updatedAt: Date.now(),
  };
}

function createTaskListItem(taskId, date) {
  return {
    taskId: taskId,
    date: date,
    completed: false,
    updatedAt: Date.now(),
  };
}

export default function ManageTaskPageTask() {
  const [taskpool, setTaskPool] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(getTodayDateString());
  const [input, setInput] = useState('');
  const [error, _setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { db, checkDbConnection } = useConfig();

  function setError(error) {
    _setError(error);
    setTimeout(() => {
      _setError('');
      setLoading(false);
    }, 3000);
  }

  const addTaskToPool = async () => {
    setLoading(true);

    const taskPoolItem = createTaskPoolItem(input);
    setInput('');
    try {
      checkDbConnection();
      const doc = await getRecordByField(db, COLLECTIONS.TASK_POOL, 'text', taskPoolItem.text);
      if (doc) throw new Error(`"${taskPoolItem.text}" already exists`);

      await setRecord(db, COLLECTIONS.TASK_POOL, taskPoolItem, taskPoolItem.id).then((docId) => {
        taskPoolItem.id = docId;
        setTaskPool([...taskpool, taskPoolItem]);
      });
    } catch (err) {
      console.error(err);
      setError('Error adding: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTasktoTransferList = async (taskId, date = getTodayDateString()) => {
    const taskListItem = createTaskListItem(taskId, date);
    const doc = await getRecordByField(db, COLLECTIONS.TASK_LIST, 'taskId', taskId, 'date', date);
    console.log('::', doc);
    if (doc && doc.date === date) throw new Error(`Task already exists`);
    return await setRecord(db, COLLECTIONS.TASK_LIST, taskListItem, taskListItem.id).then((id) => {
      taskListItem.id = id;
      taskListItem.text = taskpool.find((task) => task.id === taskId).text;
      return taskListItem;
    });
  };

  const transferTaskToList = async () => {
    setLoading(true);
    setInput('');
    try {
      checkDbConnection();
      const addTaskPromises = [];
      for (let index in selectedTaskIds) {
        executeCallbackForDateRange(startDate, endDate, (date) => {
          addTaskPromises.push(addTasktoTransferList(selectedTaskIds[index], date));
        });
      }
      const results = await Promise.allSettled(addTaskPromises);
      console.log(results);
      let error = '',
        errorCount = 0,
        fulfilled = [];
      results.forEach((result) => {
        if (result.status === 'rejected') {
          errorCount++;
          error = `(${errorCount}) ${result.reason.message}`;
        } else if (result.status === 'fulfilled') {
          fulfilled.push(result.value);
        }
      });
      setTasks([...tasks, ...fulfilled]);
      setError(error);
    } catch (err) {
      console.error(err);
      setError('Error adding: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Add Task Input & Button Section */}
      <div>
        <h2>Task Pool</h2>
        <div className="input-section">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTaskToPool()}
            placeholder="Add task to pool..."
            className="item-input"
          />
          <button onClick={addTaskToPool} id="btn-add" className="btn btn-primary" disabled={!input.trim() || loading}>
            <Spinner loading={loading}>Add Task</Spinner>
          </button>
        </div>
        <ErrorSection error={error} />
      </div>
      <TaskList tasks={taskpool} setTasks={setTaskPool} selectedTaskIds={selectedTaskIds} setSelectedTaskIds={setSelectedTaskIds} isTaskPool />

      {/* Transfer Selected Task's to Task List */}
      <button onClick={transferTaskToList} id="btn-transfer" className="btn btn-primary" disabled={!selectedTaskIds.length || loading}>
        <Spinner loading={loading}>⬇ Transfer ⬇</Spinner>
      </button>

      {/* Task List for Date Range */}
      <div>
        <h2>Daily Todos</h2>
        <TaskList tasks={tasks} setTasks={setTasks} startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
}
