export const REACT_APP_ENV = process.env.REACT_APP_ENV;
export const IS_DEV = process.env.REACT_APP_ENV === 'dev';
export const IS_PROD = process.env.REACT_APP_ENV === 'prod';
export const DEBUG = process.env.REACT_APP_DEBUG;

export const COLLECTIONS = {
  TASKS: `env/${REACT_APP_ENV}/tasks`,
  DAILY_SUMMARIES: `env/${REACT_APP_ENV}/daily-summaries`,
  ROUTINE: `env/${REACT_APP_ENV}/routine`,
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
    title: 'Hydrate Monitor',
  },
  'weight-routine': {
    title: 'Weight Monitor',
  },
};
