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
  baseUrl: '../js',
  paths: {
    // app: 'app',
    mesh3d: 'https://neuronlp.fruitflybrain.org:8888/lib/js/mesh3d',
    infopanel: "info_panel/infopanel",
    autobahn: '//cdn.rawgit.com/crossbario/autobahn-js-built/master/autobahn.min',
    d3: '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min',
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
    detector: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/Detector',
    simplifymodifier: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/utils/SceneUtils',
    lut: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/math/Lut',
    copyshader: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/shaders/CopyShader',
    convolutionshader: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/shaders/ConvolutionShader',
    fxaashader: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/shaders/FXAAShader',
    ssaoshader: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/shaders/SSAOShader',
    luminosityhighpassshader: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/shaders/LuminosityHighPassShader',
    luminosityshader: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/shaders/LuminosityShader',
    tonemapshader: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/shaders/ToneMapShader',
    gammacorrectionshader: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/shaders/GammaCorrectionShader',
    effectcomposer: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/postprocessing/EffectComposer',
    renderpass: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/postprocessing/RenderPass',
    ssaarenderpass: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/postprocessing/SSAARenderPass',
    shaderpass: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/postprocessing/ShaderPass',
    ssaopass: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/postprocessing/SSAOPass',
    maskpass: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/postprocessing/MaskPass',
    bloompass: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/postprocessing/BloomPass',
    unrealbloompass: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/postprocessing/UnrealBloomPass',
    adaptivetonemappingpass: '//cdn.rawgit.com/mrdoob/three.js/r92/examples/js/postprocessing/AdaptiveToneMappingPass',
    trackballcontrols: '//cdn.rawgit.com/fruitflybrain/ffbo.lib/VisualizationUpdates/js/three/libs/TrackballControls',
    lightshelper: '//cdn.rawgit.com/fruitflybrain/ffbo.lib/VisualizationUpdates/js/lightshelper',
    modernizr: "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min",
    d3: "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3",
    jqueryui: "//code.jquery.com/ui/1.12.1/jquery-ui",
    perfectscrollbar: "//cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.7.0/js/perfect-scrollbar.jquery.min",
    "jquery.mobile": "//code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min",
    spectrum: "//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min",
    "jquery.mmenu": "//cdnjs.cloudflare.com/ajax/libs/jQuery.mmenu/7.0.3/jquery.mmenu.all",
    bootsrapslider: "//cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/10.0.0/bootstrap-slider.min",
    swiper: "//cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.2/js/swiper.min",
    bootstrap: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min",
    blockui: "//cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min"
    /* Notify, bootbox, colormaps, demos, mouse, vis_set, ResizeSensor, read_vars, colormaps */
  },
  shim: {
    bootstrap: {deps: ['jquery']},
    modernizr: {exports: 'Modernizr'},
    detector: {deps: ['three'], exports: 'Detector'},
    trackballcontrols: {deps: ['three']},
    simplifymodifier: {deps: ['three']},
    lut: {deps: ['three']},
    copyshader: {deps: ['three']},
    convolutionshader: {deps: ['three']},
    fxaashader: {deps: ['three']},
    ssaoshader: {deps: ['three']},
    luminosityhighpassshader: {deps: ['three']},
    luminosityshader: {deps: ['three']},
    tonemapshader: {deps: ['three']},
    gammacorrectionshader: {deps: ['three']},
    effectcomposer: {deps: ['three']},
    renderpass: {deps: ['three']},
    ssaarenderpass: {deps: ['three']},
    shaderpass: {deps: ['three']},
    ssaopass: {deps: ['three']},
    maskpass: {deps: ['three']},
    bloompass: {deps: ['three']},
    unrealbloompass: {deps: ['three']},
    adaptivetonemappingpass: {deps: ['three']},
    lightshelper: {deps: ['three']}
  }
});




