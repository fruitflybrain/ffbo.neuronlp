ffbomesh.dispatch['showSettings'] = (function() {
    $("#info-panel").hide();
    $("#vis_set").show();
    $("#vis_set_dragger").show();
    $("#vis-3d").addClass("vis-3d-hf");
    $("#vis-3d").removeClass("vis-3d-lg");
    setTimeout( function(){
      ffbomesh.onWindowResize();
      }, 500
    );
});

$("#btn-vis-set-close").click( function() {
    $("#info-panel").show();
    $("#vis_set").hide();
    $("#vis_set_dragger").hide();
    if ($("#info-panel").hasClass("vis-info-pin")) {
      $("#vis-3d").addClass("vis-3d-hf");
      $("#vis-3d").removeClass("vis-3d-lg");
    } else {
      $("#vis-3d").removeClass("vis-3d-hf");
      $("#vis-3d").addClass("vis-3d-lg");
    }
    setTimeout( function(){
      ffbomesh.onWindowResize();
      }, 500
    );
})

ffbomesh.dispatch.resize = function(){
    if(! $('#vis_set').is(":visible") )
	return;
    if( $( '#vis_set' ).width() < 500 ){
	$( '#vis_set .panel-col' ).removeClass('col-sm-12 col-md-6 col-xs-6');
	$( '#vis_set .panel-col' ).addClass('col-xs-12');
	console.log('12')
    }
    else{
	$( '#vis_set .panel-col' ).removeClass('col-sm-12 col-md-6 col-xs-12');
	$( '#vis_set .panel-col' ).addClass('col-xs-6');
	console.log('6')

    }
}

/*
$( "#vis_set_dragger" ).draggable({
    axis: "x",
    delay: 200,
    start: function( event, ui ) {
	$("#vis_set").addClass("notransition");
    },
    drag: function( event, ui ) {
	var rect = document.getElementById("vis_set").getBoundingClientRect()
	var width = ui.position.left - rect.left;
	$("#vis_set").css("width",width);
    },
    stop: function( event, ui ) {
	var perc = event.pageX / window.outerWidth * 100;
	document.documentElement.style.setProperty("--boundary-horizontal", perc + "%");
	$("#vis_set").removeClass("notransition");
	$("#vis_set_dragger").css({"top": "", "left":""});
	$("#vis_set").css("width","");
	setTimeout( function() {
	    ffbomesh.onWindowResize()}, 500 );
    },
});
*/

$('#3d_rendering')[0].checked = ffbomesh.neurons_3d
if(!ffbomesh.neurons_3d)
    $('.option_3d').hide()

$('#3d_rendering').change(function(){
    $('.option_3d').toggle()
    ffbomesh.neurons_3d = !ffbomesh.neurons_3d
});

$('input[type=radio][name=mode3d]').change(function(){
    ffbomesh.mode_3d = parseInt($(this).val());
});

$('#default_radius').bootstrapSlider({value: ffbomesh.default_radius})
    .on("change", function(e){
	ffbomesh.default_radius = e.value.newValue;
    });
$('#default_soma_radius').bootstrapSlider({value: ffbomesh.default_soma_radius})
    .on("change", function(e){
	ffbomesh.default_soma_radius = e.value.newValue;
    });

$('#default_opacity').bootstrapSlider({value: ffbomesh.default_opacity})
    .on("change", function(e){
	ffbomesh.default_opacity = e.value.newValue;
	ffbomesh.resetOpacity();
    });

$('#ambientlight').bootstrapSlider({value: ffbomesh.lightsHelper.frontAmbient.intensity})
    .on("change", function(e){
	ffbomesh.lightsHelper.frontAmbient.intensity = e.value.newValue;
    });

$('#dirlight').bootstrapSlider({value: ffbomesh.lightsHelper.frontDirectional_1.intensity})
    .on("change", function(e){
	ffbomesh.lightsHelper.frontDirectional_1.intensity = e.value.newValue;
	ffbomesh.lightsHelper.frontDirectional_2.intensity = e.value.newValue;
    });


