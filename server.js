//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

//use models
const wineSeed = require('./models/seed.js')
const Wine = require('./models/winedex.js')
const wineTypes = require('./models/winetypes.js')
//___________________
// Routes
//___________________
//



//upload
app.post('/sip', (req, res) => {
  Wine.create(req.body, (err, createdWine) => {
    res.redirect('/sip')
  })
})



//update
app.put('/sip/:id', (req, res) => {
  Wine.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updateWine) => {
    res.redirect('/sip')
  })
})

//edit-page
app.get('/sip/:id/edit', (req, res) => {
  Wine.findById(req.params.id, (err, foundWine) => {
    res.render('edit.ejs', {
      wine: foundWine,
      wineType: wineTypes
    })
  })
})

//Delete
app.delete('/sip/:id', (req, res) => {
  Wine.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect('/sip')
  })
})

//add / new-page
app.get('/sip/new', (req, res) => {
  res.render('new.ejs', {
    wineTypes: wineTypes
  })
})


//show-page
app.get('/sip/:id', (req, res) => {
  Wine.findById(req.params.id, (err, foundWine) => {
    res.render('show.ejs', {
      wine: foundWine,
    })
  })
})

//localhost:3000/sip = main-page
app.get('/sip' , (req, res) => {
  Wine.find({}, (err, allWines) => {
    res.render('index.ejs', {
      wines: allWines
    })
  });
});


//___________________
//Add seed
//___________________
Wine.create(wineSeed, (err, data) => {
  if (err) console.log(err.message);
  console.log("added provided wine data");
})
// ___________________
//Check seed
//___________________
// Wine.countDocuments({}, (err, data) => {
//   if (err) console.log(err.message)
//   console.log(`There are ${data} Wine in this database`)
// })

// Wine.collection.drop()


//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
