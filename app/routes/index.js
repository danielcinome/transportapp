var router = require('express').Router()
var routes = require('./routes');
var vehicles = require('./vehiclels');

// specify route for query 'routes' available 
router.use('/routes', routes);
// specify route for query data about 'vehicles' 
router.use('/vehicles', vehicles);

router.get('/', function(req, res) {
    res.status(200);
});

module.exports = router;