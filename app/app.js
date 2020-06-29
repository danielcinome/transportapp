// Express is a web application infrastructure Node.js
const express = require('express');

let app = express();

// this is use for fix problem with of CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Use for server the view
app.use(express.static(__dirname + '../view'));

// declare the route for API
const route = require('./routes');
app.use('/api', route)

app.listen(process.env.PORT || 8000, function() {
    console.log("Server up and listening");
  });