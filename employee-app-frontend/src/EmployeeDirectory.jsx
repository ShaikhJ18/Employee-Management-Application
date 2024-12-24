import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const EmployeeDirectory = () => {
  // State to store the employee data and the search term
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search term
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For handling errors
  const [isModalOpen, setIsModalOpen] = useState(false); // To manage the modal visibility
  const [isFiringAll, setIsFiringAll] = useState(false); // To track if the user is firing all employees

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch all employees when the component mounts
  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/getAllEmployees')
      .then(response => {
        setEmployees(response.data); // Set employee data
        setLoading(false); // Stop loading
      })
      .catch(err => {
        setError('Failed to load employee data');
        setLoading(false); // Stop loading in case of error
      });
  }, []); // Empty dependency array to run only once when component mounts

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>; // Loading state
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // Error state
  }

  // Function to fire all employees (delete them all from the database)
  const handleFireAllEmployees = () => {
    setIsModalOpen(true); // Open the modal to confirm action
  };

  // Function to confirm firing all employees
  const handleConfirmFireAll = () => {
    setIsFiringAll(true); // Indicate that the action is in progress
    axios
      .delete('http://127.0.0.1:5000/fireAllEmployees')
      .then(response => {
        setEmployees([]); // Clear the employee list after deletion
        setIsModalOpen(false); // Close the modal
        console.log('All employees have been fired!');
      })
      .catch(err => {
        setError('Failed to fire all employees');
        setIsModalOpen(false); // Close the modal on error
      });
  };

  // Function to close the modal without performing the action
  const handleCancelFireAll = () => {
    setIsModalOpen(false); // Close the modal without firing employees
  };

  // Function to navigate to the Add Employee page
  const handleAddNewEmployee = () => {
    navigate('/add-employee'); // Navigate to the Add Employee page
  };

  // Handler functions for Edit and Delete buttons
  const handleEdit = (id) => {
    console.log(`Edit employee with ID: ${id}`);
    navigate('/EditEmployee');
    // Add edit logic here
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:5000/deleteEmployee/${id}`)
      .then(() => {
        setEmployees(employees.filter(employee => employee.id !== id)); // Remove the deleted employee from the list
      })
      .catch(err => {
        setError('Failed to delete employee');
      });
  };

  // Function to navigate to the Employee Details page
  const handleViewDetails = (id) => {
    navigate(`/EmployeeDetails/${id}`)
  };

  // Filtered employees based on the search term
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) // Case insensitive search by name
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-semibold text-center mb-12 text-gray-900">Welcome</h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term as user types
          className="py-2 px-4 border rounded-md w-1/2 text-gray-700"
        />
      </div>

      <div className="flex flex-row justify-center space-x-4 mb-6">
        <button
          onClick={handleFireAllEmployees}
          className="bg-red-600 text-white py-1 px-4 rounded-full text-sm font-medium shadow-sm hover:bg-red-700 transition-colors duration-200"
        >
          Fire All Employees
        </button>
        <button
          onClick={handleAddNewEmployee}
          className="bg-green-600 text-white py-1 px-4 rounded-full text-sm font-medium shadow-sm hover:bg-green-700 transition-colors duration-200"
        >
          Add New Employee
        </button>
      </div>

      {/* Modal for Confirming Fire All Employees */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-4">This will delete all employees permanently.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelFireAll}
                className="bg-gray-300 text-black py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFireAll}
                className="bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <ul className="space-y-6">
        {filteredEmployees.length === 0 ? (
          <div className="text-center text-gray-500">Get Started By Adding Your First Employee</div>
        ) : (
          filteredEmployees.map(employee => (
            <li
              key={employee.id}
              className="flex flex-row justify-between items-start sm:items-center bg-black p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
            >
              <div className="mb-4 sm:mb-0 sm:w-3/5">
                <p className="text-xl font-semibold text-white">{employee.name}</p>
                <p className="text-gray-500">{employee.position}</p>
              </div>
              <div className="space-x-4 flex sm:flex-row sm:space-x-4 sm:w-2/5">
                <button
                  onClick={() => handleEdit(employee.id)}
                  className="bg-blue-600 text-white py-1 px-4 rounded-full text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="bg-red-600 text-white py-1 px-4 rounded-full text-sm font-medium shadow-sm hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleViewDetails(employee.id)}
                  className="bg-yellow-600 text-white py-1 px-4 rounded-full text-sm font-medium shadow-sm hover:bg-yellow-700 transition-colors duration-200"
                >
                  View Details
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default EmployeeDirectory;
