// title of all datasets. the intex file
d3.csv("../data/index_county.csv", function(datasets) {
  var currentDataCode = "vap";
  var currentData = datasets[0];
  var years = currentData.years;
  var eachyear = years.split(", ");
  var currentyear = "2016";

  //year buttons
  eachyear.forEach(function(name){
    var li = document.createElement('BUTTON');
    li.innerHTML += name;
    li.className += 'year btn';
    li.id += name;
    document.getElementById('myList').appendChild(li);
    $('#2016').addClass("active");
  });

  var ddata = document.createElement('a');
  ddata.innerHTML = 'Download Data';
  ddata.className = 'btn download';
  ddata.href = '../data/county/c_'+currentDataCode+'.csv';
  ddata.download = '../data/county/c_'+currentDataCode+'.csv';
  document.getElementById('myList').appendChild(ddata);

  var ev = document.createElement('a');
  ev.innerHTML = 'Export View';
  ev.className = 'btn view';
  ev.href = '../img/export/c_'+currentDataCode+'_'+currentyear+'.png';
  ev.download = '../img/export/c_'+currentDataCode+'_'+currentyear+'.png';
  document.getElementById('myList').appendChild(ev);

//these are to make sure buttons work when dataset is changed
  $("#location").change(function() {
    var inityears = $('.year.active').attr('id');
    var initscale = $('.scale.active').attr('id');

    $( ".year" ).remove();
    $( ".view" ).remove();
    $( ".download" ).remove();

    var currentDataTitle = $('option:selected', this).html();
    $("#title").text(currentDataTitle);
    var currentData;
      for (var i in datasets){
          if (datasets[i].Title == currentDataTitle){
              currentData = datasets[i];
          }
        }

    var years = currentData.years;
    var eachyear = years.split(", ");

    //year buttons
    eachyear.forEach(function(name){
      var li = document.createElement('BUTTON');
      li.innerHTML += name;
      li.className += 'year btn';
      li.id += name;
      document.getElementById('myList').appendChild(li);
      $(document.getElementById(inityears)).addClass("active");
    });

      var ddata = document.createElement('a');
      ddata.innerHTML = 'Download Data';
      ddata.className = 'btn download';
      ddata.href = '../data/county/c_'+currentDataCode+'.csv';
      ddata.download = '../data/county/c_'+currentDataCode+'.csv';
      document.getElementById('myList').appendChild(ddata);

      var ev = document.createElement('a');
      ev.innerHTML = 'Export View';
      ev.className = 'btn view';
      ev.href = '../img/export/c_'+currentDataCode+'_'+inityears+'.png';
      ev.download = '../img/export/c_'+currentDataCode+'_'+inityears+'.png';
      document.getElementById('myList').appendChild(ev);

  });


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
 //   maxBounds: bounds
});

//reading default data
var query_csv = "../data/county/c_vap_wj.csv";
var q = d3.queue()
          q.defer(d3.csv, query_csv);
          q.await(dataDidLoad);

