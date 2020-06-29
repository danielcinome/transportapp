var router = require('express').Router()
const request = require('request');
const xml2js = require('xml2js');

const urlList = 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni';
const urlConfig = 'http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=sf-muni';
const urlStopId = 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&stopId=';


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
 * @description Get route, for a list of all available routes
 * @route /api/route{/}
 * @param {req} represents the (request)
 * @param {res} represents the (response)
 */
router.get('/', function (req, res) {

  request(urlList, function(err, response, body) {
    if (err) {
      return console.error(err);
    }
    let json = xmltoJson(body);
    let listr = [];
    for (let route of json.body.route) {
      listr.push(route.title);
    }
    res.send(listr);
  });
});


/**
 * @description Route get, obtains information about routes, stops and location of
 * each of them, with longitude and latitude
 * @route /api/route/{config}
 * @param {req} represents the (request)
 * @param {res} represents the (response)
 */
router.get('/Config', function (req, res) {
  request(urlConfig, function (err, response, body) {
    if (err) {
      return console.error(err);
    }
    const json = xmltoJson(body);
    let locationList = [];
    let data = {};
    for (let route of json.body.route) {
      if (route.title == 'LBUS-L Taraval Bus' || route.title == '1-California') {
        for (let location of route.stop) {
          location.route = route.title;
          locationList.push(location);
        }
        // break;
      }
    }
    res.send(locationList);
  })
});


/**
 * @description Route get, obtains information about a route, its stops and location
 * of each one of these
 * @route /api/route/config/{nameRoute} example value: LBUS-L Taraval Bus
 * @param {req} represents the (request)
 * @param {res} represents the (response)
 */
router.get('/Config/:nameRoute', function (req, res) {
  const nameRoute = req.params.nameRoute;
  request(urlConfig, function (err, response, body) {
    if (err) {
      return console.error(err);
    }
    const json = xmltoJson(body);
    let locationList = [];
    let data = {};
    for (let route of json.body.route) {
      if (route.title == nameRoute) {
        for (let location of route.stop) {
          locationList.push(location);
        }
        break;
      }
    }
    res.send(locationList);
  })
});


/**
 * @description Get route, obtains detailed information of a route specifying its id, 
 * how predition in the arrive
 * @route /api/routes/{id} expample value : 16622
 * @param {req} represents the (request)
 * @param {res} represents the (response)
 */
router.get('/:id', function (req, res) {

  const stopid = req.params.id;
  let listPredict = [];

    request(urlStopId + stopid, function (err, response, body) {
      if (err) {
      return console.error(err);
      }
      const json = xmltoJson(body);
      for (let preditions of json.body.predictions) {
          if (preditions.direction){
            let predic = preditions.direction[0].prediction;
            let stopTitle = preditions.stopTitle;
            for (let see of predic){
              listPredict.push({routeTitle: stopTitle[0], minutes: see.minutes[0], vehicle: see.vehicle[0]});
            }
          }
      }
      res.send(listPredict);
    });
});

module.exports = router;