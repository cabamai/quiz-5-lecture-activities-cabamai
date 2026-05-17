// server/server.js
// Assignment 6 â€” Express backend for PlateScout.
// This server stores users in memory for now.
// MongoDB, password hashing, JWTs, and protected routes come later.

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware â€” mounted BEFORE any route.
//   cors()           â€” lets the browser call this server during dev
//   express.json()   â€” populates req.body on POST requests
app.use(cors());
app.use(express.json());

// In-memory "database". Cleared every time nodemon restarts.
// MongoDB replaces this in Lesson 20 / Assignment 7.
const users = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "password123",
    admin: true
  }
];

const posts = [
  {
    title: "First Post",
    body: "This is the body of the first post.",
  }
];

function validateInputs({ username, email, password }) {
    if(!username || username.trim().length < 3){
        return new Error("Username must be at least 3 characters long");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !emailRegex.test(email)){
        return new Error("email must be in the form of example@example.example")
    }
    
    if(!password || password.length < 8){
        return new Error("Password must be at least 8 characters long")
    }
}

app.post("/api/register", (req, res) => {
  const { username, email, password } = req.body;

  const validationError = validateInputs({ username, email, password });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  
  const duplicateUser = users.find(user => user.email === email);

  if(duplicateUser){
    return res.status(409).json({error : "Email already registered"})
  }

  const newUser = {
    username,
    email,
    password,
    admin: false
  };
  users.push(newUser);

  return res.status(201).json({
    message: "User registered successfully.",
    user: {
      username: newUser.username,
      email: newUser.email,
    },
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required.",
    });
  }

  const user = users.find(user => user.email === email);

  if(!user || user.password !== password){
    return res.status(401).json({error: "Invalid email or password"})
  }

  if(user.admin){
    return res.status(200).json({
        message: "Admin login successful.",
        user: {
            username: user.username,
            email : user.email,
            admin: user.admin
        },
      });
  }

  else{
    return res.status(200).json({
    message: "Login successful.",
    user: {
        username: user.username,
        email : user.email
      },
    });
  }
  
});

app.post("/api/users", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required.",
    });
  }

  const user = users.find(user => user.email === email);

  if(!user || user.password !== password){
    return res.status(401).json({error: "Invalid email or password"})
  }

  if(!user.admin){
    return res.status(403).json({error: "Access denied. Admins only."})
  }

  return res.status(200).json({
    message: "Login successful.",
    users: users.map(({ password, ...rest }) => rest)
  });
});

app.post("/api/posts", (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({
      error: "Title and body are required.",
    });
  }
  newPost = {
    title,
    body
  }
  posts.push(newPost);
  
  return res.status(201).json({
    message: "Post created successfully.",
    post: newPost
  });
});

app.get("/api/posts", (req, res) => {
  return res.status(200).json({
    posts
  });

});



// 404 fallback — must come AFTER all routes so they match first.
app.use((req, res) => {
  return res.status(404).json({
    error: "Route not found.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
