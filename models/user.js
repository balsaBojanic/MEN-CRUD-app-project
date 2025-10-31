const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const vinylSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageURL: {
    type: String,
    default: ''
  },
  condition: {
    type: String,
    enum: ['Mint', 'Near Mint', 'Very Good', 'Good', 'Fair'],
    required: true
  }
});

const cartItemSchema = new mongoose.Schema({
  vinylId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vinyl',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true
  },
  vinyls: [vinylSchema],
  cart: [cartItemSchema]
});

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  }
  next();
});

module.exports = mongoose.model('User', userSchema);