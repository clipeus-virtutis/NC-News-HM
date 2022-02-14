const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const { response } = require("../app");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("NC News Server", () => {
  test("status(404), responds with a path not found message when provided an incorrect path", () => {
    return request(app)
      .get("/api/not-an-endpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
  describe("/api/topics", () => {
    describe("GET", () => {
      test("returns an array", () => {
        return request(app)
          .get("/api/topics")
          .then((response) => {
            expect(Array.isArray(response.body.topics)).toBe(true);
          });
      });
      test("status(200), responds with an array of topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((response) => {
            expect(response.body.topics).toHaveLength(3);
            response.body.topics.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  description: expect.any(String),
                  slug: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
  describe("/api/articles", () => {
    describe("GET /:article_id", () => {
      test('"status(200), responds with an object with the correct properties"', () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then((response) => {
            expect(response.body.article).toEqual(
              expect.objectContaining({
                author: "icellusedkars",
                title: "Eight pug gifs that remind me of mitch",
                article_id: 3,
                body: "some gifs",
                topic: "mitch",
                created_at: "2020-11-03T09:12:00.000Z",
                votes: 0,
              })
            );
          });
      });
      test("status(400), responds with a bad request message when article_id doesn't exist", () => {
        return request(app)
          .get("/api/articles/100")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Not Found");
          });
      });
    });
  });
});
