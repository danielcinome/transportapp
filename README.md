# TransportApp

![](https://i.ibb.co/gdtmhjh/home.png)

## Background Context

### Departure Times

Create a service that gives real-time departure time for public transportation (use freely available public API). The app should geolocalize the user.

Here are some examples of freely available data:

-   [511](http://511.org/developer-resources_transit-api.asp)  (San Francisco)
-   [Nextbus](http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf)  (San Francisco)
-   [Transport for London Unified API](https://api.tfl.gov.uk/)  (London)

TransportApp is the application that allows you to consult the arrival time of public transport with respect to a bus stop.

For the development of the application use NodeJS with Express server side, choose to use the Nextbus API which provides information about public transportation in the city of San Francisco. Design an API to establish query paths and serve the required information, on the client side use HTML, CSS and Javascript.

As a first task I started with the documentation to understand the Nextbus API and know how to get the information, the response format was XML so as a first step I gave myself in the task of changing the XML format to JSON and that way I could manage the information. Then I started with the design of the API for the application so I could manage the data that I brought from the Nextbus queries, process the information that I was going to require and later serve it:

---
### API transportApp
| Path | Method | Description   |
|--|--|--|
| /api/routes | get | lists all route names  |
| /api/routes/config | get | provides information on routes, such as their location |
| /api/routes/Config/:nameRoute | get | lists all stops on a route, each with its id, name and location |
| /api/routes/:id | get | details the information of a stop, the next vehicle, time etc.  |
| /api/vehicles/:id | get | provides information about a bus such as its location and speed |
---
In the development of the API I had some challenges at the time of managing the information because I needed to structure it for requests that required only certain specific data.

Once ready most of the API, I started with the FrontEnd looking for how I could represent the geolocation, for that I found the mapbox API which allows to integrate maps to our applications, I made use of some styles for the design of the front and then I started to write the scritp to consult the API and represent those values in the map, when representing it I found several challenges since the data was disorganized and when drawing it the routes were not visible. I implemented several ways to organize it but some of the data was not very well represented so the best thing was to visualize the stops of the routes individually. Once I could visualize the stops I made the requests to get more detailed information and to visualize by clicking on each of them which route they belonged to, which was the next bus to arrive and how long.

![](https://i.ibb.co/zSLBZBc/card1.png)

## Author

- Daniel Chinome - [Github](https://github.com/danielcinome) / [Twitter](https://twitter.com/DanielChinome)
