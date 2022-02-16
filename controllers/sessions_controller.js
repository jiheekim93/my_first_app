const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const User = require('../models/users.js')




// on sessions form submit (log in)
sessions.get('/new', (req, res) => {
  res.render('users-new.ejs', {
    currentUser: true
  })
})
  // username is found and password matches
  // successful log in
  //
  // username is not found - who cares about password if you don't have a username that is found?
  // unsuccessful login
  //
  // username found but password doesn't match
  // unsuccessful login
  //
  // some weird thing happened???????
  //
  // Step 1 Look for the username
  sessions.post('/', (req, res) => {
    // console.log(req);
    User.findOne({username: true}, (err, foundUser) => {
      if (err){
        console.log('error');
        res.send('oops we had a problem')
      }if (!foundUser) {
        res.send('<a href="/users/new">Sorry, no user found </a>')
      }else{
        //user is found
        //check if passwords match
        if (bcrypt.compareSync(req.body.password, foundUser.password)) {
          //add user to session
        req.session.currentUser = foundUser
        // redirect to home page
        res.redirect('/')
      } else{
        //passwords do not match
        res.send('<a href="/sip/new">password does not match </a>')
      }
    }
  })
})




sessions.delete('/', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/sip')
  })
})

module.exports = sessions