$('#frontSpot_1_posAngle1').bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_1.posAngle1})
    .on("change", function(e){
	ffbomesh.lightsHelper.frontSpot_1.posAngle1 = e.value.newValue;
    });
$('#frontSpot_1_posAngle2').bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_1.posAngle2})
    .on("change", function(e){
	ffbomesh.lightsHelper.frontSpot_1.posAngle2 = e.value.newValue;
    });
$('#frontSpot_1_intensity').bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_1.intensity})
    .on("change", function(e){
	ffbomesh.lightsHelper.frontSpot_1.intensity = e.value.newValue;
    });
$('#frontSpot_1_track')[0].checked = ffbomesh.lightsHelper.frontSpot_1.track
$('#frontSpot_1_track').change(function(){
    ffbomesh.lightsHelper.frontSpot_1.track = !ffbomesh.lightsHelper.frontSpot_1.track
});

$('#frontSpot_2_posAngle1').bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_2.posAngle1})
    .on("change", function(e){
	ffbomesh.lightsHelper.frontSpot_2.posAngle1 = e.value.newValue;
    });
$('#frontSpot_2_posAngle2').bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_2.posAngle2})
    .on("change", function(e){
	ffbomesh.lightsHelper.frontSpot_2.posAngle2 = e.value.newValue;
    });
$('#frontSpot_2_intensity').bootstrapSlider({value: ffbomesh.lightsHelper.frontSpot_2.intensity})
    .on("change", function(e){
	ffbomesh.lightsHelper.frontSpot_2.intensity = e.value.newValue;
    });
$('#frontSpot_2_track')[0].checked = ffbomesh.lightsHelper.frontSpot_2.track
$('#frontSpot_2_track').change(function(){
    ffbomesh.lightsHelper.frontSpot_2.track = !ffbomesh.lightsHelper.frontSpot_2.track
});





$('#highlighted_object_opacity').bootstrapSlider({value: ffbomesh.highlighted_object_opacity})
    .on("change", function(e){
	ffbomesh.highlighted_object_opacity = e.value.newValue;
    });
$('#low_opacity').bootstrapSlider({value: ffbomesh.low_opacity})
    .on("change", function(e){
	ffbomesh.low_opacity = e.value.newValue;
    });
$('#pin_opacity').bootstrapSlider({value: ffbomesh.pin_opacity})
    .on("change", function(e){
	ffbomesh.pin_opacity = e.value.newValue;
    });
$('#pin_low_opacity').bootstrapSlider({value: ffbomesh.pin_low_opacity})
    .on("change", function(e){
	ffbomesh.pin_low_opacity = e.value.newValue;
    });


html='<input class="color_inp" '
if(Modernizr.inputtypes.color)
    html+='type="color" '
else
    html+='type="text" '
html+='name="np_col" id="np_col" value="#' + ffbomesh.meshDict['al_l'].color.getHexString() + '"/>';
$('#neuropil-color').html(html);

if(!Modernizr.inputtypes.color)
    $("#np_col").spectrum({
	showInput: true,
	showPalette: true,
	showSelectionPalette: true,
	showInitial: true,
		localStorageKey: "spectrum.neuronlp",
	showButtons: false,
	move: function(c){
	    ffbomesh.setBackgroundColor( c.toHexString());
	}
    });
else
    $('#np_col').on('change', function(){
	ffbomesh.setBackgroundColor($('#np_col')[0].value);
    });

$('#background_opacity').bootstrapSlider({value: ffbomesh.background_opacity})
    .on("change", function(e){
	ffbomesh.background_opacity = e.value.newValue;
	ffbomesh.resetOpacity();
    });
$('#background_wireframe_opacity').bootstrapSlider({value: ffbomesh.background_wireframe_opacity})
    .on("change", function(e){
	ffbomesh.background_wireframe_opacity = e.value.newValue;
	ffbomesh.resetOpacity();
    });


ssao_pass = ffbomesh.passes['SSAO'];
$('#ssao')[0].checked = ffbomesh.composer.passes[ssao_pass].enabled
$('#ssao').change(function(){
    ffbomesh.composer.passes[ssao_pass].enabled = !ffbomesh.composer.passes[ssao_pass].enabled
});


