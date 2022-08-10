require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");


const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');
}

const userSchema = new mongoose.Schema({
  email:String,
  password: String
});


userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);



app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register")
});

app.post("/register", (req, res) => {

  const email = req.body.username;
  const password = req.body.password;

  const newUser = new User({
    email:email,
    password:password
  });

  newUser.save((err) => {

    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });

});

app.post("/login", (req, res) => {

  const email = req.body.username;
  const password = req.body.password;

  User.findOne({email: email}, (err, foundUser) => {

    if(!foundUser) {
      res.render("register");
    } else {
      if(foundUser.password === password) {
        res.render("secrets")
      }
    }
  })

});


app.listen(3000, (req, res) => {
  console.log("Server started at port 3000");
});
