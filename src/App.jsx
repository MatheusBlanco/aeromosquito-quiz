import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/routes';

export default function App() {
  return (
    <BrowserRouter>
      <Router className="App" />
    </BrowserRouter>
  );
}
