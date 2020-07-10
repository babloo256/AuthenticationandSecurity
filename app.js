//jshint esversion:6
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md_5 = require("md5");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true, useFindAndModify:true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


const User = mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: md_5(req.body.password)
    });
    newUser.save(function(err){
        if(err){
            res.send(err);
        } else{
            res.render("secrets");
        }
    });
});

app.post("/login", function(req,res){
    const userName = req.body.username;
    const password = md_5(req.body.password);
    User.findOne({email:userName}, function(err,foundUser){
        if(err){
            console.log(err);
        } else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, function(){
    console.log("Server is up !");
});