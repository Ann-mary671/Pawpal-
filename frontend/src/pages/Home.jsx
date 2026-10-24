import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPets } from '../redux/store';
import PetCard from '../components/PetCard';
import LiveAdoptionCounter from '../components/LiveAdoptionCounter';
import { Search, Heart, ShieldCheck, Smile, Sparkles } from 'lucide-react';

export default function Home() {
  const dispatch = useDispatch();
  const { items: pets, loading } = useSelector((state) => state.pets);
  const [featuredCategory, setFeaturedCategory] = useState('All');

  useEffect(() => {
    dispatch(fetchPets({ category: featuredCategory }));
  }, [dispatch, featuredCategory]);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url("https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '5rem 0',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <span
            style={{
              backgroundColor: 'rgba(249, 115, 22, 0.9)',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Find Your Forever Friend
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '1rem 0', lineHeight: 1.2 }}>
            Adopt Love, Save a Life
          </h1>

          <div className="flex items-center justify-between" style={{ justifyContent: 'center', gap: '1rem' }}>
            <Link to="/pets" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.1rem' }}>
              Find a Pet
            </Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '2rem' }}>
        {/* Class Component Demo */}
        <LiveAdoptionCounter title="Total Pets Rehomed This Year" />

        {/* Feature Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            margin: '3rem 0'
          }}
        >
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <ShieldCheck size={36} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Fully Vaccinated</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>All our pets undergo comprehensive health screening and initial vaccinations.</p>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <Smile size={36} color="var(--secondary)" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Behavior Tested</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Temperament checked to match perfectly with families, kids, and other pets.</p>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <Sparkles size={36} color="var(--accent)" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lifetime Support</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Post-adoption medical advice and behavior support for new pet parents.</p>
          </div>
        </div>

        {/* Featured Pets Section */}
        <div className="flex items-center justify-between" style={{ margin: '2rem 0 1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Featured Companions</h2>
            <p style={{ color: 'var(--text-muted)' }}>Meet some of our newest arrivals looking for a safe haven.</p>
          </div>
          <Link to="/pets" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            View All Pets &rarr;
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>Loading pets from SQL API...</p>
          </div>
        ) : (
          <div className="grid-pets">
            {pets.slice(0, 4).map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
