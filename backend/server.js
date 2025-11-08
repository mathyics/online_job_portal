const express = require('express');
const app = express();
const db = require('./config/db'); 

const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Basic route check
app.get('/', (req, res) => {
    res.send('Welcome to the Job Portal API!');
});

// Import and use routes (We will add these next)
// const userRoutes = require('./routes/users');
// app.use('/api/users', userRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});