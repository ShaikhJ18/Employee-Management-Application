import React from 'react';
import { Link } from 'react-router-dom';

const EmployeeDirectory = ({ employees }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-semibold text-center mb-8 text-gray-800">Employee Directory</h1>
      <div className="text-center mb-6">
        <Link to="/add-employee" className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-blue-600 transition">
          Add New Employee
        </Link>
      </div>
      <div className="text-center mb-6">
        <Link to="/fire-all-employees" className="bg-red-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-red-600 transition">
          Fire All Employees
        </Link>
      </div>
      <ul className="space-y-4">
        {employees.map((employee) => (
          <li key={employee.id} className="flex justify-between items-center bg-white shadow-md rounded-lg p-4">
            <span className="text-lg font-semibold text-gray-800">{employee.name} - {employee.position}</span>
            <div className="space-x-2">
              <Link to={`/edit-employee/${employee.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 transition">
                Edit
              </Link>
              <Link to={`/delete-employee/${employee.id}`} className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition">
                Delete
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeDirectory;
