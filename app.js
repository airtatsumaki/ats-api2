const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
require('dotenv').config();
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId; 
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
const Job = mongoose.model("Job", jobSchema);

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

app.route("/applicants/:job_id")
  .get(async function (req, res){
    var id = req.params.job_id;       
    var o_id = new ObjectId(id);
    console.log("applicants for role: " + o_id);
    const result = await Job.findOne( { _id: o_id} );
    const {jobApplicants} = result;
    console.log(jobApplicants);
    
    // var myArr = [1];
    // var returnArray = myArr.map((element) => {
    //   return element + 1;
    // })
    // console.log(returnArray)

    const applicants = await Applicant.find();
    // console.log(applicants);

    var appsOfJob = applicants.filter((element) => {
      var aid = element._id
      console.log(jobApplicants.indexOf({_id: aid}));
    });

    // jobApplicants.forEach(async function (element) { 
    //   const app = await Applicant.findOne( { element } );
    //   console.log(app)
    //   applicantObjs.push(app);
    //  });
    // res.send(applicantObjs);
    res.send("done");
  });

app.route("/jobs")
  .get(async function (req, res){
    res.send(await Job.find());
  });

app.listen(process.env.PORT || 8080, () => console.log("Server is running on port 8080"));