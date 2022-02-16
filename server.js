//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
const router = express.Router();
const session = require('express-session')
const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)
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
app.use(
  session({
    secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
  })
)
//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form



//use models
const Red = require('./models/red.js')
const White = require('./models/white.js')
const Rose = require('./models/rose.js')
const wineTypes = require('./models/winetypes.js')
const userController = require('./controllers/users_controller.js')
const userInfo = require('./models/user-info.js')
const User = require('./models/users.js')
app.use('/users', userController)
//___________________
// Routes
//___________________
//



//3 uploads
app.post('/sip/red', (req, res) => {
  Red.create(req.body, (err, createdRed) => {
    res.redirect('/sip/red', { currentUser:true
    })
  })
})

app.post('/sip/white', (req, res) => {
  White.create(req.body, (err, createdWhite) => {
    res.redirect('/sip/white', { currentUser:true
     })
   })
})


app.post('/sip/rose', (req, res) => {
  Rose.create(req.body, (err, createdRose) => {
    res.redirect('/sip/rose', { currentUser:true
    })
  })
})
//3 updates
app.put('/sip/red/:id', (req, res) => {
  Red.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updateWine) => {
    res.redirect('/sip/red', { currentUser:true
    })
  })
})

app.put('/sip/white/:id', (req, res) => {
  White.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updateWine) => {
    res.redirect('/sip/white', { currentUser:true
     })
  })
})

app.put('/sip/rose/:id', (req, res) => {
  Rose.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updateWine) => {
    res.redirect('/sip/rose', { currentUser:true
    })
  })
})

//3 edit-pages
app.get('/sip/red/:id/edit', (req, res) => {
  Red.findById(req.params.id, (err, foundWine) => {
    res.render('red-edit.ejs', {
      currentUser: true,
      red: foundWine,
      wineType: wineTypes
    })
  })
})

app.get('/sip/white/:id/edit', (req, res) => {
  White.findById(req.params.id, (err, whiteWine) => {
    res.render('white-edit.ejs', {
      currentUser: true,
      white: whiteWine,
      wineType: wineTypes,
    })
  })
})

app.get('/sip/rose/:id/edit', (req, res) => {
  Rose.findById(req.params.id, (err, roseWine) => {
    res.render('rose-edit.ejs', {
      currentUser: true,
      rose: roseWine,
      wineType: wineTypes
    })
  })
})

// 3 Deletes
app.delete('/sip/red/:id', (req, res) => {
  Red.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect('/sip/red', {
      currentUser: true
    })
  })
})


app.delete('/sip/white/:id', (req, res) => {
  White.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect('/sip/white', {
      currentUser: true
    })
  })
})

app.delete('/sip/rose/:id', (req, res) => {
  Rose.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect('/sip/rose', {
      currentUser: true
    })
  })
})

//add 3 new-pages
app.get('/sip/newred', (req, res) => {
  res.render('red-new.ejs', {
    currentUser: true,
    wineTypes: wineTypes
  })
})

app.get('/sip/newwhite', (req, res) => {
  res.render('white-new.ejs', {
    currentUser: true,
    wineTypes: wineTypes
  })
})

app.get('/sip/newrose', (req, res) => {
  res.render('rose-new.ejs', {
    currentUser: true,
    wineTypes: wineTypes
  })
})

//3 show-pages
app.get('/sip/red/:id', (req, res) => {
  Red.findById(req.params.id, (err, foundWine) => {
    res.render('red-show.ejs', {
      currentUser: true,
      red: foundWine
    })
  })
})

app.get('/sip/white/:id', (req, res) => {
  White.findById(req.params.id, (err, whiteWine) => {
    res.render('white-show.ejs', {
      currentUser: true,
      white: whiteWine
    })
  })
})

app.get('/sip/rose/:id', (req, res) => {
  Rose.findById(req.params.id, (err, roseWine) => {
    res.render('rose-show.ejs', {
      currentUser: true,
      rose: roseWine
    })
  })
})



// 3 main pages
app.get('/sip/red' , (req, res) => {
  Red.find({}, (err, allWines) => {
    res.render('red.ejs', {
      currentUser: true,
      reds: allWines
    })
  });
});

app.get('/sip/white' , (req, res) => {
  White.find({}, (err, whiteWines) => {
    res.render('white.ejs', {
      currentUser: true,
      whites: whiteWines
    })
  });
});

app.get('/sip/rose' , (req, res) => {
  Rose.find({}, (err, roseWines) => {
    res.render('rose.ejs', {
      currentUser: true,
      roses: roseWines
    })
  });
});

//login page


app.get('/sip/new', (req, res) => {
  User.find({}, (err, newUser) => {
    res.render('session-new.ejs', {
      user: newUser,
      currentUser: true,
    })
  })
})

//informational pages
app.get('/sip/about', (req, res) => {
  res.render('about.ejs', {
    currentUser: true,
  })
})

app.get('/sip/contact', (req, res) => {
  res.render('contact.ejs', {
    currentUser: true,
  })
})
//localhost:3000/siphome-page
app.get('/sip', (req, res) => {
  res.render('main.ejs')
})


//___________________
//Add seed
// //___________________
// Wine.create(wineSeed, (err, data) => {
//   if (err) console.log(err.message);
//   console.log("added provided wine data");
// })
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
