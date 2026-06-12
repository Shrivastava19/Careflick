import React, { useState } from 'react';
import { ActiveFormType } from '../../types';
import HealthAssessmentForm from './HealthAssessmentForm';
import IncidentReportForm from './IncidentReportForm';
import { useAppContext } from '../../context/AppContext';

const CareFormsTab: React.FC = () => {
  const [activeForm, setActiveForm] = useState<ActiveFormType>(null);
  const { submittedForms } = useAppContext();

  const healthCount = submittedForms.filter((f) => f.formType === 'health_assessment').length;
  const incidentCount = submittedForms.filter((f) => f.formType === 'incident_report').length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Care Forms</h1>
        <p className="page-subtitle">
          Convert PDF care forms into digital submissions linked to residents
        </p>
      </div>

      {/* Form Selector Cards */}
      <div className="form-selector">
        <button
          className={`form-selector-card ${activeForm === 'health_assessment' ? 'active' : ''}`}
          onClick={() => setActiveForm(activeForm === 'health_assessment' ? null : 'health_assessment')}
        >
          <div className="form-card-icon health">🏥</div>
          <div className="form-card-title">Comprehensive Health Assessment</div>
          <div className="form-card-desc">
            Record vital signs, symptoms, daily activities, and nutritional intake for a resident.
          </div>
          {healthCount > 0 && (
            <div style={{ marginTop: 10 }}>
              <span style={{
                fontSize: '12px', fontWeight: 600, padding: '3px 9px',
                borderRadius: '12px', background: '#d1fae5', color: '#065f46',
              }}>
                {healthCount} submitted
              </span>
            </div>
          )}
        </button>

        <button
          className={`form-selector-card ${activeForm === 'incident_report' ? 'active' : ''}`}
          onClick={() => setActiveForm(activeForm === 'incident_report' ? null : 'incident_report')}
        >
          <div className="form-card-icon incident">🚨</div>
          <div className="form-card-title">Incident Report Form</div>
          <div className="form-card-desc">
            Document falls, medication errors, injuries, behavioral issues, and follow-up actions.
          </div>
          {incidentCount > 0 && (
            <div style={{ marginTop: 10 }}>
              <span style={{
                fontSize: '12px', fontWeight: 600, padding: '3px 9px',
                borderRadius: '12px', background: '#fee2e2', color: '#991b1b',
              }}>
                {incidentCount} submitted
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Active Form */}
      {activeForm === 'health_assessment' && (
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20, padding: '14px 18px',
            background: '#d1fae5', borderRadius: 'var(--radius-md)',
            border: '1px solid #a7f3d0',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#065f46' }}>
                🏥 Comprehensive Health Assessment Form
              </div>
              <div style={{ fontSize: 13, color: '#047857', marginTop: 2 }}>
                All fields marked with <span style={{ color: 'var(--danger)' }}>*</span> are required
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveForm(null)}
            >
              ✕ Close Form
            </button>
          </div>
          <HealthAssessmentForm onSuccess={() => setActiveForm(null)} />
        </div>
      )}

      {activeForm === 'incident_report' && (
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20, padding: '14px 18px',
            background: '#fee2e2', borderRadius: 'var(--radius-md)',
            border: '1px solid #fecaca',
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#991b1b' }}>
                🚨 Incident Report Form
              </div>
              <div style={{ fontSize: 13, color: '#b91c1c', marginTop: 2 }}>
                All fields marked with <span style={{ color: 'var(--danger)' }}>*</span> are required
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveForm(null)}
            >
              ✕ Close Form
            </button>
          </div>
          <IncidentReportForm onSuccess={() => setActiveForm(null)} />
        </div>
      )}

      {!activeForm && (
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">Select a form to get started</div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Click on one of the form cards above to open the digital form.
          </p>
        </div>
      )}
    </div>
  );
};

export default CareFormsTab;
