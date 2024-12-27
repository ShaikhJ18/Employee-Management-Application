import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const PerformanceGraphs = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch employees data from the server
  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/getAllEmployees') // Replace with your actual API URL
      .then((response) => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load employee data');
        setLoading(false);
      });
  }, []);

  // If loading, show loading indicator
  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  // If there's an error fetching data
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Categorize employees into Bad, Neutral, and Really Good based on their performance ratings
  const badPerformers = employees.filter(employee => employee.performance_rating <= 2).length;
  const neutralPerformers = employees.filter(employee => employee.performance_rating === 3).length;
  const goodPerformers = employees.filter(employee => employee.performance_rating >= 4).length;

  // Data for the Bar chart
  const data = {
    labels: ['Bad (1-2)', 'Neutral (3)', 'Really Good (4-5)'],
    datasets: [
      {
        label: 'Employee Performance Categories',
        data: [badPerformers, neutralPerformers, goodPerformers], // Counts of employees in each category
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)'], // Red, Orange, Green
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
        barThickness: 100, // Make bars thicker
      },
    ],
  };

  // Options for the Bar chart
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Employee Performance Distribution',
        font: {
          size: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Performance Categories',
          font: {
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Employees',
          font: {
            size: 18,
          },
        },
        min: 0,
      },
    },
  };

  const ReturnToDirectory = () => {
    navigate('/');
  };

  // Data for the Pie chart
  const pieData = {
    labels: ['Bad (1-2)', 'Neutral (3)', 'Really Good (4-5)'], // Performance categories
    datasets: [
      {
        data: [badPerformers, neutralPerformers, goodPerformers], // Same counts as the bar chart
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)'], // Colors for the sections
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 3,
      },
    ],
  };

  return (
    <div className="container">
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 mb-8"
        onClick={ReturnToDirectory}
      >
        Return back to Directory
      </button>

      {/* Flex container to align charts side by side */}
      <div className="flex space-x-8 px-10 py-10">
        {/* Bar Chart */}
        <div className="w-1/2">
          <Bar data={data} options={options} />
        </div>

        {/* Pie Chart */}
        <div className="w-1/2">
          <h2 className="text-center text-xl font-semibold mb-4">Performance Distribution (Pie Chart)</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default PerformanceGraphs;
