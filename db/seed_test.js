const Bookmark = require("../models/bookmark");
const { connectDb } = require("./init");

const seedTestDb = async () => {
    await connectDb();
    await Bookmark.sync({ force: true });

    const bookmarks = [
        {
            url: "https://www.google.com",
            title: "Google",
            description: "Search engine",
        },
        {
            url: "https://www.facebook.com",
            title: "Facebook",
            description: "Social media",
        },
        {
            url: "https://www.twitter.com",
            title: "Twitter",
            description: "Social media",
        },
    ];

    await Bookmark.bulkCreate(bookmarks);
    console.log("Test Database seeded successfully.");
    process.exit(0);
};

seedTestDb();
