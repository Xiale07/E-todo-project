const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const userRoutes = require("../routes/user.js");
const todoRoutes = require ("../routes/todos.js");
require("dotenv").config();

const app = express();



/* ========================================================================================
 *                       LIMITER LES REQUÊTES / EMPECHER LE BRUTEFORCE
 * ======================================================================================== */


const rateLimit = require("express-rate-limit");


const loginLimiter = rateLimit({
  windowMs: 5 * 1000,
  max: 1,
  message: { error: "Trop de tentatives, attendez 5 secondes" }
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || "database",
  user: process.env.MYSQL_USER || "user",
  password: process.env.MYSQL_PASSWORD || "pass",
  database: process.env.MYSQL_DATABASE || "e_todo",
  port: 3306
});

db.connect(err => {
  if (err) console.error("Erreur MySQL :", err);
  else console.log("Connecté à MySQL !");
});

module.exports.db = db;

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/todos", todoRoutes);

app.use("/", userRoutes);

app.listen(3000, () => {
  console.log("Backend lancé sur http://localhost:3000");
});
