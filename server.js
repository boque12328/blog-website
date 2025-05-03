import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let posts = [];

const CURRENT_USER = "Me";

// Routes
app.get("/", (req, res) => {
  const myPosts = posts.filter(p => p.author === CURRENT_USER);
  res.render("index", { posts: myPosts, currentUser: CURRENT_USER });
});

app.get("/all-users", (req, res) => {
  res.render("all-users", { posts });
});

app.post("/posts", (req, res) => {
  const { title, content } = req.body;
  posts.unshift({ id: Date.now(), title, content, author: CURRENT_USER });
  res.redirect("/");
});

app.delete("/posts/:id", (req, res) => {
  posts = posts.filter(post => post.id !== Number(req.params.id));
  res.redirect("/");
});

app.put("/posts/:id", (req, res) => {
  const { title, content } = req.body;
  const id = Number(req.params.id);
  posts = posts.map(post => post.id === id ? { ...post, title, content } : post);
  res.redirect("/");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
