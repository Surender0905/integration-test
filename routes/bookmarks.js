const express = require("express");
const router = express.Router();
const Bookmark = require("../models/bookmark");

// GET /bookmarks
router.get("/", async (req, res) => {
    try {
        const bookmarks = await Bookmark.findAll();
        res.status(200).json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /bookmarks
router.post("/", async (req, res) => {
    try {
        const bookmark = await Bookmark.create(req.body);
        res.status(201).json(bookmark);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /bookmarks/:id
router.get("/:id", async (req, res) => {
    try {
        const bookmark = await Bookmark.findByPk(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ message: "Bookmark not found" });
        }
        res.status(200).json(bookmark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//patch /bookmarks/:id
router.patch("/:id", async (req, res) => {
    try {
        const bookmark = await Bookmark.findByPk(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ message: "Bookmark not found" });
        }

        await bookmark.update(req.body);
        res.status(200).json(bookmark);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /bookmarks/:id
router.delete("/:id", async (req, res) => {
    try {
        const bookmark = await Bookmark.findByPk(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ message: "Bookmark not found" });
        }
        await bookmark.destroy();
        res.status(204).json({
            message: "Bookmark deleted successfully",
        }); // No content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
