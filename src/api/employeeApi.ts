import type { Employee, EmployeePayload } from '../types/Employee';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/employees`;
export const getEmployees = async (): Promise<Employee[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
};

export const createEmployee = async (payload: EmployeePayload): Promise<Employee> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data.errors || ['Failed to create employee'];
  return data;
};

export const updateEmployee = async (id: number, payload: EmployeePayload): Promise<Employee> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw data.errors || ['Failed to update employee'];
  return data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete employee');
};
