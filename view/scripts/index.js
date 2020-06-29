$(document).ready(function () {

  // Use for request to API abot all routes
  async function allRoutes(){
    const url = 'http://127.0.0.1:5001/api/routes'
    const all = await $.get(url, (data) => {
      return data;
    })
  };

  // this variable is important for save data and represnt in of map
  var geojson = {
      "type": "FeatureCollection",
      "features": [
      ]
  };

  // Use for request to API and get data about geolocation and represent each  stop in the map
  // asigner parameter for save in data in geojson
  async function getData() {

    const resRoutes = await $.get('http://127.0.0.1:5001/api/routes/config', (data) => {
        return data;
    });
    for (let route of resRoutes) {
      let data = {
        "type": "Feature",
        "geometry": {
        "type": "Point",
        "coordinates": [route.lon[0], route.lat[0]]
        },
        "properties": {
        "phoneFormatted": "(202) 234-7336",
        "address": route.title,
        "city": "San Francisco",
        "country": "United States",
        "agencyTitle": route.route,
        "stopid": route.stopId,
        "state": "D.C."
        }
      };
      geojson.features.push(data);
    }
  };

  // this use for create card with the data save in geosjon and represent in the map
  async function process(){

    // call this function for get data and save in geojson
    await getData();

    // insert token generate with login in Mapbox
    // center initial ubication of map with of the lon and lat
    // insert style of map, this style can be changed at https://docs.mapbox.com/api/maps/#styles
    L.mapbox.accessToken ='pk.eyJ1IjoiZGFuaWVsY2hpbm9tZSIsImEiOiJja2J4dnhwOWMwbHFkMnFwN3EwamY0ZTd6In0.96QhIKHP2NI_7hwmRnRjYg';
    var map = L.mapbox.map('map')
    .setView([37.77493, -122.41942], 13)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
  
    // select the list container in the HTML
    var listings = document.getElementById('listings');
    var locations = L.mapbox.featureLayer().addTo(map);
      
    locations.setGeoJSON(geojson);
    
    function setActive(el) {
      var siblings = listings.getElementsByTagName('div');
      for (var i = 0; i < siblings.length; i++) {
        siblings[i].className = siblings[i].className
          .replace(/active/, '').replace(/\s\s*$/, '');
      }
      el.className += ' active';
    }
      

    locations.eachLayer(async function(locale) {
      const url = 'http://127.0.0.1:5001/api/routes/' + locale.feature.properties.stopid[0];
      let predition = await $.get(url, (data) => {
        return data;
      });

      // Shorten locale.feature.properties to `prop` so you don't
      // have to write this long form over and over again.
      var prop = locale.feature.properties;

      // Each marker on the map.
      // There are stops that do not have some parameters to avoid errors, so the condition
      if (predition.length != 0) {
        var popup = '<h3>Next Vehicles</h3>' +
                '<div>' +
                'Route: ' + predition[0].routeTitle     + '<br/>' +
                'Arrive Minutes: ' + predition[0].minutes + '<br/>' +
                'Vehicle: ' + predition[0].vehicle        + '</div>';
      } else {
        var popup = '<h3>Next Vehicles</h3>' +
                '<div>' +
                'Route: Not information <br/>' +
                'Arrive Minutes: Not information <br/>' +
                'Vehicle: Not information </div>';
      }
        
      var listing = listings.appendChild(document.createElement('div'));
      listing.className = 'item';
    
      var link = listing.appendChild(document.createElement('a'));
      link.href = '#';
      link.className = 'title';
    
      link.innerHTML = prop.address;
      if (prop.agencyTitle) {
        link.innerHTML += '<br /><small class="quiet">' + prop.agencyTitle + '</small>';
        popup += '<br /><small class="quiet">' + prop.agencyTitle + '</small>';
      }
        
      var details = listing.appendChild(document.createElement('div'));
      details.innerHTML = prop.city;
      if (prop.phone) {
        details.innerHTML += ' · ' + prop.phoneFormatted;
      }
    
      link.onclick = function() {
        setActive(listing);
    
        // When a menu item is clicked, animate the map to center
        // its associated locale and open its popup.
        map.setView(locale.getLatLng(), 16);
        locale.openPopup();
        return false;
      };
      // Marker interaction
      locale.on('click', function(e) {
        // center the map on the selected marker.
        map.panTo(locale.getLatLng());
    
        // Set active the markers associated listing.
        setActive(listing);
      });
    
      popup += '</div>';
      locale.bindPopup(popup);
    });
  };
  process();
});