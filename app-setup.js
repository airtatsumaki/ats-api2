//this file contains the app setup functions
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

function setupApp(){
  const app = express();
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

  return app;
}

module.exports = setupApp;