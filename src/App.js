import { useState, createContext } from 'react';
import './App.css';

import HealthCheck from './pages/HealthCheckPage';
import DailyTaskPage from './pages/DailyTaskPage';
import BulkTaskPage from './pages/BulkTaskPage';
import HydratePage from './pages/HydratePage';
import FloatingError from './components/FloatingError';
import { PAGES } from './config/constants';

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
      {/* Error Display */}
      {error && <FloatingError />}

      {/* Page Content */}
      <div className="container">
        <div>
          <h1>
            <div>{PAGES[page]?.title || 'Title Not Found'}</div>
          </h1>
          <nav>
            <div>{PAGES[page]?.left && <button onClick={() => navigate(PAGES[page]?.left)}>{'⬅️ ' + PAGES[PAGES[page]?.left].title}</button>}</div>
            <div>{PAGES[page]?.right && <button onClick={() => navigate(PAGES[page]?.right)}>{PAGES[PAGES[page]?.right].title + ' ➡️'}</button>}</div>
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
            default:
              return <HealthCheck />;
          }
        })(page)}
      </div>
    </AppContext.Provider>
  );
}
