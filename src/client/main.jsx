import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './Components/App';
import { BrowserRouter } from 'react-router-dom';
import "./index.css";

const root = createRoot(document.querySelector('#root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
