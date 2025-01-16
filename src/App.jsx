import React from 'react';
import { Outlet } from 'react-router-dom';
import './styles/main.css';

function App() {
  return (
    <div className="app">
      <Outlet />
    </div>
  );
}

export default App; 