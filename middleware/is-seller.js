const isSeller = (req, res, next) => {
  if (req.session.user.role === 'seller') return next();
  res.redirect('/');
};

module.exports = isSeller;