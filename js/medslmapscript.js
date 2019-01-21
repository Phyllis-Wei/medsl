//CREATE BASE MAP
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhZXdvbiIsImEiOiJjamZkZnM4bWIxbHd6MnFtczd5ZzB2ZTZ6In0.MQIEVZpgr_c30i9WsjDYeQ';

var style = {
  "version": 8,
  "name": "blank",
  "sources": {
    "openmaptiles": {
      "type": "vector",
      "url": ""
    }
  },
  "layers": [{
    "id": "background",
    "type": "background",
    "paint": {
      "background-color": "#ffffff"
    }
  }]
};

var almap = new mapboxgl.Map({
    container: 'almap',
//    style: 'mapbox://styles/chaewon/cjg46tidb1so22so5ys332gyo',
    style: style,
    zoom: 1.75,
    center: [-149.493700, 64.000800],
});

var himap = new mapboxgl.Map({
    container: 'himap',
//    style: 'mapbox://styles/chaewon/cjg46tidb1so22so5ys332gyo',
    style: style,
    zoom: 4.5,
    center: [-157.6, 20.5],
});

var dcmap = new mapboxgl.Map({
    container: 'dcmap',
//    style: 'mapbox://styles/chaewon/cjg46tidb1so22so5ys332gyo',
    style: style,
    zoom: 8,
    center: [-77.036900, 38.907200],
});


var bounds = [
    [-140.57, 55.1], // Southeast coordinates
    [-70.86, 26.25]  // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map',
    style: style,
    zoom: 3.6,
    center: [-97.50,40.00],
//    maxBounds: bounds
});

var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
