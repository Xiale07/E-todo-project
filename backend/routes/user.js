const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth.js");
const { db } = require("../db.js");
require("dotenv").config();

const router = express.Router();


router.options("/", (req, res) => res.sendStatus(200));

/* ===============================================================
 *                          REGISTER 
 * =============================================================== */
router.post("/register", async (req, res) => {
    const { firstname, name, email, birthdate, password } = req.body;

    if (!firstname || !name || !email || !password || !birthdate) {
        return res.status(400).json({ success: false, message: "Champs manquants" });
    }

    try {
        const [exists] = await db.query(
            "SELECT id FROM user WHERE email = ?",
            [email]
        );

        if (exists.length > 0) {
            return res.status(409).json({ success: false, message: "Email déjà utilisé" });
        }

        const hashed = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO user (firstname, name, password, email, birthdate) VALUES (?, ?, ?, ?, ?)",
            [firstname, name, hashed, email, birthdate]
        );

        return res.json({ success: true, message: "Utilisateur créé !" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

/* ===============================================================
 *                           LOGIN 
 * =============================================================== */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Champs manquants" });

    try {
        const [users] = await db.query("SELECT * FROM user WHERE email = ?", [email]);

        if (users.length === 0)
            return res.status(404).json({ error: "User not found" });

        const user = users[0];

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(400).json({ error: "Invalid password" });

        if (!process.env.JWT_SECRET)
            return res.status(500).json({ error: "JWT_SECRET manquant" });

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ success: true, token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* ===============================================================
 *                           GET USER CONNECTER
 * =============================================================== */
router.get("/user", auth, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, firstname, name, email, birthdate FROM user WHERE id = ?",
            [req.user.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ error: "Utilisateur introuvable" });

        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* ===============================================================
 *                         GET   TODOS 
 * =============================================================== */
router.get("/user/todos", auth, async (req, res) => {
    try {
        const [todos] = await db.query(
            "SELECT * FROM todo WHERE user_id = ?",
            [req.user.id]
        );
        res.json(todos);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});



/* ===============================================================
 *                        DELETE TODO
 * =============================================================== */
router.delete("/todos/:id", auth, async (req, res) => {
    try {
        const todoId = req.params.id;

        const [rows] = await db.query(
            "SELECT id FROM todo WHERE id = ? AND user_id = ?",
            [todoId, req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Todo introuvable ou non autorisée" });
        }

        await db.query("DELETE FROM todo WHERE id = ?", [todoId]);

        res.json({ success: true, message: "Todo supprimée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});



/* ===============================================================
 *                       GET USER BY ID or EMAIL
 * =============================================================== */
router.get("/users/:param", auth, async (req, res) => {
    const param = req.params.param;

    try {
        const [rows] = await db.query(
            isNaN(param)
                ? "SELECT id, firstname, name, email, birthdate FROM user WHERE email = ?"
                : "SELECT id, firstname, name, email, birthdate FROM user WHERE id = ?",
            [param]
        );

        if (rows.length === 0)
            return res.status(404).json({ error: "Utilisateur introuvable" });

        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* ===============================================================
 *                       GET ALL USERS
 * =============================================================== */
router.get("/users", auth, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, firstname, name, email, birthdate FROM user"
        );
        res.json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* ===============================================================
 *                          UPDATE USER
 * =============================================================== */
router.put("/users/:id", auth, async (req, res) => {
    const { name, email, firstname } = req.body;

    if (!name || !email || !firstname)
        return res.status(400).json({ error: "Champs manquants" });

    try {
        await db.query(
            "UPDATE user SET name=?, email=?, firstname=? WHERE id=?",
            [name, email, firstname, req.params.id]
        );

        res.json({ success: true, message: "Utilisateur mis à jour" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* ===============================================================
 *                        DELETE USER
 * =============================================================== */
router.delete("/users/:id", auth, async (req, res) => {
    try {
        await db.query("DELETE FROM user WHERE id = ?", [req.params.id]);

        res.json({ success: true, message: "Utilisateur supprimé" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;