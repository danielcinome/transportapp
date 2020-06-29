const router = require('express').Router()
const request = require('request');
const xml2js = require('xml2js');


const urlVehicleId = 'http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocation&a=sf-muni&v=';

/**
 * @description Function used to parse the XML format obtained as a response from the NetBusXML API to JSON
 * @param {XML} data in formation xml
 * @return returns information in JSON format
 */
function xmltoJson(body) {
    let json = null;
    xml2js.parseString(body, { mergeAttrs: true }, (err, result) => {
    if (err) {
        throw err;
    }
    json = result;
  });
  return json;
};


/**
 * @description Route get, allows to obtain information about the location of a vehicle
 * @route /api/vehicles/{id} expample value : 1453
 * @param {req} represents the (request)
 * @param {res} represents the (response)
 */
router.get('/:id', function (req, res) {

  const vehicleId = req.params.id;
  let listPredict = [];

    request(urlVehicleId + vehicleId, function (err, response, body) {
      if (err) {
        return console.error(err);
      }
      const json = xmltoJson(body);
      res.send(json);
    });
});

module.exports = router;