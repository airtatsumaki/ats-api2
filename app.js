const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
// app.use(cors());
const corsOptions = {
  optionsSuccessStatus: 200,
  credentials: true,
}
app.use(cors(corsOptions));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
  //can add addage (time in milliseconds): 
  //maxAge: 5000,
  // expires works the same as the maxAge
  //expires: new Date('01 12 2021'),
}));
app.use(passport.initialize());
app.use(passport.session());


mongoose.set('strictQuery', true);

const userSchema = new mongoose.Schema({
  username: {type: String},
  password: {type: String},
  type: {type: String, default: 'jobseeker'} //admin, recruiter, jobseeker
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const candidateSchema = new mongoose.Schema({
  name: {type: String},
  email: {type: String},
  blurb: {type: String},
  cvPath: {type: String}
});
const Candidate = mongoose.model("Candidate", candidateSchema);

const recruiterSchema = new mongoose.Schema({
  name: {type: String},
  email: {type: String},
});
const Recruiter = mongoose.model("Recruiter", recruiterSchema);

const applicationSchema = new mongoose.Schema({
  applicant: candidateSchema,
  appSource: recruiterSchema,
  appProgress: {type: Number}
  // 0 - Apply
  // 1 - Screen
  // 2 - 1st Interview
  // 3 - 2nd Interview
  // 4 - 2nd Interview with task
  // 5 - 3rd Interview
  // 6 - 3rd Interview with task

  //date application submitted
  //appFlag - 0,1 - 0 = fail, 1 = hired
  //failedReason - reason for appFlag = 0
  //add application channel - linkdin,reed,monster,uni schemes 
});
const Application = mongoose.model("Application", applicationSchema);

const roleSchema = new mongoose.Schema({
  role: {type: String},
  roleDescription: {type: String},
  //date job posteed
  jobApplicants: [applicationSchema]
});
const Role = mongoose.model("Role", roleSchema);

connect().catch(err => console.log(err));

async function connect() {
  const url = `mongodb+srv://${process.env.db_USERNAME}:${process.env.db_PASSWORD}@cluster0.lgbc6oy.mongodb.net/ats-db`;
  await mongoose.connect(url);
}

app.route("/auth/register")
  .post(async function (req, res) {
    // check if user exists
    //if user doesn't exists : 
    //register user
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
    //otherwise
  });

app.route("/")
  .get(async function (req, res) {
    // console.log(req.body);
    res.send({message:'Hello World'});
  });

app.route("/candidates")
  .get(async function (req, res){
    res.send(await Candidate.find());
  });

app.route("/applicants/:job_id")
  .get(async function (req, res){
    // "64198008c274e47ba4464bad"
    const role = await Role.findOne({_id: req.params.job_id});
    const {jobApplicants} = role;
    // console.log(jobApplicants);
    // const candidates = jobApplicants.map((can) => {
    //   // const {applicant: {name}} = can;
    //   // const {appProgress} = can;
    //   return appProgress;
    // })
    res.send(jobApplicants);
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

app.route("/init")
  .get(async function (req, res){
    // const rec = new Recruiter({
    //   name: "Alexandra Buckley",
    //   email: "ab@totaljobs.co.uk"
    // });
    // rec.save();

    // const role = await Role.findOne({_id: "64198008c274e47ba4464bad"});
    // const can1 = await Candidate.findOne({_id: "6419812c475a0215cba08b16"});
    // let app1 = new Application({
    //   applicant: can1,
    //   appProgress: 0
    // });
    // // app1.save();
    // role.jobApplicants.push(app1);
    // role.save();

    // var can1 = new Candidate({
    //   name:   "Steve",
    //   email:  "fergie@incite.ws",
    //   blurb:  "the other architect",
    //   cvPath: ""
    // });
    // can1.save();
    res.send("complete");
  });

app.listen(process.env.PORT || 8080, () => console.log("Server is running on port 8080"));