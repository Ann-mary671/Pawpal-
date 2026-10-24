import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Home as HomeIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  MapPin,
  FileText
} from 'lucide-react';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState({
    open: false,
    action: null, // 'Approved' | 'Rejected'
    application: null
  });
  const [reviewData, setReviewData] = useState({
    pickup_date: '',
    review_notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const fetchApplications = () => {
    fetch('http://localhost:5000/api/adoptions')
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openReviewModal = (application, action) => {
    // Default pickup date to 3 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    const formattedDate = defaultDate.toISOString().split('T')[0];

    setReviewModal({
      open: true,
      action,
      application
    });
    setReviewData({
      pickup_date: action === 'Approved' ? formattedDate : '',
      review_notes: action === 'Approved' 
        ? 'Congratulations! Your home environment is a wonderful match. Please bring a valid ID and a pet carrier.' 
        : ''
    });
  };

  const closeReviewModal = () => {
    setReviewModal({ open: false, action: null, application: null });
    setReviewData({ pickup_date: '', review_notes: '' });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModal.application) return;

    if (reviewModal.action === 'Rejected' && !reviewData.review_notes.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    if (reviewModal.action === 'Approved' && !reviewData.pickup_date) {
      alert('Please choose a scheduled pickup date.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/adoptions/${reviewModal.application.id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: reviewModal.action,
          review_notes: reviewData.review_notes,
          pickup_date: reviewData.pickup_date
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update application review status');
      }

      setFeedbackMsg({
        type: 'success',
        text: `Application for ${reviewModal.application.pet_name} has been ${reviewModal.action.toLowerCase()}!`
      });
      setTimeout(() => setFeedbackMsg(null), 4000);

      closeReviewModal();
      fetchApplications();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Adoption Applications</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review applicants, approve adoptions with pickup dates, or reject applications with explanations.
        </p>
      </div>

      {feedbackMsg && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={20} color="#10b981" />
          {feedbackMsg.text}
        </div>
      )}

      {loading ? (
        <p>Loading applications from SQL database...</p>
      ) : applications.length === 0 ? (
        <div style={{ background: 'white', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No adoption applications submitted yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                border: app.status === 'Approved' ? '1.5px solid #10b981' : app.status === 'Rejected' ? '1.5px solid #ef4444' : '1px solid var(--border)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
                <img
                  src={app.pet_image}
                  alt={app.pet_name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
                  }}
                  style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />

                <div style={{ flex: 1, minWidth: '250px' }}>
                  <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                      Pet: {app.pet_name}
                    </h3>
                    
                    {/* Status Badge */}
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor:
                          app.status === 'Approved'
                            ? '#dcfce7'
                            : app.status === 'Rejected'
                            ? '#fee2e2'
                            : '#fef3c7',
                        color:
                          app.status === 'Approved'
                            ? '#15803d'
                            : app.status === 'Rejected'
                            ? '#b91c1c'
                            : '#b45309'
                      }}
                    >
                      {app.status === 'Approved' && <CheckCircle2 size={14} />}
                      {app.status === 'Rejected' && <XCircle size={14} />}
                      {app.status === 'Pending' && <Clock size={14} />}
                      {app.status}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                    Breed: <strong>{app.pet_breed}</strong> • Applied on: {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#475569' }}>
                    <span className="flex items-center gap-1">
                      <User size={14} /> <strong>{app.applicant_name}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail size={14} /> {app.applicant_email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} /> {app.applicant_phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <HomeIcon size={14} /> {app.housing_type} ({app.has_yard ? 'Has Yard' : 'No Yard'}, {app.has_other_pets ? 'Has Pets' : 'No Other Pets'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Applicant Note */}
              <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', borderLeft: '3px solid #cbd5e1' }}>
                <strong style={{ color: 'var(--text-main)' }}>Reason for Adopting: </strong>
                <span style={{ color: '#475569' }}>{app.reason_for_adoption}</span>
              </div>

              {/* Review Decision Result Box if Approved or Rejected */}
              {app.status === 'Approved' && (
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div className="flex items-center gap-2" style={{ color: '#15803d', fontWeight: 700 }}>
                    <CheckCircle2 size={18} />
                    <span>Application Approved!</span>
                  </div>
                  {app.pickup_date && (
                    <div className="flex items-center gap-2" style={{ fontSize: '0.92rem', color: '#166534', fontWeight: 600 }}>
                      <Calendar size={16} />
                      Scheduled Pet Pickup Date: <span style={{ textDecoration: 'underline' }}>{new Date(app.pickup_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  )}
                  {app.review_notes && (
                    <div style={{ fontSize: '0.88rem', color: '#14532d', background: 'rgba(255,255,255,0.7)', padding: '0.6rem', borderRadius: '4px' }}>
                      <strong>Pickup Instructions / Shelter Note: </strong>
                      {app.review_notes}
                    </div>
                  )}
                </div>
              )}

              {app.status === 'Rejected' && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fca5a5',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div className="flex items-center gap-2" style={{ color: '#b91c1c', fontWeight: 700 }}>
                    <XCircle size={18} />
                    <span>Application Not Approved</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#991b1b', background: 'rgba(255,255,255,0.7)', padding: '0.6rem', borderRadius: '4px' }}>
                    <strong>Rejection Reason: </strong>
                    {app.review_notes || 'Does not currently meet requirements for this specific pet.'}
                  </div>
                </div>
              )}

              {/* Review Buttons: Available if status is Pending, or allows re-evaluation */}
              <div className="flex items-center gap-2" style={{ justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                {app.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => openReviewModal(app, 'Approved')}
                      className="btn"
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.5rem 1rem'
                      }}
                    >
                      <CheckCircle2 size={16} /> Approve & Schedule Pickup
                    </button>
                    <button
                      onClick={() => openReviewModal(app, 'Rejected')}
                      className="btn"
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.5rem 1rem'
                      }}
                    >
                      <XCircle size={16} /> Reject with Reason
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openReviewModal(app, app.status === 'Approved' ? 'Rejected' : 'Approved')}
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  >
                    Change Decision ({app.status === 'Approved' ? 'Switch to Reject' : 'Switch to Approve'})
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Dialog Modal */}
      {reviewModal.open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeReviewModal();
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
              {reviewModal.action === 'Approved' ? (
                <div style={{ backgroundColor: '#dcfce7', padding: '8px', borderRadius: '50%', color: '#16a34a' }}>
                  <CheckCircle2 size={24} />
                </div>
              ) : (
                <div style={{ backgroundColor: '#fee2e2', padding: '8px', borderRadius: '50%', color: '#dc2626' }}>
                  <XCircle size={24} />
                </div>
              )}
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  {reviewModal.action === 'Approved' ? 'Approve Application' : 'Reject Application'}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Applicant: <strong>{reviewModal.application?.applicant_name}</strong> for <strong>{reviewModal.application?.pet_name}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit}>
              {reviewModal.action === 'Approved' ? (
                <>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                      📅 Scheduled Pickup Date *
                    </label>
                    <input
                      type="date"
                      required
                      className="input"
                      value={reviewData.pickup_date}
                      onChange={(e) => setReviewData({ ...reviewData, pickup_date: e.target.value })}
                      style={{ width: '100%' }}
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                      Inform the adopter when they can come to pick up the pet.
                    </small>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                      📝 Pickup Instructions / Note
                    </label>
                    <textarea
                      rows={3}
                      className="input"
                      value={reviewData.review_notes}
                      onChange={(e) => setReviewData({ ...reviewData, review_notes: e.target.value })}
                      placeholder="e.g. Please bring a collar, leash, pet carrier, and photo ID."
                      style={{ width: '100%', resize: 'vertical' }}
                    />
                  </div>
                </>
              ) : (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    ❌ Reason for Rejection *
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="input"
                    value={reviewData.review_notes}
                    onChange={(e) => setReviewData({ ...reviewData, review_notes: e.target.value })}
                    placeholder="e.g. Pet requires a fenced yard, or building does not allow large pets, etc."
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                    This reason will be provided to the client for transparency.
                  </small>
                </div>
              )}

              <div className="flex items-center gap-2" style={{ justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeReviewModal}
                  className="btn btn-outline"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  disabled={submitting}
                  style={{
                    backgroundColor: reviewModal.action === 'Approved' ? '#10b981' : '#ef4444',
                    color: 'white'
                  }}
                >
                  {submitting ? 'Saving...' : `Confirm ${reviewModal.action}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
