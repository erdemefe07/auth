const Redis = require("ioredis");

/**
 * @typedef {import('ioredis').Redis} RedisClient
 * @type {RedisClient}
 */
let client

module.exports.connect = new Promise((resolve, reject) => {
  client = new Redis(process.env.REDIS_URI);

  client.on("error", function (error) {
    console.log("REDİS we're cannot connecting!")
    console.error(error);
    reject()
  });

  client.on("ready", function (error) {
    console.log("REDİS we're ready!")
    resolve()
  });
})

module.exports = client