// Start loading the main app file. Put all of
// your application logic in there.
require([
  'jquery',
  'client',
  'three',
  'detector',
  'mesh3d',
  'infopanel',
  'bootstrap',
  'jquery.mobile',
  'jqueryui',
  'jquery.mmenu',
  'blockui'
], function (
   $,
   FFBOClient,
   THREE,
   Detector,
   FFBOMesh3D,
   InfoPanel
){

  $.mobile.ajaxEnabled = false;

  var infoPanel;
  var lpuList = [
    'al_l', 'al_r', 'ammc_l', 'ammc_r', 'cal_l', 'cal_r', 'ccp_l', 'ccp_r',
    'cmp_l', 'cmp_r', 'cvlp_l', 'cvlp_r', 'dlp_l', 'dlp_r', 'dmp_l', 'dmp_r',
    'eb', 'fb', 'fspp_l', 'fspp_r', 'idfp_l', 'idfp_r', 'idlp_l', 'idlp_r',
    'lat_l', 'lat_r', 'lh_l', 'lh_r', 'lob_l', 'lob_r', 'lop_l', 'lop_r',
    'mb_l', 'mb_r', 'med_l', 'med_r', 'nod_l', 'nod_r', 'og_l', 'og_r',
    'optu_l', 'optu_r', 'pan_l', 'pan_r', 'pb', 'sdfp_l', 'sdfp_r', 'sog_l',
    'sog_r', 'spp_l', 'spp_r', 'vlp_l', 'vlp_r', 'vmp_l', 'vmp_r'
  ];

  lpuJSON = {};
  for (var i=0; i < lpuList.length; i++ ) {
    var x = lpuList[i].split("_");
    var side = "";
    if (x.length > 1) {
      if (x[1] == "r")
        side = "Right ";
      else
        side = "Left ";
    }
    lpuJSON[lpuList[i]] = {
      'filename': 'https://raw.githubusercontent.com/fruitflybrain/ffbo.lib/master/mesh/' + lpuList[i] + '.json',
      'label': side + x[0].toUpperCase(),
      'highlight': false,
      'background': true,
      'color': new THREE.Color( 0.15, 0.01, 0.15)
    };
  }

  var ffbomesh = new FFBOMesh3D('vis-3d', {"ffbo_json": lpuJSON, "showAfterLoadAll": true}, {"globalCenter": {'x': 0, 'y':-250, 'z':0}});
  infoPanel = new InfoPanel("info-panel");

  infoPanel.isInWorkspace = (rid) => {
    return (rid in ffbomesh.meshDict);
  };

  
  infoPanel.addByUname = (uname) => {
    query = client.addByUnameQuery(uname);
    queryID = client.executeNAquery(query, {success: dataCallback});
    logAndMonitorQuery(queryID);    
  };
  
  infoPanel.removeByUname = (uname) => {
    query = client.removeByUnameQuery(uname);
    queryID = client.executeNAquery(query);
    logAndMonitorQuery(queryID);
  };
  
  infoPanel.getAttr = (id,attr) => {
    if (attr !== 'color') {
      return undefined;
    }
    return ffbomesh.meshDict[id].color.getHexString();
  };
  infoPanel.setAttr = (id,attr,value) => {
    if (attr !== 'color') {
      return;
    }
    ffbomesh.setColor(id, value);
  };

  // var infoPanel = new InfoPanel("#info-panel");

  var client = new FFBOClient();
  client.startConnection("guest", "guestpass", "wss://neuronlp.fruitflybrain.org:8888/ws");

  window["fetchNeuronInfo"] = function(rid){
    client.executeNAquery(client.neuronInfoQuery(rid),
                          {success: function(d){
                            console.log(d);
                            if ("summary_1" in d) {
                              infoPanel.update(d["summary_1"],d["synaptic_info_1"]);
                            }else{
                              infoPanel.update(d["summary_2"],d["synaptic_info_2"]);
                            }
                          }});
  }
  window["fetchSynapseInfo"] = function(rid){
    client.executeNAquery(client.synapseInfoQuery(rid),
                          {success: function(d){
                            console.log(d);
                            if ("synapse_details_1" in d) {
                              infoPanel.update(d["synapse_details_1"],undefined);
                            }
                          }});

  }
  window["client"] = client;

  function logAndMonitorQuery(queryID){
    console.log("Query Fired: ID - " + queryID);
    client.status.on("change", function(e){
      console.log("Query Status Changed, ID: " + e.prop + ", Value: ", e.value);
    }, queryID);
  }

  window["testNLPquery"] = function(query){
    queryID = client.executeNLPquery(query, {success: dataCallback});
    logAndMonitorQuery(queryID);
  }
  client.notifySuccess = function(message){
    console.log("Success: " + message);
  }

  client.notifyError = function(message){
    console.log("Error: " + message);
  }

  client.receiveCommand = function(message){
    console.log("Command Received");
    console.log(message);
    if(!'commands' in message)
      return;
    if('reset' in message['commands']){
      ffbomesh.reset();
      delete message.commands.reset;
    }
    for(var cmd in message["commands"])
      ffbomesh.execCommand({"commands":[cmd],"neurons": message["commands"][cmd][0],"args":message['commands'][cmd][1]});
  }

  window["ffbomesh"] = ffbomesh;
  function dataCallback(data){
    ffbomesh.addJson({ffbo_json: data, type: 'morphology_json'});
  }

  ffbomesh.on('click',   function(e){
    $("#info-intro").hide();
    $("#info-panel").show();
    query = client.infoQuery(e.value);
    queryID = client.executeNAquery(query, {success: function(data){
      data['summary']['rid'] = e.value;
      infoPanel.update(data);
    }});
    logAndMonitorQuery(queryID);
  })

  window.addByUname = function(uname){
    query = client.addByUnameQuery(uname);
    queryID = client.executeNAquery(query, {success: dataCallback});
    logAndMonitorQuery(queryID);
  }

  window.removeByUname = function(uname){
    query = client.removeByUnameQuery(uname);
    queryID = client.executeNAquery(query);
    logAndMonitorQuery(queryID);
  }
  var srchInput = document.getElementById('srch_box');
  var srchBtn = document.getElementById('srch_box_btn');
  //add event listener
  srchBtn.addEventListener('click', function(event) {
    query = document.getElementById('srch_box').value;
    $("#search-wrapper").block({ message: null });
    srchInput.blur();
    queryID = client.executeNLPquery(query, {success: dataCallback});
    logAndMonitorQuery(queryID);
    client.status.on("change", function(e){ $("#search-wrapper").unblock() }, queryID);
  });

  srchInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13)
      srchBtn.click();
  });

});
