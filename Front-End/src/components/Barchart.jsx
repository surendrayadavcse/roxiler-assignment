import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
  const [selectedMonth, setSelectedMonth] = useState('01'); // Default to January
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchBarChartData(selectedMonth);
  }, [selectedMonth]);

  const fetchBarChartData = async (month) => {
    try {
      const response = await fetch(`http://localhost:3000/bar-chart/${month}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bar chart data');
      }
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const chartLabels = chartData.map(({ range }) => range);
  const chartCounts = chartData.map(({ count }) => count);

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Items',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Price Range',
        },
      },
    },
  };

  const chartDataConfig = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Number of Items',
        data: chartCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Bar Chart</h2>
      <div>
        <label htmlFor="month">Select Month: </label>
        <select id="month" value={selectedMonth} onChange={handleMonthChange}>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      <div style={{ height: '400px', width: '600px' }}>
        <Bar data={chartDataConfig} options={chartOptions} />
      </div>
    </div>
  );
};

export default BarChart;
