import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPets, setCategory, setSearchQuery } from '../redux/store';
import PetCard from '../components/PetCard';
import { Search, Filter, AlertCircle } from 'lucide-react';

export default function PetList() {
  const dispatch = useDispatch();
  const { items: pets, loading, error, selectedCategory, searchQuery } = useSelector((state) => state.pets);

  const categories = ['All', 'Dogs', 'Cats', 'Birds', 'Small Animals'];

  useEffect(() => {
    dispatch(fetchPets({ category: selectedCategory, search: searchQuery }));
  }, [dispatch, selectedCategory, searchQuery]);

  const handleCategoryClick = (cat) => {
    dispatch(setCategory(cat));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Available Pets for Adoption</h1>
        <p style={{ color: 'var(--text-muted)' }}>Browse through our available rescues and find your match.</p>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: 'white',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Categories (Controlled Tabs) */}
        <div className="flex items-center gap-1" style={{ flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat ? 'var(--primary)' : '#f1f5f9',
                color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input (Controlled Component) */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search name or breed..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.4rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
        </div>
      </div>

      {/* Loading & Error Handling (Module 5 requirement) */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <h3>Fetching latest pets from SQLite RDBMS...</h3>
        </div>
      )}

      {error && (
        <div
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={20} />
          <span>Error loading pets: {error}</span>
        </div>
      )}

      {/* Conditional Rendering (Module 3) */}
      {!loading && !error && pets.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: 'var(--radius-md)' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            No pets found matching your criteria.
          </p>
          <button
            onClick={() => {
              dispatch(setCategory('All'));
              dispatch(setSearchQuery(''));
            }}
            className="btn btn-outline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Lists and Keys (Module 4) */}
      <div className="grid-pets">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}
