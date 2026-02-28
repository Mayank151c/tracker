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
  },
  'daily-task': {
    title: 'Daily Task',
  },
  'bulk-task': {
    title: 'Bulk Task',
  },
  'hydrate-routine': {
    title: 'Hydrate',
  },
  'weight-routine': {
    title: 'Weight Tracker',
  },
};
