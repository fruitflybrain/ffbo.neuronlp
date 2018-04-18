// For any third party dependencies, like jQuery, place them in the lib folder.
define('modernizr', [], Modernizr);

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    paths: {
        app: 'app',
        'autobahn': '//cdn.rawgit.com/crossbario/autobahn-js-built/master/autobahn.min',
        'd3':'lib/d3.min',
        'jquery':'//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs([
  'jquery',
  'app/Client',
  'app/info_panel/info_panel'
],
function (
  $,
  FFBOClient,
  InfoPanel,
){
  var infoPanel;
  $.getJSON('./data/data.json',function(d){
    var synData = d['success']['data']["synaptic_info_2"];
    var neuData = d['success']['data']["summary_2"];
    infoPanel = new InfoPanel("#info-panel", neuData, synData);

  
  }); 
  
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

