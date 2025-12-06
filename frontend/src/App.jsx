import React, { useState, useEffect } from 'react';
import EmojiGrid from './components/EmojiGrid';
import AdminPage from './components/AdminPage';

function App() {
  const [currentPage, setCurrentPage] = useState('main');

  useEffect(() => {
    // Check URL hash for admin page
    const hash = window.location.hash;
    if (hash === '#admin') {
      setCurrentPage('admin');
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash;
      setCurrentPage(newHash === '#admin' ? 'admin' : 'main');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app">
      {currentPage === 'admin' ? <AdminPage /> : <EmojiGrid />}
    </div>
  );
}

export default App;
