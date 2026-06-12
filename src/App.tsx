import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import UsersTab from './components/Users/UsersTab';
import CareFormsTab from './components/CareForms/CareFormsTab';
import { TabType } from './types';
import './index.css';

const NAV_TABS: Array<{ id: TabType; label: string; icon: string }> = [
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'care-forms', label: 'Care Forms', icon: '📋' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');

  return (
    <AppProvider>
      <div className="app-shell">
        {/* Top Navigation */}
        <nav className="top-nav" role="navigation" aria-label="Main navigation">
          <a className="nav-brand" href="/" aria-label="Careflick Home">
            <div className="nav-brand-icon" aria-hidden="true">✦</div>
            <span>Careflick</span>
          </a>

          <div className="tab-bar" role="tablist" aria-label="Dashboard sections">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span aria-hidden="true">{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
            Care Management Dashboard
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          {activeTab === 'users' && (
            <div role="tabpanel" id="panel-users" aria-label="Users">
              <div className="page-header">
                <h1 className="page-title">Users</h1>
                <p className="page-subtitle">
                  Manage residents, view profiles, and track submitted care forms
                </p>
              </div>
              <UsersTab />
            </div>
          )}
          {activeTab === 'care-forms' && (
            <div role="tabpanel" id="panel-care-forms" aria-label="Care Forms">
              <CareFormsTab />
            </div>
          )}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1a202c',
            color: '#f7fafc',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            borderRadius: '10px',
            padding: '10px 16px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </AppProvider>
  );
};

export default App;
