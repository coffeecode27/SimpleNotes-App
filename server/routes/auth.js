const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  async function (accessToken, refreshToken, profile, done) {

    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profileImage: profile.photos[0].value
    }

    try {
      let user = await User.findOne({ googleId: profile.id })
      if (user) {
        done(null, user);
      } else {
        user = await User.create(newUser);
        done(null, user);
      }

    } catch (error) {
      console.log(error);
    }
  }
));

/* GOOGLE LOGIN ROUTE */
router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));

/* RETRIEVE USER DATA  ROUTE*/
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failure',
    successRedirect: '/dashboard'
  })
);

/* IF SOMETHING GOES WRONG */
router.get('/login-failure', (req, res) => {
  res.status(500).send('Something Went Wrong...');
})

/* DESTROY USER SESSION WHEN LOGOUT */
router.get('/logout', (req,res) => {
  req.session.destroy(error => {
    if(error){
      console.log(error);
      res.send('Error logged out')
    }else{
      res.redirect('/')
    }
  })
})

/* PRESIST USER DATA AFTER SUCCESSFUL AUTHENTICATION */
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

/* RETRIEVE USER DATA FROM SESSION */
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  })
})
module.exports = router