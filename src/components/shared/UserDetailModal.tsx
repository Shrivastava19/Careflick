import React from 'react';
import { User, SubmittedForm } from '../../types';
import {
  IconX, IconMail, IconPhone, IconMapPin, IconBuilding,
  IconGlobe, IconHeart, IconAlertTriangle, IconFileText,
} from './Icons';

interface Props {
  user: User;
  submittedForms: SubmittedForm[];
  onClose: () => void;
  onEdit: () => void;
}

const getInitials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const UserDetailModal: React.FC<Props> = ({ user, submittedForms, onClose, onEdit }) => {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg" role="dialog" aria-modal="true" aria-labelledby="user-detail-title">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="user-card-avatar" style={{ width: 52, height: 52, fontSize: 20, flexShrink: 0 }}>
              {getInitials(user.name)}
            </div>
            <div>
              <h2 className="modal-title" id="user-detail-title">{user.name}</h2>
              <p className="modal-subtitle">@{user.username}</p>
            </div>
            {user.isLocal && (
              <span className="local-badge" style={{ alignSelf: 'flex-start', marginTop: 2 }}>Local</span>
            )}
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <IconX />
          </button>
        </div>

        <div className="modal-body">
          {/* Contact Info */}
          <div className="detail-section">
            <div className="detail-section-title">
              <IconFileText size={13} /> Contact Information
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <label><IconMail size={12} style={{ marginRight: 4 }} />Email</label>
                <span>{user.email}</span>
              </div>
              <div className="detail-item">
                <label><IconPhone size={12} style={{ marginRight: 4 }} />Phone</label>
                <span>{user.phone}</span>
              </div>
              <div className="detail-item">
                <label><IconGlobe size={12} style={{ marginRight: 4 }} />Website</label>
                <span>{user.website || '—'}</span>
              </div>
              <div className="detail-item">
                <label><IconMapPin size={12} style={{ marginRight: 4 }} />Address</label>
                <span>
                  {[user.address.street, user.address.suite, user.address.city, user.address.zipcode]
                    .filter(Boolean)
                    .join(', ') || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Company */}
          {user.company.name && (
            <div className="detail-section">
              <div className="detail-section-title">
                <IconBuilding size={13} /> Company
              </div>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Company Name</label>
                  <span>{user.company.name}</span>
                </div>
                {user.company.catchPhrase && (
                  <div className="detail-item">
                    <label>Catch Phrase</label>
                    <span>{user.company.catchPhrase}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="divider" />

          {/* Submitted Care Forms */}
          <div className="detail-section" style={{ marginBottom: 0 }}>
            <div className="detail-section-title" style={{ marginBottom: 14 }}>
              <IconFileText size={13} /> Submitted Care Forms
              {submittedForms.length > 0 && (
                <span style={{
                  background: 'var(--brand-blue)', color: 'white',
                  borderRadius: '12px', padding: '1px 8px', fontSize: '11px', fontWeight: 600
                }}>
                  {submittedForms.length}
                </span>
              )}
            </div>

            {submittedForms.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px 20px' }}>
                <div className="empty-state-icon">📋</div>
                <div className="empty-state-title">No forms submitted yet</div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Go to <strong>Care Forms</strong> tab to submit forms for this user.
                </p>
              </div>
            ) : (
              <div className="submitted-forms-list">
                {submittedForms.map((form) => (
                  <div key={form.id} className="submitted-form-item">
                    <div className={`form-item-icon ${form.formType === 'health_assessment' ? 'health' : 'incident'}`}>
                      {form.formType === 'health_assessment' ? (
                        <IconHeart size={16} />
                      ) : (
                        <IconAlertTriangle size={16} />
                      )}
                    </div>
                    <div className="form-item-info">
                      <div className="form-item-title">{form.formTitle}</div>
                      <div className="form-item-date">Submitted on {formatDate(form.submittedAt)}</div>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: form.formType === 'health_assessment' ? '#d1fae5' : '#fee2e2',
                      color: form.formType === 'health_assessment' ? '#065f46' : '#991b1b',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}>
                      {form.formType === 'health_assessment' ? 'Health' : 'Incident'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={onEdit}>Edit User</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
