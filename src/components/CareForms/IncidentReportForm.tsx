import React from 'react';
import { useForm } from 'react-hook-form';
import { IncidentFormData } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { IconAlertTriangle, IconCheck } from '../shared/Icons';
import toast from 'react-hot-toast';

interface Props {
  onSuccess: () => void;
}

const IncidentReportForm: React.FC<Props> = ({ onSuccess }) => {
  const { users, submitForm } = useAppContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IncidentFormData>({
    defaultValues: {
      incidentType: [],
      actionTaken: {
        doctorNotified: false,
        familyNotified: false,
        medicationGiven: false,
        observationContinued: false,
      },
    },
  });

  const onSubmit = (data: IncidentFormData) => {
    const user = users.find((u) => u.id === Number(data.userId));
    if (!user) { toast.error('User not found'); return; }
    submitForm('incident_report', { ...data, userId: Number(data.userId), userName: user.name });
    toast.success(`Incident Report submitted for ${user.name}`);
    reset();
    onSuccess();
  };

  const INCIDENT_TYPES = [
    { key: 'fall', label: 'Fall' },
    { key: 'medicationError', label: 'Medication Error' },
    { key: 'injury', label: 'Injury' },
    { key: 'behavioralIssue', label: 'Behavioral Issue' },
    { key: 'other', label: 'Other' },
  ] as const;

  const ACTION_ITEMS = [
    { key: 'doctorNotified', label: 'Doctor Notified' },
    { key: 'familyNotified', label: 'Family Notified' },
    { key: 'medicationGiven', label: 'Medication Given' },
    { key: 'observationContinued', label: 'Observation Continued' },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Section 1: Resident & Incident Details */}
      <div className="form-section">
        <div className="form-section-title" style={{ color: '#dc2626' }}>
          <IconAlertTriangle size={16} /> Resident & Incident Details
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Select User <span className="required">*</span>
            </label>
            <select
              className={`form-select ${errors.userId ? 'error' : ''}`}
              {...register('userId', { required: 'Please select a user' })}
            >
              <option value="">— Select a user —</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            {errors.userId && <span className="form-error">{errors.userId.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">
              Resident Name <span className="required">*</span>
            </label>
            <input
              className={`form-input ${errors.residentName ? 'error' : ''}`}
              placeholder="Resident's full name"
              {...register('residentName', { required: 'Resident name is required' })}
            />
            {errors.residentName && <span className="form-error">{errors.residentName.message}</span>}
          </div>
        </div>
        <div className="form-row cols-3">
          <div className="form-group">
            <label className="form-label">
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              className={`form-input ${errors.date ? 'error' : ''}`}
              {...register('date', { required: 'Date is required' })}
            />
            {errors.date && <span className="form-error">{errors.date.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">
              Time <span className="required">*</span>
            </label>
            <input
              type="time"
              className={`form-input ${errors.time ? 'error' : ''}`}
              {...register('time', { required: 'Time is required' })}
            />
            {errors.time && <span className="form-error">{errors.time.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Room No.</label>
            <input className="form-input" placeholder="e.g. 12A" {...register('roomNo')} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Caregiver Name <span className="required">*</span>
            </label>
            <input
              className={`form-input ${errors.caregiverName ? 'error' : ''}`}
              placeholder="Caregiver's name"
              {...register('caregiverName', { required: 'Caregiver name is required' })}
            />
            {errors.caregiverName && <span className="form-error">{errors.caregiverName.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              className="form-input"
              placeholder="e.g. Dining Hall, Room 12A"
              {...register('location')}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Incident Type */}
      <div className="form-section">
        <div className="form-section-title" style={{ color: '#dc2626' }}>
          ⚠️ Incident Type
        </div>
        <div className="checkbox-group">
          {INCIDENT_TYPES.map(({ key, label }) => (
            <label key={key} className="checkbox-item">
              <input
                type="checkbox"
                value={key}
                {...register('incidentType', {
                  validate: (v) => (v && v.length > 0) || 'Select at least one incident type',
                })}
              />
              {label}
            </label>
          ))}
        </div>
        {errors.incidentType && (
          <span className="form-error" style={{ marginTop: 6, display: 'block' }}>
            {errors.incidentType.message}
          </span>
        )}
      </div>

      {/* Section 3: Incident Description */}
      <div className="form-section">
        <div className="form-section-title" style={{ color: '#dc2626' }}>
          📋 Incident Description
        </div>
        <div className="form-group">
          <label className="form-label">
            Description <span className="required">*</span>
          </label>
          <textarea
            className={`form-textarea ${errors.incidentDescription ? 'error' : ''}`}
            placeholder="Describe the incident in detail — what happened, when, where, and any contributing factors…"
            rows={5}
            {...register('incidentDescription', {
              required: 'Incident description is required',
              minLength: { value: 20, message: 'Please provide at least 20 characters' },
            })}
          />
          {errors.incidentDescription && (
            <span className="form-error">{errors.incidentDescription.message}</span>
          )}
        </div>
      </div>

      {/* Section 4: Actions Taken */}
      <div className="form-section">
        <div className="form-section-title" style={{ color: '#dc2626' }}>
          ✅ Follow-up & Actions Taken
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {ACTION_ITEMS.map(({ key, label }) => (
            <label key={key} className="checkbox-item">
              <input type="checkbox" {...register(`actionTaken.${key}`)} />
              {label}
            </label>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">Additional Follow-up Notes</label>
          <textarea
            className="form-textarea"
            placeholder="Any additional notes, observations, or planned follow-up actions…"
            rows={4}
            {...register('followUpNotes')}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={() => reset()}>
          Reset Form
        </button>
        <button
          type="submit"
          className="btn"
          disabled={isSubmitting}
          style={{
            background: '#dc2626', color: 'white',
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 'var(--radius-md)', border: 'none',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-sans)',
            transition: 'all var(--transition)',
          }}
        >
          <IconCheck size={15} /> Submit Incident Report
        </button>
      </div>
    </form>
  );
};

export default IncidentReportForm;
