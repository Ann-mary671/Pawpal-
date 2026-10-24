import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, PawPrint, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const location = useLocation();
  const { favorites } = useApp();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container flex items-center justify-between" style={{ height: '70px' }}>
        <Link to="/" className="flex items-center gap-1" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
          <PawPrint size={32} />
          <span>PawPals</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/"
            style={{
              fontWeight: 600,
              color: isActive('/') ? 'var(--primary)' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Home size={18} /> Home
          </Link>

          <Link
            to="/pets"
            style={{
              fontWeight: 600,
              color: isActive('/pets') ? 'var(--primary)' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <PawPrint size={18} /> Browse Pets
          </Link>

          <Link
            to="/applications"
            style={{
              fontWeight: 600,
              color: isActive('/applications') ? 'var(--primary)' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FileText size={18} /> Applications
          </Link>



          <div style={{ marginLeft: '1rem', position: 'relative' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                backgroundColor: '#fff1f2',
                borderRadius: '999px',
                color: '#e11d48',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <Heart size={16} fill={favorites.length ? '#e11d48' : 'none'} />
              Favorites: {favorites.length}
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
