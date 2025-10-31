const isBuyer = (req, res, next) => {
  if (req.session.user.role === 'buyer') return next();
  res.redirect('/');
};

module.exports = isBuyer;