function dataDidLoad (error, data) {

  if (error) throw error;
//  console.log(data);

  //array in jenks
  var jenks = {};
  var rateById = {};

  //initial dataset to viz on load ////////////////////////////////////////////////////////
    //jenks-ing the data
    //2016
    data.forEach(function(d) {

      //because CSVs are stupid and will get rid of the 0 in front of a number in the state fips..
      if (d.GEOID.length == 4) {
        d.GEOID = "0" + d.GEOID;};

      d.jenks = d.jenks_2016;
      var j1_height = (d.jenksDomain_2016_2 - d.jenksDomain_2016_1) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
      var j2_height = (d.jenksDomain_2016_3 - d.jenksDomain_2016_2) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
      var j3_height = (d.jenksDomain_2016_4 - d.jenksDomain_2016_3) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
      var j4_height = (d.jenksDomain_2016_5 - d.jenksDomain_2016_4) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
      var j5_height = (d.jenksDomain_2016_6 - d.jenksDomain_2016_5) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
      $("#break-1").text(d.jenksDomain_2016_1+" - "+d.jenksDomain_2016_2);
      $("#break-2").text(d.jenksDomain_2016_2+" - "+d.jenksDomain_2016_3);
      $("#break-3").text(d.jenksDomain_2016_3+" - "+d.jenksDomain_2016_4);
      $("#break-4").text(d.jenksDomain_2016_4+" - "+d.jenksDomain_2016_5);
      $("#break-5").text(d.jenksDomain_2016_5+" - "+d.jenksDomain_2016_6);
      $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
      $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
      $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
      $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
      $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

    });
 //console.log(data);

   // First value is the default, used where the is no data
   var timestamp = new Date() / 1000; // just so we can see the same layer over and over
   var layerName = "lite_county-4a9o9r";
   var vtMatchProp = "GEOID";
   var dataMatchProp = "GEOID";
   var dataStyleProp = "jenks";
   var source = "vap" + timestamp;
   var targetdata = "year_2016";

   // Add source for state polygons hosted by OVRDC Node JS Tileserver
  map.addSource(source, {
     type: "vector",
     url: "mapbox://chaewon.6lswbgay"
   });

   var stops = "rgba(255, 255, 255, 1)";
   var newData = data.map(function(county) {
     var jenks = county.jenks;

     function colorScale(a){
       if (isNaN(a)=== true){
        return "#d3d3d3"
         } else {
       return "rgba(" + 250 + ", " + (200 - a*33) + ", " + 0 + ", 1)";
        }
     }

     var color = colorScale(jenks);
     var id = county[dataMatchProp];
     var sid = id.toString();

     return [sid, color]
   });

//   console.log(newData);
   // Add layer for the contiental states
   map.addLayer({
     "id": "joined-data",
     "type": "fill",
     "source": source,
     "source-layer": layerName,
     "paint": {
       "fill-color": {
         "property": vtMatchProp,
         "type": "categorical",
         "stops": newData
       },
       "fill-opacity": 1,
       "fill-outline-color": "rgba(255, 255, 255, 1)",
     }
   });

   //state boundary
   var bosource = "bo" + timestamp;
   map.addSource(bosource, {
      type: "vector",
      url: "mapbox://chaewon.4k0t5ilf"
    });

   map.addLayer({
     "id": "state-boundaries",
     'type': 'line',
     "source": bosource,
     "source-layer": "0314_Joined_State-7x9at9",
     "paint": {
       "line-color": "rgba(255, 255, 255, 1)",
       "line-width": 1
     }
   });

   //Alaska
   var alsource = "al" + timestamp;
   almap.addSource(alsource, {
      type: "vector",
      url: "mapbox://chaewon.duh911d2"
    });

   almap.addLayer({
     "id": "joined-data",
     "type": "fill",
     "source": alsource,
     "source-layer": "AL-county-7kvm3a",
     "paint": {
       "fill-color": {
         "property": vtMatchProp,
         "type": "categorical",
         "stops": newData
       },
       "fill-opacity": 1,
       "fill-outline-color": "rgba(255, 255, 255, 1)",
     }
   });

   //Hawaii
   var hisource = "hi" + timestamp;
   himap.addSource(hisource, {
      type: "vector",
      url: "mapbox://chaewon.ca9j0kuy"
    });

   himap.addLayer({
     "id": "joined-data",
     "type": "fill",
     "source": hisource,
     "source-layer": "HI-county-60my81",
     "paint": {
       "fill-color": {
         "property": vtMatchProp,
         "type": "categorical",
         "stops": newData
       },
       "fill-opacity": 1,
       "fill-outline-color": "rgba(255, 255, 255, 1)",
     }
   });

   //DC
   var dcsource = "dc" + timestamp;
   dcmap.addSource(dcsource, {
      type: "vector",
      url: "mapbox://chaewon.98e9zsku"
    });

   dcmap.addLayer({
     "id": "joined-data",
     "type": "fill",
     "source": dcsource,
     "source-layer": "DC-county-4uqyqb",
     "paint": {
       "fill-color": {
         "property": vtMatchProp,
         "type": "categorical",
         "stops": newData
       },
       "fill-opacity": 1,
       "fill-outline-color": "rgba(255, 255, 255, 1)",
     }
   });

// changes on click for the years! ////////////////////////////////////////////////////////
    $(function(){
     $('.year').click(function () {
        $('.year').removeClass("active");
        $(this).addClass("active");
        var thisyear = parseInt($(".year.active").attr('id'));
        var currentDataTitle = $('#location').val();

        var currentData;
          for (var i in datasets){
              if (datasets[i].Title == currentDataTitle){
                  currentData = datasets[i];
              }
            }
        $( ".view" ).remove();

        var ev = document.createElement('a');
        ev.innerHTML = 'Export View';
        ev.className = 'btn view';
        ev.href = '../img/export/c_'+currentDataCode+'_'+thisyear+'.png';
        ev.download = '../img/export/c_'+currentDataCode+'_'+thisyear+'.png';
        document.getElementById('myList').appendChild(ev);

       data.forEach(function (d) {
         if (thisyear == "2016") {
           d.jenks = d.jenks_2016;
           var j1_height = (d.jenksDomain_2016_2 - d.jenksDomain_2016_1) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
           var j2_height = (d.jenksDomain_2016_3 - d.jenksDomain_2016_2) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
           var j3_height = (d.jenksDomain_2016_4 - d.jenksDomain_2016_3) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
           var j4_height = (d.jenksDomain_2016_5 - d.jenksDomain_2016_4) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
           var j5_height = (d.jenksDomain_2016_6 - d.jenksDomain_2016_5) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
           $("#break-1").text(d.jenksDomain_2016_1+" - "+d.jenksDomain_2016_2);
           $("#break-2").text(d.jenksDomain_2016_2+" - "+d.jenksDomain_2016_3);
           $("#break-3").text(d.jenksDomain_2016_3+" - "+d.jenksDomain_2016_4);
           $("#break-4").text(d.jenksDomain_2016_4+" - "+d.jenksDomain_2016_5);
           $("#break-5").text(d.jenksDomain_2016_5+" - "+d.jenksDomain_2016_6);
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

         } else if (thisyear == "2014") {
           d.jenks = d.jenks_2014;
           var j1_height = (d.jenksDomain_2014_2 - d.jenksDomain_2014_1) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
           var j2_height = (d.jenksDomain_2014_3 - d.jenksDomain_2014_2) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
           var j3_height = (d.jenksDomain_2014_4 - d.jenksDomain_2014_3) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
           var j4_height = (d.jenksDomain_2014_5 - d.jenksDomain_2014_4) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
           var j5_height = (d.jenksDomain_2014_6 - d.jenksDomain_2014_5) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
           $("#break-1").text(d.jenksDomain_2014_1+" - "+d.jenksDomain_2014_2);
           $("#break-2").text(d.jenksDomain_2014_2+" - "+d.jenksDomain_2014_3);
           $("#break-3").text(d.jenksDomain_2014_3+" - "+d.jenksDomain_2014_4);
           $("#break-4").text(d.jenksDomain_2014_4+" - "+d.jenksDomain_2014_5);
           $("#break-5").text(d.jenksDomain_2014_5+" - "+d.jenksDomain_2014_6);
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2012") {
           d.jenks = d.jenks_2012;
           var j1_height = (d.jenksDomain_2012_2 - d.jenksDomain_2012_1) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
           var j2_height = (d.jenksDomain_2012_3 - d.jenksDomain_2012_2) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
           var j3_height = (d.jenksDomain_2012_4 - d.jenksDomain_2012_3) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
           var j4_height = (d.jenksDomain_2012_5 - d.jenksDomain_2012_4) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
           var j5_height = (d.jenksDomain_2012_6 - d.jenksDomain_2012_5) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
           $("#break-1").text(d.jenksDomain_2012_1+" - "+d.jenksDomain_2012_2);
           $("#break-2").text(d.jenksDomain_2012_2+" - "+d.jenksDomain_2012_3);
           $("#break-3").text(d.jenksDomain_2012_3+" - "+d.jenksDomain_2012_4);
           $("#break-4").text(d.jenksDomain_2012_4+" - "+d.jenksDomain_2012_5);
           $("#break-5").text(d.jenksDomain_2012_5+" - "+d.jenksDomain_2012_6);
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2010") {
           d.jenks = d.jenks_2010;
           var j1_height = (d.jenksDomain_2010_2 - d.jenksDomain_2010_1) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
           var j2_height = (d.jenksDomain_2010_3 - d.jenksDomain_2010_2) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
           var j3_height = (d.jenksDomain_2010_4 - d.jenksDomain_2010_3) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
           var j4_height = (d.jenksDomain_2010_5 - d.jenksDomain_2010_4) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
           var j5_height = (d.jenksDomain_2010_6 - d.jenksDomain_2010_5) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
           $("#break-1").text(d.jenksDomain_2010_1+" - "+d.jenksDomain_2010_2);
           $("#break-2").text(d.jenksDomain_2010_2+" - "+d.jenksDomain_2010_3);
           $("#break-3").text(d.jenksDomain_2010_3+" - "+d.jenksDomain_2010_4);
           $("#break-4").text(d.jenksDomain_2010_4+" - "+d.jenksDomain_2010_5);
           $("#break-5").text(d.jenksDomain_2010_5+" - "+d.jenksDomain_2010_6);
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2008") {
           d.jenks = d.jenks_2008;
           var j1_height = (d.jenksDomain_2008_2 - d.jenksDomain_2008_1) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
           var j2_height = (d.jenksDomain_2008_3 - d.jenksDomain_2008_2) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
           var j3_height = (d.jenksDomain_2008_4 - d.jenksDomain_2008_3) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
           var j4_height = (d.jenksDomain_2008_5 - d.jenksDomain_2008_4) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
           var j5_height = (d.jenksDomain_2008_6 - d.jenksDomain_2008_5) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
           $("#break-1").text(d.jenksDomain_2008_1+" - "+d.jenksDomain_2008_2);
           $("#break-2").text(d.jenksDomain_2008_2+" - "+d.jenksDomain_2008_3);
           $("#break-3").text(d.jenksDomain_2008_3+" - "+d.jenksDomain_2008_4);
           $("#break-4").text(d.jenksDomain_2008_4+" - "+d.jenksDomain_2008_5);
           $("#break-5").text(d.jenksDomain_2008_5+" - "+d.jenksDomain_2008_6);
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2004") {
           d.jenks = d.jenks_2004;
           var j1_height = (d.jenksDomain_2004_2 - d.jenksDomain_2004_1) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
           var j2_height = (d.jenksDomain_2004_3 - d.jenksDomain_2004_2) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
           var j3_height = (d.jenksDomain_2004_4 - d.jenksDomain_2004_3) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
           var j4_height = (d.jenksDomain_2004_5 - d.jenksDomain_2004_4) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
           var j5_height = (d.jenksDomain_2004_6 - d.jenksDomain_2004_5) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
           $("#break-1").text(d.jenksDomain_2004_1+" - "+d.jenksDomain_2004_2);
           $("#break-2").text(d.jenksDomain_2004_2+" - "+d.jenksDomain_2004_3);
           $("#break-3").text(d.jenksDomain_2004_3+" - "+d.jenksDomain_2004_4);
           $("#break-4").text(d.jenksDomain_2004_4+" - "+d.jenksDomain_2004_5);
           $("#break-5").text(d.jenksDomain_2004_5+" - "+d.jenksDomain_2004_6);
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2000") {
           d.jenks = d.jenks_2000;
           var j1_height = (d.jenksDomain_2000_2 - d.jenksDomain_2000_1) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
           var j2_height = (d.jenksDomain_2000_3 - d.jenksDomain_2000_2) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
           var j3_height = (d.jenksDomain_2000_4 - d.jenksDomain_2000_3) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
           var j4_height = (d.jenksDomain_2000_5 - d.jenksDomain_2000_4) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
           var j5_height = (d.jenksDomain_2000_6 - d.jenksDomain_2000_5) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
           $("#break-1").text(d.jenksDomain_2000_1+" - "+d.jenksDomain_2000_2);
           $("#break-2").text(d.jenksDomain_2000_2+" - "+d.jenksDomain_2000_3);
           $("#break-3").text(d.jenksDomain_2000_3+" - "+d.jenksDomain_2000_4);
           $("#break-4").text(d.jenksDomain_2000_4+" - "+d.jenksDomain_2000_5);
           $("#break-5").text(d.jenksDomain_2000_5+" - "+d.jenksDomain_2000_6);
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         };
       });
       console.log(data);

      // First value is the default, used where the is no data
      var stops = "rgba(255, 255, 255, 1)";
      var newData = data.map(function(county) {
        var jenks = county.jenks;

        function colorScale(a){
          if (isNaN(a)=== true){
           return "#d3d3d3"
            } else {
          return "rgba(" + 250 + ", " + (200 - a*33) + ", " + 0 + ", 1)";
           }
        }

       var color = colorScale(jenks);
        var id = county[dataMatchProp];
        var sid = id.toString();
        return [sid, color]
      });

      console.log(newData);
      // Add layer from the vector tile source with data-driven style
      map.addLayer({
        "id": "joined-data",
        "type": "fill",
        "source": source,
        "source-layer": layerName,
        "paint": {
          "fill-color": {
            "property": vtMatchProp,
            "type": "categorical",
            "stops": newData
          },
          "fill-opacity": 1,
          "fill-outline-color": "rgba(255, 255, 255, 1)"
        }
      });
      //state boundary
      map.addLayer({
        "id": "state-boundaries",
        'type': 'line',
        "source": bosource,
        "source-layer": "0314_Joined_State-7x9at9",
        "paint": {
          "line-color": "rgba(255, 255, 255, 1)",
          "line-width": 1
        }
      });

      //Alaska
      almap.addLayer({
        "id": "joined-data",
        "type": "fill",
        "source": alsource,
        "source-layer": "AL-county-7kvm3a",
        "paint": {
          "fill-color": {
            "property": vtMatchProp,
            "type": "categorical",
            "stops": newData
          },
          "fill-opacity": 1,
          "fill-outline-color": "rgba(255, 255, 255, 1)",
        }
      });

      //Hawaii
      himap.addLayer({
        "id": "joined-data",
        "type": "fill",
        "source": hisource,
        "source-layer": "HI-county-60my81",
        "paint": {
          "fill-color": {
            "property": vtMatchProp,
            "type": "categorical",
            "stops": newData
          },
          "fill-opacity": 1,
          "fill-outline-color": "rgba(255, 255, 255, 1)",
        }
      });

      //DC
      dcmap.addLayer({
        "id": "joined-data",
        "type": "fill",
        "source": dcsource,
        "source-layer": "DC-county-4uqyqb",
        "paint": {
          "fill-color": {
            "property": vtMatchProp,
            "type": "categorical",
            "stops": newData
          },
          "fill-opacity": 1,
          "fill-outline-color": "rgba(255, 255, 255, 1)",
        }
      });

  });
});
};

