import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { MessagesProvider } from './context/MessagesContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MessagesProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MessagesProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
