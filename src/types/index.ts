// ─── API User (from JSONPlaceholder) ────────────────────────────────────────
export interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// ─── App User (local state, can be added/edited/deleted) ────────────────────
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  isLocal?: boolean; // true if user was added manually
}

// ─── Health Assessment Form ──────────────────────────────────────────────────
export interface VitalSigns {
  temperature: string;
  bloodPressure: string;
  heartRate: string;
  oxygenLevel: string;
  respiratoryRate: string;
}

export interface Symptoms {
  fever: boolean;
  cough: boolean;
  fatigue: boolean;
  headache: boolean;
  shortnessOfBreath: boolean;
  dizziness: boolean;
}

export interface Activities {
  walk: { morning: boolean; afternoon: boolean; evening: boolean };
  exercise: { morning: boolean; afternoon: boolean; evening: boolean };
  therapy: { morning: boolean; afternoon: boolean; evening: boolean };
  socialInteraction: { morning: boolean; afternoon: boolean; evening: boolean };
}

export interface Meals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  snacks: boolean;
  notes: string;
}

export interface HealthAssessmentFormData {
  userId: number;
  userName: string;
  residentName: string;
  date: string;
  caregiverName: string;
  age: string;
  gender: string;
  roomNo: string;
  vitalSigns: VitalSigns;
  symptoms: Symptoms;
  caregiverNotes: string;
  dailyActivities: Activities;
  meals: Meals;
  caregiverSignature: string;
}

// ─── Incident Report Form ────────────────────────────────────────────────────
export type IncidentType = 'fall' | 'medicationError' | 'injury' | 'behavioralIssue' | 'other';

export interface IncidentFormData {
  userId: number;
  userName: string;
  residentName: string;
  date: string;
  caregiverName: string;
  time: string;
  location: string;
  roomNo: string;
  incidentType: IncidentType[];
  incidentDescription: string;
  actionTaken: {
    doctorNotified: boolean;
    familyNotified: boolean;
    medicationGiven: boolean;
    observationContinued: boolean;
  };
  followUpNotes: string;
}

// ─── Submitted Form (union type stored per user) ─────────────────────────────
export type FormType = 'health_assessment' | 'incident_report';

export interface SubmittedForm {
  id: string;
  formType: FormType;
  formTitle: string;
  submittedAt: string;
  userId: number;
  data: HealthAssessmentFormData | IncidentFormData;
}

// ─── App State ───────────────────────────────────────────────────────────────
export type TabType = 'users' | 'care-forms';
export type ActiveFormType = 'health_assessment' | 'incident_report' | null;
