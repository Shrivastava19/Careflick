import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { useUsers, useDebounce, usePagination } from '../../hooks';
import { useAppContext } from '../../context/AppContext';
import UserDetailModal from '../shared/UserDetailModal';
import UserFormModal from '../shared/UserFormModal';
import {
  IconSearch, IconPlus, IconMail, IconPhone,
  IconEdit, IconTrash, IconRefresh, IconChevronLeft, IconChevronRight,
} from '../shared/Icons';
import toast from 'react-hot-toast';

const getInitials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const COLORS = [
  'linear-gradient(135deg,#0f4c81,#0d9488)',
  'linear-gradient(135deg,#7c3aed,#db2777)',
  'linear-gradient(135deg,#059669,#0891b2)',
  'linear-gradient(135deg,#d97706,#dc2626)',
  'linear-gradient(135deg,#2563eb,#7c3aed)',
  'linear-gradient(135deg,#0891b2,#059669)',
];

const UsersTab: React.FC = () => {
  const { loading, error, refetch } = useUsers();
  const { users, deleteUser, getFormsForUser } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, debouncedQuery]);

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 6);

  const totalForms = useMemo(
    () => users.reduce((sum, u) => sum + getFormsForUser(u.id).length, 0),
    [users, getFormsForUser]
  );

  const handleDelete = (e: React.MouseEvent, userId: number, userName: string) => {
    e.stopPropagation();
    if (window.confirm(`Delete user "${userName}"? This will also remove their submitted forms.`)) {
      deleteUser(userId);
      toast.success('User deleted');
      if (selectedUser?.id === userId) setSelectedUser(null);
    }
  };

  const handleEditClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setEditUser(user);
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Fetching users from API…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p style={{ fontWeight: 600, marginBottom: 8 }}>Failed to load users</p>
        <p style={{ fontSize: '14px', marginBottom: 16 }}>{error}</p>
        <button className="btn btn-secondary btn-sm" onClick={refetch}>
          <IconRefresh size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div>
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{users.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📋</div>
          <div>
            <div className="stat-label">Forms Submitted</div>
            <div className="stat-value">{totalForms}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🔍</div>
          <div>
            <div className="stat-label">Search Results</div>
            <div className="stat-value">{filtered.length}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-row">
        <div className="search-wrap">
          <span className="search-icon"><IconSearch /></span>
          <input
            className="search-input"
            type="text"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search users"
          />
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <IconPlus /> Add User
        </button>
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">No users found</div>
          <p style={{ fontSize: '13px' }}>
            {debouncedQuery ? 'Try a different search term.' : 'Add a user to get started.'}
          </p>
        </div>
      ) : (
        <div className="cards-grid">
          {paginated.map((user, idx) => {
            const forms = getFormsForUser(user.id);
            return (
              <div
                key={user.id}
                className="user-card"
                onClick={() => setSelectedUser(user)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${user.name}`}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedUser(user)}
              >
                <div
                  className="user-card-avatar"
                  style={{ background: COLORS[idx % COLORS.length] }}
                >
                  {getInitials(user.name)}
                </div>
                <div className="user-card-name">{user.name}</div>
                <div className="user-card-meta">
                  <div className="user-card-row">
                    <IconMail />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </span>
                  </div>
                  <div className="user-card-row">
                    <IconPhone />
                    <span>{user.phone}</span>
                  </div>
                </div>
                <div className="user-card-footer">
                  <span className="form-badge">
                    {forms.length} form{forms.length !== 1 ? 's' : ''}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {user.isLocal && <span className="local-badge">Local</span>}
                    <div className="card-actions">
                      <button
                        className="btn-icon"
                        onClick={(e) => handleEditClick(e, user)}
                        aria-label={`Edit ${user.name}`}
                        title="Edit user"
                      >
                        <IconEdit />
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={(e) => handleDelete(e, user.id, user.name)}
                        aria-label={`Delete ${user.name}`}
                        title="Delete user"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <IconChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`page-btn ${page === p ? 'active' : ''}`}
              onClick={() => setPage(p)}
              aria-label={`Page ${p}`}
              aria-current={page === p ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button
            className="page-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <IconChevronRight />
          </button>
          <span className="page-info">
            {(page - 1) * 6 + 1}–{Math.min(page * 6, filtered.length)} of {filtered.length}
          </span>
        </div>
      )}

      {/* Modals */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          submittedForms={getFormsForUser(selectedUser.id)}
          onClose={() => setSelectedUser(null)}
          onEdit={() => {
            setEditUser(selectedUser);
            setSelectedUser(null);
          }}
        />
      )}

      {(showAddModal || editUser) && (
        <UserFormModal
          editUser={editUser}
          onClose={() => {
            setShowAddModal(false);
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UsersTab;
