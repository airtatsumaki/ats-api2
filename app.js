const setupApp = require('./app-setup');
require('dotenv').config();
const { User, Candidate, Recruiter, Application, Role, connect } = require('./db');
const passport = require('passport');
const app = setupApp();
connect().catch(err => console.log(err));

app.route("/roles")
  .get(async function (req, res){
    res.send(await Role.find());
  })
  .post(function (req, res){
    try{
      const {title, description} = req.body
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
  })
  .post(async function (req, res){
    try{
      const {name, email, blurb} = req.body;
      // const cv = req.body.cvpath;
      const can = await Candidate.findOne({email: email});
      if(!can){
        const newCandidate = new Candidate({
          name: name,
          email: email,
          blurb: blurb,
          // cvPath: cv
        });
        console.log(newCandidate);
        newCandidate.save();
        console.log("new candidate added");
        res.send(newCandidate);
      } else {
        console.log("already a candidate.");
        res.send("Candidate already exists");
      }
    } catch (error){
      console.log(error);
    }
  });

app.route("/applicants/:job_id")
  .get(async function (req, res){
    const role = await Role.findOne({_id: req.params.job_id});
    const {jobApplicants} = role;
    res.send(jobApplicants);
  });

app.route("/auth/login")
  .post(function (req, res) {
    const {username, password} = req.body
    const user = new User({
      username: username,
      password: password
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
    const {username, password} = req.body
    const isUser = await User.findOne({username: username});
    if(!isUser){
      User.register({username: username}, password, function(err, user) {
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
  });

app.route("/")
  .get(function (req, res) {
    res.send({message:'Hello World'});
  });

app.route("/init")
  .get(function (req, res){
    res.send("complete");
  });

module.exports = app;