import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure axios is installed
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';  // Validation library
import { useNavigate, useParams } from 'react-router-dom';  // Import useNavigate and useParams for routing and getting the employee ID

// Form validation schema with Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .max(50, 'Name must be at most 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
  salary: Yup.number()
    .required('Salary is required')
    .positive('Salary must be positive')
    .max(200000, 'Salary cannot exceed $200,000'),
  hire_date: Yup.date().required('Hire date is required'),
  department: Yup.string().required('Department is required'),
  position: Yup.string().required('Position is required'),
  gender: Yup.string().required('Gender is required'),
  emergency_contact: Yup.string()
    .max(50, 'Emergency contact name must be at most 50 characters')
    .required('Emergency contact is required'),
  emergency_contact_phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Emergency contact phone must be exactly 10 digits')
    .required('Emergency contact phone is required'),
  address: Yup.string()
    .max(200, 'Address must be at most 200 characters')
    .required('Address is required'),
  performance_rating: Yup.number()
    .required('Performance rating is required')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5')
});

const EditEmployee = () => {
  const { id } = useParams(); // Get the employee id from the URL params
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [employee, setEmployee] = useState(null); // State to store the employee data
  console.log(id)
  useEffect(() => {
    // Fetch the employee data based on the id
    axios
      .get(`http://127.0.0.1:5000/getEmployeeDetails/${id}`)
      .then((response) => {
        setEmployee(response.data); // Set the employee data in state
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
        alert('Error fetching employee details');
      });
  }, [id]);

  // If employee data hasn't loaded yet, return a loading state
  if (!employee) {
    return <div>Loading...</div>;
  }
  const handleSubmit = (values) => {
    console.log('Form submitted', values);

    // Send data to Flask backend to update the employee details
    axios
      .put(`http://127.0.0.1:5000/updateEmployee/${id}`, values)  // Ensure this URL is correct
      .then((response) => {
        alert('Employee updated successfully!');
        console.log(response.data); // Optionally handle the response

        // Navigate to the Employee Directory after successful submission
        navigate('/');
      })
      .catch((error) => {
        alert('There was an error updating the employee.');
        console.error(error);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Update Employee</h1>
      <Formik
        initialValues={employee}  // Use the fetched employee data as initial values
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fields in a two-column grid */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Enter Name</label>
              <Field
                type="text"
                id="name"
                name="name"
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter Name"
              />
              <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="position" className="block text-gray-700 font-medium mb-2">Enter Position</label>
              <Field as="select" name="position" className="form-input w-full p-3 border border-gray-300 rounded-md">
                <option value="Software Engineer">Software Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Designer">Designer</option>
                <option value="Data Analyst">Data Analyst</option>
              </Field>
              <ErrorMessage name="position" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">Enter Gender</label>
              <Field as="select" name="gender" className="form-input w-full p-3 border border-gray-300 rounded-md">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Field>
              <ErrorMessage name="gender" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Enter Email</label>
              <Field
                type="email"
                id="email"
                name="email"
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter Email"
              />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Enter Phone Number</label>
              <Field
                type="text"
                id="phone"
                name="phone"
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter Phone Number"
              />
              <ErrorMessage name="phone" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Enter Address</label>
              <Field
                type="text"
                id="address"
                name="address"
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter Address"
              />
              <ErrorMessage name="address" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="emergency_contact" className="block text-gray-700 font-medium mb-2">Enter Emergency Contact Name</label>
              <Field
                type="text"
                id="emergency_contact"
                name="emergency_contact"
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter Emergency Contact Name"
              />
              <ErrorMessage name="emergency_contact" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="emergency_contact_phone" className="block text-gray-700 font-medium mb-2">Enter Emergency Contact Phone</label>
              <Field
                type="text"
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter Emergency Contact Phone"
              />
              <ErrorMessage name="emergency_contact_phone" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="salary" className="block text-gray-700 font-medium mb-2">Enter Salary</label>
              <Field
                type="number"
                id="salary"
                name="salary"
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter Salary"
              />
              <ErrorMessage name="salary" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="hire_date" className="block text-gray-700 font-medium mb-2">Enter Hire Date</label>
              <Field
                type="date"
                id="hire_date"
                name="hire_date"
                className="form-input w-full p-3 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="hire_date" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="department" className="block text-gray-700 font-medium mb-2">Enter Department</label>
              <Field as="select" name="department" className="form-input w-full p-3 border border-gray-300 rounded-md">
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
              </Field>
              <ErrorMessage name="department" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Performance Rating (1-5) */}
            <div className="mb-6">
              <label htmlFor="performance_rating" className="block text-gray-700 font-medium mb-2">Performance Rating</label>
              <Field as="select" name="performance_rating" className="form-input w-full p-3 border border-gray-300 rounded-md">
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Below Average</option>
                <option value={3}>3 - Average</option>
                <option value={4}>4 - Good</option>
                <option value={5}>5 - Excellent</option>
              </Field>
              <ErrorMessage name="performance_rating" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition duration-300"
              >
                Update Employee
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditEmployee;
