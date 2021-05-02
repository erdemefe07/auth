const MongoError = (err, res) => {
  switch (err.code) {
    case 11000:
      return catchDuplicateError(err, res)
  }
}

const catchDuplicateError = (err, res) => {
  res.status(400).json({ status: "error", message: "Duplicate keys found" })
}

module.exports = MongoError