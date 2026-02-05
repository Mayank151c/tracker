import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { IS_PROD } from './config/constants';

document.body.style.background = `linear-gradient(135deg, ${IS_PROD ? '#123456' : '#004a00'} 0%, #987654 100%)`;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
