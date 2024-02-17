const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const swaggerFile = require("./swagger-output.json");

const songRoutes = require("./routes/songRoutes");
const customRoutes = require("./routes/customerRoutes");
const accountRoutes = require("./routes/accountRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const managerRoutes = require("./routes/managerRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const sexRoutes = require("./routes/sexRoutes");
const specialOfferRoutes = require("./routes/specialOfferRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const emailRoutes = require("./routes/emailRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5050;
const swaggerUI = require("swagger-ui-express");
const protectedRoute = require("./routes/protectedRoutes");

// Serve Swagger documentation
// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL);
// mongoose.connect("mongodb://127.0.0.1:27017/beauty-salon");

// Use the cors middleware to enable Cross-Origin Resource Sharing
app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use("/api", songRoutes);
app.use("/api", customRoutes);
app.use("/api", serviceRoutes);
app.use("/api", managerRoutes);
app.use("/api", expenseRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", emailRoutes);
app.use("/api", accountRoutes);
app.use("/api", employeeRoutes);
app.use("/api", sexRoutes);
app.use("/api", specialOfferRoutes);
app.use("/api", notificationRoutes);
app.use("/api", dashboardRoutes);
app.use("/protected", protectedRoute);
app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));

// app.get('/',)
// Middleware pour intercepter les erreurs
app.use((err, req, res, next) => {
  if (err.message) {
    res.status(500).json({ error: err.message });
  } else {
    next(err);
  }
});

// Token handler
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, "your-secret-key");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
  next();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
