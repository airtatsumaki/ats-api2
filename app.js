const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const applicantSchema = new mongoose.Schema({
  name: {type: String},
  email: {type: String},
  blurb: {type: String},
  cvPath: {type: String}
});
const Applicant = mongoose.model("Applicant", applicantSchema);

const jobSchema = new mongoose.Schema({
  role: {type: String},
  roleDescription: {type: String},
  jobApplicants: [applicantSchema]
});
const Job = mongoose.model("Job", applicantSchema);

connect().catch(err => console.log(err));

async function connect() {
  const url = `mongodb+srv://${process.env.db_USERNAME}:${process.env.db_PASSWORD}@cluster0.lgbc6oy.mongodb.net/ats-db`;
  await mongoose.connect(url);
}

app.route("/")
  .get(async function (req, res) {
    console.log(req.body);
    res.send({message:'Hello World new'});
  });

app.route("/applicants")
  .get(async function (req, res){
    res.send(await Applicant.find());
  });

app.route("/jobs")
  .get(async function (req, res){
    res.send(await Job.find());
  });

app.listen(process.env.PORT || 8080, () => console.log("Server is running on port 8080"));