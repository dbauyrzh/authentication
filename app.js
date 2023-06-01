
//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const port = 3000;
const mongoose = require('mongoose');
const app = express();
const encrypt = require('mongoose-encryption');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
}
const userSchema=new mongoose.Schema({
    email: String,
    password:String
});
userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});

const User= new mongoose.model("User",userSchema);

app.get("/", async(req, res) => {
  res.render("home");
});
app.get("/login", async(req, res) => {
  res.render("login");
});
app.get("/register", async(req, res) => {
  res.render("register");
});

app.post("/register", async(req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save()
    .then( () => {
      res.render("secrets");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/login", async(req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username})
    .then((foundUser) => {
      if(foundUser) {
        if(foundUser.password === password) {
          res.render("secrets");
        }
      }
    })
    .catch((err) => {
      console.log(err);
    })
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
