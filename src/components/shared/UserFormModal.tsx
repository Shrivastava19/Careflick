import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { IconX, IconUser } from './Icons';
import toast from 'react-hot-toast';

interface UserFormFields {
  name: string;
  email: string;
  phone: string;
  username: string;
  website: string;
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  companyName: string;
}

interface Props {
  editUser?: User | null;
  onClose: () => void;
}

const UserFormModal: React.FC<Props> = ({ editUser, onClose }) => {
  const { addUser, updateUser } = useAppContext();
  const isEdit = Boolean(editUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormFields>();

  useEffect(() => {
    if (editUser) {
      reset({
        name: editUser.name,
        email: editUser.email,
        phone: editUser.phone,
        username: editUser.username,
        website: editUser.website,
        street: editUser.address.street,
        suite: editUser.address.suite,
        city: editUser.address.city,
        zipcode: editUser.address.zipcode,
        companyName: editUser.company.name,
      });
    }
  }, [editUser, reset]);

  const onSubmit = (data: UserFormFields) => {
    const userPayload: Omit<User, 'id'> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      username: data.username || data.name.toLowerCase().replace(/\s+/g, ''),
      website: data.website || '',
      address: {
        street: data.street || '',
        suite: data.suite || '',
        city: data.city || '',
        zipcode: data.zipcode || '',
        geo: { lat: '0', lng: '0' },
      },
      company: {
        name: data.companyName || '',
        catchPhrase: '',
        bs: '',
      },
      isLocal: true,
    };

    if (isEdit && editUser) {
      updateUser(editUser.id, userPayload);
      toast.success('User updated successfully');
    } else {
      addUser(userPayload);
      toast.success('User added successfully');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="user-form-title">
        <div className="modal-header">
          <div>
            <h2 className="modal-title" id="user-form-title">
              {isEdit ? 'Edit User' : 'Add New User'}
            </h2>
            <p className="modal-subtitle">
              {isEdit ? 'Update user information' : 'Fill in the details to add a new user'}
            </p>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="modal-body">
            {/* Basic Info */}
            <div className="form-section" style={{ padding: '0', border: 'none', marginBottom: '0' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. John Doe"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                  />
                  {errors.name && <span className="form-error">{errors.name.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    className="form-input"
                    placeholder="e.g. johndoe"
                    {...register('username')}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="john@example.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email address',
                      },
                    })}
                  />
                  {errors.email && <span className="form-error">{errors.email.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Phone <span className="required">*</span>
                  </label>
                  <input
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="e.g. 1-770-736-8031"
                    {...register('phone', {
                      required: 'Phone is required',
                      pattern: {
                        value: /^[+\d\s\-().]{7,20}$/,
                        message: 'Enter a valid phone number',
                      },
                    })}
                  />
                  {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    className="form-input"
                    placeholder="example.com"
                    {...register('website')}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    className="form-input"
                    placeholder="Company Inc."
                    {...register('companyName')}
                  />
                </div>
              </div>

              <div className="divider" />
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Address (Optional)
              </p>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Street</label>
                  <input className="form-input" placeholder="123 Main St" {...register('street')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Suite / Apt</label>
                  <input className="form-input" placeholder="Apt 4B" {...register('suite')} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" placeholder="New York" {...register('city')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Zip Code</label>
                  <input className="form-input" placeholder="10001" {...register('zipcode')} />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <IconUser size={15} />
              {isEdit ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
