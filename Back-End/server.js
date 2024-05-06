
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Sample database to store transactions
let transactions = []; // Initialize an empty array to hold transactions

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoint to initialize the database
app.post('/initialize-database', (req, res) => {
  
    fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
        .then(response => response.json())
        .then(data => {
            transactions = data;
            console.log(transactions);
            res.status(200).send('Database initialized successfully');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.status(500).send('Error initializing database');
        });
});

// Endpoint to list transactions for a specific month
app.get('/transactions/:month', (req, res) => {
    const { month } = req.params;
    const { search, page = 1, per_page = 10 } = req.query;

    // Filter transactions by month
    let filteredTransactions = transactions.filter(transaction => {
        const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1;
        return transactionMonth === parseInt(month);
    });

    // Apply search filter if search query provided
    if (search) {
        filteredTransactions = filteredTransactions.filter(transaction => {
            return (
                transaction.title.toLowerCase().includes(search.toLowerCase()) ||
                transaction.description.toLowerCase().includes(search.toLowerCase()) ||
                String(transaction.price).includes(search.toLowerCase())
            );
        });
    }

    // Paginate transactions
    const startIndex = (page - 1) * per_page;
    const endIndex = startIndex + per_page;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    res.status(200).json(paginatedTransactions);
});

// Endpoint to get statistics
app.get('/statistics/:month', (req, res) => {
    const { month } = req.params;

    // Filter transactions by month
    const filteredTransactions = transactions.filter(transaction => {
        return transaction.dateOfSale.split('-')[1] === month;
    });

    const totalSaleAmount = filteredTransactions.reduce((total, transaction) => {
        return total + (transaction.sold ? transaction.price : 0);
    }, 0);

    const totalSoldItems = filteredTransactions.filter(transaction => transaction.sold).length;
    const totalUnsoldItems = filteredTransactions.filter(transaction => !transaction.sold).length;

    const statistics = {
        total_sale_amount: totalSaleAmount,
        total_sold_items: totalSoldItems,
        total_unsold_items: totalUnsoldItems
    };

    res.status(200).json(statistics);
});



// Endpoint to get bar chart data
app.get('/bar-chart/:month', (req, res) => {
    const { month } = req.params;

    // Filter transactions by month
    const filteredTransactions = transactions.filter(transaction => {
        const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1;
        return String(transactionMonth).padStart(2, '0') === month; // Ensure month is padded with leading zero
    });

    // Define price ranges
    const priceRanges = [
        { range: '0 - 100', count: 0 },
        { range: '101 - 200', count: 0 },
        { range: '201 - 300', count: 0 },
        { range: '301 - 400', count: 0 },
        { range: '401 - 500', count: 0 },
        { range: '501 - 600', count: 0 },
        { range: '601 - 700', count: 0 },
        { range: '701 - 800', count: 0 },
        { range: '801 - 900', count: 0 },
        { range: '901 - above', count: 0 }
    ];

    // Calculate number of items in each price range
    filteredTransactions.forEach(transaction => {
        const price = transaction.price;
        if (price <= 100) {
            priceRanges[0].count++;
        } else if (price <= 200) {
            priceRanges[1].count++;
        } else if (price <= 300) {
            priceRanges[2].count++;
        } else if (price <= 400) {
            priceRanges[3].count++;
        } else if (price <= 500) {
            priceRanges[4].count++;
        } else if (price <= 600) {
            priceRanges[5].count++;
        } else if (price <= 700) {
            priceRanges[6].count++;
        } else if (price <= 800) {
            priceRanges[7].count++;
        } else if (price <= 900) {
            priceRanges[8].count++;
        } else {
            priceRanges[9].count++;
        }
    });

    res.status(200).json(priceRanges);
});

// Endpoint to get pie chart data
app.get('/pie-chart/:month', (req, res) => {
    const { month } = req.params;

    // Filter transactions by month
    const filteredTransactions = transactions.filter(transaction => {
        const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1;
        return String(transactionMonth).padStart(2, '0') === month; // Ensure month is padded with leading zero
    });

    // Initialize an object to store categories and their counts
    const categoryCounts = {};

    // Count the number of items in each category
    filteredTransactions.forEach(transaction => {
        const category = transaction.category;
        if (category in categoryCounts) {
            categoryCounts[category]++;
        } else {
            categoryCounts[category] = 1;
        }
    });

    // Convert categoryCounts object to an array of objects
    const pieChartData = Object.keys(categoryCounts).map(category => ({
        category: category,
        count: categoryCounts[category]
    }));

    res.status(200).json(pieChartData);
});





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
