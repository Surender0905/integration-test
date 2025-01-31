const express = require("express");
const router = express.Router();
const Bookmark = require("../models/bookmark");

// GET /bookmarks

// Return bookmarks filtered by favorite status
//Return bookmarks sorted by title
router.get("/", async (req, res) => {
    const { favorite, sort } = req.query;
    try {
        const bookmarks = await Bookmark.findAll({
            where: { favorite: favorite === "true" },
            order: [["title", sort === "title" ? "ASC" : "DESC"]],
        });

        //Return 200 OK with an empty array when no bookmarks exist
        if (bookmarks.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(bookmarks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /bookmarks
router.post("/", async (req, res) => {
    try {
        //check other field
        if (!req.body.title || !req.body.description) {
            return res
                .status(400)
                .json({ message: "Title and description are required" });
        }

        if (!req.body.url) {
            return res.status(400).json({ message: "URL is required" });
        }
        //check if URL is valid
        if (
            !req.body.url.startsWith("http://") &&
            !req.body.url.startsWith("https://")
        ) {
            return res.status(400).json({ message: "Invalid URL" });
        }
        const bookmark = await Bookmark.create(req.body);
        res.status(201).json(bookmark);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /bookmarks/:id
router.put("/:id", async (req, res) => {
    try {
        if (!req.body.title || !req.body.description) {
            return res
                .status(400)
                .json({ message: "Title and description are required" });
        }

        if (!req.body.url) {
            return res.status(400).json({ message: "URL is required" });
        }
        //check if URL is valid
        if (
            !req.body.url.startsWith("http://") &&
            !req.body.url.startsWith("https://")
        ) {
            return res.status(400).json({ message: "Invalid URL" });
        }

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

        if (typeof req.body.favorite === "string") {
            return res.status(400).json({ message: "Invalid favorite value" });
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
