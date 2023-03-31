const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cors());
require('dotenv').config();
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId; 
mongoose.set('strictQuery', true);

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