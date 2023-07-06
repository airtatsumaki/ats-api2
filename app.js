const { setupApp, upload, fs, passport, path }  = require('./app-setup');
require('dotenv').config();
const { User, Candidate, Recruiter, Application, Role, connect } = require('./db');
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
    console.log(req.user);
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

app.route("/upload")
  .post(upload.single('cvpath'), async function (req, res){
    const { name, email, blurb } = req.body;
    const filename = `${Date.now()}_${req.file.originalname}`;
    const can = await Candidate.findOne({email: email});
    if (!can) {
      const newCandidate = new Candidate({
        name: name,
        email: email,
        blurb: blurb,
        cvPath: filename
      });
      fs.writeFile(`./uploads/${filename}`, req.file.buffer, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Failed to write file to disk');
        } else {
          res.send('File uploaded successfully, candidate created');
          newCandidate.save();
        }
      });
    } else {
      res.send('Candidate already exists');
    }
  });

app.route("/viewFile/:filename")
  .get(async function (req, res){
    res.sendFile(path.join(__dirname, "uploads", req.params.filename));
    // res.send(path.join(__dirname, "uploads", req.params.filename));
  });

app.route("/downloadFile/:filename")
  .get(async function (req, res){
    res.download(path.join(__dirname, "uploads", req.params.filename));
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
          // send the authenticated user to client/ react/ frontend to store within useState etc. 
          res.send(req.user);
          console.log(req.user.username);
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
            // res.send('user registered successfully, cookie sent');
            // send the authenticated user to client/ react/ frontend to store within useState etc. 
            console.log('register new user');
            res.send(req.user);
          });
        }
      });
    } else {
      console.log('user already exists');
      res.send(req.user);
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