import { useState, useEffect } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from './api/employeeApi';
import type { Employee, EmployeePayload } from './types/Employee';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleFormSubmit = async (payload: EmployeePayload) => {
    setServerErrors([]);
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, payload);
        setEditingEmployee(null);
      } else {
        await createEmployee(payload);
      }
      await loadEmployees();
    } catch (errors) {
      setServerErrors(Array.isArray(errors) ? errors : ['Server error occurred']);
      throw errors;
    }
  };

  const handleDelete = async (id: number) => {
    await deleteEmployee(id);
    if (editingEmployee?.id === id) setEditingEmployee(null);
    await loadEmployees();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <EmployeeForm
        onSubmit={handleFormSubmit}
        editingEmployee={editingEmployee}
        onCancel={() => {
          setEditingEmployee(null);
          setServerErrors([]);
        }}
        serverErrors={serverErrors}
      />

      <hr style={{ margin: '2rem 0' }} />

      <h3>Employee List</h3>
      <EmployeeTable
        employees={employees}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setServerErrors([]);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}
