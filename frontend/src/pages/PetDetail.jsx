import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, CheckCircle2, ArrowLeft, DollarSign, Calendar, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PetDetail() {
  const { id } = useParams(); // React Router parameter
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useApp();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/pets/${id}`);
        if (!res.ok) throw new Error('Pet not found');
        const data = await res.json();
        setPet(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Loading pet profile...</h2>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Unable to load pet</h2>
        <p style={{ color: 'var(--danger)', margin: '1rem 0' }}>{error || 'Pet not found'}</p>
        <Link to="/pets" className="btn btn-primary">
          Back to Listings
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(pet.id);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <Link to="/pets" className="flex items-center gap-1" style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft size={18} /> Back to all pets
      </Link>

      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}
      >
        {/* Pet Image */}
        <div style={{ height: '450px', position: 'relative' }}>
          <img
            src={pet.image_url}
            alt={pet.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>

        {/* Pet Profile Info */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>{pet.name}</h1>
            <button
              onClick={() => toggleFavorite(pet)}
              className="btn btn-outline"
              style={{ padding: '0.5rem 0.8rem' }}
            >
              <Heart size={20} color={favorited ? '#e11d48' : '#64748b'} fill={favorited ? '#e11d48' : 'none'} />
            </button>
          </div>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {pet.breed} • {pet.category_name}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              backgroundColor: '#f8fafc',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Age</span>
              <p style={{ fontWeight: 700 }}>{pet.age} {pet.age === 1 ? 'Year' : 'Years'}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gender</span>
              <p style={{ fontWeight: 700 }}>{pet.gender}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Size</span>
              <p style={{ fontWeight: 700 }}>{pet.size}</p>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>About {pet.name}</h3>
            <p style={{ color: '#475569', lineHeight: 1.7 }}>{pet.description}</p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div className="flex items-center gap-1" style={{ color: 'var(--secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
              <CheckCircle2 size={18} /> Health & Wellness: {pet.health_status}
            </div>
            <div className="flex items-center gap-1" style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '1.2rem' }}>
              Adoption Fee: ₹{Number(pet.adoption_fee).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className="flex items-center gap-2" style={{ marginTop: 'auto' }}>
            <Link
              to={`/adopt/${pet.id}`}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.9rem', fontSize: '1.05rem', textAlign: 'center' }}
            >
              Submit Adoption Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
