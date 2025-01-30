const request = require("supertest");
const app = require("../app");
const Bookmark = require("../models/bookmark");
const { sequelize } = require("../db/init");

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await Bookmark.bulkCreate([
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
    ]);
});

afterAll(async () => {
    await sequelize.close();
});

describe("GET /bookmarks api test", () => {
    it("should return all bookmarks", async () => {
        const response = await request(app).get("/bookmarks");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);
    });

    it("should create a new bookmark", async () => {
        const response = await request(app).post("/bookmarks").send({
            url: "https://www.done.com",
            title: "Done",
            description: "Done website",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("should update a bookmark as favorite", async () => {
        const res = await request(app).patch("/bookmarks/1").send({
            favorite: true,
        });

        expect(res.status).toBe(200);
        expect(res.body.favorite).toBe(true);
    });

    it("should delete a bookmark", async () => {
        const res = await request(app).delete("/bookmarks/4");

        expect(res.status).toBe(204);
    });
});
