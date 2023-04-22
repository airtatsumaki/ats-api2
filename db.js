//this file will contain all mongoose code.
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

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

async function connect() {
  const url = `mongodb+srv://${process.env.db_USERNAME}:${process.env.db_PASSWORD}@cluster0.lgbc6oy.mongodb.net/ats-db`;
  await mongoose.connect(url);
}

module.exports = { User, Candidate, Recruiter, Application, Role, connect };