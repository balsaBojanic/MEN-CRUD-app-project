require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');
const vinylsController = require('./controllers/vinyls.js');
const usersController = require('./controllers/users.js');
const cartController = require('./controllers/cart.js');

const app = express();

const port = process.env.PORT ? process.env.PORT : '3000';


if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/vinyls', vinylsController);
app.use('/cart', cartController);
app.use('/users', usersController);

app.get('/', async (req, res) => {
  try {
    if (req.session.user) {
      const User = mongoose.model('User');
      const sellers = await User.find({ role: 'seller' });
      const allVinyls = sellers.flatMap(seller => 
        seller.vinyls.map(vinyl => ({
          ...vinyl.toObject(),
          seller: seller.username
        }))
      );
      res.locals.vinyls = allVinyls.slice(0, 6);
    }
    res.render('index.ejs');
  } catch (error) {
    console.log(error);
    res.render('index.ejs');
  }
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});