require("dotenv").config();
const express = require("express");
const cors = require("cors");

const mongoose = require ("mongoose");

mongoose
    .connect(process.env.MONGO_URL)
    .then(()=> {console.log("mongodb connection");})
    .catch ((err=> {console.log("mongo connection failed")}));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const users = [];

const userSchema = {
    username: {type: String, required: true, minlength: 3},
    email : {type : String, require : true, lowercase: true, trim: true},
    password: {type : String, require :true, minlength : 8},
    createAt : {type: Date, default: Date.now}
}

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

    return "";
  // The /api/register handler treats a falsy return value as success.
}

app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;
  
    const validationError = validateInputs({ username, email, password });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
  
    try{
      const existing = await UserActivation.findOne({username});
      if(existing){
        return res.status(409).json({error: "Username already exists"})
      }
    }catch{

    }
    
    const newUser = {
      username,
      email,
      password,
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
app.post("/api/login", async (req, res) => {
  const {username, password} = req.body;

  try{
    const user = await user.findOne((username));

    return res.status(200).json({
      success : true,
      message: "login is succesful",
      user: {username:user.username, email: user.email}
    })
  }catch(error){
    console.error("Login Error", error);
  }
  if(!user || user.password !== password){

  }
});

