const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

// Load environment variables from the specified config file
dotenv.config({ path: 'backend/config/config.env' });

// Connect to the database
connectDatabase();

// Sample product data to be inserted
const products = require('../data/product');

// Seeding function
const seedProducts = async () => {
    try {
        // Delete all existing products from the database
        await Product.deleteMany();
        console.log("All products deleted");

        // Insert the sample products into the database
        await Product.insertMany(products);
        console.log("All products added");

        process.exit(); // Exit the script after seeding is done
    } catch (error) {
        console.error(error.message);
        process.exit(1); // Exit with an error code
    }
};

// Call the seeding function
seedProducts();
