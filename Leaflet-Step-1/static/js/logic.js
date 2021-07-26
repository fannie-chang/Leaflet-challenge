// Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Adding tile layer
var tile_layer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});


var myMap = L.map("map", {
  center: [36.7783, -119.4179],
  zoom: 4

  
});

tile_layer.addTo(myMap);


// Grabbing our GeoJSON data..
d3.json(link).then(function(data) {

  function markerSize(mag) {
    return mag * 4;
  };
  
  function chooseSytle(feature) {
    return{
      opacity: 1,
      fillOpacity: 0.5,
      fillColor:getColor(feature.properties.mag),
      color: "white",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
      
    };
  }
  
  function getColor(mag) {
    switch (true) {
      case mag > 5:
        return "#DE3163";
      case mag > 4:
        return "#FF7F50";
      case mag > 3:
        return "#FFBF00";
      case mag > 2:
        return "#F7DC6F";
      case mag > 1:
        return "#DFFF00";
      default:
        return "#00FF00";
  };
}


// Create a circle and pass in some initial options
L.geoJson(data, {

  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng);
  },
  
  style: chooseSytle,

  onEachFeature: function(feature, layer) {

    layer.bindPopup("Magnitude:" + feature.properties.mag + "<hr> Location:" + feature.properties.place + "</h3>")
           
    }
}).addTo(myMap);

// Set up the legend
   
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        
        grades = [0, 1, 2, 3 ,4 ,5];
        labels = [];

    
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
         
  

  });
