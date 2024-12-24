import React from 'react';
import axios from 'axios'; // Make sure axios is installed
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';  // Validation library
import { useNavigate } from 'react-router-dom';  // Import useNavigate for routing

// Form validation schema with Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  salary: Yup.number().required('Salary is required').positive('Salary must be positive'),
  hireDate: Yup.date().required('Hire date is required'),
  department: Yup.string().required('Department is required'),
  position: Yup.string().required('Position is required'),
  gender: Yup.string().required('Gender is required'),
  emergencyContact: Yup.string().required('Emergency contact is required'),
  emergencyContactPhone: Yup.string().required('Emergency contact phone is required'),
  address: Yup.string().required('Address is required'),
});

const AddEmployee = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes

  const initialValues = {
    name: '',
    position: 'Software Engineer',  // Default position
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    salary: '',
    hireDate: '',
    department: 'Engineering',  // Default department
  };

  const handleSubmit = (values) => {
    console.log('Form submitted', values);

    // Send data to Flask backend (adjust the URL if needed)
    axios
      .post('http://127.0.0.1:5000/addEmployee', values)  // Ensure this URL is correct
      .then((response) => {
        alert('Employee added successfully!');
        console.log(response.data); // Optionally handle the response

        // Navigate to the Employee Directory after successful submission
        navigate('/');
      })
      .catch((error) => {
        alert('There was an error adding the employee.');
        console.error(error);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Add New Employee</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="bg-white p-6 rounded-lg shadow-lg">
            {/* Field for each input, including error message */}
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
              <label htmlFor="emergencyContact" className="block text-gray-700 font-medium mb-2">Enter Emergency Contact Name</label>
              <Field
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter Emergency Contact Name"
              />
              <ErrorMessage name="emergencyContact" component="p" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-6">
              <label htmlFor="emergencyContactPhone" className="block text-gray-700 font-medium mb-2">Enter Emergency Contact Phone</label>
              <Field
                type="text"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                className="form-input w-full p-3 border border-gray-300 rounded-md"
                placeholder="Enter Emergency Contact Phone"
              />
              <ErrorMessage name="emergencyContactPhone" component="p" className="text-red-500 text-sm mt-1" />
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
              <label htmlFor="hireDate" className="block text-gray-700 font-medium mb-2">Enter Hire Date</label>
              <Field
                type="date"
                id="hireDate"
                name="hireDate"
                className="form-input w-full p-3 border border-gray-300 rounded-md"
              />
              <ErrorMessage name="hireDate" component="p" className="text-red-500 text-sm mt-1" />
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

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition duration-300"
              >
                Add Employee
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEmployee;
