const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { User, Candidate, Recruiter, Application, Role, connect } = require('./db');
const session = require('express-session');
const passport = require('passport');
//addding a comment for github branch checking on second pc.
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
    // res.send({message:'Hello World', mySesh: sesh.newVar});
    res.send({message:'Hello World'});
  });

app.route("/roles")
  .get(async function (req, res){
    res.send(await Role.find());
  })
  .post(async function (req, res){
    // console.log(req.body);
    try{
      const t = req.body.title;
      const desc = req.body.description;
      const newRole = new Role({
        role: t,
        roleDescription: desc
      });
      newRole.save();
      res.send(newRole);
    } catch (error){
      console.log(error);
    }
  });

app.route("/candidates")
  .get(async function (req, res){
    res.send(await Candidate.find());
  });

app.route("/applicants/:job_id")
  .get(async function (req, res){
    const role = await Role.findOne({_id: req.params.job_id});
    const {jobApplicants} = role;
    res.send(jobApplicants);
  });

app.route("/auth/login")
  .post(async function (req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    req.logIn(user, function(err) {
      if (err) { 
        console.log(err);
        res.send('login error');
      } else {
        passport.authenticate("local")(req,res,function(err){
          //add any other cookie info you need (like user type)
          res.cookie(`myCookie`,`This is the enc value`);
          res.send('user logged in successfully, cookie sent');
        });
      }
    });
  });

app.route("/auth/register")
  .post(async function (req, res) {
    const isUser = await User.findOne({username: req.body.username});
    console.log();
    if(!isUser){
      User.register({username: req.body.username}, req.body.password, function(err, user) {
        if (err) {
          console.log(err);
        } else{
          passport.authenticate("local")(req,res,function(){
            //add any other cookie info you need (like user type)
            res.cookie(`myCookie`,`This is the enc value`);
            res.send('user registered successfully, cookie sent');
          });
        }
      });
    } else {
      res.send('user already exists');
    }
    //otherwise
  });

app.route("/init")
  .get(async function (req, res){
    res.send("complete");
  });

module.exports = app;

// const server = app.listen(process.env.PORT || 8081, () => {
//   console.log(`Server is running on port ${server.address().port}`);
// });

// app.listen(process.env.PORT || 8081, () => console.log("Server is running on port 8080"));