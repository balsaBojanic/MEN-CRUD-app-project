const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

const isSeller = (req, res, next) => {
  if (req.session.user.role === 'seller') return next();
  res.redirect('/');
};

router.get('/', async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' }).populate('vinyls');
    const allVinyls = sellers.flatMap(seller => 
      seller.vinyls.map(vinyl => ({
        ...vinyl.toObject(),
        seller: seller.username
      }))
    );
    
    res.locals.vinyls = allVinyls;
    res.render('vinyls/index.ejs');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/new', isSeller, (req, res) => {
  res.render('vinyls/new.ejs');
});

router.post('/', isSeller, async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.vinyls.push(req.body);
    await currentUser.save();
    res.redirect('/vinyls');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:vinylId', async (req, res) => {
  try {
    const seller = await User.findOne({ 'vinyls._id': req.params.vinylId });
    const vinyl = seller.vinyls.id(req.params.vinylId);
    
    res.locals.vinyl = {
      ...vinyl.toObject(),
      seller: seller.username,
      sellerId: seller._id
    };
    res.render('vinyls/show.ejs');
  } catch (error) {
    console.log(error);
    res.redirect('/vinyls');
  }
});

router.get('/:vinylId/edit', isSeller, async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const vinyl = currentUser.vinyls.id(req.params.vinylId);
    
    if (!vinyl) {
      return res.redirect('/vinyls');
    }
    
    res.locals.vinyl = vinyl;
    res.render('vinyls/edit.ejs');
  } catch (error) {
    console.log(error);
    res.redirect('/vinyls');
  }
});

router.put('/:vinylId', isSeller, async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const vinyl = currentUser.vinyls.id(req.params.vinylId);
    vinyl.set(req.body);
    await currentUser.save();
    res.redirect(`/vinyls/${req.params.vinylId}`);
  } catch (error) {
    console.log(error);
    res.redirect('/vinyls');
  }
});

router.delete('/:vinylId', isSeller, async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.vinyls.id(req.params.vinylId).deleteOne();
    await currentUser.save();
    res.redirect('/vinyls');
  } catch (error) {
    console.log(error);
    res.redirect('/vinyls');
  }
});

module.exports = router;