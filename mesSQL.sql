\c nc_news_test

-- SELECT comments.article_id, articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count FROM comments 
-- JOIN articles on articles.article_id = comments.article_id
-- WHERE articles.article_id = 3
-- GROUP BY comments.article_id; 

-- SELECT comments.article_id, COUNT(comment_id) AS comment_count FROM comments 
-- LEFT JOIN articles on articles.article_id = comments.article_id
-- WHERE articles.article_id = 3
-- GROUP BY comments.article_id; 

-- SELECT comments.article_id, articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes FROM comments
-- --COUNT(comment_id) AS comment_count FROM comments 
-- JOIN articles on articles.article_id = comments.article_id
-- WHERE articles.article_id = 3;
-- --GROUP BY comments.article_id; 

-- SELECT articles.article_id, articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes FROM articles
-- WHERE articles.article_id = 3;
-- --COUNT(comment_id) AS comment_count FROM comments 
-- -- JOIN comments on comments.article_id = articles.article_id;
-- --GROUP BY comments.article_id; 

-- SELECT articles.*, (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS TOT FROM articles;

-- SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count FROM articles
-- LEFT JOIN comments ON comments.article_id = articles.article_id
-- GROUP BY articles.author;

-- SELECT articles.article_id, COUNT(comments.comment_id) AS comment_count FROM articles
-- LEFT JOIN comments ON articles.article_id = comments.article_id
-- WHERE articles.article_id = 3
-- GROUP BY articles.article_id;

--returns a table with two columns, article_id as selected, and comment_count

-- SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments
--         LEFT JOIN articles ON articles.article_id = comments.article_id
--         WHERE comments.article_id = 9;

-- SELECT articles.*, CAST(COUNT(comments.article_id) as INT) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;

SELECT articles.*, CAST(COUNT(comments.article_id) as INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;