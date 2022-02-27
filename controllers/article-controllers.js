const { checkArticleExists, checkCommentExists } = require("../db/helpers/utils");
const {
  fetchArticle,
  updateArticle,
  fetchArticles,
  fetchCommentNumber,
  fetchComments,
  addComment,
  removeComment,
} = require("../models/article-models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([fetchArticle(article_id), fetchCommentNumber(article_id)])
    .then((response) => {
      response[0].comment_count = response[1].rows[0].comment_count;
      res.status(200).send({ article: response[0] });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const articleId = req.params;
  const articleUpdate = req.body;

  updateArticle(articleId, articleUpdate)
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([checkArticleExists(article_id), fetchComments(article_id)])
    .then((response) => {
      res.status(200).send({ comments: response[1].rows });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  addComment(article_id, req.body)
    .then((response) => {
      res.status(201).send({ comment: response });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;

  Promise.all([checkCommentExists(commentId), removeComment(commentId)])
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};

exports.getApi = (req, res, next) => {
  const endpointInfo = {
    "GET /api": {
      description: "serves up a json representation of all the available endpoints of the api",
    },
    "GET /api/topics": {
      description: "serves an array of all topics",
      queries: [],
      exampleResponse: {
        topics: [{ slug: "football", description: "FOOTIE!" }],
      },
    },
    "GET /api/articles": {
      description: "serves an array of all articles",
      queries: ["topic", "sort_by", "order"],
      exampleResponse: {
        articles: [
          {
            article_id: 34,
            title: "The Notorious MSG's Unlikely Formula For Success",
            topic: "cooking",
            author: "grumpy19",
            body: "The 'umami' craze has turned a much-maligned and misunderstood food additive into an object of obsession for the world's most innovative chefs. But secret ingredient monosodium glutamate's biggest secret may be that there was never anything wrong with it at all.",
            created_at: "2020-11-22T11:13:00.000Z",
            votes: 0,
            comment_count: 11,
          },
        ],
      },
    },
    "GET /api/articles/:article_id": {
      description: "serves one article as defined by article_id",
      queries: [],
      exampleResponse: {
        article: {
          article_id: 1,
          title: "Running a Node App",
          topic: "coding",
          author: "jessjelly",
          body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
          created_at: "2020-11-07T06:03:00.000Z",
          votes: 0,
          comment_count: "8",
        },
      },
    },
    "PATCH /api/articles/:article_id": {
      description: "serves the updated article after votes have been updated",
      exampleInput: {
        inc_votes: 50,
      },
      exampleResponse: {
        article_id: 1,
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: "2020-11-07T06:03:00.000Z",
        votes: 50,
      },
    },
    "GET /api/articles/:article_id/comments": {
      description: "serves an array of all comments relating to the specified article",
      queries: [],
      exampleResponse: {
        comments: [
          {
            comment_id: 31,
            votes: 11,
            created_at: "2020-09-26T16:16:00.000Z",
            author: "weegembump",
            body: "Sit sequi odio suscipit. Iure quisquam qui alias distinctio eos officia enim aut sit. Corrupti ut praesentium ut iste earum itaque qui. Dolores in ab rerum consequuntur. Id ab aliquid autem dolore.",
          },
        ],
      },
    },
    "POST /api/articles/:article_id/comments": {
      description: "serves the new comment that has been posted",
      exampleInput: {
        username: "cooljmessy",
        body: "i rate this 10/10, excellent work",
      },
      exampleResponse: {
        comment: {
          comment_id: 301,
          body: "i rate this 10/10, excellent work",
          article_id: 1,
          author: "cooljmessy",
          votes: 0,
          created_at: "2022-02-27T16:53:04.821Z",
        },
      },
    },
    "GET /api/users": {
      description: "serves an array of all users",
      queries: [],
      exampleResponse: {
        users: [
          {
            username: "tickle122",
          },
        ],
      },
    },
    "DELETE /api/comments/:comment_id": {
      description: "Deletes a comment with no returned object",
    },
  };
  res.status(200).send(endpointInfo);
};
