const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')

const { authRoute } = require('@routes');
const { errorHandleMiddleware } = require('@middlewares');

app.use(helmet())
app.use(cors({ origin: process.env.NODE_ENV == 'production' ? false : true })) // TODO düzelt
app.use(cookieParser())
app.use(express.json());

app.get('/a', (req,res)=>{
  req.session.views = req.session.views + 1
  res.send(req.session)
})

app.use('/auth', authRoute);
app.use(errorHandleMiddleware)

module.exports = app;