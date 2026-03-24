import { useContext } from 'react';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { AppContext } from './App';

/** Get a record from any Firestore Collection
 * @param {*} db A reference to the firestore instance
 * @param {String} collection name
 * @param {String} id default value `YYYY-MM-DD`
 * @returns
 */
export async function getRecord(db, collection, id = getTodayDateString()) {
  const recordRef = doc(db, collection, id);
  const record = await getDoc(recordRef);
  return record.exists() ? record.data() : null;
}

/** Get a record from any Firestore Collection
 * @param {*} db A reference to the firestore instance
 * @param {String} collection name
 * @param {String} field
 * @param {String} value
 * @returns
 */
export async function getRecordByField(db, collectionName, ...fieldValues) {
  const collectionRef = collection(db, collectionName);
  const queryPayload = [collectionRef];
  console.log(fieldValues);
  for (let i = 0; i < fieldValues.length; i += 2) {
    const field = fieldValues[i];
    const value = fieldValues[i + 1];
    queryPayload.push(where(field, '==', value));
  }
  const q = query(...queryPayload);

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  }
  return null;
}

/** Set a record from any Firestore Collection by date
 * @param {*} db A reference to the firestore instance
 * @param {String} collection name
 * @param {Object} data
 * @param {String} id
 * @returns
 */
export async function setRecord(db, collectionName, data, id = null) {
  const record = {
    ...data,
    updatedAt: Date.now(),
  };

  // If no ID is provided, create a doc reference with an auto-generated ID
  const recordRef = id ? doc(db, collectionName, id) : doc(collection(db, collectionName));

  await setDoc(recordRef, record, { merge: true });
  return recordRef.id;
}

/**
 * Generates a date string (YYYY-MM-DD) after deducting a specified number of days.
 * @param {number} days - Number of days to subtract (default is 0).
 * @param {Date} date - The starting date object (default is current date).
 * @param {boolean} isIST - Whether the provided date is already in IST.
 * @returns {string} - Formatted date string `YYYY-MM-DD`.
 */
export const getSubtractedDateString = function (days = 0, date = new Date(), isIST = false) {
  // 1. Subtract the specified number of days
  days && date.setDate(date.getDate() - days);

  // 2. Add IST offset (330 minutes) if not already IST
  if (!isIST) {
    date.setMinutes(date.getMinutes() + 330);
  }

  // 3. Return the date portion of the ISO string
  return date.toISOString().split('T')[0];
};

/**
 * Generates a date string (YYYY-MM-DD)
 * @param {Date} date - The starting date object (default is current date).
 * @param {boolean} isIST - Whether the provided date is already in IST.
 * @returns {string} - Formatted date string `YYYY-MM-DD`.
 */
export const getTodayDateString = function (date = new Date(), isIST = false) {
  return getSubtractedDateString(0, date, isIST);
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
  await Promise.allSettled(callbacks);
}

export const executeCallbackForDateRange = async (start, end, callback) => {
  return await executeCallbackForRange(start, end, callback, 1);
};

export function EmptyList(condition, message) {
  return condition && <div id="empty-list">{message}</div>;
}
