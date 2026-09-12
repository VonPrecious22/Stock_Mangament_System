require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const connectDatabase = require("./config/database");
const app = express();
const PORT = process.env.PORT || 10000;
const stockRoutes = require("./routes/stockRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const session = require("express-session");
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public"))); 

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const SESSION = process.env.SESSION;
app.use(
  session({
    secret: SESSION || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use((req, res, next) => {

  res.locals.user = req.session.userId ? { name: req.session.userName } : null;
  next();
});

connectDatabase();

app.get("/", (req, res) => {
  res.redirect(req.session.userId ? "/dashboard" : "/login");
});

app.use("/", dashboardRoutes);
app.use("/", userRoutes);
app.use("/stocks", stockRoutes);
app.use("/products", productRoutes);
app.use("/customers", customerRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/transactions", transactionRoutes);
app.use("/reports", reportRoutes);

app.use((req, res) => {
  res.status(404).render("errors/404"); 
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("errors/500");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
