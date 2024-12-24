import React, { useState } from 'react';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    salary: '',
    hireDate: '',
    department: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', formData);
    // Handle form submission logic here (e.g., send to API)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Add New Employee</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        {Object.keys(formData).map((field) => (
          <div key={field} className="mb-6">
            <label htmlFor={field} className="block text-gray-700 font-medium mb-2">{field.replace(/([A-Z])/g, ' $1')}</label>
            {field === 'gender' || field === 'department' ? (
              <select
                name={field}
                value={formData[field]}
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
                value={formData[field]}
                onChange={handleChange}
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                required
              />
            )}
          </div>
        ))}
        <div className="flex justify-center">
          <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition duration-300">
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
