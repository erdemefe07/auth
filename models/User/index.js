const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, 'This username is taken.'],
    index: [true, 'This username is taken.'],
    validate: {
      validator: function (v) {
        return validator.isLength(v, { min: 1, max: 50 })
      },
      message: 'Username must be between 1 and 50 characters'
    },
  },
  password: {
    type: String,
    validate: {
      validator: function (v) {
        return validator.isStrongPassword(v, { minLength: 8, maxLength: 50, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0, returnScore: false })
      },
      message: 'Password must be between 8 and 50 characters. It must contain at least 1 lowercase, 1 uppercase and 1 number.'
    },
  },
  sessions: [
    {
      ipaddress: String,
      userAgent: String,
      token: String
    }
  ]
});

schema.pre('save', function (next) {
  const passModify = this.isModified('password')
  if (!passModify)
    return next()

  bcrypt.genSalt(12, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash
      next();
    });
  });

});

module.exports = mongoose.model('User', schema);
