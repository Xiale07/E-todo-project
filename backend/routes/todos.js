const express = require("express");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth.js");
const { db } = require("../db.js");

const router = express.Router();

/* ===============================================================
 *                       GET ALL TODOS 
 * =============================================================== */
router.get("/", auth, async (req, res) => {
    try {
        const [todos] = await db.query("SELECT * FROM todo");
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* ===============================================================
 *                    GET ONE TODO BY ID 
 * =============================================================== */
router.get("/:id", auth, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM todo WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Todo introuvable" });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* ===============================================================
 *                       CREATE TODO 
 * =============================================================== */
router.post("/", auth, async (req, res) => {
    const { user_id, title, description, status, priority, due_time, start_time, day } = req.body;

    if (!user_id || !title || !description || !status || !due_time) {
        return res.status(400).json({ error: "Champs manquants" });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO todo (user_id, title, description, status, priority, due_time, start_time, day)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, title, description, status, priority, due_time, start_time, day]
        );

        const [todo] = await db.query("SELECT * FROM todo WHERE id = ?", [result.insertId]);

        return res.status(201).json(todo[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* ===============================================================
 *                       UPDATE TODO 
 * =============================================================== */
router.put("/:id", auth, async (req, res) => {
    const todoId = req.params.id;
    const { title, description, status, priority, due_time, start_time, day } = req.body;
    const allowedStatuses = ['Not started', 'To do', 'In progress', 'Done'];

    if (status !== undefined && !allowedStatuses.includes(status)) {
        return res.status(400).json({ error: `Status invalide. Valeurs autorisées : ${allowedStatuses.join(", ")}` });
    }


    try {
        const [rows] = await db.query(
            "SELECT * FROM todo WHERE id = ?",
            [todoId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Todo introuvable" });
        }
        
        const fields = [];
        const values = [];

        if (title !== undefined) { fields.push("title = ?"); values.push(title); }
        if (description !== undefined) { fields.push("description = ?"); values.push(description); }
        if (status !== undefined) {
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ error: `Status invalide. Valeurs autorisées : ${allowedStatuses.join(", ")}` });
            }
            fields.push("status = ?");
            values.push(status);
        }
        if (priority !== undefined) { fields.push("priority = ?"); values.push(priority); }
        if (due_time !== undefined) { fields.push("due_time = ?"); values.push(due_time); }
        if (start_time !== undefined) { fields.push("start_time = ?"); values.push(start_time); }
        if (day !== undefined) { fields.push("day = ?"); values.push(day); }

        if (fields.length === 0) {
            return res.status(400).json({ error: "Aucun champ à mettre à jour" });
        }


        values.push(todoId);

        await db.query(`UPDATE todo SET ${fields.join(", ")} WHERE id = ?`, values);

        res.json({ success: true, message: "Todo mise à jour" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
/* ===============================================================
 *                       DELETE TODO (PUBLIC)
 * =============================================================== */
router.delete("/:id", auth, async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM todo WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Todo introuvable" });
        }

        res.json({ success: true, message: "Todo supprimée" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;
