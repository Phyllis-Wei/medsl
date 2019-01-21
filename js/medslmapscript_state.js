// title of all datasets. the intex file
d3.csv("../data/index_state.csv", function(datasets) {
  var currentDataCode = "vap";
  var currentData = datasets[0];
  var years = currentData.years;
  var eachyear = years.split(", ");

  $( ".year" ).remove();
  $( ".view" ).remove();
  $( ".download" ).remove();

  //year buttons
  eachyear.forEach(function(name){
    var li = document.createElement('BUTTON');
    li.innerHTML += name;
    li.className += 'year btn';
    li.id += name;
    document.getElementById('myList').appendChild(li);
    $('#2016').addClass("active");
  });

  var ddata = document.createElement('BUTTON');
  ddata.innerHTML = 'Download Data';
  ddata.className = 'btn download';
  ddata.id = '';
  document.getElementById('myList').appendChild(ddata);

  var currentyear = $('.year.active').attr('id');

  var ev = document.createElement('a');
  ev.innerHTML = 'Export View';
  ev.className = 'btn view';
  ev.href = '../img/export/c_'+currentDataCode+'_'+currentyear+'.png';
  ev.download = '../img/export/c_'+currentDataCode+'_'+currentyear+'.png';
  document.getElementById('myList').appendChild(ev);

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

      var ddata = document.createElement('BUTTON');
      ddata.innerHTML = 'Download Data';
      ddata.className = 'btn view';
      ddata.href = '../data/state/'+currentDataCode+'.csv';
      ddata.download = '../data/state/'+currentDataCode+'.csv';
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

var map = new mapboxgl.Map({
    container: 'map',
    style: style,
    zoom: 3.6,
    center: [-97.50,40.00],
//    maxBounds: bounds
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



//initial data
var query_csv = "../data/state/vap.csv";
var q = d3.queue()
          q.defer(d3.csv, query_csv);
          q.await(dataDidLoad);

function dataDidLoad (error, data) {
  if (error) throw error;

  //array in jenks
  var jenks = {};
  var rateById = {};
    //jenks-ing the data
    //2016
    data.forEach(function(d) {
      rateById[+d.id] = +d.year_2016;
      var jenksDomain = ss.jenks(data.map(function(d) { return parseFloat(+d.year_2016); }), 5);
      jenks = d3.scale.threshold()
                      .domain(jenksDomain)
                      .range(d3.range(5).map(function(i) { return i; }));
      //2016
      if (d.year_2016 >= jenksDomain[0] && d.year_2016 < jenksDomain[1]) {
        d.jenks_2016 = 1;}
        else if (d.year_2016 >= jenksDomain[1] && d.year_2016 < jenksDomain[2]){
        d.jenks_2016 = 2;}
        else if (d.year_2016 >= jenksDomain[2] && d.year_2016 < jenksDomain[3]){
        d.jenks_2016 = 3;}
        else if (d.year_2016 >= jenksDomain[3] && d.year_2016 < jenksDomain[4]){
        d.jenks_2016 = 4;}
        else if (d.year_2016 >= jenksDomain[4] && d.year_2016 < jenksDomain[5]){
        d.jenks_2016 = 5;}
        else{
        d.jenks_2016 = 6;};
      //because CSVs are stupid and will get rid of the 0 in front of a number in the state fips..
      if (d.state_fips.length == 1) {
        d.state_fips = "0" + d.state_fips;
      };

      d.jenksDomain_2016 = jenksDomain;
    });

    //initial dataset to viz on load == vap ////////////////////////////////////////////////////////
    var thisyear = $(".year.active").attr('id');
    var currentlayername = "jenks_"+thisyear;
//    console.log(data);
    var width = $("nav.legend").width();

    data.forEach(function (d) {
      if (thisyear == "2016") {
        d.jenks = d.jenks_2016;
        $("#break-1").text(d.jenksDomain_2016[0].toFixed(2)+" - "+d.jenksDomain_2016[1].toFixed(2));
        $("#break-2").text(d.jenksDomain_2016[1].toFixed(2)+" - "+d.jenksDomain_2016[2].toFixed(2));
        $("#break-3").text(d.jenksDomain_2016[2].toFixed(2)+" - "+d.jenksDomain_2016[3].toFixed(2));
        $("#break-4").text(d.jenksDomain_2016[3].toFixed(2)+" - "+d.jenksDomain_2016[4].toFixed(2));
        $("#break-5").text(d.jenksDomain_2016[4].toFixed(2)+" - "+d.jenksDomain_2016[5].toFixed(2));
        var j1_height = (d.jenksDomain_2016[1] - d.jenksDomain_2016[0]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
        var j2_height = (d.jenksDomain_2016[2] - d.jenksDomain_2016[1]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
        var j3_height = (d.jenksDomain_2016[3] - d.jenksDomain_2016[2]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
        var j4_height = (d.jenksDomain_2016[4] - d.jenksDomain_2016[3]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
        var j5_height = (d.jenksDomain_2016[5] - d.jenksDomain_2016[4]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
        $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
        $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
        $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
        $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
        $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

      } else if (thisyear == "2014") {
        d.jenks = d.jenks_2014;
        $("#break-1").text(d.jenksDomain_2014[0].toFixed(2)+" - "+d.jenksDomain_2014[1].toFixed(2));
        $("#break-2").text(d.jenksDomain_2014[1].toFixed(2)+" - "+d.jenksDomain_2014[2].toFixed(2));
        $("#break-3").text(d.jenksDomain_2014[2].toFixed(2)+" - "+d.jenksDomain_2014[3].toFixed(2));
        $("#break-4").text(d.jenksDomain_2014[3].toFixed(2)+" - "+d.jenksDomain_2014[4].toFixed(2));
        $("#break-5").text(d.jenksDomain_2014[4].toFixed(2)+" - "+d.jenksDomain_2014[5].toFixed(2));
        var j1_height = (d.jenksDomain_2014[1] - d.jenksDomain_2014[0]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
        var j2_height = (d.jenksDomain_2014[2] - d.jenksDomain_2014[1]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
        var j3_height = (d.jenksDomain_2014[3] - d.jenksDomain_2014[2]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
        var j4_height = (d.jenksDomain_2014[4] - d.jenksDomain_2014[3]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
        var j5_height = (d.jenksDomain_2014[5] - d.jenksDomain_2014[4]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
        $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
        $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
        $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
        $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
        $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

      } else if (thisyear == "2012") {
        d.jenks = d.jenks_2012;
        $("#break-1").text(d.jenksDomain_2012[0].toFixed(2)+" - "+d.jenksDomain_2012[1].toFixed(2));
        $("#break-2").text(d.jenksDomain_2012[1].toFixed(2)+" - "+d.jenksDomain_2012[2].toFixed(2));
        $("#break-3").text(d.jenksDomain_2012[2].toFixed(2)+" - "+d.jenksDomain_2012[3].toFixed(2));
        $("#break-4").text(d.jenksDomain_2012[3].toFixed(2)+" - "+d.jenksDomain_2012[4].toFixed(2));
        $("#break-5").text(d.jenksDomain_2012[4].toFixed(2)+" - "+d.jenksDomain_2012[5].toFixed(2));
        var j1_height = (d.jenksDomain_2012[1] - d.jenksDomain_2012[0]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
        var j2_height = (d.jenksDomain_2012[2] - d.jenksDomain_2012[1]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
        var j3_height = (d.jenksDomain_2012[3] - d.jenksDomain_2012[2]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
        var j4_height = (d.jenksDomain_2012[4] - d.jenksDomain_2012[3]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
        var j5_height = (d.jenksDomain_2012[5] - d.jenksDomain_2012[4]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
        $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
        $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
        $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
        $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
        $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
      } else if (thisyear == "2010") {
        d.jenks = d.jenks_2010;
        $("#break-1").text(d.jenksDomain_2010[0].toFixed(2)+" - "+d.jenksDomain_2010[1].toFixed(2));
        $("#break-2").text(d.jenksDomain_2010[1].toFixed(2)+" - "+d.jenksDomain_2010[2].toFixed(2));
        $("#break-3").text(d.jenksDomain_2010[2].toFixed(2)+" - "+d.jenksDomain_2010[3].toFixed(2));
        $("#break-4").text(d.jenksDomain_2010[3].toFixed(2)+" - "+d.jenksDomain_2010[4].toFixed(2));
        $("#break-5").text(d.jenksDomain_2010[4].toFixed(2)+" - "+d.jenksDomain_2010[5].toFixed(2));
        var j1_height = (d.jenksDomain_2010[1] - d.jenksDomain_2010[0]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
        var j2_height = (d.jenksDomain_2010[2] - d.jenksDomain_2010[1]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
        var j3_height = (d.jenksDomain_2010[3] - d.jenksDomain_2010[2]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
        var j4_height = (d.jenksDomain_2010[4] - d.jenksDomain_2010[3]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
        var j5_height = (d.jenksDomain_2010[5] - d.jenksDomain_2010[4]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
        $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
        $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
        $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
        $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
        $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
      } else if (thisyear == "2008") {
        d.jenks = d.jenks_2008;
        $("#break-1").text(d.jenksDomain_2008[0].toFixed(2)+" - "+d.jenksDomain_2008[1].toFixed(2));
        $("#break-2").text(d.jenksDomain_2008[1].toFixed(2)+" - "+d.jenksDomain_2008[2].toFixed(2));
        $("#break-3").text(d.jenksDomain_2008[2].toFixed(2)+" - "+d.jenksDomain_2008[3].toFixed(2));
        $("#break-4").text(d.jenksDomain_2008[3].toFixed(2)+" - "+d.jenksDomain_2008[4].toFixed(2));
        $("#break-5").text(d.jenksDomain_2008[4].toFixed(2)+" - "+d.jenksDomain_2008[5].toFixed(2));
        var j1_height = (d.jenksDomain_2008[1] - d.jenksDomain_2008[0]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
        var j2_height = (d.jenksDomain_2008[2] - d.jenksDomain_2008[1]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
        var j3_height = (d.jenksDomain_2008[3] - d.jenksDomain_2008[2]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
        var j4_height = (d.jenksDomain_2008[4] - d.jenksDomain_2008[3]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
        var j5_height = (d.jenksDomain_2008[5] - d.jenksDomain_2008[4]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
        $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
        $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
        $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
        $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
        $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
      } else if (thisyear == "2004") {
        d.jenks = d.jenks_2004;
        $("#break-1").text(d.jenksDomain_2004[0].toFixed(2)+" - "+d.jenksDomain_2004[1].toFixed(2));
        $("#break-2").text(d.jenksDomain_2004[1].toFixed(2)+" - "+d.jenksDomain_2004[2].toFixed(2));
        $("#break-3").text(d.jenksDomain_2004[2].toFixed(2)+" - "+d.jenksDomain_2004[3].toFixed(2));
        $("#break-4").text(d.jenksDomain_2004[3].toFixed(2)+" - "+d.jenksDomain_2004[4].toFixed(2));
        $("#break-5").text(d.jenksDomain_2004[4].toFixed(2)+" - "+d.jenksDomain_2004[5].toFixed(2));
        var j1_height = (d.jenksDomain_2004[1] - d.jenksDomain_2004[0]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
        var j2_height = (d.jenksDomain_2004[2] - d.jenksDomain_2004[1]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
        var j3_height = (d.jenksDomain_2004[3] - d.jenksDomain_2004[2]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
        var j4_height = (d.jenksDomain_2004[4] - d.jenksDomain_2004[3]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
        var j5_height = (d.jenksDomain_2004[5] - d.jenksDomain_2004[4]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
        $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
        $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
        $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
        $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
        $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
      } else if (thisyear == "2000") {
        d.jenks = d.jenks_2004;
        $("#break-1").text(d.jenksDomain_2000[0].toFixed(2)+" - "+d.jenksDomain_2000[1].toFixed(2));
        $("#break-2").text(d.jenksDomain_2000[1].toFixed(2)+" - "+d.jenksDomain_2000[2].toFixed(2));
        $("#break-3").text(d.jenksDomain_2000[2].toFixed(2)+" - "+d.jenksDomain_2000[3].toFixed(2));
        $("#break-4").text(d.jenksDomain_2000[3].toFixed(2)+" - "+d.jenksDomain_2000[4].toFixed(2));
        $("#break-5").text(d.jenksDomain_2000[4].toFixed(2)+" - "+d.jenksDomain_2000[5].toFixed(2));
        var j1_height = (d.jenksDomain_2000[1] - d.jenksDomain_2000[0]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
        var j2_height = (d.jenksDomain_2000[2] - d.jenksDomain_2000[1]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
        var j3_height = (d.jenksDomain_2000[3] - d.jenksDomain_2000[2]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
        var j4_height = (d.jenksDomain_2000[4] - d.jenksDomain_2000[3]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
        var j5_height = (d.jenksDomain_2000[5] - d.jenksDomain_2000[4]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
        $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
        $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
        $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
        $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
        $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
      };
    });

   var timestamp = new Date() / 1000; // just so we can see the same layer over and over
   var layerName = "0314_Joined_State-7x9at9";
   var vtMatchProp = "GEOID";
   var dataMatchProp = "state_fips";
   var dataStyleProp = currentlayername;
   var source = "vap" + timestamp;

   // Add source for state polygons hosted by OVRDC Node JS Tileserver
  map.addSource(source, {
     type: "vector",
     url: "mapbox://chaewon.4k0t5ilf"
   });

   var stops = "rgba(255, 255, 255, 1)";
   var newData = data.map(function(county) {
     var jenks = county.jenks;
//      console.log(jenks);

//      jenks.isNaN = function(a) { return a !==a; }

     var red = (county["jenks"] + 200 - county["jenks"]*33);
     var color = "rgba(" + 250 + ", " + red + ", " + 0 + ", 1)";

     for (var i = 0; i < data.length; i++) {
       if (county[dataStyleProp] <= data[i]) {
         color = colorScale[i];
         break;
       }
     }

     var id = county[dataMatchProp];
     var sid = id.toString();
     return [sid, color]
   });

//   console.log(newData);
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

   //Alaska
   var alsource = "al" + timestamp;
   almap.addSource(alsource, {
      type: "vector",
      url: "mapbox://chaewon.6uf7v5r7"
    });

   almap.addLayer({
     "id": "joined-data",
     "type": "fill",
     "source": alsource,
     "source-layer": "AL-state-1ktcs0",
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
      url: "mapbox://chaewon.3jvxiu4g"
    });

   himap.addLayer({
     "id": "joined-data",
     "type": "fill",
     "source": hisource,
     "source-layer": "HI-state-7g2jv1",
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
      url: "mapbox://chaewon.9b9x64bf"
    });

   dcmap.addLayer({
     "id": "joined-data",
     "type": "fill",
     "source": dcsource,
     "source-layer": "DC-state-da0how",
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
        var thisyear = parseInt(this.id);
        var currentDataTitle = $('#location').val();
        
        var currentData;
          for (var i in datasets){
              if (datasets[i].Title == currentDataTitle){
                  currentData = datasets[i];
              }
            }
        $( ".view" ).remove();
        var currentlayername = "jenks_"+thisyear;
       data.forEach(function (d) {
         if (thisyear == "2016") {
           d.jenks = d.jenks_2016;
           $("#break-1").text(d.jenksDomain_2016[0].toFixed(2)+" - "+d.jenksDomain_2016[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2016[1].toFixed(2)+" - "+d.jenksDomain_2016[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2016[2].toFixed(2)+" - "+d.jenksDomain_2016[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2016[3].toFixed(2)+" - "+d.jenksDomain_2016[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2016[4].toFixed(2)+" - "+d.jenksDomain_2016[5].toFixed(2));
           var j1_height = (d.jenksDomain_2016[1] - d.jenksDomain_2016[0]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
           var j2_height = (d.jenksDomain_2016[2] - d.jenksDomain_2016[1]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
           var j3_height = (d.jenksDomain_2016[3] - d.jenksDomain_2016[2]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
           var j4_height = (d.jenksDomain_2016[4] - d.jenksDomain_2016[3]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
           var j5_height = (d.jenksDomain_2016[5] - d.jenksDomain_2016[4]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

         } else if (thisyear == "2014") {
           d.jenks = d.jenks_2014;

           $("#break-1").text(d.jenksDomain_2014[0].toFixed(2)+" - "+d.jenksDomain_2014[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2014[1].toFixed(2)+" - "+d.jenksDomain_2014[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2014[2].toFixed(2)+" - "+d.jenksDomain_2014[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2014[3].toFixed(2)+" - "+d.jenksDomain_2014[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2014[4].toFixed(2)+" - "+d.jenksDomain_2014[5].toFixed(2));
           var j1_height = (d.jenksDomain_2014[1] - d.jenksDomain_2014[0]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
           var j2_height = (d.jenksDomain_2014[2] - d.jenksDomain_2014[1]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
           var j3_height = (d.jenksDomain_2014[3] - d.jenksDomain_2014[2]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
           var j4_height = (d.jenksDomain_2014[4] - d.jenksDomain_2014[3]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
           var j5_height = (d.jenksDomain_2014[5] - d.jenksDomain_2014[4]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

         } else if (thisyear == "2012") {
           d.jenks = d.jenks_2012;
           $("#break-1").text(d.jenksDomain_2012[0].toFixed(2)+" - "+d.jenksDomain_2012[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2012[1].toFixed(2)+" - "+d.jenksDomain_2012[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2012[2].toFixed(2)+" - "+d.jenksDomain_2012[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2012[3].toFixed(2)+" - "+d.jenksDomain_2012[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2012[4].toFixed(2)+" - "+d.jenksDomain_2012[5].toFixed(2));
           var j1_height = (d.jenksDomain_2012[1] - d.jenksDomain_2012[0]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
           var j2_height = (d.jenksDomain_2012[2] - d.jenksDomain_2012[1]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
           var j3_height = (d.jenksDomain_2012[3] - d.jenksDomain_2012[2]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
           var j4_height = (d.jenksDomain_2012[4] - d.jenksDomain_2012[3]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
           var j5_height = (d.jenksDomain_2012[5] - d.jenksDomain_2012[4]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2010") {
           d.jenks = d.jenks_2010;
           $("#break-1").text(d.jenksDomain_2010[0].toFixed(2)+" - "+d.jenksDomain_2010[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2010[1].toFixed(2)+" - "+d.jenksDomain_2010[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2010[2].toFixed(2)+" - "+d.jenksDomain_2010[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2010[3].toFixed(2)+" - "+d.jenksDomain_2010[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2010[4].toFixed(2)+" - "+d.jenksDomain_2010[5].toFixed(2));
           var j1_height = (d.jenksDomain_2010[1] - d.jenksDomain_2010[0]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
           var j2_height = (d.jenksDomain_2010[2] - d.jenksDomain_2010[1]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
           var j3_height = (d.jenksDomain_2010[3] - d.jenksDomain_2010[2]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
           var j4_height = (d.jenksDomain_2010[4] - d.jenksDomain_2010[3]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
           var j5_height = (d.jenksDomain_2010[5] - d.jenksDomain_2010[4]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2008") {
           d.jenks = d.jenks_2008;
           $("#break-1").text(d.jenksDomain_2008[0].toFixed(2)+" - "+d.jenksDomain_2008[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2008[1].toFixed(2)+" - "+d.jenksDomain_2008[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2008[2].toFixed(2)+" - "+d.jenksDomain_2008[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2008[3].toFixed(2)+" - "+d.jenksDomain_2008[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2008[4].toFixed(2)+" - "+d.jenksDomain_2008[5].toFixed(2));
           var j1_height = (d.jenksDomain_2008[1] - d.jenksDomain_2008[0]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
           var j2_height = (d.jenksDomain_2008[2] - d.jenksDomain_2008[1]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
           var j3_height = (d.jenksDomain_2008[3] - d.jenksDomain_2008[2]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
           var j4_height = (d.jenksDomain_2008[4] - d.jenksDomain_2008[3]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
           var j5_height = (d.jenksDomain_2008[5] - d.jenksDomain_2008[4]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2004") {
           d.jenks = d.jenks_2004;
           $("#break-1").text(d.jenksDomain_2004[0].toFixed(2)+" - "+d.jenksDomain_2004[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2004[1].toFixed(2)+" - "+d.jenksDomain_2004[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2004[2].toFixed(2)+" - "+d.jenksDomain_2004[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2004[3].toFixed(2)+" - "+d.jenksDomain_2004[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2004[4].toFixed(2)+" - "+d.jenksDomain_2004[5].toFixed(2));
           var j1_height = (d.jenksDomain_2004[1] - d.jenksDomain_2004[0]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
           var j2_height = (d.jenksDomain_2004[2] - d.jenksDomain_2004[1]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
           var j3_height = (d.jenksDomain_2004[3] - d.jenksDomain_2004[2]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
           var j4_height = (d.jenksDomain_2004[4] - d.jenksDomain_2004[3]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
           var j5_height = (d.jenksDomain_2004[5] - d.jenksDomain_2004[4]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2004") {
           d.jenks = d.jenks_2004;
           $("#break-1").text(d.jenksDomain_2000[0].toFixed(2)+" - "+d.jenksDomain_2000[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2000[1].toFixed(2)+" - "+d.jenksDomain_2000[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2000[2].toFixed(2)+" - "+d.jenksDomain_2000[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2000[3].toFixed(2)+" - "+d.jenksDomain_2000[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2000[4].toFixed(2)+" - "+d.jenksDomain_2000[5].toFixed(2));
           var j1_height = (d.jenksDomain_2000[1] - d.jenksDomain_2000[0]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
           var j2_height = (d.jenksDomain_2000[2] - d.jenksDomain_2000[1]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
           var j3_height = (d.jenksDomain_2000[3] - d.jenksDomain_2000[2]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
           var j4_height = (d.jenksDomain_2000[4] - d.jenksDomain_2000[3]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
           var j5_height = (d.jenksDomain_2000[5] - d.jenksDomain_2000[4]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         };
       });

      // First value is the default, used where the is no data
      var stops = "rgba(255, 255, 255, 1)";
      var newData = data.map(function(county) {
        var jenks = county.jenks;
  //      console.log(jenks);

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

         //Alaska
         almap.addLayer({
           "id": "joined-data",
           "type": "fill",
           "source": alsource,
           "source-layer": "AL-state-1ktcs0",
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
         himap.addLayer({
           "id": "joined-data",
           "type": "fill",
           "source": hisource,
           "source-layer": "HI-state-7g2jv1",
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
           "source-layer": "DC-state-da0how",
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

console.log(datasets);

//dropdown
jQuery(function($) {
   var datasets = {
       'Demographics': ['Voting-age population (VAP)', 'Voting-age population (VAP)', 'Voting-eligible population (VEP)','Racial demographics of voting-age population (percentage Black)','Racial demographics of voting-age population (percentage Hispanic)'],
       'Voter Turnout': ['Turnout in 2016 election'],
       'Election Returns': ['Votes cast for recent federal and statewide office (democratic)', 'Votes cast for recent federal and statewide office (republican)','Votes cast for recent federal and statewide office (other)'],
       'Administration': ['Turnout by voting mode (in-person on election day)','Turnout by voting mode (in-person early)','Turnout by voting mode (mail)','Turnout by voting mode (Other)'],
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

//dropdown + csv read conection////////////////////////////////////////////////////////
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
      $("#url").attr("href",currentData.Source_URL);
      var query_csv = "../data/state/"+currentData.Code+".csv";
      var q = d3.queue()
                q.defer(d3.csv, query_csv);
                q.await(dataDidLoad);

      function dataDidLoad (error, data) {
        if (error) throw error;
//        console.log(data);
//        console.log(geo);

        //array in jenks
        var jenks = {};
        var rateById = {};
        var data_2016;
        console.log(data);

        //2016
        data.forEach(function(d) {
          rateById[d.id] = +d.year_2016;
          var jenksDomain = ss.jenks(data.map(function(d) { return +d.year_2016; }), 5);
          jenks = d3.scale.threshold()
                          .domain(jenksDomain)
                          .range(d3.range(5).map(function(i) { return i; }));
          //2016
          if (d.year_2016 >= jenksDomain[0] && d.year_2016 < jenksDomain[1]) {
            d.jenks_2016 = 1;}
            else if (d.year_2016 >= jenksDomain[1] && d.year_2016 < jenksDomain[2]){
            d.jenks_2016 = 2;}
            else if (d.year_2016 >= jenksDomain[2] && d.year_2016 < jenksDomain[3]){
            d.jenks_2016 = 3;}
            else if (d.year_2016 >= jenksDomain[3] && d.year_2016 < jenksDomain[4]){
            d.jenks_2016 = 4;}
            else if (d.year_2016 >= jenksDomain[4] && d.year_2016 < jenksDomain[5]){
            d.jenks_2016 = 5;}
            else{
            d.jenks_2016 = 6;};
          //because CSVs are stupid and will get rid of the 0 in front of a number in the state fips..
          if (d.state_fips.length == 4) {
            d.state_fips = "0" + d.state_fips;
          };

          d.jenksDomain_2016 = jenksDomain;

          //2014
          rateById[d.id] = +d.year_2014;
          var jenksDomain = ss.jenks(data.map(function(d) { return +d.year_2014; }), 5);
          jenks = d3.scale.threshold()
                          .domain(jenksDomain)
                          .range(d3.range(5).map(function(i) { return i; }));

          if (d.year_2014 >= jenksDomain[0] && d.year_2014 < jenksDomain[1]) {
            d.jenks_2014 = 1;}
            else if (d.year_2014 >= jenksDomain[1] && d.year_2014 < jenksDomain[2]){
            d.jenks_2014 = 2;}
            else if (d.year_2014 >= jenksDomain[2] && d.year_2014 < jenksDomain[3]){
            d.jenks_2014 = 3;}
            else if (d.year_2014 >= jenksDomain[3] && d.year_2014 < jenksDomain[4]){
            d.jenks_2014 = 4;}
            else if (d.year_2014 >= jenksDomain[4] && d.year_2014 < jenksDomain[5]){
            d.jenks_2014 = 5;}
          else{
            d.jenks_2014 = 6;};

          //because CSVs are stupid and will get rid of the 0 in front of a number in the state fips..
          if (d.state_fips.length == 1) {
            d.state_fips = "0" + d.state_fips;
          };

          d.jenksDomain_2014 = jenksDomain;

          //2012
          rateById[d.id] = +d.year_2012;
          var jenksDomain = ss.jenks(data.map(function(d) { return +d.year_2012; }), 5);
          jenks = d3.scale.threshold()
                          .domain(jenksDomain)
                          .range(d3.range(5).map(function(i) { return i; }));
          if (d.year_2012 >= jenksDomain[0] && d.year_2012 < jenksDomain[1]) {
            d.jenks_2012 = 1;}
            else if (d.year_2012 >= jenksDomain[1] && d.year_2012 < jenksDomain[2]){
            d.jenks_2012 = 2;}
            else if (d.year_2012 >= jenksDomain[2] && d.year_2012 < jenksDomain[3]){
            d.jenks_2012 = 3;}
            else if (d.year_2012 >= jenksDomain[3] && d.year_2012 < jenksDomain[4]){
            d.jenks_2012 = 4;}
            else if (d.year_2012 >= jenksDomain[4] && d.year_2012 < jenksDomain[5]){
            d.jenks_2012 = 5;}
            else{
            d.jenks_2012 = 6;};
          //because CSVs are stupid and will get rid of the 0 in front of a number in the state fips..
          if (d.state_fips.length == 1) {
            d.state_fips = "0" + d.state_fips;
          };
          d.jenksDomain_2012 = jenksDomain;

          //2010
          rateById[d.id] = +d.year_2010;
          var jenksDomain = ss.jenks(data.map(function(d) { return +d.year_2010; }), 5);
          jenks = d3.scale.threshold()
                          .domain(jenksDomain)
                          .range(d3.range(5).map(function(i) { return i; }));
          if (d.year_2010 >= jenksDomain[0] && d.year_2010 < jenksDomain[1]) {
            d.jenks_2010 = 1;}
            else if (d.year_2010 >= jenksDomain[1] && d.year_2010 < jenksDomain[2]){
            d.jenks_2010 = 2;}
            else if (d.year_2010 >= jenksDomain[2] && d.year_2010 < jenksDomain[3]){
            d.jenks_2010 = 3;}
            else if (d.year_2010 >= jenksDomain[3] && d.year_2010 < jenksDomain[4]){
            d.jenks_2010 = 4;}
            else if (d.year_2010 >= jenksDomain[4] && d.year_2010 < jenksDomain[5]){
            d.jenks_2010 = 5;}
            else{
              d.jenks_2010 = 6;};
          //because CSVs are stupid and will get rid of the 0 in front of a number in the state fips..
          if (d.state_fips.length == 1) {
            d.state_fips = "0" + d.state_fips;
          };
          d.jenksDomain_2010 = jenksDomain;

          //2008
          rateById[d.id] = +d.year_2008;
          var jenksDomain = ss.jenks(data.map(function(d) { return +d.year_2008; }), 5);
          jenks = d3.scale.threshold()
                          .domain(jenksDomain)
                          .range(d3.range(5).map(function(i) { return i; }));
          if (d.year_2008 >= jenksDomain[0] && d.year_2008 < jenksDomain[1]) {
            d.jenks_2008 = 1;}
            else if (d.year_2008 >= jenksDomain[1] && d.year_2008 < jenksDomain[2]){
            d.jenks_2008 = 2;}
            else if (d.year_2008 >= jenksDomain[2] && d.year_2008 < jenksDomain[3]){
            d.jenks_2008 = 3;}
            else if (d.year_2008 >= jenksDomain[3] && d.year_2008 < jenksDomain[4]){
            d.jenks_2008 = 4;}
            else if (d.year_2008 >= jenksDomain[4] && d.year_2008 < jenksDomain[5]){
            d.jenks_2008 = 5;}
            else{
            d.jenks_2008 = 6;};

          //because CSVs are stupid and will get rid of the 0 in front of a number in the state fips..
          if (d.state_fips.length == 1) {
            d.state_fips = "0" + d.state_fips;
          };
          d.jenksDomain_2008 = jenksDomain;

        });
       console.log(data);

       //initial dataset to viz on load
       var thisyear = parseInt($(".year.active").attr('id'));
       var currentlayername = "jenks_"+thisyear;
       console.log(currentlayername);

       data.forEach(function (d) {
         if (thisyear == "2016") {
           d.jenks = d.jenks_2016;
           $("#break-1").text(d.jenksDomain_2016[0].toFixed(2)+" - "+d.jenksDomain_2016[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2016[1].toFixed(2)+" - "+d.jenksDomain_2016[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2016[2].toFixed(2)+" - "+d.jenksDomain_2016[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2016[3].toFixed(2)+" - "+d.jenksDomain_2016[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2016[4].toFixed(2)+" - "+d.jenksDomain_2016[5].toFixed(2));
           var j1_height = (d.jenksDomain_2016[1] - d.jenksDomain_2016[0]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
           var j2_height = (d.jenksDomain_2016[2] - d.jenksDomain_2016[1]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
           var j3_height = (d.jenksDomain_2016[3] - d.jenksDomain_2016[2]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
           var j4_height = (d.jenksDomain_2016[4] - d.jenksDomain_2016[3]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
           var j5_height = (d.jenksDomain_2016[5] - d.jenksDomain_2016[4]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

         } else if (thisyear == "2014") {
           d.jenks = d.jenks_2014;

           $("#break-1").text(d.jenksDomain_2014[0].toFixed(2)+" - "+d.jenksDomain_2014[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2014[1].toFixed(2)+" - "+d.jenksDomain_2014[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2014[2].toFixed(2)+" - "+d.jenksDomain_2014[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2014[3].toFixed(2)+" - "+d.jenksDomain_2014[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2014[4].toFixed(2)+" - "+d.jenksDomain_2014[5].toFixed(2));
           var j1_height = (d.jenksDomain_2014[1] - d.jenksDomain_2014[0]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
           var j2_height = (d.jenksDomain_2014[2] - d.jenksDomain_2014[1]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
           var j3_height = (d.jenksDomain_2014[3] - d.jenksDomain_2014[2]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
           var j4_height = (d.jenksDomain_2014[4] - d.jenksDomain_2014[3]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
           var j5_height = (d.jenksDomain_2014[5] - d.jenksDomain_2014[4]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

         } else if (thisyear == "2012") {
           d.jenks = d.jenks_2012;
           $("#break-1").text(d.jenksDomain_2012[0].toFixed(2)+" - "+d.jenksDomain_2012[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2012[1].toFixed(2)+" - "+d.jenksDomain_2012[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2012[2].toFixed(2)+" - "+d.jenksDomain_2012[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2012[3].toFixed(2)+" - "+d.jenksDomain_2012[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2012[4].toFixed(2)+" - "+d.jenksDomain_2012[5].toFixed(2));
           var j1_height = (d.jenksDomain_2012[1] - d.jenksDomain_2012[0]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
           var j2_height = (d.jenksDomain_2012[2] - d.jenksDomain_2012[1]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
           var j3_height = (d.jenksDomain_2012[3] - d.jenksDomain_2012[2]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
           var j4_height = (d.jenksDomain_2012[4] - d.jenksDomain_2012[3]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
           var j5_height = (d.jenksDomain_2012[5] - d.jenksDomain_2012[4]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2010") {
           d.jenks = d.jenks_2010;
           $("#break-1").text(d.jenksDomain_2010[0].toFixed(2)+" - "+d.jenksDomain_2010[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2010[1].toFixed(2)+" - "+d.jenksDomain_2010[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2010[2].toFixed(2)+" - "+d.jenksDomain_2010[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2010[3].toFixed(2)+" - "+d.jenksDomain_2010[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2010[4].toFixed(2)+" - "+d.jenksDomain_2010[5].toFixed(2));
           var j1_height = (d.jenksDomain_2010[1] - d.jenksDomain_2010[0]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
           var j2_height = (d.jenksDomain_2010[2] - d.jenksDomain_2010[1]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
           var j3_height = (d.jenksDomain_2010[3] - d.jenksDomain_2010[2]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
           var j4_height = (d.jenksDomain_2010[4] - d.jenksDomain_2010[3]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
           var j5_height = (d.jenksDomain_2010[5] - d.jenksDomain_2010[4]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2008") {
           d.jenks = d.jenks_2008;
           $("#break-1").text(d.jenksDomain_2008[0].toFixed(2)+" - "+d.jenksDomain_2008[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2008[1].toFixed(2)+" - "+d.jenksDomain_2008[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2008[2].toFixed(2)+" - "+d.jenksDomain_2008[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2008[3].toFixed(2)+" - "+d.jenksDomain_2008[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2008[4].toFixed(2)+" - "+d.jenksDomain_2008[5].toFixed(2));
           var j1_height = (d.jenksDomain_2008[1] - d.jenksDomain_2008[0]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
           var j2_height = (d.jenksDomain_2008[2] - d.jenksDomain_2008[1]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
           var j3_height = (d.jenksDomain_2008[3] - d.jenksDomain_2008[2]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
           var j4_height = (d.jenksDomain_2008[4] - d.jenksDomain_2008[3]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
           var j5_height = (d.jenksDomain_2008[5] - d.jenksDomain_2008[4]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2004") {
           d.jenks = d.jenks_2004;
           $("#break-1").text(d.jenksDomain_2004[0].toFixed(2)+" - "+d.jenksDomain_2004[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2004[1].toFixed(2)+" - "+d.jenksDomain_2004[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2004[2].toFixed(2)+" - "+d.jenksDomain_2004[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2004[3].toFixed(2)+" - "+d.jenksDomain_2004[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2004[4].toFixed(2)+" - "+d.jenksDomain_2004[5].toFixed(2));
           var j1_height = (d.jenksDomain_2004[1] - d.jenksDomain_2004[0]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
           var j2_height = (d.jenksDomain_2004[2] - d.jenksDomain_2004[1]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
           var j3_height = (d.jenksDomain_2004[3] - d.jenksDomain_2004[2]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
           var j4_height = (d.jenksDomain_2004[4] - d.jenksDomain_2004[3]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
           var j5_height = (d.jenksDomain_2004[5] - d.jenksDomain_2004[4]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         } else if (thisyear == "2004") {
           d.jenks = d.jenks_2004;
           $("#break-1").text(d.jenksDomain_2000[0].toFixed(2)+" - "+d.jenksDomain_2000[1].toFixed(2));
           $("#break-2").text(d.jenksDomain_2000[1].toFixed(2)+" - "+d.jenksDomain_2000[2].toFixed(2));
           $("#break-3").text(d.jenksDomain_2000[2].toFixed(2)+" - "+d.jenksDomain_2000[3].toFixed(2));
           $("#break-4").text(d.jenksDomain_2000[3].toFixed(2)+" - "+d.jenksDomain_2000[4].toFixed(2));
           $("#break-5").text(d.jenksDomain_2000[4].toFixed(2)+" - "+d.jenksDomain_2000[5].toFixed(2));
           var j1_height = (d.jenksDomain_2000[1] - d.jenksDomain_2000[0]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
           var j2_height = (d.jenksDomain_2000[2] - d.jenksDomain_2000[1]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
           var j3_height = (d.jenksDomain_2000[3] - d.jenksDomain_2000[2]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
           var j4_height = (d.jenksDomain_2000[4] - d.jenksDomain_2000[3]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
           var j5_height = (d.jenksDomain_2000[5] - d.jenksDomain_2000[4]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
           $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
           $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
           $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
           $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
           $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
         };
       });

      // First value is the default, used where the is no data
      var timestamp = new Date() / 1000; // just so we can see the same layer over and over
      var layerName = "0314_Joined_State-7x9at9";
      var vtMatchProp = "GEOID";
      var dataMatchProp = "state_fips";
      var dataStyleProp = currentlayername;
      var source = "vap" + timestamp;

      // Add source for state polygons hosted by OVRDC Node JS Tileserver
     map.addSource(source, {
        type: "vector",
        url: "mapbox://chaewon.4k0t5ilf"
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

      //Alaska
      var alsource = "al" + timestamp;
      almap.addSource(alsource, {
         type: "vector",
         url: "mapbox://chaewon.6uf7v5r7"
       });

      almap.addLayer({
        "id": "joined-data",
        "type": "fill",
        "source": alsource,
        "source-layer": "AL-state-1ktcs0",
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
         url: "mapbox://chaewon.3jvxiu4g"
       });

      himap.addLayer({
        "id": "joined-data",
        "type": "fill",
        "source": hisource,
        "source-layer": "HI-state-7g2jv1",
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
         url: "mapbox://chaewon.9b9x64bf"
       });

      dcmap.addLayer({
        "id": "joined-data",
        "type": "fill",
        "source": dcsource,
        "source-layer": "DC-state-da0how",
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
//           console.log(currentlayername);
          data.forEach(function (d) {
            if (thisyear == "2016") {
              d.jenks = d.jenks_2016;
              $("#break-1").text(d.jenksDomain_2016[0].toFixed(2)+" - "+d.jenksDomain_2016[1].toFixed(2));
              $("#break-2").text(d.jenksDomain_2016[1].toFixed(2)+" - "+d.jenksDomain_2016[2].toFixed(2));
              $("#break-3").text(d.jenksDomain_2016[2].toFixed(2)+" - "+d.jenksDomain_2016[3].toFixed(2));
              $("#break-4").text(d.jenksDomain_2016[3].toFixed(2)+" - "+d.jenksDomain_2016[4].toFixed(2));
              $("#break-5").text(d.jenksDomain_2016[4].toFixed(2)+" - "+d.jenksDomain_2016[5].toFixed(2));
              var j1_height = (d.jenksDomain_2016[1] - d.jenksDomain_2016[0]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
              var j2_height = (d.jenksDomain_2016[2] - d.jenksDomain_2016[1]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
              var j3_height = (d.jenksDomain_2016[3] - d.jenksDomain_2016[2]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
              var j4_height = (d.jenksDomain_2016[4] - d.jenksDomain_2016[3]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
              var j5_height = (d.jenksDomain_2016[5] - d.jenksDomain_2016[4]) / (d.jenksDomain_2016[5] - d.jenksDomain_2016[0]) * 100;
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

            } else if (thisyear == "2014") {
              d.jenks = d.jenks_2014;

              $("#break-1").text(d.jenksDomain_2014[0].toFixed(2)+" - "+d.jenksDomain_2014[1].toFixed(2));
              $("#break-2").text(d.jenksDomain_2014[1].toFixed(2)+" - "+d.jenksDomain_2014[2].toFixed(2));
              $("#break-3").text(d.jenksDomain_2014[2].toFixed(2)+" - "+d.jenksDomain_2014[3].toFixed(2));
              $("#break-4").text(d.jenksDomain_2014[3].toFixed(2)+" - "+d.jenksDomain_2014[4].toFixed(2));
              $("#break-5").text(d.jenksDomain_2014[4].toFixed(2)+" - "+d.jenksDomain_2014[5].toFixed(2));
              var j1_height = (d.jenksDomain_2014[1] - d.jenksDomain_2014[0]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
              var j2_height = (d.jenksDomain_2014[2] - d.jenksDomain_2014[1]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
              var j3_height = (d.jenksDomain_2014[3] - d.jenksDomain_2014[2]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
              var j4_height = (d.jenksDomain_2014[4] - d.jenksDomain_2014[3]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
              var j5_height = (d.jenksDomain_2014[5] - d.jenksDomain_2014[4]) / (d.jenksDomain_2014[5] - d.jenksDomain_2014[0]) * 100;
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");

            } else if (thisyear == "2012") {
              d.jenks = d.jenks_2012;
              $("#break-1").text(d.jenksDomain_2012[0].toFixed(2)+" - "+d.jenksDomain_2012[1].toFixed(2));
              $("#break-2").text(d.jenksDomain_2012[1].toFixed(2)+" - "+d.jenksDomain_2012[2].toFixed(2));
              $("#break-3").text(d.jenksDomain_2012[2].toFixed(2)+" - "+d.jenksDomain_2012[3].toFixed(2));
              $("#break-4").text(d.jenksDomain_2012[3].toFixed(2)+" - "+d.jenksDomain_2012[4].toFixed(2));
              $("#break-5").text(d.jenksDomain_2012[4].toFixed(2)+" - "+d.jenksDomain_2012[5].toFixed(2));
              var j1_height = (d.jenksDomain_2012[1] - d.jenksDomain_2012[0]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
              var j2_height = (d.jenksDomain_2012[2] - d.jenksDomain_2012[1]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
              var j3_height = (d.jenksDomain_2012[3] - d.jenksDomain_2012[2]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
              var j4_height = (d.jenksDomain_2012[4] - d.jenksDomain_2012[3]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
              var j5_height = (d.jenksDomain_2012[5] - d.jenksDomain_2012[4]) / (d.jenksDomain_2012[5] - d.jenksDomain_2012[0]) * 100;
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
            } else if (thisyear == "2010") {
              d.jenks = d.jenks_2010;
              $("#break-1").text(d.jenksDomain_2010[0].toFixed(2)+" - "+d.jenksDomain_2010[1].toFixed(2));
              $("#break-2").text(d.jenksDomain_2010[1].toFixed(2)+" - "+d.jenksDomain_2010[2].toFixed(2));
              $("#break-3").text(d.jenksDomain_2010[2].toFixed(2)+" - "+d.jenksDomain_2010[3].toFixed(2));
              $("#break-4").text(d.jenksDomain_2010[3].toFixed(2)+" - "+d.jenksDomain_2010[4].toFixed(2));
              $("#break-5").text(d.jenksDomain_2010[4].toFixed(2)+" - "+d.jenksDomain_2010[5].toFixed(2));
              var j1_height = (d.jenksDomain_2010[1] - d.jenksDomain_2010[0]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
              var j2_height = (d.jenksDomain_2010[2] - d.jenksDomain_2010[1]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
              var j3_height = (d.jenksDomain_2010[3] - d.jenksDomain_2010[2]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
              var j4_height = (d.jenksDomain_2010[4] - d.jenksDomain_2010[3]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
              var j5_height = (d.jenksDomain_2010[5] - d.jenksDomain_2010[4]) / (d.jenksDomain_2010[5] - d.jenksDomain_2010[0]) * 100;
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
            } else if (thisyear == "2008") {
              d.jenks = d.jenks_2008;
              $("#break-1").text(d.jenksDomain_2008[0].toFixed(2)+" - "+d.jenksDomain_2008[1].toFixed(2));
              $("#break-2").text(d.jenksDomain_2008[1].toFixed(2)+" - "+d.jenksDomain_2008[2].toFixed(2));
              $("#break-3").text(d.jenksDomain_2008[2].toFixed(2)+" - "+d.jenksDomain_2008[3].toFixed(2));
              $("#break-4").text(d.jenksDomain_2008[3].toFixed(2)+" - "+d.jenksDomain_2008[4].toFixed(2));
              $("#break-5").text(d.jenksDomain_2008[4].toFixed(2)+" - "+d.jenksDomain_2008[5].toFixed(2));
              var j1_height = (d.jenksDomain_2008[1] - d.jenksDomain_2008[0]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
              var j2_height = (d.jenksDomain_2008[2] - d.jenksDomain_2008[1]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
              var j3_height = (d.jenksDomain_2008[3] - d.jenksDomain_2008[2]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
              var j4_height = (d.jenksDomain_2008[4] - d.jenksDomain_2008[3]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
              var j5_height = (d.jenksDomain_2008[5] - d.jenksDomain_2008[4]) / (d.jenksDomain_2008[5] - d.jenksDomain_2008[0]) * 100;
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
            } else if (thisyear == "2004") {
              d.jenks = d.jenks_2004;
              $("#break-1").text(d.jenksDomain_2004[0].toFixed(2)+" - "+d.jenksDomain_2004[1].toFixed(2));
              $("#break-2").text(d.jenksDomain_2004[1].toFixed(2)+" - "+d.jenksDomain_2004[2].toFixed(2));
              $("#break-3").text(d.jenksDomain_2004[2].toFixed(2)+" - "+d.jenksDomain_2004[3].toFixed(2));
              $("#break-4").text(d.jenksDomain_2004[3].toFixed(2)+" - "+d.jenksDomain_2004[4].toFixed(2));
              $("#break-5").text(d.jenksDomain_2004[4].toFixed(2)+" - "+d.jenksDomain_2004[5].toFixed(2));
              var j1_height = (d.jenksDomain_2004[1] - d.jenksDomain_2004[0]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
              var j2_height = (d.jenksDomain_2004[2] - d.jenksDomain_2004[1]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
              var j3_height = (d.jenksDomain_2004[3] - d.jenksDomain_2004[2]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
              var j4_height = (d.jenksDomain_2004[4] - d.jenksDomain_2004[3]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
              var j5_height = (d.jenksDomain_2004[5] - d.jenksDomain_2004[4]) / (d.jenksDomain_2004[5] - d.jenksDomain_2004[0]) * 100;
              $("span.j1").attr("style","height:"+j1_height+"%; background:rgba(250,166, 0, 1);");
              $("span.j2").attr("style","height:"+j2_height+"%; background:rgba(250,133, 0, 1);");
              $("span.j3").attr("style","height:"+j3_height+"%; background:rgba(250,100, 0, 1);");
              $("span.j4").attr("style","height:"+j4_height+"%; background:rgba(250,66, 0, 1);");
              $("span.j5").attr("style","height:"+j5_height+"%; background:rgba(250,33, 0, 1);");
            } else if (thisyear == "2004") {
              d.jenks = d.jenks_2004;
              $("#break-1").text(d.jenksDomain_2000[0].toFixed(2)+" - "+d.jenksDomain_2000[1].toFixed(2));
              $("#break-2").text(d.jenksDomain_2000[1].toFixed(2)+" - "+d.jenksDomain_2000[2].toFixed(2));
              $("#break-3").text(d.jenksDomain_2000[2].toFixed(2)+" - "+d.jenksDomain_2000[3].toFixed(2));
              $("#break-4").text(d.jenksDomain_2000[3].toFixed(2)+" - "+d.jenksDomain_2000[4].toFixed(2));
              $("#break-5").text(d.jenksDomain_2000[4].toFixed(2)+" - "+d.jenksDomain_2000[5].toFixed(2));
              var j1_height = (d.jenksDomain_2000[1] - d.jenksDomain_2000[0]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
              var j2_height = (d.jenksDomain_2000[2] - d.jenksDomain_2000[1]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
              var j3_height = (d.jenksDomain_2000[3] - d.jenksDomain_2000[2]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
              var j4_height = (d.jenksDomain_2000[4] - d.jenksDomain_2000[3]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
              var j5_height = (d.jenksDomain_2000[5] - d.jenksDomain_2000[4]) / (d.jenksDomain_2000[5] - d.jenksDomain_2000[0]) * 100;
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
          var layerName = "0314_Joined_State-7x9at9";
          var vtMatchProp = "GEOID";
          var dataMatchProp = "state_fips";
          var dataStyleProp = currentlayername;
          var source = currentData.Code + timestamp;

          // Add source for state polygons hosted by OVRDC Node JS Tileserver
         map.addSource(source, {
            type: "vector",
            url: "mapbox://chaewon.4k0t5ilf"
          });

          // First value is the default, used where the is no data
          var stops = [];

          var newData = data.map(function(county) {

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
              "fill-outline-color": "rgba(255, 255, 255, 1)"
            }
          });

          //Alaska
          almap.addLayer({
            "id": "joined-data",
            "type": "fill",
            "source": alsource,
            "source-layer": "AL-state-1ktcs0",
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
            "source-layer": "HI-state-7g2jv1",
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
            "source-layer": "DC-state-da0how",
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
});// datasets csv ends here
