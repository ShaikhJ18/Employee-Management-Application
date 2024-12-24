import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    // Fetch employee data by id
    const fetchedEmployee = {
      id,
      name: 'John Smith',
      position: 'Programmer',
      gender: 'Male',
      email: 'jsmith@example.com',
      phone: '(123) 456-7890',
      address: '123 Main St',
      emergencyContact: 'Jane Doe',
      emergencyContactPhone: '(123) 555-7890',
      salary: '40000',
      hireDate: '2023-01-01',
      department: 'Engineering',
    };
    setEmployee(fetchedEmployee);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Employee updated', employee);
    // Handle form submission logic here (e.g., update API)
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Edit Employee</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        {Object.keys(employee).map((field) => (
          <div key={field} className="mb-6">
            <label htmlFor={field} className="block text-gray-700 font-medium mb-2">{field.replace(/([A-Z])/g, ' $1')}</label>
            {field === 'gender' || field === 'department' ? (
              <select
                name={field}
                value={employee[field]}
                onChange={handleChange}
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <input
                type={field === 'salary' ? 'number' : 'text'}
                name={field}
                value={employee[field]}
                onChange={handleChange}
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                required
              />
            )}
          </div>
        ))}
        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition duration-300">
            Update Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
