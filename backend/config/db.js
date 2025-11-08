// Import the mysql2 library and dotenv
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection (optional, but good practice)
pool.getConnection()
    .then(connection => {
        console.log('✅ MySQL Database connected successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1); // Exit process with failure
    });

// Export the pool so other files (models) can use it
module.exports = pool;