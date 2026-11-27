import { useState, useEffect } from 'react';
import type { Employee, EmployeePayload } from '../types/Employee';


interface EmployeeFormProps {
  onSubmit: (employee: EmployeePayload) => Promise<void>;
  editingEmployee?: Employee | null;
  onCancel: () => void;
  serverErrors?: string[];  
}

interface FieldErrors {
  name?: string;
  email?: string;
  salary?: string;
}

export default function EmployeeForm({
  onSubmit,
  editingEmployee,
  onCancel,
   serverErrors = [],
}: EmployeeFormProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name);
      setEmail(editingEmployee.email);
      setSalary(editingEmployee.salary.toString());
    } else {
      setName('');
      setEmail('');
      setSalary('');
    }
    setFieldErrors({});
  }, [editingEmployee]);

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters long';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (salary.trim() === '') {
      errors.salary = 'Salary is required';
    } else if (isNaN(Number(salary)) || Number(salary) <= 0) {
      errors.salary = 'Salary must be a positive number';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        salary: Number(salary),
      });
      if (!editingEmployee) {
        setName('');
        setEmail('');
        setSalary('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <h3>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h3>

        {serverErrors.length > 0 && (
          <div className="server-errors" style={{ color: 'red' }}>
            {serverErrors.map((err, index) => (
              <p key={index}>{err}</p>
            ))}
          </div>
        )}

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {fieldErrors.name && <span className="error">{fieldErrors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && <span className="error">{fieldErrors.email}</span>}
        </div>

        <div className="form-group">
          <label>Salary:</label>
          <input
            type="number"
            placeholder="Enter salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          {fieldErrors.salary && <span className="error">{fieldErrors.salary}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Add Employee'}
          </button>
          {editingEmployee && (
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
