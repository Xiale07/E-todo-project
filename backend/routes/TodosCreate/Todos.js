const express = require("express");
const jwt = require("jsonwebtoken");
const { db } = require("../db.js");
require("dotenv").config();

const router = express.Router();

router.options("/", (req, res) => res.sendStatus(200));

router.post("/todos", async (req, res) => {
    const { title, description, due_time, status, user_id} = req.body;

    if (!title || !description || !due_time || !status || !user_id) {
        return res.json({success: false, message: "Champs manquant" });
    }

    try {
        const [UserExists] = await db.query(
            "SELECT id FROM user WHERE id = ?",
            [user_id]
        );

        if (UserExists.lenght === 0) {
            return res.json({ success: false, message: "Utilisateur Inconnu"});
        }

        const [result] = await db.query(
            "INSERT INTO todo (user_id, title, description, due_time, status) VALUES (?, ?, ?, ?, ?)",
            [user_id, title, description, due_time, status]
        );

        const [todo] = await db.query("SELECT * FROM todo WHERE id = ?", [result.insertId])
        return res.status(201).json(todo[0]);
    } catch (err) {
        console.error(err);
        return res.json({success: false, message: "Erreur Serveur"});
    }
});

module.exports = router;