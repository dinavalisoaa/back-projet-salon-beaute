const express = require('express');
const mongoose = require('mongoose');

const swaggerFile = require('./swagger-output.json')

const songRoutes = require('./routes/songRoutes');
const cors = require('cors'); 
const app = express();
const port = process.env.PORT || 5050;
const swaggerUI = require("swagger-ui-express");


// Serve Swagger documentation
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/beauty-salon');

// Use the cors middleware to enable Cross-Origin Resource Sharing
app.use(cors());
app.use(express.json());
app.use('/api', songRoutes);
app.use('/api', songRoutes);

  
app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerFile))

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
