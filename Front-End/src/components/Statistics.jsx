import React, { useState, useEffect } from 'react';

function Statistics() {
  const [selectedMonth, setSelectedMonth] = useState('03'); // Default to March
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchStatistics(selectedMonth);
  }, [selectedMonth]);

  const fetchStatistics = async (month) => {
    try {
      const response = await fetch(`http://localhost:3000/statistics/${month}`);
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <>
    <div className='stat-main-head'>
    <div className='stat-top-div'>
    
      <header className='statheader'>
      <h2>Statistics</h2>
      </header>
      <div>
      <label htmlFor="month">Select Month:</label>
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
      {statistics && (
        <div className='stat-items'>
        <div className='stats-result'> 
          <p>Total Sale Amount: {statistics.total_sale_amount}</p>
          <p>Total Sold Items: {statistics.total_sold_items}</p>
          <p>Total Unsold Items: {statistics.total_unsold_items}</p>
        </div>
        </div>
    
      )}
    </div>
    </div>
    </>
  );
}

export default Statistics;
