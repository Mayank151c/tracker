import { useState, useEffect, createContext } from 'react';
import './App.css';

import HealthCheck from './pages/HealthCheckPage';
import DailyTaskPage from './pages/DailyTaskPage';
import BulkTaskPage from './pages/BulkTaskPage';
import HydratePage from './pages/HydratePage';
import FloatingError from './components/FloatingError';
import { ERRORS, PAGES } from './config/constants';
import WeightPage from './pages/WeightPage';

export const AppContext = createContext(null);

export default function App() {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);
  const [deleteIcon, setDeleteIcon] = useState(null);
  const [page, setPage] = useState(window.location.hash.slice(1));

  useEffect(() => {
    (async () => {
      fetch('https://img.icons8.com/glyph-neue/512/delete--v1.png')
        .then((response) => response.blob())
        .then((blob) => setDeleteIcon(URL.createObjectURL(blob)))
        .catch((e) => console.error('Error fetching image', e));
    })();
  }, []);

  // updates URL without re-render
  const navigate = (newPath) => {
    setPage(newPath);
    window.history.pushState({}, '', `#${newPath}`);
  };

  // Validate database connection
  const checkDbConnection = () => {
    if (!db) {
      navigate('');
      throw new Error(ERRORS.FIREBASE);
    }
    setError(null);
  };

  return (
    <AppContext.Provider
      value={{
        navigate,
        db,
        setDb,
        error,
        setError,
        deleteIcon,
        checkDbConnection,
      }}
    >
      {/* Error Display */}
      {error && <FloatingError />}

      {/* Page Content */}
      <div className="container">
        <div>
          <h1>
            <div>{PAGES[page]?.title || 'Title Not Found'}</div>
          </h1>
          <nav>
            {page !== '' &&
              Object.keys(PAGES).map((hashPath) => {
                if (['', page].includes(hashPath)) return null;
                return <button onClick={() => navigate(hashPath)}>{PAGES[hashPath].title}</button>;
              })}
          </nav>
        </div>
        {((path) => {
          switch (path) {
            case 'daily-task':
              return <DailyTaskPage />;
            case 'bulk-task':
              return <BulkTaskPage />;
            case 'hydrate-routine':
              return <HydratePage />;
            case 'weight-routine':
              return <WeightPage />;
            default:
              return <HealthCheck />;
          }
        })(page)}
      </div>
    </AppContext.Provider>
  );
}
