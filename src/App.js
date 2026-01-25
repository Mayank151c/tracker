import { useState, createContext, useContext } from 'react';
import './App.css';

import HealthCheck from './pages/HealthCheckPage';
import DailyTaskPage from './pages/DailyTaskPage';
import AddBulkTasks from './pages/BulkTaskPage';
import FloatingError from './components/FloatingError';
import { REACT_APP_ENV, PAGES } from './config/constants';

export const AppContext = createContext(null);

export const useConfig = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useConfig must be used within a AppProvider');
  }
  return context;
};

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
        <nav id="nav">
          {Object.entries(PAGES).map(
            ([key, { path, title }]) =>
              key && (
                <button key={path} onClick={() => navigate(path)}>
                  {title}
                </button>
              ),
          )}
        </nav>
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
