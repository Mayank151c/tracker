import { useContext } from 'react';
import { AppContext } from './App';

// Get today's date in YYYY-MM-DD format
export const getTodayDateString = function (date = new Date(), isIST = false) {
  if (!isIST) date.setMinutes(date.getMinutes() + 330);
  return date.toISOString().split('T')[0];
};

// Get today's date in YYYY-MM-DD HH:MM:SS format
export const getTodayDatetimeString = function (date = new Date(), isIST = false) {
  if (!isIST) date.setMinutes(date.getMinutes() + 330);
  return date.toISOString().replace(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}).*$/, '$1 $2 IST');
};

export const useConfig = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useConfig must be used within a AppProvider');
  }
  return context;
};

async function executeCallbackForRange(start, end, callback, range) {
  let currentDate = new Date(start);
  const endDate = new Date(end);

  const callbacks = [];
  while (currentDate <= endDate) {
    callbacks.push(callback(getTodayDateString(currentDate, true)));
    currentDate.setDate(currentDate.getDate() + range);
  }
  await Promise.all(callbacks);
}

export const executeCallbackForDateRange = async (start, end, callback) => {
  return await executeCallbackForRange(start, end, callback, 1);
};
