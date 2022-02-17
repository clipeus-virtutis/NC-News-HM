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
      test("status(200), responds with an object which also contains the comment count", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then((response) => {
            expect(response.body.article).toEqual(
              expect.objectContaining({
                comment_count: "2",
              })
            );
          });
      });
      test("status(200), responds with correct comment count if there are no comments", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then((response) => {
            expect(response.body.article).toEqual(
              expect.objectContaining({
                comment_count: "0",
              })
            );
          });
      });
      test("status(404), responds with a 'Not Found' message when article_id doesn't exist", () => {
        return request(app)
          .get("/api/articles/100")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("ID 100 not found");
          });
      });
    });
    describe("GET", () => {
      test("returns an array", () => {
        return request(app)
          .get("/api/articles")
          .then((response) => {
            expect(Array.isArray(response.body.articles)).toBe(true);
          });
      });
      test("status(200), responds with an array of article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toHaveLength(12);
            response.body.articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
          });
      });
      test("articles should be sorted by date in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy("created_at", { descending: true });
          });
      });
    });
    describe("PATCH /:article_id", () => {
      test("status(200), responds with the updated article after the votes property has been amended", () => {
        const articleUpdates = {
          inc_votes: 10,
        };
        return request(app)
          .patch("/api/articles/1")
          .send(articleUpdates)
          .expect(200)
          .then((response) => {
            expect(response.body.article).toEqual(
              expect.objectContaining({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 110,
              })
            );
          });
      });
      test("status(404), responds with a 'ID Not Found' message when article_id doesn't exist", () => {
        const articleUpdates = {
          inc_votes: 10,
        };
        return request(app)
          .patch("/api/articles/100")
          .send(articleUpdates)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("ID 100 not found");
          });
      });
      test("status(400), responds with a Bad Request error message when the request body key is incorrect", () => {
        const articleUpdates = {
          incorrect_key: 10,
        };
        return request(app)
          .patch("/api/articles/4")
          .send(articleUpdates)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad Request - incorrect body format");
          });
      });
      test("status(400), responds with a Bad Request error message when the request body value is the wrong type", () => {
        const articleUpdates = {
          inc_votes: "Incorrect Data",
        };
        return request(app)
          .patch("/api/articles/4")
          .send(articleUpdates)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad Request - incorrect body data");
          });
      });
    });
  });
  describe("/api/users", () => {
    describe("GET", () => {
      test("returns an array", () => {
        return request(app)
          .get("/api/users")
          .then((result) => {
            expect(Array.isArray(result.body.users)).toBe(true);
          });
      });
      test("status(200), responds with an array of user objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then((result) => {
            expect(result.body.users).toHaveLength(4);
            result.body.users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
});
