// Create the map
var map = L.map('map').setView([0, 0], 2);

// Add the tile layer (you can use any other tile layer here)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; OpenStreetMap contributors'
}).addTo(map);

// Load the earthquake data (replace 'earthquakes.json' with your data source)
d3.json('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02').then(function(data) {
  // Process each earthquake data point
  data.features.forEach(function(feature) {
    var coordinates = feature.geometry.coordinates;
    var magnitude = feature.properties.mag;
    var depth = coordinates[2];

    // Determine the marker size based on magnitude
    var markerSize = Math.sqrt(magnitude) * 4;

    // Determine the marker color based on depth
    var markerColor = getColor(depth);

    // Create a marker with a popup
    var marker = L.circleMarker([coordinates[1], coordinates[0]], {
      radius: markerSize,
      fillColor: markerColor,
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map);

    // Create a popup with additional information
    var popupContent = "<b>Magnitude:</b> " + magnitude +
      "<br><b>Depth:</b> " + depth + " km";
    marker.bindPopup(popupContent);
  });
});

// Function to determine the marker color based on depth
function getColor(depth) {
  var colors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'];
  var breakpoints = [10, 30, 50, 70];

  for (var i = 0; i < breakpoints.length; i++) {
    if (depth < breakpoints[i]) {
      return colors[i];
    }
  }

  return colors[colors.length - 1];
}

// Create a legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'info legend');
  var breakpoints = [-10, 10, 30, 50, 70, 90];
  var labels = [];

  for (var i = 0; i < breakpoints.length; i++) {
    labels.push(
      '<i style="background:' + getColor(breakpoints[i]) + '"></i> ' +
      breakpoints[i] + (breakpoints[i + 1] ? '&ndash;' + breakpoints[i + 1] + ' km' : '+ km')
    );
  }

  div.innerHTML = labels.join('<br>');
  return div;
};
legend.addTo(map);