// These are all the imports
const express = require('express'); // importing a CommonJS module
const hubsRouter = require('./hubs/hubs-router.js');
const helmet = require('helmet');
const morgan = require('morgan');

const server = express();

// These are Middleware. This is where you call them.
server.use(express.json());
server.use(helmet());
// server.use(lockout);
// server.use(lockout2);
// server.use(morgan('dev'));   // use a predefined format when you use morgan
server.use(methodLogger);
server.use(addName);

server.use('/api/hubs', hubsRouter);

//This a  way to use morgan with multiple calls
// server.get('/', morgan('dev'));
// server.delete('/', morgan('tiny'));

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.delete('/', (req, res) => {
  res.send('deleted');
})


// This is a middleware that we created on our own. remember to call it in the middleware section. Remember to add a 3rd parameter 
function methodLogger(req, res, next) {
  console.log(`${req.method} request`);
  next();    // This is you can give it to the next thing that matches which in this case is the server.get with the res.send
}

// This is a middleware function that lets you add data when it gets to server.get req.name. remember to use server.use in the import middleware section
function addName(req, res, next) {
  req.name = req.name || req.headers['x-name'];
  next();
}

function lockout(req, res, next) {
  res.status(403).json({message: 'api in maintenance mode'})
}


// This is a modular technique on how to lockout the server in itervals of 3 seconds 
function lockout2 (req, res, next) {
  let d = new Date()
  let n = d.getSeconds()
  if(n % 3 === 0) {
    res.status(403).json({message: 'you shall not pass'})
  } else {
    next()
  }
}

//This is the same as the previous lockout but using Integer
// function lockout2 (req, res, next) {
//   const date = new Date();
//   const n = date.getSeconds();
//   if(Number.isInteger(n / 3)) {
//     res.status(403).json({message: 'you shall not pass'})
//   } else {
//     next()
//   }
// }

module.exports = server;
