import React, { useState, useEffect } from 'react';

export default function Transactiontable() {
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('03'); // Default to March
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    // const [pagenum,setpageNum]=useState(1)
  
    useEffect(() => {
      fetchTransactions(selectedMonth, searchText, currentPage);
    }, [selectedMonth, searchText, currentPage]);
  
    const fetchTransactions = async (month, search, page) => {
      try {
        const url = `http://localhost:3000/transactions/${month}?search=${search}&page=${page}`;
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
  
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
  
    const handleMonthChange = (e) => {
      setSelectedMonth(e.target.value);
    };
  
    const handleSearch = (e) => {
      setSearchText(e.target.value);
    };
  
    const handleNextPage = () => {
      setCurrentPage(currentPage + 1);
    };
  
    const handlePrevPage = () => {
      setCurrentPage(Math.max(currentPage - 1, 1)); // Ensure currentPage doesn't go below 1
    };
  
    return (
      <div>
        <div className='thead'>
        <h1 >Transaction<br></br> Table</h1>
        </div>
        <header className='head'>
        
        
        
        <input type="text" placeholder="Search Transaction" value={searchText} onChange={handleSearch} />
        <label htmlFor="month">Select Month:<select id="month" value={selectedMonth} onChange={handleMonthChange}>
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
        </select></label>
        
        </header >
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Date of Sale</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description.substring(0,30 )}</td>
                <td>{transaction.price}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? 'Sold' : 'Not Sold'}</td>
                <td>{transaction.dateOfSale}</td>
                <td><img className='image' src={transaction.image} alt="Product" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pages'>
        
        <p>Page Number:{currentPage}</p>
        <div className='buttoncss'>
        <button  onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
        </div>
        <p>Per Page:10</p>
        
        
        </div>
         {/* <Statistics></Statistics>
         <BarChart></BarChart> */}
       
      </div>
      
    );
  }