if( moduleExporter === undefined){
  var moduleExporter = function(name, dependencies, definition) {
    if (typeof module === 'object' && module && module.exports) {
      dependencies = dependencies.map(require);
      module.exports = definition.apply(context, dependencies);
    } else if (typeof require === 'function') {
      define(dependencies, definition);
    } else {
      window[name] = definition();
    }
  };
}

moduleExporter(
  'FFBOVisualizationSettings',
  ['jquery','bootstrap','bootsrapslider'],
  function($){
    $ = $ || window.$;

  var FFBOVisualizationSettings = function(ffbomesh) {

    var _this = this;
    $('#vis-3d-rendering')[0].checked = ffbomesh.settings.neuron3d;
    if(!ffbomesh.settings.neuron3d)
        $("#vis-3d-mode-option").hide()

    $('#vis-3d-rendering').change(function(){
        ffbomesh.settings.neuron3d = !ffbomesh.settings.neuron3d;
        if (ffbomesh.settings.neuron3d)
          $("#vis-3d-mode-option").show("slide", { direction: "right" }, 800);
        else
          $("#vis-3d-mode-option").hide("slide", { direction: "right" }, 800);
    });

    $('input[type=radio][name=mode3d]').change(function(){
        ffbomesh.settings.neuron3dMode = parseInt($(this).val());
    });

    $('#vis-default-nerite-radius')
      .bootstrapSlider({value: ffbomesh.settings.defaultRadius})
      .on("change", function(e){
        ffbomesh.settings.defaultRadius = e.value.newValue;
      });

    $('#vis-default-soma-radius')
      .bootstrapSlider({value: ffbomesh.settings.defaultSomaRadius})
      .on("change", function(e){
        ffbomesh.settings.defaultSomaRadius = e.value.newValue;
      });

    $('#vis-default-opacity')
      .bootstrapSlider({value: ffbomesh.settings.defaultOpacity})
      .on("change", function(e){
        ffbomesh.settings.defaultOpacity = e.value.newValue;
      });

    $('#vis-highlighted-object-opacity')
      .bootstrapSlider({value: ffbomesh.settings.highlightedObjectOpacity})
      .on("change", function(e){
        ffbomesh.settings.highlightedObjectOpacity = e.value.newValue;
      });

    $('#vis-low-opacity')
      .bootstrapSlider({value: ffbomesh.settings.lowOpacity})
      .on("change", function(e){
        ffbomesh.settings.lowOpacity = e.value.newValue;
      });
    $('#vis-pin-opacity')
      .bootstrapSlider({value: ffbomesh.settings.pinOpacity})
      .on("change", function(e){
        ffbomesh.settings.pinOpacity = e.value.newValue;
      });
    $('#vis-pin-low-opacity')
      .bootstrapSlider({value: ffbomesh.settings.pinLowOpacity})
      .on("change", function(e){
        ffbomesh.settings.pinLowOpacity = e.value.newValue;
      });

    $('#vis-ambientlight-intensity')
      .bootstrapSlider({value: ffbomesh.lightsHelper.frontAmbient.intensity})
      .on("change", function(e){
        ffbomesh.lightsHelper.frontAmbient.intensity = e.value.newValue;
      });

    $('#vis-dirlight-intensity')
      .bootstrapSlider({value: ffbomesh.lightsHelper.frontDirectional_1.intensity})
      .on("change", function(e){
        ffbomesh.lightsHelper.frontDirectional_1.intensity = e.value.newValue;
        ffbomesh.lightsHelper.frontDirectional_2.intensity = e.value.newValue;
      });

    $('#vis-frontSpot-1-posAngle1')
      .bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_1.posAngle1})
      .on("change", function(e){
        ffbomesh.lightsHelper.frontSpot_1.posAngle1 = e.value.newValue;
      });

    $('#vis-frontSpot-1-posAngle2')
      .bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_1.posAngle2})
      .on("change", function(e){
        ffbomesh.lightsHelper.frontSpot_1.posAngle2 = e.value.newValue;
      });

    $('#vis-frontSpot-1-intensity')
      .bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_1.intensity})
      .on("change", function(e){
        ffbomesh.lightsHelper.frontSpot_1.intensity = e.value.newValue;
      });

    $('#vis-frontSpot-1-track')[0].checked = ffbomesh.lightsHelper.frontSpot_1.track
    $('#vis-frontSpot-1-track').change(function(){
        ffbomesh.lightsHelper.frontSpot_1.track = !ffbomesh.lightsHelper.frontSpot_1.track
    });

    $('#vis-frontSpot-2-posAngle1')
      .bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_2.posAngle1})
      .on("change", function(e){
        ffbomesh.lightsHelper.frontSpot_2.posAngle1 = e.value.newValue;
      });
    $('#vis-frontSpot-2-posAngle2')
      .bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_2.posAngle2})
      .on("change", function(e){
        ffbomesh.lightsHelper.frontSpot_2.posAngle2 = e.value.newValue;
      });
    $('#vis-frontSpot-2-intensity')
      .bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_2.intensity})
      .on("change", function(e){
        ffbomesh.lightsHelper.frontSpot_2.intensity = e.value.newValue;
    });

    $('#vis-frontSpot-2-track')[0].checked = ffbomesh.lightsHelper.frontSpot_2.track
    $('#vis-frontSpot-2-track').change(function(){
        ffbomesh.lightsHelper.frontSpot_2.track = !ffbomesh.lightsHelper.frontSpot_2.track
    });

    if(Modernizr.inputtypes.color)
        $("#vis-neuropil-color").attr("type", "color");
    else
        $("#vis-neuropil-color").attr("type", "text");

    this.setColorPickerBackground = function (c) {
      $("#vis-neuropil-color-wrapper").css("background-color", c);
      $("#vis-neuropil-color").attr("value", c);
    }

    if (!Modernizr.inputtypes.color) {
      $("#vis-neuropil-color").spectrum({
        showInput: true,
        showPalette: true,
        showSelectionPalette: true,
        showInitial: true,
        localStorageKey: "spectrum.neuronlp",
        showButtons: false,
        move: function(c){
          var ch = c.toHexString();
          ffbomesh.settings.backgroundColor = ch;
        }
      });
    } else {
      $('#vis-neuropil-color').on('change', function(){
        var ch = $('#vis-neuropil-color')[0].value;
        ffbomesh.settings.backgroundColor = ch;
      });
    }


    if(Modernizr.inputtypes.color)
        $("#vis-background-color").attr("type", "color");
    else
        $("#vis-background-color").attr("type", "text");

    this.setColorPickerSceneBackground = function (c) {
      $("#vis-background-color-wrapper").css("background-color", c);
      $("#vis-background-color").attr("value", c);
    }

    if (!Modernizr.inputtypes.color) {
      $("#vis-background-color").spectrum({
        showInput: true,
        showPalette: true,
        showSelectionPalette: true,
        showInitial: true,
        localStorageKey: "spectrum.neuronlp.back",
        showButtons: false,
        move: function(c){
          var ch = c.toHexString();
          ffbomesh.settings.sceneBackgroundColor = ch;
        }
      });
    } else {
      $('#vis-background-color').on('change', function(){
        var ch = $('#vis-background-color')[0].value;
        ffbomesh.settings.sceneBackgroundColor = ch;
      });
    }

    $('#vis-background-opacity')
      .bootstrapSlider({value: ffbomesh.settings.backgroundOpacity})
      .on("change", function(e){
        ffbomesh.settings.backgroundOpacity = e.value.newValue;
      });
    $('#vis-background-wireframe-opacity')
      .bootstrapSlider({value: ffbomesh.settings.backgroundWireframeOpacity})
      .on("change", function(e){
        ffbomesh.settings.backgroundWireframeOpacity = e.value.newValue;
      });

    $('#vis-ssao')[0].checked = ffbomesh.settings.backrenderSSAO.enabled;
    $('#vis-ssao').change(function(){
        ffbomesh.settings.backrenderSSAO.enabled = !ffbomesh.settings.backrenderSSAO.enabled;
    });

    $('#vis-backambientlight-intensity')
      .bootstrapSlider({value: ffbomesh.lightsHelper.backAmbient.intensity})
      .on("change", function(e){
        ffbomesh.lightsHelper.backAmbient.intensity = e.value.newValue;
      });

    $('#vis-backdirlight-intensity')
      .bootstrapSlider({value: ffbomesh.lightsHelper.backDirectional_1.intensity})
      .on("change", function(e){
        ffbomesh.lightsHelper.backDirectional_1.intensity = e.value.newValue;
        ffbomesh.lightsHelper.backDirectional_2.intensity = e.value.newValue;
      });

    $('#vis-backSpot-1-posAngle1')
      .bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_1.posAngle1})
      .on("change", function(e){
        ffbomesh.lightsHelper.backSpot_1.posAngle1 = e.value.newValue;
      });

    $('#vis-backSpot-1-posAngle2')
      .bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_1.posAngle2})
      .on("change", function(e){
        ffbomesh.lightsHelper.backSpot_1.posAngle2 = e.value.newValue;
      });

    $('#vis-backSpot-1-intensity')
      .bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_1.intensity})
      .on("change", function(e){
        ffbomesh.lightsHelper.backSpot_1.intensity = e.value.newValue;
      });

    $('#vis-backSpot-1-track')[0].checked = ffbomesh.lightsHelper.backSpot_1.track
    $('#vis-backSpot-1-track').change(function(){
        ffbomesh.lightsHelper.backSpot_1.track = !ffbomesh.lightsHelper.backSpot_1.track
    });

    $('#vis-backSpot-2-posAngle1')
      .bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_2.posAngle1})
      .on("change", function(e){
        ffbomesh.lightsHelper.backSpot_2.posAngle1 = e.value.newValue;
      });
    $('#vis-backSpot-2-posAngle2')
      .bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_2.posAngle2})
      .on("change", function(e){
        ffbomesh.lightsHelper.backSpot_2.posAngle2 = e.value.newValue;
      });
    $('#vis-backSpot-2-intensity')
      .bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_2.intensity})
      .on("change", function(e){
        ffbomesh.lightsHelper.backSpot_2.intensity = e.value.newValue;
      });
    $('#vis-backSpot-2-track')[0].checked = ffbomesh.lightsHelper.backSpot_2.track
    $('#vis-backSpot-2-track').change(function(){
        ffbomesh.lightsHelper.backSpot_2.track = !ffbomesh.lightsHelper.backSpot_2.track
    });
    //
    //
    //
    //
    $('#vis-default-synapse-radius')
      .bootstrapSlider({value: ffbomesh.settings.defaultSynapseRadius})
      .on("change", function(e){
        ffbomesh.settings.defaultSynapseRadius = e.value.newValue;
      });

    $('#vis-synapse-opacity')
      .bootstrapSlider({value: ffbomesh.settings.synapseOpacity})
      .on("change", function(e){
        ffbomesh.settings.synapseOpacity = e.value.newValue;
      });
    //
    //
    //
    $('#vis-fxaa')[0].checked = ffbomesh.settings.effectFXAA.enabled;
    $('#vis-fxaa').change(function(){
        ffbomesh.settings.effectFXAA.enabled = !ffbomesh.settings.effectFXAA.enabled;
    });

    $('#vis-tonemappingbright')
      .bootstrapSlider({value: ffbomesh.settings.toneMappingPass.brightness})
      .on("change", function(e){
        ffbomesh.settings.toneMappingPass.brightness = e.value.newValue;
      });

    $('#vis-bloom-radius')
      .bootstrapSlider({value: ffbomesh.bloomPass.radius})
      .on("change", function(e){
        ffbomesh.settings.bloomPass.radius = e.value.newValue;
      });

    $('#vis-bloom-threshold')
      .bootstrapSlider({value: ffbomesh.bloomPass.threshold})
      .on("change", function(e){
        ffbomesh.settings.bloomPass.threshold = e.value.newValue;
      });

    $('#vis-bloom-strength')
      .bootstrapSlider({value: ffbomesh.bloomPass.strength})
      .on("change", function(e){
        ffbomesh.settings.bloomPass.strength = e.value.newValue;
      });

    $('#btn-store-vis-settings')
      .click(function() {
        ffbomesh.import_settings(ffbomesh._defaultSettings);
      });

    var domId2ffbomeshSettings = {
      '#vis-default-nerite-radius': 'defaultRadius',
      '#vis-default-soma-radius': 'defaultSomaRadius',
      '#vis-default-opacity': 'defaultOpacity',
      '#vis-highlighted-object-opacity': 'highlightedObjectOpacity',
      '#vis-low-opacity': 'lowOpacity',
      '#vis-pin-opacity': 'pinOpacity',
      '#vis-pin-low-opacity': 'pinLowOpacity',
      '#vis-background-opacity': 'backgroundOpacity',
      '#vis-background-wireframe-opacity': 'backgroundWireframeOpacity',
      '#vis-default-synapse-radius': 'defaultSynapseRadius',
      '#vis-synapse-opacity': 'synapseOpacity'
    }

    var lightObj2Dom = {
      'backSpot_1': 'vis-backSpot-1',
      'backSpot_2': 'vis-backSpot-2',
      'backAmbient': 'vis-backambientlight',
      'frontDirectional_1': 'vis-dirlight',
      'backDirectional_1': 'vis-backdirlight',
      'frontSpot_1': 'vis-frontSpot-1',
      'frontSpot_2': 'vis-frontSpot-2',
      'frontAmbient': 'vis-ambientlight'
    }

    var postProcessing2Dom = {
      'backrenderSSAO': 'vis-ssao',
      'effectFXAA': 'vis-fxaa'
    }

    var settingCallback = function (key) {
      return (function (e) {
        $(key).bootstrapSlider('setValue', e.value, true);
      })
    }

    for (var key of Object.keys(domId2ffbomeshSettings)) {
      let val = domId2ffbomeshSettings[key];
      ffbomesh.settings.on('change', settingCallback(key), val);
    }

    ffbomesh.lightsHelper.on('change', function(e) {
      if (!lightObj2Dom.hasOwnProperty(e.path[0]))
        return;
      var dom = lightObj2Dom[e.path[0]];
      $(`#${dom}-${e.prop}`).bootstrapSlider('setValue', e.value, true);
    }, ['intensity', 'posAngle1', 'posAngle2']);

    ffbomesh.settings.on('change', function (e) {
      $('#vis-3d-rendering')[0].checked = e.value;
      if (ffbomesh.settings.neuron3d)
        $("#vis-3d-mode-option").show("slide", { direction: "right" }, 800);
      else
        $("#vis-3d-mode-option").hide("slide", { direction: "right" }, 800);
    }, 'neuron3d');


    ffbomesh.settings.bloomPass.on('change', function(e) {
      var dom = 'vis-bloom';
      $(`#${dom}-${e.prop}`).bootstrapSlider('setValue', e.value, true);
    }, ['threshold', 'radius', 'strength']);

    ffbomesh.settings.on('change', function (e) {
      if (!postProcessing2Dom.hasOwnProperty(e.path[0]))
        return;
      var dom = postProcessing2Dom[e.path[0]];
      $(`#${dom}`)[0].checked = e.value;
    }, 'enabled');

    ffbomesh.lightsHelper.on('change', function (e) {
      if (!lightObj2Dom.hasOwnProperty(e.path[0]))
        return;
      var dom = lightObj2Dom[e.path[0]];
      $(`#${dom}-${e.prop}`)[0].checked = e.value;
    }, 'track');

    ffbomesh.settings.toneMappingPass.on('change', function(e) {
      $('#vis-tonemappingbright').bootstrapSlider('setValue', e.value, true);
    }, 'brightness');

    ffbomesh.settings.on('change', function(e) {
      $('input[type=radio][name=mode3d]')[e.value].checked = true;
    }, 'neuron3dMode');

    ffbomesh.settings.on('change', function(e) {
      _this.setColorPickerBackground(e.value);
    }, 'backgroundColor');

    ffbomesh.settings.on('change', function(e) {
      _this.setColorPickerSceneBackground(e.value);
    }, 'sceneBackgroundColor');

  }
  return FFBOVisualizationSettings;
});
