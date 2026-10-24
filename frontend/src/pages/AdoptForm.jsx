import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Send } from 'lucide-react';

/**
 * MODULE 3: Forms – Controlled Components, Submission, Validation
 * Demonstrates input state management, error handling, validation, and async fetch submission
 */

export default function AdoptForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    housing_type: 'House',
    has_yard: false,
    has_other_pets: false,
    reason_for_adoption: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  // Fetch pet info for context
  useEffect(() => {
    fetch(`http://localhost:5000/api/pets/${id}`)
      .then((res) => res.json())
      .then((data) => setPet(data))
      .catch((err) => console.error(err));
  }, [id]);

  // Form field change handler (Controlled Components)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear individual error when user starts correcting
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.applicant_name.trim()) newErrors.applicant_name = 'Full name is required.';
    
    if (!formData.applicant_email.trim()) {
      newErrors.applicant_email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.applicant_email)) {
      newErrors.applicant_email = 'Invalid email address format.';
    }

    if (!formData.applicant_phone.trim()) {
      newErrors.applicant_phone = 'Phone number is required.';
    } else if (formData.applicant_phone.trim().length < 7) {
      newErrors.applicant_phone = 'Phone number must be at least 7 digits.';
    }

    if (!formData.reason_for_adoption.trim()) {
      newErrors.reason_for_adoption = 'Please explain your reason for adopting.';
    } else if (formData.reason_for_adoption.trim().length < 15) {
      newErrors.reason_for_adoption = 'Reason must be at least 15 characters long.';
    }

    return newErrors;
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/adoptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pet_id: id,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application. Please check backend.');
      }

      const result = await response.json();
      setSuccessMessage(result.message || 'Adoption application registered successfully!');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '750px' }}>
      <Link to={pet ? `/pets/${pet.id}` : '/pets'} className="flex items-center gap-1" style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft size={18} /> Back to details
      </Link>

      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          padding: '2.5rem',
          border: '1px solid var(--border)'
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Adoption Application {pet && `for ${pet.name}`}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Please fill out this form accurately so our team can review your living environment.
        </p>

        {/* Success Alert */}
        {successMessage ? (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              textAlign: 'center',
              color: '#065f46'
            }}
          >
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Application Submitted!</h2>
            <p style={{ marginBottom: '1.5rem' }}>{successMessage}</p>
            <div className="flex items-center gap-2" style={{ justifyContent: 'center' }}>
              <button onClick={() => navigate('/applications')} className="btn btn-primary">
                View All Applications
              </button>
              <button onClick={() => navigate('/pets')} className="btn btn-outline">
                Browse More Pets
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {serverError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #ef4444',
                  color: '#991b1b',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.5rem'
                }}
              >
                {serverError}
              </div>
            )}

            {/* Applicant Name */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="applicant_name"
                value={formData.applicant_name}
                onChange={handleChange}
                placeholder="Jane Doe"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: errors.applicant_name ? '1px solid var(--danger)' : '1px solid var(--border)',
                  outline: 'none'
                }}
              />
              {errors.applicant_name && (
                <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.applicant_name}</span>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="applicant_email"
                  value={formData.applicant_email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: errors.applicant_email ? '1px solid var(--danger)' : '1px solid var(--border)',
                    outline: 'none'
                  }}
                />
                {errors.applicant_email && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.applicant_email}</span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="applicant_phone"
                  value={formData.applicant_phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: errors.applicant_phone ? '1px solid var(--danger)' : '1px solid var(--border)',
                    outline: 'none'
                  }}
                />
                {errors.applicant_phone && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.applicant_phone}</span>
                )}
              </div>
            </div>

            {/* Housing Type */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Housing Type
              </label>
              <select
                name="housing_type"
                value={formData.housing_type}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  outline: 'none'
                }}
              >
                <option value="House">Single Family House</option>
                <option value="Apartment">Apartment / Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
              <label className="flex items-center gap-1" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="has_yard"
                  checked={formData.has_yard}
                  onChange={handleChange}
                />
                <span>Fenced Yard Available</span>
              </label>

              <label className="flex items-center gap-1" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="has_other_pets"
                  checked={formData.has_other_pets}
                  onChange={handleChange}
                />
                <span>Currently Own Other Pets</span>
              </label>
            </div>

            {/* Reason */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
                Why do you want to adopt this pet? *
              </label>
              <textarea
                name="reason_for_adoption"
                rows="4"
                value={formData.reason_for_adoption}
                onChange={handleChange}
                placeholder="Tell us about your home, routine, and preparation..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: errors.reason_for_adoption ? '1px solid var(--danger)' : '1px solid var(--border)',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              {errors.reason_for_adoption && (
                <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{errors.reason_for_adoption}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
            >
              {isSubmitting ? 'Submitting Application...' : 'Send Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
