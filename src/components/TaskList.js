import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { COLLECTIONS } from '../config/constants';
import { useConfig } from '../utils';
import './TaskList.css';

export default function TaskList({ bulk, startDate, endDate, tasks, setTasks }) {
  const { db, setError, deleteIcon, checkDbConnection } = useConfig();
  const [loading, setLoading] = useState(false);

  // Load tasks for selected date
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      checkDbConnection();
      const tasksCollection = collection(db, COLLECTIONS.TASKS);
      const tasksQuery = query(tasksCollection, where('date', '>=', startDate), where('date', '<=', endDate), orderBy('date'));
      const tasksList = await getDocs(tasksQuery).then((snapshot) => {
        const list = [];
        snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
        return list.sort((a, b) => a.completed - b.completed);
      });
      setTasks(tasksList);
    } catch (err) {
      // Provide specific error messages based on error code
      console.error('Firestore Error:', {
        code: err.code,
        message: err.message,
        stack: err.stack,
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [db, endDate, setError, setTasks, startDate, checkDbConnection]);

  // Delete a task
  const deleteTask = async (id) => {
    setLoading(true);
    try {
      checkDbConnection();
      const taskDoc = doc(db, COLLECTIONS.TASKS, id);
      await deleteDoc(taskDoc);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const toggleTask = async (id, currentStatus) => {
    setLoading(true);
    try {
      checkDbConnection();
      const taskDoc = doc(db, COLLECTIONS.TASKS, id);
      await updateDoc(taskDoc, {
        completed: !currentStatus,
        updatedAt: Date.now(),
      });
      await loadTasks();
    } catch (err) {
      setError(err.message);
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const listByBulkId = (tasks) => {
    const result = tasks.reduce((result, task) => {
      if (result[task.bulkId]) {
        result[task.bulkId].begin = result[task.bulkId].begin > task.date ? task.date : result[task.bulkId].begin;
        result[task.bulkId].end = result[task.bulkId].end < task.date ? task.date : result[task.bulkId].end;
      } else {
        result[task.bulkId] = {
          ...task,
          begin: task.date,
          end: task.date,
        };
      }
      return result;
    }, {});
    return Object.values(result);
  };

  // Reload data when date changes or when db becomes available
  useEffect(() => {
    loadTasks();
  }, [startDate, endDate, loadTasks]);

  return (
    <div className="tasks-list">
      {listByBulkId(tasks).map((task) => (
        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          {/* Task checkbox */}
          {!bulk && (
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id, task.completed)} className="task-checkbox" disabled={loading} />
          )}

          {/* Task Description */}
          <div className="task-text" onClick={() => toggleTask(task.id, task.completed)}>
            {task.text}
          </div>

          {/* Date Range */}
          {bulk && (
            <>
              <div className="task-date">
                <div>
                  <b>From :</b>
                </div>{' '}
                {task.begin}
              </div>
              <div className="task-date">
                <div>
                  <b>To :</b>
                </div>{' '}
                {task.end}
              </div>
            </>
          )}

          {/* Delete button */}
          {!task.completed && (
            <button onClick={() => deleteTask(task.id)} id="btn-delete" disabled={loading}>
              <img src={deleteIcon} alt="delete--v1" width={20} height={24.5} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
