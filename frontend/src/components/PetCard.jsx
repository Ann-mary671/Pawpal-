import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Tag, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * MODULE 2 & 4:
 * - Functional Component with Props
 * - List Item rendering & Keys
 * - Event Handling (Favorite toggle)
 * - Conditional Rendering
 */

export default function PetCard({ pet }) {
  const { isFavorite, toggleFavorite } = useApp();
  const favorited = isFavorite(pet.id);

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        border: '1px solid var(--border)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
    >
      <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
        <img
          src={pet.image_url}
          alt={pet.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
          }}
        />

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(pet);
          }}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'white',
            borderRadius: '50%',
            padding: '8px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <Heart size={18} color={favorited ? '#e11d48' : '#64748b'} fill={favorited ? '#e11d48' : 'none'} />
        </button>

        {/* Conditional Badge */}
        <span
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: pet.status === 'Available' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(234, 88, 12, 0.95)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '999px',
            textTransform: 'uppercase'
          }}
        >
          {pet.status}
        </span>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{pet.name}</h3>
          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>
            ₹{Number(pet.adoption_fee).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
          {pet.breed} • {pet.age} {pet.age === 1 ? 'yr' : 'yrs'} old • {pet.gender}
        </p>

        <div className="flex items-center gap-2" style={{ marginTop: 'auto' }}>
          <Link
            to={`/pets/${pet.id}`}
            className="btn btn-outline"
            style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem' }}
          >
            View Details
          </Link>
          <Link
            to={`/adopt/${pet.id}`}
            className="btn btn-primary"
            style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem' }}
          >
            Adopt Me
          </Link>
        </div>
      </div>
    </div>
  );
}
