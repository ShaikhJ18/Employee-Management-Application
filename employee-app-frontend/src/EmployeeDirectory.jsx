import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TrashIcon, PencilIcon, EyeIcon, XIcon, CheckIcon, PlusIcon, FilterIcon } from '@heroicons/react/outline'; // Importing icons

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [isFiringAllModalOpen, setIsFiringAllModalOpen] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [filterType, setFilterType] = useState('all'); // To keep track of filtering type (all, high, low)

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/getAllEmployees')
      .then((response) => {
        setEmployees(response.data);
        setFilteredEmployees(response.data); // Initially, show all employees
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load employee data');
        setLoading(false);
      });
  }, []);

  const handleFilterHighPerformers = () => {
    const highPerformers = employees.filter(employee => employee.performance_rating >= 4);
    setFilteredEmployees(highPerformers);
    setFilterType('high');
  };

  const handleFilterLowPerformers = () => {
    const lowPerformers = employees.filter(employee => employee.performance_rating <= 2);
    setFilteredEmployees(lowPerformers);
    setFilterType('low');
  };

  const handleShowAllEmployees = () => {
    setFilteredEmployees(employees);
    setFilterType('all');
  };

  const handleFireAllEmployees = () => {
    setIsFiringAllModalOpen(true);
  };

  const handleConfirmFireAll = () => {
    axios
      .delete('http://127.0.0.1:5000/fireAllEmployees')
      .then(() => {
        setEmployees([]);
        setFilteredEmployees([]);
        setIsFiringAllModalOpen(false);
        console.log('All employees have been fired!');
      })
      .catch((err) => {
        setError('Failed to fire all employees');
        setIsFiringAllModalOpen(false);
      });
  };

  const handleCancelFireAll = () => {
    setIsFiringAllModalOpen(false);
  };

  const handleDelete = (employee) => {
    setDeletingEmployee(employee); // Set the employee to be deleted
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const handleConfirmDeleteEmployee = () => {
    if (deletingEmployee) {
      axios
        .delete(`http://127.0.0.1:5000/deleteEmployee/${deletingEmployee.id}`)
        .then(() => {
          setEmployees(employees.filter((employee) => employee.id !== deletingEmployee.id));
          setFilteredEmployees(filteredEmployees.filter((employee) => employee.id !== deletingEmployee.id));
          setIsDeleteModalOpen(false);
          console.log(`Employee ${deletingEmployee.name} has been deleted!`);
        })
        .catch((err) => {
          setError('Failed to delete employee');
          setIsDeleteModalOpen(false);
        });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // Close the modal without deleting
  };

  const handleAddNewEmployee = () => {
    navigate('/add-employee');
  };

  const handleEdit = (id) => {
    navigate(`/EditEmployee/${id}`);
  };

  const handleViewDetails = (id) => {
    navigate(`/EmployeeDetails/${id}`);
  };

  const getPerformanceFaceAndColor = (rating) => {
    let face = '🙂'; // Default neutral face
    let cardColor = 'bg-yellow-500'; // Default neutral color

    switch (true) {
      case rating <= 2:
        face = '😞';
        cardColor = 'bg-red-600'; // Red for poor performance
        break;
      case rating === 3:
        face = '🙂';
        cardColor = 'bg-yellow-500'; // Yellow for neutral performance
        break;
      case rating >= 4:
        face = '😊';
        cardColor = 'bg-green-600'; // Green for excellent performance
        break;
      default:
        break;
    }

    return { face, cardColor };
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-semibold text-center mb-12 text-blue-600">Welcome To TeamFlow 🌊</h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="py-2 px-4 border rounded-md w-1/2 text-blue-500"
        />
      </div>

      <div className="flex flex-row justify-center space-x-4 mb-6">
        <button
          onClick={handleFireAllEmployees}
          className="bg-red-600 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <TrashIcon className="w-5 h-5" />
          <span>Fire All Employees</span>
        </button>
        <button
          onClick={handleAddNewEmployee}
          className="bg-green-600 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add New Employee</span>
        </button>
        {/* Buttons for filtering */}
        <button
          onClick={handleFilterHighPerformers}
          className="bg-blue-600 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <FilterIcon className="w-5 h-5" />
          <span>High Performers</span>
        </button>
        <button
          onClick={handleFilterLowPerformers}
          className="bg-yellow-600 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm hover:bg-yellow-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <FilterIcon className="w-5 h-5" />
          <span>Low Performers</span>
        </button>
        <button
          onClick={handleShowAllEmployees}
          className="bg-gray-600 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <FilterIcon className="w-5 h-5" />
          <span>Show All Employees</span>
        </button>
        <button
          onClick={() => navigate('/PerformanceGraphs')}
          className="bg-purple-600 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
        >
          Performance Graphs
        </button>
      </div>

      {/* Fire All Employees Confirmation Modal */}
      {isFiringAllModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-4">This will delete all employees permanently.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelFireAll}
                className="bg-gray-300 text-black py-2 px-4 rounded-md flex items-center space-x-2"
              >
                <XIcon className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleConfirmFireAll}
                className="bg-red-600 text-white py-2 px-4 rounded-md flex items-center space-x-2"
              >
                <CheckIcon className="w-5 h-5" />
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Individual Employee Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="mb-4">This will delete the employee permanently.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-black py-2 px-4 rounded-md flex items-center space-x-2"
              >
                <XIcon className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleConfirmDeleteEmployee}
                className="bg-red-600 text-white py-2 px-4 rounded-md flex items-center space-x-2"
              >
                <CheckIcon className="w-5 h-5" />
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout for Employee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredEmployees.length === 0 ? (
          <div className="text-center text-gray-500 col-span-4">Get Started By Adding Your First Employee</div>
        ) : (
          filteredEmployees.map((employee) => {
            const { face, cardColor } = getPerformanceFaceAndColor(employee.performance_rating);

            return (
              <div
                key={employee.id}
                className={`${cardColor} p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col justify-between items-center space-y-4`}
              >
                {/* Employee Image */}
                <img
                  src={employee.profileImage || 'https://i.kym-cdn.com/photos/images/original/001/896/761/b9a.png'} // Default placeholder image if no image is provided
                  alt={employee.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <div className="text-center text-white">
                  <p className="text-xl font-semibold">{employee.name}</p>
                  <p className="text-gray-500">{employee.position}</p>

                  {/* Performance Rating with Face */}
                  <div className="mt-2 text-yellow-300">
                    <span>Performance: {employee.performance_rating}</span>
                    <span className="ml-2 text-2xl">{face}</span>
                  </div>
                </div>

                <div className="space-x-4 flex justify-center w-full">
                  <button
                    onClick={() => handleEdit(employee.id)}
                    className="bg-blue-600 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <PencilIcon className="w-5 h-5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(employee)}
                    className="bg-red-600 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <TrashIcon className="w-5 h-5" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => handleViewDetails(employee.id)}
                    className="bg-yellow-600 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm hover:bg-yellow-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <EyeIcon className="w-5 h-5" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EmployeeDirectory;
