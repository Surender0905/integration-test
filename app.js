const express = require("express");
const bookmarksRoutes = require("./routes/bookmarks");

const app = express();

app.use(express.json());

app.use("/bookmarks", bookmarksRoutes);

module.exports = app;
