import { useState, createContext } from 'react';
import './App.css';

import HealthCheck from './pages/HealthCheckPage';
import DailyTaskPage from './pages/DailyTaskPage';
import AddBulkTasks from './pages/BulkTaskPage';
import FloatingError from './components/FloatingError';
import Navigation from './components/Navigation';
import { REACT_APP_ENV, PAGES } from './config/constants';

export const AppContext = createContext(null);

export default function App() {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(window.location.hash.slice(1));

  // updates URL without re-render
  const navigate = (newPath) => {
    setPage(newPath);
    window.history.pushState({}, '', `#${newPath}`);
  };

  return (
    <AppContext.Provider
      value={{
        navigate,
        db,
        setDb,
        error,
        setError,
      }}
    >
      {/* Env Display */}
      {REACT_APP_ENV !== 'prod' && <div style={{ position: 'fixed' }}>{REACT_APP_ENV}</div>}

      {/* Error Display */}
      {error && <FloatingError />}

      {/* Page Content */}
      <div className="container">
        <Navigation />
        <h1>{PAGES[page]?.title || 'Title Not Found'}</h1>
        {((path) => {
          switch (path) {
            case 'daily-task':
              return <DailyTaskPage />;
            case 'bulk-task':
              return <AddBulkTasks />;
            default:
              return <HealthCheck />;
          }
        })(page)}
      </div>
    </AppContext.Provider>
  );
}
