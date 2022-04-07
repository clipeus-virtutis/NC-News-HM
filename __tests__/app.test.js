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
      test("status(200), responds with an object with the correct properties", () => {
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
    describe("GET /:article_id/comments", () => {
      test("returns an array", () => {
        return request(app)
          .get("/api/articles/9/comments")
          .then((response) => {
            expect(Array.isArray(response.body.comments)).toBe(true);
          });
      });
      test("status(200), responds with an array of comment objects", () => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toHaveLength(2);
            response.body.comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                })
              );
            });
          });
      });
      test("status(200), responds with an empty array when there are no comments for the particular article", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toEqual([]);
          });
      });
      test("status(404), responds with a 'Not Found' message when article_id doesn't exist", () => {
        return request(app)
          .get("/api/articles/100/comments")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("ID 100 not found");
          });
      });
    });
    describe("POST /:article_id/comments", () => {
      test("status(201), responds with the new comment", () => {
        const newComment = {
          username: "rogersop",
          body: "not a bad article",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(newComment)
          .expect(201)
          .then((response) => {
            expect(response.body.comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: "not a bad article",
                votes: expect.any(Number),
                author: "rogersop",
                article_id: 2,
                created_at: expect.any(String),
              })
            );
          });
      });
      test("status(400), Bad Request message when a username doesn't exist", () => {
        const newComment = {
          username: "Steve",
          body: "Bad Request - Incorrect data type",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(newComment)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad Request - username doesn't exist");
          });
      });
      test("status(400), Bad Request message when required properties aren't provided", () => {
        const newComment = {
          incorrectName: "rogersop",
          body: "great article i r8 8/8",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(newComment)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad Request - invalid input");
          });
      });
      test("status(400), Bad Request message when properties are the wrong data type", () => {
        const newComment = {
          incorrectName: "rogersop",
          body: 55,
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(newComment)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad Request - invalid input");
          });
      });
      test("status(400), Bad Request message when article_id doesn't exist", () => {
        return request(app)
          .post("/api/articles/100/comments")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad Request - invalid input");
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
      test("status(200), article object now also includes comment_count", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toHaveLength(12);
            response.body.articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  comment_count: expect.any(Number),
                })
              );
            });
          });
      });
      test("articles should be sorted by date in descending order by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy("created_at", { descending: true });
          });
      });
    });
    describe("QUERIES", () => {
      test("status(200), accepts sort_by query for author", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy("author", { descending: true });
          });
      });
      test("status(200), accepts sort_by query for title", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy("title", { descending: true });
          });
      });
      test("status(200), accepts sort_by query for article_id", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy("article_id", { descending: true });
          });
      });
      test("status(200), accepts sort_by query for topic", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy("topic", { descending: true });
          });
      });
      test("status(200), accepts sort_by query for created_at", () => {
        return request(app)
          .get("/api/articles?sort_by=created_at")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("status(200), accepts sort_by query for votes", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy("votes", { descending: true });
          });
      });
      test("status(200), accepts sort_by query for comment_count", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy("comment_count", { descending: true });
          });
      });
      test("status(400), for invalid sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid-query")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad request - invalid query");
          });
      });
      test("status(200), accepts order query to allow user to sort by date and order by ascending", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy("created_at", { ascending: true });
          });
      });
      test("status(200), accepts order query to allow user to sort by valid columns and order by ascending", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=asc")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy("article_id", { ascending: true });
          });
      });
      test("status(400), for invalid order query", () => {
        return request(app)
          .get("/api/articles?order=not-valid-input")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Bad request - invalid query - order");
          });
      });
      test("status(200), returns articles of a topic specified by a query", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toHaveLength(11);
            response.body.articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  topic: "mitch",
                })
              );
            });
          });
      });
      test("status(200), returns articles of a topic specified by a query, whilst also allowing client to sort by a particular column and order by", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=desc&topic=mitch")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toHaveLength(11);
            expect(response.body.articles).toBeSortedBy("article_id", { descending: true });
            response.body.articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  topic: "mitch",
                })
              );
            });
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
  describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
      test("status(204), responds with an empty response body", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
      test("status(404), responds with an error if comment_id doesn't exist", () => {
        return request(app)
          .delete("/api/comments/100")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Not found - comment doesn't exist");
          });
      });
    });
  });
});