$('#backambientlight').bootstrapSlider({value: ffbomesh.lightsHelper.backAmbient.intensity})
    .on("change", function(e){
	ffbomesh.lightsHelper.backAmbient.intensity = e.value.newValue;
    });

$('#backdirlight').bootstrapSlider({value: ffbomesh.lightsHelper.backDirectional_1.intensity})
    .on("change", function(e){
	ffbomesh.lightsHelper.backDirectional_1.intensity = e.value.newValue;
	ffbomesh.lightsHelper.backDirectional_2.intensity = e.value.newValue;
    });


$('#backSpot_1_posAngle1').bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_1.posAngle1})
    .on("change", function(e){
	ffbomesh.lightsHelper.backSpot_1.posAngle1 = e.value.newValue;
    });
$('#backSpot_1_posAngle2').bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_1.posAngle2})
    .on("change", function(e){
	ffbomesh.lightsHelper.backSpot_1.posAngle2 = e.value.newValue;
    });
$('#backSpot_1_intensity').bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_1.intensity})
    .on("change", function(e){
	ffbomesh.lightsHelper.backSpot_1.intensity = e.value.newValue;
    });
$('#backSpot_1_track')[0].checked = ffbomesh.lightsHelper.backSpot_1.track
$('#backSpot_1_track').change(function(){
    ffbomesh.lightsHelper.backSpot_1.track = !ffbomesh.lightsHelper.backSpot_1.track
});

$('#backSpot_2_posAngle1').bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_2.posAngle1})
    .on("change", function(e){
	ffbomesh.lightsHelper.backSpot_2.posAngle1 = e.value.newValue;
    });
$('#backSpot_2_posAngle2').bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_2.posAngle2})
    .on("change", function(e){
	ffbomesh.lightsHelper.backSpot_2.posAngle2 = e.value.newValue;
    });
$('#backSpot_2_intensity').bootstrapSlider({value: ffbomesh.lightsHelper.backSpot_2.intensity})
    .on("change", function(e){
	ffbomesh.lightsHelper.backSpot_2.intensity = e.value.newValue;
    });
$('#backSpot_2_track')[0].checked = ffbomesh.lightsHelper.backSpot_2.track
$('#backSpot_2_track').change(function(){
    ffbomesh.lightsHelper.backSpot_2.track = !ffbomesh.lightsHelper.backSpot_2.track
});




$('#default_synapse_radius').bootstrapSlider({value: ffbomesh.default_synapse_radius})
    .on("change", function(e){
	ffbomesh.default_synapse_radius = e.value.newValue;
    });

$('#synapse_opacity').bootstrapSlider({value: ffbomesh.synapse_opacity})
    .on("change", function(e){
	ffbomesh.synapse_opacity = e.value.newValue;
	ffbomesh.resetOpacity();
    });



$('#fxaa')[0].checked = ffbomesh.effectFXAA.enabled
$('#fxaa').change(function(){
    ffbomesh.effectFXAA.enabled = !ffbomesh.effectFXAA.enabled
});

/*
$('#tonemapping')[0].checked = ffbomesh.toneMappingPass.enabled
$('#fxaa').change(function(){
    ffbomesh.toneMappingPass.enabled = !ffbomesh.toneMappingPass.enabled
});
*/
$('#tonemappingbright').bootstrapSlider({value: 1-ffbomesh.toneMappingPass.materialToneMap.uniforms.minLuminance.value})
    .on("change", function(e){
	ffbomesh.toneMappingPass.setMinLuminance(1-e.value.newValue);
    });

$('#bloomradius').bootstrapSlider({value: ffbomesh.bloomPass.radius})
    .on("change", function(e){
	ffbomesh.bloomPass.radius = e.value.newValue;
    });

$('#bloomthreshold').bootstrapSlider({value: ffbomesh.bloomPass.threshold})
    .on("change", function(e){
	ffbomesh.bloomPass.threshold = e.value.newValue;
    });


$('#bloomstrength').bootstrapSlider({value: ffbomesh.bloomPass.strength})
    .on("change", function(e){
	ffbomesh.bloomPass.strength = e.value.newValue;
    });
