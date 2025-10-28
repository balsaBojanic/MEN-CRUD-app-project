const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.locals.users = allUsers;
    res.render('users/index.ejs');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.locals.userProfile = user;
    res.render('users/show.ejs');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;