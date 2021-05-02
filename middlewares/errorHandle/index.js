const MongoErrors = require('./MongoErrors')
const JwtErrors = require('./JwtErrors')
const { JsonWebTokenError } = require('jsonwebtoken')

const errorHandler = (err, req, res, next) => {
  if (!err)
    return

  console.log('\n{')
  for (const key in err) {
    if (Object.hasOwnProperty.call(err, key)) {
      const element = err[key];
      console.log('    ' + key + ': ' + element)
    }
  }
  console.log('}\n')
  console.log(err)

  if (err instanceof JsonWebTokenError)
    return JwtErrors(err, req, res)

  if (err.name = "MongoError") {
    return MongoErrors(err, res)
  }

  res.status(500).json({ status: 'error' })
}

module.exports = errorHandler