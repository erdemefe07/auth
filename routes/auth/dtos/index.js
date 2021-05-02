const { checkSchema } = require('express-validator');

const RegisterDTO = {
  username: checkSchema({
    username: {
      isLength: {
        errorMessage: 'Username must be between 1 and 50 characters.',
        options: { min: 1, max: 50 },
      },
    },
  }),
  password: checkSchema({
    password: {
      isStrongPassword: {
        errorMessage: 'Password must be between 8 and 50 characters. It must contain at least 1 lowercase, 1 uppercase and 1 number.',
        options: { minLength: 8, maxLength: 50, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0, returnScore: false },
      },
    },
  }),
  newPassword: checkSchema({
    newPassword: {
      isStrongPassword: {
        errorMessage: 'Password must be between 8 and 50 characters. It must contain at least 1 lowercase, 1 uppercase and 1 number.',
        options: { minLength: 8, maxLength: 50, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0, returnScore: false },
      },
    },
  }),
  identifier: checkSchema({
    identifier: {
      isLength: {
        errorMessage: 'Wrong identifier.',
        options: { min: 21, max: 21 },
      },
    },
  }),
}

module.exports = {
  RegisterDTO,
}