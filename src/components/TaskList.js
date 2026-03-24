import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { COLLECTIONS } from '../config/constants';
import { EmptyList, getRecord, setRecord, useConfig } from '../utils';
import './TaskList.css';
import TextUI from './elements/TextUI';
import DeleteBtn from './elements/DeleteBtn';

export default function TaskList({ tasks, setTasks, startDate, endDate, selectedTaskIds, setSelectedTaskIds, isDailyPage = false, isTaskPool = false }) {
  const { db, setError, deleteIcon, checkDbConnection } = useConfig();
  const [loading, setLoading] = useState(false);
  const collectionName = isTaskPool ? COLLECTIONS.TASK_POOL : COLLECTIONS.TASK_LIST;

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      checkDbConnection();
      const tasksCollection = collection(db, collectionName);
      const queryPayload = [tasksCollection];
      if (!isTaskPool) {
        queryPayload.push(where('date', '>=', startDate));
        queryPayload.push(where('date', '<=', endDate));
      }
      const tasksQuery = query(...queryPayload);

      const snapshot = await getDocs(tasksQuery);
      const list = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, text: null, ...doc.data() }));

      const tasksPopulatePromise = [];
      if (!isTaskPool) {
        for (const task of list) {
          if (task.text === null) {
            await getRecord(db, COLLECTIONS.TASK_POOL, task.taskId).then(({ text }) => {
              task.text = text;
            });
          }
        }
      }
      setTasks(list);
    } catch (err) {
      setError(err.message);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [db, setError, startDate, endDate, setTasks, checkDbConnection]);

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      checkDbConnection();
      const taskDoc = doc(db, collectionName, id);
      await deleteDoc(taskDoc);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reload data when date changes or when db becomes available
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleTaskCompletion(e, taskId) {
    tasks.map((task) => {
      if (taskId === task.id) {
        task.completed = e.target.checked;
        console.log(task);
        setRecord(db, collectionName, { completed: task.completed }, task.id).then((id) => {
          setTasks([...tasks.filter((t) => id !== t.id), task]);
        });
      }
    });
  }

  function handleSelectedTask(e, taskId) {
    if (e.target.checked) {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    } else {
      setSelectedTaskIds(selectedTaskIds.filter((id) => id !== taskId));
    }
  }

  function handleCheckButton(e, taskId) {
    !isDailyPage && handleSelectedTask(e, taskId);
  }

  return (
    <div className="tasks-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          {/* Task checkbox */}
          {!isDailyPage && isTaskPool && <input type="checkbox" onClick={(e) => handleCheckButton(e, task.id)} className="task-checkbox" disabled={loading} />}
          {isDailyPage && (
            <input type="checkbox" onChange={(e) => handleTaskCompletion(e, task.id)} checked={task.completed} className="task-checkbox" disabled={loading} />
          )}

          {/* Task Description */}
          <div className="task-text">{task.text}</div>

          {/* Date */}
          {!isDailyPage && !isTaskPool && <TextUI date={task.date} />}

          {/* Delete button */}
          {!isDailyPage && <DeleteBtn deleteOnClick={() => deleteTask(task.id)} loading={loading} />}
        </div>
      ))}
      {EmptyList(tasks.length === 0, 'No tasks for this day. Add one above!')}
    </div>
  );
}
