import React from 'react';
import { useForm } from 'react-hook-form';
import { HealthAssessmentFormData } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { IconHeart, IconCheck } from '../shared/Icons';
import toast from 'react-hot-toast';

interface Props {
  onSuccess: () => void;
}

const HealthAssessmentForm: React.FC<Props> = ({ onSuccess }) => {
  const { users, submitForm } = useAppContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HealthAssessmentFormData>({
    defaultValues: {
      symptoms: {
        fever: false, cough: false, fatigue: false,
        headache: false, shortnessOfBreath: false, dizziness: false,
      },
      dailyActivities: {
        walk: { morning: false, afternoon: false, evening: false },
        exercise: { morning: false, afternoon: false, evening: false },
        therapy: { morning: false, afternoon: false, evening: false },
        socialInteraction: { morning: false, afternoon: false, evening: false },
      },
      meals: { breakfast: false, lunch: false, dinner: false, snacks: false, notes: '' },
    },
  });

  const onSubmit = (data: HealthAssessmentFormData) => {
    const user = users.find((u) => u.id === Number(data.userId));
    if (!user) { toast.error('User not found'); return; }
    submitForm('health_assessment', { ...data, userId: Number(data.userId), userName: user.name });
    toast.success(`Health Assessment submitted for ${user.name}`);
    reset();
    onSuccess();
  };

  const SYMPTOM_LABELS: Array<{ key: keyof HealthAssessmentFormData['symptoms']; label: string }> = [
    { key: 'fever', label: 'Fever' },
    { key: 'cough', label: 'Cough' },
    { key: 'fatigue', label: 'Fatigue' },
    { key: 'headache', label: 'Headache' },
    { key: 'shortnessOfBreath', label: 'Shortness of Breath' },
    { key: 'dizziness', label: 'Dizziness' },
  ];

  const ACTIVITY_ROWS = [
    { key: 'walk', label: 'Walk' },
    { key: 'exercise', label: 'Exercise' },
    { key: 'therapy', label: 'Therapy' },
    { key: 'socialInteraction', label: 'Social Interaction' },
  ] as const;

  const MEAL_ROWS = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'snacks', label: 'Snacks' },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Section 1: Resident Info */}
      <div className="form-section">
        <div className="form-section-title">
          <IconHeart size={16} /> Resident & Caregiver Details
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
            <label className="form-label">Age</label>
            <input className="form-input" placeholder="e.g. 72" {...register('age')} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-select" {...register('gender')}>
              <option value="">— Select —</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Room No.</label>
            <input className="form-input" placeholder="e.g. 12A" {...register('roomNo')} />
          </div>
        </div>
      </div>

      {/* Section 2: Vital Signs */}
      <div className="form-section">
        <div className="form-section-title">🌡️ Vital Signs</div>
        <table className="vitals-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Recorded Value</th>
              <th>Normal Range</th>
            </tr>
          </thead>
          <tbody>
            {[
              { key: 'temperature', label: 'Temperature (°C)', range: '36.1 – 37.2' },
              { key: 'bloodPressure', label: 'Blood Pressure (mmHg)', range: '90/60 – 120/80' },
              { key: 'heartRate', label: 'Heart Rate (bpm)', range: '60 – 100' },
              { key: 'oxygenLevel', label: 'Oxygen Level (%)', range: '95 – 100' },
              { key: 'respiratoryRate', label: 'Respiratory Rate', range: '12 – 20' },
            ].map(({ key, label, range }) => (
              <tr key={key}>
                <td style={{ fontWeight: 500 }}>{label}</td>
                <td>
                  <input
                    className="form-input"
                    placeholder="Enter value"
                    style={{ margin: 0 }}
                    {...register(`vitalSigns.${key as keyof HealthAssessmentFormData['vitalSigns']}`)}
                  />
                </td>
                <td>{range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 3: Symptoms */}
      <div className="form-section">
        <div className="form-section-title">🤒 Symptoms Observed</div>
        <div className="checkbox-group">
          {SYMPTOM_LABELS.map(({ key, label }) => (
            <label key={key} className="checkbox-item">
              <input type="checkbox" {...register(`symptoms.${key}`)} />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Section 4: Caregiver Notes */}
      <div className="form-section">
        <div className="form-section-title">📝 Caregiver Notes</div>
        <div className="form-row cols-1">
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              placeholder="Enter caregiver observations and notes…"
              rows={4}
              {...register('caregiverNotes')}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Caregiver Signature</label>
            <input
              className="form-input"
              placeholder="Type full name as signature"
              {...register('caregiverSignature')}
            />
          </div>
        </div>
      </div>

      {/* Section 5: Daily Activity */}
      <div className="form-section">
        <div className="form-section-title">🏃 Daily Activities</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="activity-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Morning</th>
                <th>Afternoon</th>
                <th>Evening</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_ROWS.map(({ key, label }) => (
                <tr key={key}>
                  <td>{label}</td>
                  {(['morning', 'afternoon', 'evening'] as const).map((time) => (
                    <td key={time}>
                      <input
                        type="checkbox"
                        style={{ width: 16, height: 16, accentColor: 'var(--brand-blue)', cursor: 'pointer' }}
                        {...register(`dailyActivities.${key}.${time}`)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 6: Nutrition */}
      <div className="form-section">
        <div className="form-section-title">🍽️ Nutrition & Meals</div>
        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table className="activity-table">
            <thead>
              <tr>
                <th>Meal</th>
                <th>Consumed</th>
              </tr>
            </thead>
            <tbody>
              {MEAL_ROWS.map(({ key, label }) => (
                <tr key={key}>
                  <td>{label}</td>
                  <td>
                    <input
                      type="checkbox"
                      style={{ width: 16, height: 16, accentColor: 'var(--brand-blue)', cursor: 'pointer' }}
                      {...register(`meals.${key}`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="form-group">
          <label className="form-label">Meal Notes</label>
          <textarea
            className="form-textarea"
            placeholder="Any notes about meals, appetite, or dietary concerns…"
            rows={3}
            {...register('meals.notes')}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={() => reset()}>
          Reset Form
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          <IconCheck size={15} /> Submit Health Assessment
        </button>
      </div>
    </form>
  );
};

export default HealthAssessmentForm;
