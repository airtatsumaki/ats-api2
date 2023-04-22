const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { User, Candidate, Recruiter, Application, Role, connect } = require('./db');
const app = express();
require('dotenv').config();
const session = require('express-session');
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
const corsOptions = {
  optionsSuccessStatus: 200,
  credentials: true,
}
app.use(cors(corsOptions));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false

  // session storage
  //https://www.npmjs.com/package/memorystore

  //can add addage (time in milliseconds): 
  //maxAge: 5000,
  // expires works the same as the maxAge
  //expires: new Date('01 12 2021'),
}));
app.use(passport.initialize());
app.use(passport.session());

connect().catch(err => console.log(err));

app.route("/")
  .get(async function (req, res) {
    // console.log(req.body);
    let sesh = req.session;
    // console.log(req.session);
    //add data to session. this will only be available within this route
    sesh.newVar = "You have a session cookie, good for you";
    res.send({message:'Hello World', mySesh: sesh.newVar});
  });

app.listen(process.env.PORT || 8080, () => console.log("Server is running on port 8080"));