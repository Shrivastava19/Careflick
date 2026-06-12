import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  User,
  SubmittedForm,
  HealthAssessmentFormData,
  IncidentFormData,
  FormType,
} from '../types';

// ─── Context Shape ────────────────────────────────────────────────────────────
interface AppContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  submittedForms: SubmittedForm[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
  deleteUser: (id: number) => void;
  submitForm: (
    formType: FormType,
    data: HealthAssessmentFormData | IncidentFormData
  ) => void;
  getFormsForUser: (userId: number) => SubmittedForm[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [submittedForms, setSubmittedForms] = useState<SubmittedForm[]>([]);

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now(),
      isLocal: true,
    };
    setUsers((prev) => [newUser, ...prev]);
  }, []);

  const updateUser = useCallback((id: number, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  }, []);

  const deleteUser = useCallback((id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSubmittedForms((prev) => prev.filter((f) => f.userId !== id));
  }, []);

  const submitForm = useCallback(
    (formType: FormType, data: HealthAssessmentFormData | IncidentFormData) => {
      const titles: Record<FormType, string> = {
        health_assessment: 'Health Assessment Form',
        incident_report: 'Incident Report Form',
      };
      const newForm: SubmittedForm = {
        id: `form-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        formType,
        formTitle: titles[formType],
        submittedAt: new Date().toISOString(),
        userId: data.userId,
        data,
      };
      setSubmittedForms((prev) => [newForm, ...prev]);
    },
    []
  );

  const getFormsForUser = useCallback(
    (userId: number) => submittedForms.filter((f) => f.userId === userId),
    [submittedForms]
  );

  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        submittedForms,
        addUser,
        updateUser,
        deleteUser,
        submitForm,
        getFormsForUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
