import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import Router from './routes/routes';

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Router className="App" />
      </BrowserRouter>
      <Toaster
        position="bottom-center"
        reverseOrder
        toastOptions={{
          className: '',
          style: {
            borderRadius: '30px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
