CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES ('John Doe', 'http://example.com', 'My First Blog', 10),
       ('Jane Smith', 'http://example.com', 'My Second Blog', 20);

INSERT INTO blogs (url, title)
VALUES ('http://example.com', 'My Third Blog'),
       ('http://example.com', 'My Fourth Blog');