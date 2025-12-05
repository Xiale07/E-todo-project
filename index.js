const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || "database",   
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "etodo",
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error("❌ Erreur MySQL :", err);
    } else {
        console.log("✅ Connecté à MySQL dans Docker !");
    }
});

app.get("/", (req, res) => {
    res.send("Backend API is running inside Docker !");
});

app.post("/register", (req, res) => {
    const { firstname, name, email, birthdate, password } = req.body;

    if (!firstname || !name || !email || !password || !birthdate) {
        return res.json({ success: false, message: "Champs manquants" });
    }

    const sql = `
        INSERT INTO user (firstname, name, password, email, birthdate)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [firstname, name, password, email, birthdate], (err, result) => {
        if (err) {
            console.error("Erreur INSERT:", err);
            return res.json({ success: false, message: "Erreur serveur" });
        }

        res.json({ success: true, message: "Utilisateur créé !" });
    });
});

app.get("/users", (req, res) => {
    db.query("SELECT * FROM user", (err, results) => {
        if (err) {
            console.error(err);
            return res.json({ success: false });
        }
        res.json({ success: true, data: results });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`🚀 Backend Docker lancé sur http://localhost:${port}`);
});
