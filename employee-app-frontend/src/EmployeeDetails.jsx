import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import the useParams and useNavigate hooks

const EmployeeDetails = () => {
  const { id } = useParams(); // Extract the employee ID from the URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch the employee details when the component mounts
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/getEmployeeDetails/${id}`)
      .then(response => {
        setEmployee(response.data); // Set the employee data
        setLoading(false); // Stop loading
      })
      .catch(err => {
        setError('Failed to load employee details');
        setLoading(false);
      });
  }, [id]); // Re-run the effect when the employee ID changes

  if (loading) {
    return <div className="text-center text-gray-500">Loading employee details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!employee) {
    return <div className="text-center text-red-500">Employee not found</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/')} // Navigate back to the directory page
        className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Return to Directory
      </button>

      <h1 className="text-4xl font-semibold text-center mb-12 text-gray-900">Employee Details</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">{employee.name}</h2>
        <p className="text-xl text-gray-500">{employee.position}</p>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900">Email:</h3>
          <p className="text-gray-700">{employee.email}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900">Phone:</h3>
          <p className="text-gray-700">{employee.phone}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900">Address:</h3>
          <p className="text-gray-700">{employee.address}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900">Department:</h3>
          <p className="text-gray-700">{employee.department}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900">Emergency Contact:</h3>
          <p className="text-gray-700">{employee.emergency_contact}</p>
          <p className="text-gray-700">{employee.emergency_contact_phone}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900">Hire Date:</h3>
          <p className="text-gray-700">{employee.hire_date}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900">Salary:</h3>
          <p className="text-gray-700">${employee.salary.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
