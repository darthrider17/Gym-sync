import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ConnectPage from './pages/ConnectPage';
import QueuePage from './pages/QueuePage';
import SessionPage from './pages/SessionPage';
import { SessionProvider } from './context/SessionContext';

const App: React.FC = () => {
  return (
    <SessionProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
            <Routes>
              <Route path="/" element={<Navigate to="/session" replace />} />
              <Route path="/session" element={<SessionPage />} />
              <Route path="/connect" element={<ConnectPage />} />
              <Route path="/queue" element={<QueuePage />} />
            </Routes>
          </main>
          <footer className="p-4 text-center text-slate-500 text-sm">
            <p>Gym Sync &copy; 2024 - Multi-Device Audio Sync</p>
          </footer>
        </div>
      </Router>
    </SessionProvider>
  );
};

export default App;