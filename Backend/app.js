const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require("path");


const authRoutes = require('./Routes/Auth_routes');
const productRoutes=require('./Routes/ProductRoute');
const  cartRoute=require('./Routes/CartRoute');
const wishlistRoute=require('./Routes/WishlistRoute');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes); // Login & signup route
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoute);
app.use('/api/wishlist',wishlistRoute);
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));




mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB error:', err));

module.exports = app;
