export const REACT_APP_ENV = process.env.REACT_APP_ENV;
export const IS_DEV = process.env.REACT_APP_ENV === 'dev';
export const IS_PROD = process.env.REACT_APP_ENV === 'prod';
export const DEBUG = process.env.REACT_APP_DEBUG;

export const COLLECTIONS = {
  TASKS: 'tasks',
  DAILY_SUMMARIES: 'dailySummaries',
  ROUTINE: 'routine',
};

export const ERRORS = {
  FIREBASE: 'Firebase not initialized. Please initialize first.',
};

export const PAGES = {
  '': {
    title: 'Health Check',
    path: '',
    left: false,
    right: false,
  },
  'daily-task': {
    title: 'Daily Task',
    path: 'daily-task',
    left: false,
    right: 'bulk-task',
  },
  'bulk-task': {
    title: 'Bulk Task',
    path: 'bulk-task',
    left: 'daily-task',
    right: false,
  },
  'hydrate-routine': {
    title: 'Hydrate',
    path: 'hydrate-routine',
    left: 'daily-task',
    right: false,
  },
};
