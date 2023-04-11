const express = require("express");
const cors = require("cors");
const jsonServer = require("json-server");
const morgan = require("morgan");
const { validatePost } = require("./middleware");
const app = express();
// const server = jsonServer.create();
const router = jsonServer.router("db.json");
// const middlewares = jsonServer.defaults();
const db = router.db;

app.use(express.json());
app.use(morgan("dev"));
// app.use(middlewares);
app.use(cors());

// Mount the JSON Server app on the root path
// app.use('/', server);

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Get all posts
app.get("/", (req, res) => {
  res.redirect("/posts");
});

// Get all posts
app.get("/posts", (req, res) => {
  const posts = db.get("posts").value();
  res.json(posts);
});

// Get a single post
app.get("/posts/:id", (req, res) => {
  const post = db.get("posts").find({ id: req.params.id }).value();
  res.json(post);
});

// Create a new post
app.post("/posts", validatePost, (req, res) => {
  const id = Math.random().toString().slice(2);
  const post = { id, ...req.body };
  db.get("posts").push(post).write();
  res.json(post);
});

// Update an existing post
app.put("/posts/:id", (req, res) => {
  const post = db.get("posts").find({ id: req.params.id }).assign(req.body).write();
  res.json(post);
});

// Delete a post
app.delete("/posts/:id", (req, res) => {
  db.get("posts").remove({ id: req.params.id }).write();
  res.sendStatus(200);
});

// Get all comments
app.get("/comments", (req, res) => {
  const comments = db.get("comments").value();
  res.json(comments);
});

// Get all comments with id === postId
app.get("/comments/:postId", (req, res) => {
  const { postId } = req.params;
  const comments = db.get("comments").filter({ postId }).value();
  res.json(comments);
});

// Create a new post
app.post("/comments", (req, res) => {
  const id = Math.random().toString().slice(2);
  const comment = { id, ...req.body };
  db.get("comments").push(comment).write();
  res.json(comment);
});

// Delete a comment
app.delete("/comments/:id", (req, res) => {
  db.get("comments").remove({ id: req.params.id }).write();
  res.sendStatus(200);
});
