const { MongoMemoryServer } = require('mongodb-memory-server')

let mongod

module.exports.open = async () => {
  mongod = new MongoMemoryServer();
  process.env.MONGO_URI = await mongod.getUri()
}

module.exports.stop = async () => {
  await mongod.stop();
  console.log('mongo in memory stopped')
};