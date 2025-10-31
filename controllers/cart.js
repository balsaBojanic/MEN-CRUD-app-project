const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const isBuyer = require('../middleware/is-buyer.js');

router.get('/', isBuyer, async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    
    const cartWithVinyls = await Promise.all(
      currentUser.cart.map(async (cartItem) => {
        const seller = await User.findOne({ 'vinyls._id': cartItem.vinylId });
        const vinyl = seller ? seller.vinyls.id(cartItem.vinylId) : null;
        
        return {
          ...cartItem.toObject(),
          vinylId: vinyl
        };
      })
    );
    
    res.locals.cart = cartWithVinyls;
    res.render('cart/index.ejs');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/:vinylId', isBuyer, async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    
    const existingItem = currentUser.cart.find(item => 
      item.vinylId.toString() === req.params.vinylId
    );
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentUser.cart.push({
        vinylId: req.params.vinylId,
        quantity: 1
      });
    }
    
    await currentUser.save();
    res.redirect('/cart');
  } catch (error) {
    console.log(error);
    res.redirect('/vinyls');
  }
});

router.put('/:itemId', isBuyer, async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const cartItem = currentUser.cart.id(req.params.itemId);
    cartItem.quantity = req.body.quantity;
    await currentUser.save();
    res.redirect('/cart');
  } catch (error) {
    console.log(error);
    res.redirect('/cart');
  }
});

router.delete('/:itemId', isBuyer, async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.cart.id(req.params.itemId).deleteOne();
    await currentUser.save();
    res.redirect('/cart');
  } catch (error) {
    console.log(error);
    res.redirect('/cart');
  }
});

module.exports = router;