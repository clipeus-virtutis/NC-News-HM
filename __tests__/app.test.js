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
  //   describe("/api/topics", () => {
  //     describe("GET", () => {
  //       test("status(200), responds with an array of topics", () => {
  //         return request(app)
  //           .get("/api/topics")
  //           .expect(200)
  //           .then((response) => {
  //             expect(response.body.topics).toHaveLength(3);
  //             response.body.topics.forEach((topic) => {
  //               expect(topic).toEqual(
  //                 expect.objectContaining({
  //                   description: expect.any(String),
  //                   slug: expect.any(String),
  //                 })
  //               );
  //             });
  //           });
  //       });
  //     });
  //   });
});
