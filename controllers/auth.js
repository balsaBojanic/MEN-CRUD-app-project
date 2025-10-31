const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

const router = express.Router();

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ 
      $or: [
        { username: req.body.username },
        { email: req.body.email }
      ]
    });
    if (userInDatabase) {
      return res.send('Username or email already taken.');
    }
    
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match');
    }
    
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    });
    
    req.session.user = {
      username: user.username,
      _id: user._id,
      role: user.role
    };
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.send('Login failed. Please try again.');
    }
    
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword) {
      return res.send('Login failed. Please try again.');
    }
    
    req.session.user = {
      username: user.username,
      _id: user._id,
      role: user.role
    };
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;