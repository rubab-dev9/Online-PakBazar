require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// connect to DB 
connectDB();

// middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// CORS config
app.use(
  cors({
    origin: [process.env.FRONTEND_URI],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/wishlist", require("./routes/wishlistRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/reviews", require("./routes/reviewRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/supplier", require("./routes/supplierRoutes"));
app.use("/contact", require("./routes/contactRoutes"));

// start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
});