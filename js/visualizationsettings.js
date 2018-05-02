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

  //
  // $('#3d_rendering')[0].checked = ffbomesh.neurons_3d
  // if(!ffbomesh.neurons_3d)
  //     $('.option_3d').hide()
  //
  // $('#3d_rendering').change(function(){
  //     $('.option_3d').toggle()
  //     ffbomesh.neurons_3d = !ffbomesh.neurons_3d
  // });

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
        ffbomesh.settings.default_opacity = e.value.newValue;
        ffbomesh.resetOpacity();
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

    $('#vis-ambientlight')
      .bootstrapSlider({value: ffbomesh.lightsHelper.frontAmbient.intensity})
      .on("change", function(e){
        ffbomesh.lightsHelper.frontAmbient.intensity = e.value.newValue;
      });

    $('#vis-dirlight')
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
    $('#vis-frontSpot-2-intensity').bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_2.intensity})
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
          ffbomesh.setBackgroundColor(ch);
          _this.setColorPickerBackground(ch);
        }
      });
    } else {
      $('#vis-neuropil-color').on('change', function(){
        var ch = $('#vis-neuropil-color')[0].value;
        ffbomesh.setBackgroundColor(ch);
        _this.setColorPickerBackground(ch);
      });
    }

    $('#vis-background-opacity')
      .bootstrapSlider({value: ffbomesh.settings.backgroundOpacity})
      .on("change", function(e){
        ffbomesh.backgroundOpacity = e.value.newValue;
        ffbomesh.resetOpacity();
      });
    $('#vis-background-wireframe-opacity')
      .bootstrapSlider({value: ffbomesh.settings.backgroundWireframeOpacity})
      .on("change", function(e){
        ffbomesh.backgroundWireframeOpacity = e.value.newValue;
        ffbomesh.resetOpacity();
      });

    ssao_pass = ffbomesh.passes['SSAO'];
    $('#vis-ssao')[0].checked = ffbomesh.composer.passes[ssao_pass].enabled
    $('#vis-ssao').change(function(){
        ffbomesh.composer.passes[ssao_pass].enabled = !ffbomesh.composer.passes[ssao_pass].enabled
    });

    $('#vis-backambientlight')
      .bootstrapSlider({value: ffbomesh.lightsHelper.backAmbient.intensity})
      .on("change", function(e){
        ffbomesh.lightsHelper.backAmbient.intensity = e.value.newValue;
      });

    $('#vis-backdirlight')
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
        ffbomesh.resetOpacity();
      });
    //
    //
    //
    $('#vis-fxaa')[0].checked = ffbomesh.effectFXAA.enabled
    $('#vis-fxaa').change(function(){
        ffbomesh.effectFXAA.enabled = !ffbomesh.effectFXAA.enabled
    });
    //
    // /*
    // $('#tonemapping')[0].checked = ffbomesh.toneMappingPass.enabled
    // $('#fxaa').change(function(){
    //     ffbomesh.toneMappingPass.enabled = !ffbomesh.toneMappingPass.enabled
    // });
    // */
    $('#vis-tonemappingbright')
      .bootstrapSlider({value: 1-ffbomesh.toneMappingPass.materialToneMap.uniforms.minLuminance.value})
      .on("change", function(e){
        ffbomesh.toneMappingPass.setMinLuminance(1-e.value.newValue);
      });

    $('#vis-bloomradius')
      .bootstrapSlider({value: ffbomesh.bloomPass.radius})
      .on("change", function(e){
        ffbomesh.bloomPass.radius = e.value.newValue;
      });

    $('#vis-bloomthreshold')
      .bootstrapSlider({value: ffbomesh.bloomPass.threshold})
      .on("change", function(e){
        ffbomesh.bloomPass.threshold = e.value.newValue;
      });

    $('#vis-bloomstrength')
      .bootstrapSlider({value: ffbomesh.bloomPass.strength})
      .on("change", function(e){
        ffbomesh.bloomPass.strength = e.value.newValue;
      });
  }
  return FFBOVisualizationSettings;
});
