import { useContext } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { REACT_APP_ENV } from './config/constants';
import { AppContext } from './App';

/** Get a record from any Firestore Collection by date
 * @param {*} db A reference to the firestore instance
 * @param {String} collection name
 * @param {String} date `YYYY-MM-DD`
 * @returns
 */
export async function getRecord(db, collection, date = getTodayDateString()) {
  const recordRef = doc(db, 'env', REACT_APP_ENV, collection, date);
  const record = await getDoc(recordRef);
  return record.exists() ? record.data() : null;
}

/** Set a record from any Firestore Collection by date
 * @param {*} db A reference to the firestore instance
 * @param {String} collection name
 * @param {Object} data
 * @param {String} date `YYYY-MM-DD`
 * @returns
 */
export async function setRecord(db, collection, data, date = getTodayDateString()) {
  const record = {
    date: date,
    updatedAt: getTodayDatetimeString(),
    ...data,
  };
  const recordRef = doc(db, 'env', REACT_APP_ENV, collection, date);
  await setDoc(recordRef, record, { merge: true });
}

/** Get date in `YYYY-MM-DD` format
 * @param {Date} date
 * @param {Boolean} isIST
 * @returns {String} Current date `YYYY-MM-DD` in IST by default
 */
export const getTodayDateString = function (date = new Date(), isIST = false) {
  if (!isIST) date.setMinutes(date.getMinutes() + 330);
  return date.toISOString().split('T')[0];
};

/** Get date in `YYYY-MM-DD HH:MM:SS` format
 * @param {Date} date
 * @param {Boolean} isIST
 * @returns {String} Current date in `YYYY-MM-DD HH:MM:SS` in IST by default
 */
export const getTodayDatetimeString = function (date = new Date(), isIST = false) {
  if (!isIST) date.setMinutes(date.getMinutes() + 330);
  return date.toISOString().replace(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}).*$/, '$1 $2 IST');
};

export const useConfig = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('Hook [useConfig] must be used within a AppProvider');
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

export function EmptyList(condition, message) {
  return condition && <div id="empty-list">{message}</div>;
}
