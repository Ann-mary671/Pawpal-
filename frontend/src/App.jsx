import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PetList from './pages/PetList';
import PetDetail from './pages/PetDetail';
import AdoptForm from './pages/AdoptForm';
import Applications from './pages/Applications';

/**
 * MODULE 4: React Router – Setup, Routes, Parameters
 */
export default function App() {
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/:id" element={<PetDetail />} />
          <Route path="/adopt/:id" element={<AdoptForm />} />
          <Route path="/applications" element={<Applications />} />
        </Routes>
      </main>

      <footer
        style={{
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          padding: '2.5rem 0',
          marginTop: 'auto',
          borderTop: '1px solid #1e293b'
        }}
      >
        <div className="container flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>PawPals Pet Adoption System</h4>
          </div>
          <p style={{ fontSize: '0.85rem' }}>© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
