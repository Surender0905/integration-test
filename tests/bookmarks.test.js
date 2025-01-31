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

    //Return 200 OK with an empty array when no bookmarks exist

    it("should create a new bookmark", async () => {
        const response = await request(app).post("/bookmarks").send({
            url: "https://www.done.com",
            title: "Done",
            description: "Done website",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    // Return 400 if URL is missing in POST request
    it("should return 400 if URL is missing in POST request", async () => {
        const response = await request(app).post("/bookmarks").send({
            title: "Done",
            description: "Done website",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });

    // Return 400 if invalid URL is provided in POST request
    it("should return 400 if invalid URL is provided in POST request", async () => {
        const response = await request(app).post("/bookmarks").send({
            url: "invalid-url",
            title: "Done",
            description: "Done website",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });

    // Return 400 if required fields are missing in PUT request
    it("should return 400 if required fields are missing in PUT request", async () => {
        const response = await request(app).put("/bookmarks/1").send({
            url: "https://www.done.com",
            title: "",
            description: "",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message");
    });

    it("should update a bookmark as favorite", async () => {
        const res = await request(app).patch("/bookmarks/1").send({
            favorite: true,
        });

        expect(res.status).toBe(200);
        expect(res.body.favorite).toBe(true);
    });

    // Return 404 if bookmark is not found for PATCH
    it("should return 404 if bookmark is not found for PATCH", async () => {
        const res = await request(app).patch("/bookmarks/5").send({
            favorite: true,
        });

        expect(res.status).toBe(404);
    });

    ///Return 400 if invalid data is provided in PATCH request
    it("should return 400 if invalid data is provided in PATCH request", async () => {
        const res = await request(app).patch("/bookmarks/1").send({
            favorite: "true",
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
    });

    it("should delete a bookmark", async () => {
        const res = await request(app).delete("/bookmarks/4");

        expect(res.status).toBe(204);
    });
    // Return 404 if bookmark is not found for deletion
    it("should return 404 if bookmark is not found for deletion", async () => {
        const res = await request(app).delete("/bookmarks/4");

        expect(res.status).toBe(404);
    });

    //Return bookmarks filtered by favorite status
    it("should return bookmarks filtered by favorite status", async () => {
        const res = await request(app).get("/bookmarks?favorite=true");
        expect(res.status).toBe(200);
        expect(res.body[0].favorite).toBe(true);
    });

    //Return bookmarks sorted by title
    it("should return bookmarks sorted by title", async () => {
        const res = await request(app).get("/bookmarks?sort=title");
        expect(res.status).toBe(200);
        expect(res.body[0].title).toBe("Facebook");
    });

    //Return 200 OK with an empty array when no bookmarks match the filter
    it("should return 200 OK with an empty array when no bookmarks match the filter", async () => {
        const res = await request(app).get("/bookmarks?favorite=false");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });
});
