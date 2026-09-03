require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const connectDatabase = require("./config/database");
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

connectDatabase();

app.use('/api/users', userRoutes);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app;