map.on('style.load', function() {

// title of all datasets. the intex file
d3.csv("../data/index_county.csv", function(datasets) {
//dropdown
jQuery(function($) {
   var datasets = {
       'Demographics': ['Voting-age population (VAP)', 'Voting-eligible population (VEP)','Racial demographics of voting-age population (percentage Black)','Racial demographics of voting-age population (percentage Hispanic)'],
       'Election Returns': ['Votes cast for recent federal and statewide office (democratic)', 'Votes cast for recent federal and statewide office (republican)','Votes cast for recent federal and statewide office (other)'],
       'Administration': ['Turnout by voting mode (in-person on election day)','Turnout by voting mode (in-person early)','Turnout by voting mode (mail)','Turnout by voting mode (Other)','UOCAVA ballots cast']
   }
   var $datasets = $('#location');
   $('#country').change(function () {
       var country = $(this).val(), vals = datasets[country] || [];
       var html = $.map(vals, function(val){
           return '<option value="' + val + '">' + val + '</option>'
       }).join('');
       $datasets.html(html)
   });
});

//dropdown + csv read conection
var previousData;
var currentDataCode = "vap";
var currentData;
  for (var i in datasets){
    if (datasets[i] == currentDataCode){
      currentData = datasets[i];
    }
  }
var currentDataTitle = $('#location').val();

$(document).ready(function selectData() {
    $("#location").change(function() {
      var currentDataTitle = $('option:selected', this).html();
      $("#title").text(currentDataTitle);
      var currentData;
        for (var i in datasets){
            if (datasets[i].Title == currentDataTitle){
                currentData = datasets[i];
            }
          }
      $("#url").text(currentData.Source);

      var thisyear = parseInt($(".year.active").attr('id'));
      var currentDataTitle = $('#location').val();

      var currentDataCode = currentData.Code;

      $( ".view" ).remove();

      var ev = document.createElement('a');
      ev.innerHTML = 'Export View';
      ev.className = 'btn view';
      ev.href = '../img/export/c_'+currentDataCode+'_'+thisyear+'.png';
      ev.download = '../img/export/c_'+currentDataCode+'_'+thisyear+'.png';
      document.getElementById('myList').appendChild(ev);

      var query_csv = "../data/county/c_"+currentData.Code+"_wj.csv";
      var q = d3.queue()
                q.defer(d3.csv, query_csv);
                q.await(dataDidLoad);

      function dataDidLoad (error, data) {
        if (error) throw error;

        //array in jenks
        var jenks = {};
        var rateById = {};
        console.log(data);

        //initial dataset to viz on load
        var thisyear = parseInt($(".year.active").attr('id'));

        var currentlayername = "jenks_"+thisyear;
        console.log(thisyear);
        console.log(data);
        data.forEach(function(d) {
          //because CSVs are stupid and will get rid of the 0 in front of a number in the state fips..
          if (d.GEOID.length == 4) {
            d.GEOID = "0" + d.GEOID;};

          if (thisyear == "2016") {
            d.jenks = d.jenks_2016;
            var j1_height = (d.jenksDomain_2016_2 - d.jenksDomain_2016_1) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
            var j2_height = (d.jenksDomain_2016_3 - d.jenksDomain_2016_2) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
            var j3_height = (d.jenksDomain_2016_4 - d.jenksDomain_2016_3) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
            var j4_height = (d.jenksDomain_2016_5 - d.jenksDomain_2016_4) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
            var j5_height = (d.jenksDomain_2016_6 - d.jenksDomain_2016_5) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
            $("#break-1").text(d.jenksDomain_2016_1+" - "+d.jenksDomain_2016_2);
            $("#break-2").text(d.jenksDomain_2016_2+" - "+d.jenksDomain_2016_3);
            $("#break-3").text(d.jenksDomain_2016_3+" - "+d.jenksDomain_2016_4);
            $("#break-4").text(d.jenksDomain_2016_4+" - "+d.jenksDomain_2016_5);
            $("#break-5").text(d.jenksDomain_2016_5+" - "+d.jenksDomain_2016_6);
            $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
            $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
            $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
            $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
            $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

          } else if (thisyear == "2014") {
            d.jenks = d.jenks_2014;
            var j1_height = (d.jenksDomain_2014_2 - d.jenksDomain_2014_1) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
            var j2_height = (d.jenksDomain_2014_3 - d.jenksDomain_2014_2) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
            var j3_height = (d.jenksDomain_2014_4 - d.jenksDomain_2014_3) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
            var j4_height = (d.jenksDomain_2014_5 - d.jenksDomain_2014_4) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
            var j5_height = (d.jenksDomain_2014_6 - d.jenksDomain_2014_5) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
            $("#break-1").text(d.jenksDomain_2014_1+" - "+d.jenksDomain_2014_2);
            $("#break-2").text(d.jenksDomain_2014_2+" - "+d.jenksDomain_2014_3);
            $("#break-3").text(d.jenksDomain_2014_3+" - "+d.jenksDomain_2014_4);
            $("#break-4").text(d.jenksDomain_2014_4+" - "+d.jenksDomain_2014_5);
            $("#break-5").text(d.jenksDomain_2014_5+" - "+d.jenksDomain_2014_6);
            $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
            $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
            $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
            $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
            $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
          } else if (thisyear == "2012") {
            d.jenks = d.jenks_2012;
            var j1_height = (d.jenksDomain_2012_2 - d.jenksDomain_2012_1) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
            var j2_height = (d.jenksDomain_2012_3 - d.jenksDomain_2012_2) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
            var j3_height = (d.jenksDomain_2012_4 - d.jenksDomain_2012_3) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
            var j4_height = (d.jenksDomain_2012_5 - d.jenksDomain_2012_4) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
            var j5_height = (d.jenksDomain_2012_6 - d.jenksDomain_2012_5) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
            $("#break-1").text(d.jenksDomain_2012_1+" - "+d.jenksDomain_2012_2);
            $("#break-2").text(d.jenksDomain_2012_2+" - "+d.jenksDomain_2012_3);
            $("#break-3").text(d.jenksDomain_2012_3+" - "+d.jenksDomain_2012_4);
            $("#break-4").text(d.jenksDomain_2012_4+" - "+d.jenksDomain_2012_5);
            $("#break-5").text(d.jenksDomain_2012_5+" - "+d.jenksDomain_2012_6);
            $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
            $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
            $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
            $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
            $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
          } else if (thisyear == "2010") {
            d.jenks = d.jenks_2010;
            var j1_height = (d.jenksDomain_2010_2 - d.jenksDomain_2010_1) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
            var j2_height = (d.jenksDomain_2010_3 - d.jenksDomain_2010_2) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
            var j3_height = (d.jenksDomain_2010_4 - d.jenksDomain_2010_3) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
            var j4_height = (d.jenksDomain_2010_5 - d.jenksDomain_2010_4) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
            var j5_height = (d.jenksDomain_2010_6 - d.jenksDomain_2010_5) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
            $("#break-1").text(d.jenksDomain_2010_1+" - "+d.jenksDomain_2010_2);
            $("#break-2").text(d.jenksDomain_2010_2+" - "+d.jenksDomain_2010_3);
            $("#break-3").text(d.jenksDomain_2010_3+" - "+d.jenksDomain_2010_4);
            $("#break-4").text(d.jenksDomain_2010_4+" - "+d.jenksDomain_2010_5);
            $("#break-5").text(d.jenksDomain_2010_5+" - "+d.jenksDomain_2010_6);
            $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
            $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
            $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
            $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
            $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
          } else if (thisyear == "2008") {
            d.jenks = d.jenks_2008;
            var j1_height = (d.jenksDomain_2008_2 - d.jenksDomain_2008_1) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
            var j2_height = (d.jenksDomain_2008_3 - d.jenksDomain_2008_2) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
            var j3_height = (d.jenksDomain_2008_4 - d.jenksDomain_2008_3) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
            var j4_height = (d.jenksDomain_2008_5 - d.jenksDomain_2008_4) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
            var j5_height = (d.jenksDomain_2008_6 - d.jenksDomain_2008_5) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
            $("#break-1").text(d.jenksDomain_2008_1+" - "+d.jenksDomain_2008_2);
            $("#break-2").text(d.jenksDomain_2008_2+" - "+d.jenksDomain_2008_3);
            $("#break-3").text(d.jenksDomain_2008_3+" - "+d.jenksDomain_2008_4);
            $("#break-4").text(d.jenksDomain_2008_4+" - "+d.jenksDomain_2008_5);
            $("#break-5").text(d.jenksDomain_2008_5+" - "+d.jenksDomain_2008_6);
            $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
            $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
            $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
            $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
            $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
          } else if (thisyear == "2004") {
            d.jenks = d.jenks_2004;
            var j1_height = (d.jenksDomain_2004_2 - d.jenksDomain_2004_1) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
            var j2_height = (d.jenksDomain_2004_3 - d.jenksDomain_2004_2) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
            var j3_height = (d.jenksDomain_2004_4 - d.jenksDomain_2004_3) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
            var j4_height = (d.jenksDomain_2004_5 - d.jenksDomain_2004_4) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
            var j5_height = (d.jenksDomain_2004_6 - d.jenksDomain_2004_5) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
            $("#break-1").text(d.jenksDomain_2004_1+" - "+d.jenksDomain_2004_2);
            $("#break-2").text(d.jenksDomain_2004_2+" - "+d.jenksDomain_2004_3);
            $("#break-3").text(d.jenksDomain_2004_3+" - "+d.jenksDomain_2004_4);
            $("#break-4").text(d.jenksDomain_2004_4+" - "+d.jenksDomain_2004_5);
            $("#break-5").text(d.jenksDomain_2004_5+" - "+d.jenksDomain_2004_6);
            $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
            $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
            $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
            $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
            $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
          } else if (thisyear == "2000") {
            d.jenks = d.jenks_2000;
            var j1_height = (d.jenksDomain_2000_2 - d.jenksDomain_2000_1) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
            var j2_height = (d.jenksDomain_2000_3 - d.jenksDomain_2000_2) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
            var j3_height = (d.jenksDomain_2000_4 - d.jenksDomain_2000_3) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
            var j4_height = (d.jenksDomain_2000_5 - d.jenksDomain_2000_4) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
            var j5_height = (d.jenksDomain_2000_6 - d.jenksDomain_2000_5) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
            $("#break-1").text(d.jenksDomain_2000_1+" - "+d.jenksDomain_2000_2);
            $("#break-2").text(d.jenksDomain_2000_2+" - "+d.jenksDomain_2000_3);
            $("#break-3").text(d.jenksDomain_2000_3+" - "+d.jenksDomain_2000_4);
            $("#break-4").text(d.jenksDomain_2000_4+" - "+d.jenksDomain_2000_5);
            $("#break-5").text(d.jenksDomain_2000_5+" - "+d.jenksDomain_2000_6);
            $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
            $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
            $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
            $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
            $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
          };
      });
       console.log(data);

      // First value is the default, used where the is no data
      var timestamp = new Date() / 1000; // just so we can see the same layer over and over
      var layerName = "lite_county-4a9o9r";
      var vtMatchProp = "GEOID";
      var dataMatchProp = "GEOID";
      var dataStyleProp = currentlayername;
      var source = currentData.Code + timestamp;

      // Add source for state polygons hosted by OVRDC Node JS Tileserver
     map.addSource(source, {
        type: "vector",
        url: "mapbox://chaewon.6lswbgay"
      });

      var stops = "rgba(255, 255, 255, 1)";
      var newData = data.map(function(county) {
        var jenks = county.jenks;

        function colorScale(a){
          if (isNaN(a)=== true){
           return "#d3d3d3"
            } else {
          return "rgba(" + 250 + ", " + (200 - a*33) + ", " + 0 + ", 1)";
           }
        }

        var color = colorScale(jenks);
        var id = county[dataMatchProp];
        var sid = id.toString();
        return [sid, color]
      });

      console.log(newData);
      // Add layer from the vector tile source with data-driven style
      map.addLayer({
        "id": "joined-data",
        "type": "fill",
        "source": source,
        "source-layer": layerName,
        "paint": {
          "fill-color": {
            "property": vtMatchProp,
            "type": "categorical",
            "stops": newData
          },
          "fill-opacity": 1,
          "fill-outline-color": "rgba(255, 255, 255, 1)"
        }
      });
      //state boundary
      var bosource = "bo" + timestamp;
      map.addSource(bosource, {
         type: "vector",
         url: "mapbox://chaewon.4k0t5ilf"
       });

      map.addLayer({
        "id": "state-boundaries",
        'type': 'line',
        "source": bosource,
        "source-layer": "0314_Joined_State-7x9at9",
        "paint": {
          "line-color": "rgba(255, 255, 255, 1)",
          "line-width": 1
        }
      });

      //Alaska
      var alsource = "al" + timestamp;
      almap.addSource(alsource, {
         type: "vector",
         url: "mapbox://chaewon.duh911d2"
       });

      almap.addLayer({
        "id": "joined-data",
        "type": "fill",
        "source": alsource,
        "source-layer": "AL-county-7kvm3a",
        "paint": {
          "fill-color": {
            "property": vtMatchProp,
            "type": "categorical",
            "stops": newData
          },
          "fill-opacity": 1,
          "fill-outline-color": "rgba(255, 255, 255, 1)",
        }
      });

      //Hawaii
      var hisource = "hi" + timestamp;
      himap.addSource(hisource, {
         type: "vector",
         url: "mapbox://chaewon.ca9j0kuy"
       });

      himap.addLayer({
        "id": "joined-data",
        "type": "fill",
        "source": hisource,
        "source-layer": "HI-county-60my81",
        "paint": {
          "fill-color": {
            "property": vtMatchProp,
            "type": "categorical",
            "stops": newData
          },
          "fill-opacity": 1,
          "fill-outline-color": "rgba(255, 255, 255, 1)",
        }
      });

      //DC
      var dcsource = "dc" + timestamp;
      dcmap.addSource(dcsource, {
         type: "vector",
         url: "mapbox://chaewon.98e9zsku"
       });

      dcmap.addLayer({
        "id": "joined-data",
        "type": "fill",
        "source": dcsource,
        "source-layer": "DC-county-4uqyqb",
        "paint": {
          "fill-color": {
            "property": vtMatchProp,
            "type": "categorical",
            "stops": newData
          },
          "fill-opacity": 1,
          "fill-outline-color": "rgba(255, 255, 255, 1)",
        }
      });

       //button for years
       $(function(){
       	$('.year').click(function () {
       		$('.year').removeClass("active");
       		$(this).addClass("active");
           var thisyear = parseInt(this.id);
           var currentlayername = "jenks_"+thisyear;
           console.log(currentlayername);

           var currentDataTitle = $('#location').val();
           var currentData;
             for (var i in datasets){
                 if (datasets[i].Title == currentDataTitle){
                     currentData = datasets[i];
                 }
               }
           $( ".view" ).remove();

           var ev = document.createElement('a');
           ev.innerHTML = 'Export View';
           ev.className = 'btn view';
           ev.href = '../img/export/c_'+currentDataCode+'_'+thisyear+'.png';
           ev.download = '../img/export/c_'+currentDataCode+'_'+thisyear+'.png';
           document.getElementById('myList').appendChild(ev);

          data.forEach(function (d) {
            if (thisyear == "2016") {
              d.jenks = d.jenks_2016;
              var j1_height = (d.jenksDomain_2016_2 - d.jenksDomain_2016_1) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
              var j2_height = (d.jenksDomain_2016_3 - d.jenksDomain_2016_2) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
              var j3_height = (d.jenksDomain_2016_4 - d.jenksDomain_2016_3) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
              var j4_height = (d.jenksDomain_2016_5 - d.jenksDomain_2016_4) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
              var j5_height = (d.jenksDomain_2016_6 - d.jenksDomain_2016_5) / (d.jenksDomain_2016_6 - d.jenksDomain_2016_1) * 100;
              $("#break-1").text(d.jenksDomain_2016_1+" - "+d.jenksDomain_2016_2);
              $("#break-2").text(d.jenksDomain_2016_2+" - "+d.jenksDomain_2016_3);
              $("#break-3").text(d.jenksDomain_2016_3+" - "+d.jenksDomain_2016_4);
              $("#break-4").text(d.jenksDomain_2016_4+" - "+d.jenksDomain_2016_5);
              $("#break-5").text(d.jenksDomain_2016_5+" - "+d.jenksDomain_2016_6);
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

            } else if (thisyear == "2014") {
              d.jenks = d.jenks_2014;
              var j1_height = (d.jenksDomain_2014_2 - d.jenksDomain_2014_1) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
              var j2_height = (d.jenksDomain_2014_3 - d.jenksDomain_2014_2) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
              var j3_height = (d.jenksDomain_2014_4 - d.jenksDomain_2014_3) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
              var j4_height = (d.jenksDomain_2014_5 - d.jenksDomain_2014_4) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
              var j5_height = (d.jenksDomain_2014_6 - d.jenksDomain_2014_5) / (d.jenksDomain_2014_6 - d.jenksDomain_2014_1) * 100;
              $("#break-1").text(d.jenksDomain_2014_1+" - "+d.jenksDomain_2014_2);
              $("#break-2").text(d.jenksDomain_2014_2+" - "+d.jenksDomain_2014_3);
              $("#break-3").text(d.jenksDomain_2014_3+" - "+d.jenksDomain_2014_4);
              $("#break-4").text(d.jenksDomain_2014_4+" - "+d.jenksDomain_2014_5);
              $("#break-5").text(d.jenksDomain_2014_5+" - "+d.jenksDomain_2014_6);
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
            } else if (thisyear == "2012") {
              d.jenks = d.jenks_2012;
              var j1_height = (d.jenksDomain_2012_2 - d.jenksDomain_2012_1) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
              var j2_height = (d.jenksDomain_2012_3 - d.jenksDomain_2012_2) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
              var j3_height = (d.jenksDomain_2012_4 - d.jenksDomain_2012_3) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
              var j4_height = (d.jenksDomain_2012_5 - d.jenksDomain_2012_4) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
              var j5_height = (d.jenksDomain_2012_6 - d.jenksDomain_2012_5) / (d.jenksDomain_2012_6 - d.jenksDomain_2012_1) * 100;
              $("#break-1").text(d.jenksDomain_2012_1+" - "+d.jenksDomain_2012_2);
              $("#break-2").text(d.jenksDomain_2012_2+" - "+d.jenksDomain_2012_3);
              $("#break-3").text(d.jenksDomain_2012_3+" - "+d.jenksDomain_2012_4);
              $("#break-4").text(d.jenksDomain_2012_4+" - "+d.jenksDomain_2012_5);
              $("#break-5").text(d.jenksDomain_2012_5+" - "+d.jenksDomain_2012_6);
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
            } else if (thisyear == "2010") {
              d.jenks = d.jenks_2010;
              var j1_height = (d.jenksDomain_2010_2 - d.jenksDomain_2010_1) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
              var j2_height = (d.jenksDomain_2010_3 - d.jenksDomain_2010_2) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
              var j3_height = (d.jenksDomain_2010_4 - d.jenksDomain_2010_3) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
              var j4_height = (d.jenksDomain_2010_5 - d.jenksDomain_2010_4) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
              var j5_height = (d.jenksDomain_2010_6 - d.jenksDomain_2010_5) / (d.jenksDomain_2010_6 - d.jenksDomain_2010_1) * 100;
              $("#break-1").text(d.jenksDomain_2010_1+" - "+d.jenksDomain_2010_2);
              $("#break-2").text(d.jenksDomain_2010_2+" - "+d.jenksDomain_2010_3);
              $("#break-3").text(d.jenksDomain_2010_3+" - "+d.jenksDomain_2010_4);
              $("#break-4").text(d.jenksDomain_2010_4+" - "+d.jenksDomain_2010_5);
              $("#break-5").text(d.jenksDomain_2010_5+" - "+d.jenksDomain_2010_6);
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
            } else if (thisyear == "2008") {
              d.jenks = d.jenks_2008;
              var j1_height = (d.jenksDomain_2008_2 - d.jenksDomain_2008_1) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
              var j2_height = (d.jenksDomain_2008_3 - d.jenksDomain_2008_2) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
              var j3_height = (d.jenksDomain_2008_4 - d.jenksDomain_2008_3) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
              var j4_height = (d.jenksDomain_2008_5 - d.jenksDomain_2008_4) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
              var j5_height = (d.jenksDomain_2008_6 - d.jenksDomain_2008_5) / (d.jenksDomain_2008_6 - d.jenksDomain_2008_1) * 100;
              $("#break-1").text(d.jenksDomain_2008_1+" - "+d.jenksDomain_2008_2);
              $("#break-2").text(d.jenksDomain_2008_2+" - "+d.jenksDomain_2008_3);
              $("#break-3").text(d.jenksDomain_2008_3+" - "+d.jenksDomain_2008_4);
              $("#break-4").text(d.jenksDomain_2008_4+" - "+d.jenksDomain_2008_5);
              $("#break-5").text(d.jenksDomain_2008_5+" - "+d.jenksDomain_2008_6);
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
            } else if (thisyear == "2004") {
              d.jenks = d.jenks_2004;
              var j1_height = (d.jenksDomain_2004_2 - d.jenksDomain_2004_1) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
              var j2_height = (d.jenksDomain_2004_3 - d.jenksDomain_2004_2) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
              var j3_height = (d.jenksDomain_2004_4 - d.jenksDomain_2004_3) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
              var j4_height = (d.jenksDomain_2004_5 - d.jenksDomain_2004_4) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
              var j5_height = (d.jenksDomain_2004_6 - d.jenksDomain_2004_5) / (d.jenksDomain_2004_6 - d.jenksDomain_2004_1) * 100;
              $("#break-1").text(d.jenksDomain_2004_1+" - "+d.jenksDomain_2004_2);
              $("#break-2").text(d.jenksDomain_2004_2+" - "+d.jenksDomain_2004_3);
              $("#break-3").text(d.jenksDomain_2004_3+" - "+d.jenksDomain_2004_4);
              $("#break-4").text(d.jenksDomain_2004_4+" - "+d.jenksDomain_2004_5);
              $("#break-5").text(d.jenksDomain_2004_5+" - "+d.jenksDomain_2004_6);
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
            } else if (thisyear == "2000") {
              d.jenks = d.jenks_2000;
              var j1_height = (d.jenksDomain_2000_2 - d.jenksDomain_2000_1) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
              var j2_height = (d.jenksDomain_2000_3 - d.jenksDomain_2000_2) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
              var j3_height = (d.jenksDomain_2000_4 - d.jenksDomain_2000_3) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
              var j4_height = (d.jenksDomain_2000_5 - d.jenksDomain_2000_4) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
              var j5_height = (d.jenksDomain_2000_6 - d.jenksDomain_2000_5) / (d.jenksDomain_2000_6 - d.jenksDomain_2000_1) * 100;
              $("#break-1").text(d.jenksDomain_2000_1+" - "+d.jenksDomain_2000_2);
              $("#break-2").text(d.jenksDomain_2000_2+" - "+d.jenksDomain_2000_3);
              $("#break-3").text(d.jenksDomain_2000_3+" - "+d.jenksDomain_2000_4);
              $("#break-4").text(d.jenksDomain_2000_4+" - "+d.jenksDomain_2000_5);
              $("#break-5").text(d.jenksDomain_2000_5+" - "+d.jenksDomain_2000_6);
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
            };
          });

          // Merge data into style that will be on the map ;)
          // Get the vector geometries to join
          var timestamp = new Date() / 1000; // just so we can see the same layer over and over
          var layerName = "lite_county-4a9o9r";
          var vtMatchProp = "GEOID";
          var dataMatchProp = "GEOID";
          var dataStyleProp = currentlayername;
          var source = currentData.Code + timestamp;

          // Add source for state polygons hosted by OVRDC Node JS Tileserver
         map.addSource(source, {
            type: "vector",
            url: "mapbox://chaewon.6lswbgay"
          });

          // First value is the default, used where the is no data
          var stops = [];

          var newData = data.map(function(county) {
            var jenks = county.jenks;

            function colorScale(a){
              return "rgba(" + 250 + ", " + (200 - a*33) + ", " + 0 + ", 1)";
            }

            var color = colorScale(jenks);
            var id = county[dataMatchProp];
            var sid = id.toString();
            return [sid, color]

          });

       console.log(newData);

          // Add layer from the vector tile source with data-driven style
         map.addLayer({
            "id": "joined-data",
            "type": "fill",
            "source": source,
            "source-layer": layerName,
            "paint": {
              "fill-color": {
                "property": vtMatchProp,
                "type": "categorical",
                "stops": newData
              },
              "fill-opacity": 1,
              "fill-outline-color": "rgba(255, 255, 255, 1)",
            }
          });
          //state boundary
          map.addLayer({
            "id": "state-boundaries",
            'type': 'line',
            "source": bosource,
            "source-layer": "0314_Joined_State-7x9at9",
            "paint": {
              "line-color": "rgba(255, 255, 255, 1)",
              "line-width": 1
            }
          });

          //Alaska
          almap.addLayer({
            "id": "joined-data",
            "type": "fill",
            "source": alsource,
            "source-layer": "AL-county-7kvm3a",
            "paint": {
              "fill-color": {
                "property": vtMatchProp,
                "type": "categorical",
                "stops": newData
              },
              "fill-opacity": 1,
              "fill-outline-color": "rgba(255, 255, 255, 1)",
            }
          });

          //Hawaii
          himap.addLayer({
            "id": "joined-data",
            "type": "fill",
            "source": hisource,
            "source-layer": "HI-county-60my81",
            "paint": {
              "fill-color": {
                "property": vtMatchProp,
                "type": "categorical",
                "stops": newData
              },
              "fill-opacity": 1,
              "fill-outline-color": "rgba(255, 255, 255, 1)",
            }
          });

          //DC
          dcmap.addLayer({
            "id": "joined-data",
            "type": "fill",
            "source": dcsource,
            "source-layer": "DC-county-4uqyqb",
            "paint": {
              "fill-color": {
                "property": vtMatchProp,
                "type": "categorical",
                "stops": newData
              },
              "fill-opacity": 1,
              "fill-outline-color": "rgba(255, 255, 255, 1)",
            }
            });


           });
         });
    // ^^ where on click for the years ends

          }
        }
      );

    });
  });
});
}); // datasets csv ends here
