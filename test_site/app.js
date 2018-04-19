// For any third party dependencies, like jQuery, place them in the lib folder.
//define('modernizr', [], Modernizr);

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.

define('three', ['https://cdn.rawgit.com/mrdoob/three.js/r92/build/three.min.js'], function(THREE){
  window.THREE = THREE;
  return THREE;
});
requirejs.config({
  paths: {
    app: 'app',
    autobahn: '//cdn.rawgit.com/crossbario/autobahn-js-built/master/autobahn.min',
    d3: 'lib/d3.min',
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
    detector: 'https://cdn.rawgit.com/mrdoob/three.js/r92/examples/js/Detector',
    trackball: 'https://cdn.rawgit.com/mrdoob/three.js/r92/examples/js/controls/TrackballControls',
    modernizr: "lib/modernizr"
  },
  shim: {
    modernizr: {exports: 'Modernizr'},
    detector: {deps: ['three'], exports: 'Detector'},
    trackball: {deps: ['three'], init: function(THREE){
      return THREE.TrackballControls;
    }},
  }
});

// Start loading the main app file. Put all of
// your application logic in there.
require([
  'jquery',
  'app/Client',
  'app/info_panel/info_panel',
  'three',
  'detector',
  'trackball'
], function (
   $,
   FFBOClient,
   InfoPanel,
   THREE,
   Detector,
   Trackball
){
  var infoPanel;
  $.getJSON('./data/data.json',function(d){
    var synData = d['success']['data']["synaptic_info_2"];
    var neuData = d['success']['data']["summary_2"];
    infoPanel = new InfoPanel("#info-panel", neuData, synData);


  });
  console.log(THREE)
  console.log(Detector)
  console.log(Trackball)
  //var infoPanel = new InfoPanel("#info-panel");

  var client = new FFBOClient();
  client.startConnection("guest", "guestpass", "wss://neuronlp.fruitflybrain.org:8888/ws")

  window["fetchNeuronInfo"] = function(rid){
    client.executeNAquery(client.neuronInfoQuery(rid), {success: infoPanel.update})
  }
  window["fetchSynapseInfo"] = function(rid){
    client.executeNAquery(client.synapseInfoQuery(rid), {success: infoPanel.update})
  }

});
