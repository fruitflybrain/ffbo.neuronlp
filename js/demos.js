$("#btn-demo").click( function() { $("#demo-panel").slideDown(500) } );
$("#btn-demo-close").click( function() { $("#demo-panel").slideUp(500) } );
$("#btn-tutorial-video").click( function() { $("#video-panel").slideDown(500) } );
$("#btn-video-close").click( function() { $("#video-container")[0].pause(); $("#video-panel").slideUp(500) } );

var script_loader = ScriptLoader(function() {$("#vis-none").click()} );

var auto_type = AutoTyper(srchInput);

var isOnMobile = checkOnMobile();

/*
 * 'Show' demos
 */
var show_1_query = "Show neurons in the Ellipsoid Body";
var show_1_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query neurons in the Ellipsoid Body!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(show_1_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var show_2_query = "Show T4 neurons";
var show_2_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query T4 neurons!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(show_2_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var show_3_query = "Show neurons in the PB";
var show_3_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for neurons in the PB (Photocerebral Bridge)!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(show_3_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var show_4_query = "Show neurons in left lateral horn";
var show_4_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for neurons in the left lateral horn!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(show_4_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var add_1_query_1 = "Show L1 neurons in the Lamina";
var add_1_query_2 = "Add postsynaptic neurons";
var add_1_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query L1 neurons in the Lamina!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(add_1_query_1)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Let's add L1 neurons' postsynaptic neurons!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(add_1_query_2)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var add_2_query_1 = "Show L1 neurons";
var add_2_query_2 = "Add Mi1 neurons";
var add_2_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for L1 neurons!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(add_2_query_1)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Now let's add Mi1 neurons."); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(add_2_query_2)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [1000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var add_3_query_1 = "Show neurons in eb";
var add_3_query_2 = "Add neurons in photocerebral bridge";
var add_3_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for neurons in the ellipsoid body!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(add_3_query_1)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Now let's bring in neurons from photocerebral bridge."); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(add_3_query_2)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var undo_1_query_1 = "Show neurons in eb";
var undo_1_query_2 = "Add neurons in og";
var undo_1_query_3 = "Undo";
var undo_1_query_4 = "Add neurons in PB";
var undo_1_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for neurons in the ellipsoid body!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(undo_1_query_1)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [1000, function() { Notify("Now let's add neurons in the optic glomeruli."); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(undo_1_query_2)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [1000, function() { Notify("Now let's undo what we just did."); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(undo_1_query_3)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [1000, function() { Notify("Now let's add neurons from the PB."); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(undo_1_query_4)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var keep_1_query_1 = "Show neurons in cx";
var keep_1_query_2 = "Keep dopaminergic neurons";
var keep_1_query_3 = "Undo";
var keep_1_query_4 = "Keep neurons that transmit acetycholine";
var keep_1_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for neurons from the entire central complex!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(keep_1_query_1)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Now let's only keep known dopaminergic neurons and remove the rest."); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(keep_1_query_2)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Now let's undo what we just did to get back to all neurons from cx ."); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(keep_1_query_3)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Now let's only keep cholinergic neurons."); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(keep_1_query_4)],
    [null, function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var remove_1_query_1 = "Show neurons in right al";
var remove_1_query_2 = "Remove projection neurons";
var remove_1_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for neurons from the right antennal lobe!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(remove_1_query_1)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Now let's only remove the projection neurons."); }],
    [3000, function() { Notify("We expect to see only local neurons from the right AL after executing the query."); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(remove_1_query_2)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var connecting_1_query = "show neurons connecting right lob to left og";
var connecting_1_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for neurons projecting from right Lobula to left optic glomerulus!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(connecting_1_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var innervating_1_query = "Show neurons innervating optic glomerulus";
var innervating_1_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for neurons innervating optic glomerulus!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(innervating_1_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var dendrite_axon_1_query = "Show neurons having dendritic innervations in right lateral horn";
var dendrite_axon_1_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for neurons that have dendrites in the right lateral horn!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(dendrite_axon_1_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var dendrite_axon_2_query = "Show neurons having dendrites in al and axons in both right lh and left lh";
var dendrite_axon_2_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for neurons that have dendrites in al and axons in both right lh and left lh!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(dendrite_axon_2_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var lptc_query_1 = "show neurons connecting the left lop to the left cvlp";
var lptc_query_2 = "add neurons connecting the right lop to the right cvlp";
var lptc_script = [
    [1000, function() { $("#btn-lpu-group-all").click(); }],
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("It is known that Lobula Plate Tangential Cells are an essential component of optomotor responses."); }],
    [3000, function() { Notify("Let's search for LPTC."); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(lptc_query_1,undefined,20)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [1000, function() { Notify("Now let's add neuron from the other side of the brain."); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(lptc_query_2,undefined,20)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [5000, function() { $("#btn-lpu-group-all").click(); }],
    [5000, function() { $("#btn-lpu-group-none").click(); }],
    [1000, function() { Notify("Now let's select from the workspace some tangential cells and pin them."); }],
    [0,    function() { cursor = new mouseSVG(ffbomesh);}],
    [1000, function() { cursor.show(); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-400392");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-700175");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("fru-F-400542");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-800153");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("Cha-F-200097");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-500650");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-300353");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-300501");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-100111");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("fru-F-100144");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("fru-F-300055");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-200199");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-300567");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-000601");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-700450");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [200, function() {demo_neuron_id = chooseNeuron("VGlut-F-000241");  cursor.moveto(ffbomesh.getNeuronScreenPosition(demo_neuron_id), 10*(!isOnMobile));}],
    [200, function() {visual_highlight_neuron(demo_neuron_id); }],
    [5000, function() { Notify("We can also investigate each of the LPTC individually."); }],
    [2000, function() { Notify("Let's unpinn all the pinned neurons first."); }],
    [1000, function() {cursor.moveto("#page-content-wrapper > nav > div > div.navbar-collapse.collapse > ul > li:nth-child(1) > a",400);}],
    [1000, function() {cursor.click(); $("#page-content-wrapper > nav > div > div.navbar-collapse.collapse > ul > li:nth-child(1) > a").click();}], //toggle neuron
    [1000, function() {cursor.moveto("#btn-neu-none",400);}],
    [1000, function() {cursor.click(); $("#btn-neu-none").click();}],
    [1000, function() {cursor.moveto("#toggle_neuron > ul > li:nth-child(3) > a");}],
    [1000, function() {cursor.click(); $("#toggle_neuron > ul > li:nth-child(3) > a").click(); }], //pinned
    [1000, function() {cursor.moveto("#btn-pin-unpinall",400);}],
    [1000, function() {cursor.click(); $("#btn-pin-unpinall").click(); }], //unpin all
    [1000, function() {cursor.moveto("#page-content-wrapper > nav > div > div.navbar-collapse.collapse > ul > li:nth-child(1) > a",400);}],
    [1000, function() {cursor.click(); $("#page-content-wrapper > nav > div > div.navbar-collapse.collapse > ul > li:nth-child(1) > a").click();}], //toggle neuron
    [1000, function() {cursor.moveto("#btn-neu-none",400);}],
    [1000, function() {cursor.click(); $("#btn-neu-none").click();}],
    [1000, function() { Notify("Now let's toggle the neurpils of interest: LOP and CVLP."); }],
    [1000, function() {cursor.moveto("#page-content-wrapper > nav > div > div.navbar-collapse.collapse > ul > li:nth-child(2) > a",400);}],
    [1000, function() {cursor.click(); $("#page-content-wrapper > nav > div > div.navbar-collapse.collapse > ul > li:nth-child(2) > a").click(); }], //toggle neuropil
    [1000, function() {cursor.moveto("#toggle_neuropil > ul > li:nth-child(2) > a",400);}],
    [1000, function() {cursor.click(); $("#toggle_neuropil > ul > li:nth-child(2) > a").click(); }], //toggle neuropil
    [1000, function() {cursor.moveto("#btn-cvlp_l",400);}],
    [1000, function() {cursor.click(); $("#btn-cvlp_l").click(); }], //toggle cvlp_l
    [1000, function() {cursor.moveto("#btn-cvlp_r");},400],
    [1000, function() {cursor.click(); $("#btn-cvlp_r").click(); }], //toggle cvlp_r
    [1000, function() {cursor.moveto("#btn-lop_l");},400],
    [1000, function() {cursor.click(); $("#btn-lop_l").click(); }], //toggle lop_l
    [1000, function() {cursor.moveto("#btn-lop_r");},400],
    [1000, function() {cursor.click(); $("#btn-lop_r").click(); }], //toggle lop_r
    [1000, function() { Notify("Now let's inspect individual neurons"); }],
    [500, function() {cursor.moveto("#page-content-wrapper > nav > div > div.navbar-collapse.collapse > ul > li:nth-child(1) > a",400);}],
    [500, function() {cursor.click(); $("#page-content-wrapper > nav > div > div.navbar-collapse.collapse > ul > li:nth-child(1) > a").click();}], //toggle neuron
    [500, function() {cursor.moveto("#toggle_neuron > ul > li:nth-child(4) > a",400);}],
    [500, function() {cursor.click(); $("#toggle_neuron > ul > li:nth-child(4) > a").click();}], //single neuron
    [2000, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-400392")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}],
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-700175")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() { cursor.click(); $(demo_neuron_selector).click(); }],
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("fru-F-400542")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() { cursor.click(); $(demo_neuron_selector).click(); }],
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-800153")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() { cursor.click(); $(demo_neuron_selector).click(); }],
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("Cha-F-200097")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() { cursor.click(); $(demo_neuron_selector).click(); }],
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-500650")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-300353")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-300501")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-100111")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("fru-F-100144")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("fru-F-300055")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-200199")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-300567")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-000601")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-700450")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [400, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-000241")); cursor.moveto(demo_neuron_selector,200);}],
    [400, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [1500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [2000, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-400392")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-700175")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("fru-F-400542")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-800153")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("Cha-F-200097")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-500650")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-300353")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-300501")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-100111")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("fru-F-100144")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("fru-F-300055")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-200199")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-300567")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-000601")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-700450")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [500, function() {demo_neuron_selector = "#btn-"+uidDecode(chooseNeuron("VGlut-F-000241")); cursor.moveto(demo_neuron_selector,200);}],
    [500, function() {cursor.click(); $(demo_neuron_selector).click();}], //single neuron
    [4000, function() {cursor.moveto("#page-content-wrapper > nav > div > div.navbar-collapse.collapse > ul > li:nth-child(2) > a",400);}],
    [500, function() {cursor.click(); $("#page-content-wrapper > nav > div > div.navbar-collapse.collapse > ul > li:nth-child(2) > a").click(); }], //toggle neuropil
    [500, function() {cursor.moveto("#toggle_neuropil > ul > li:nth-child(1) > a",400);}],
    [500, function() {cursor.click(); $("#toggle_neuropil > ul > li:nth-child(1) > a").click();}], //single neuron
    [500, function() {cursor.moveto("#btn-lpu-group-all",400);}],
    [500, function() {cursor.click(); $("#btn-lpu-group-all").click();}], //single neuron
    [500, function() {cursor.remove();}],
    [10, function() {delete cursor;}],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var local_1_query_1 = "Show local neurons in the right antennal lobe";
var local_1_query_2 = "Add interneurons in the left antennal lobe";
var local_1_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for local neurons in the right antennal lobe!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(local_1_query_1)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Let's add interneurons in the left antennal lobe!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(local_1_query_2)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var project_1_query = "Show projection neurons in the left mushroom body";
var project_1_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for projection neurons in the left mushroom body!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(project_1_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

var neurotransmitter_1_query_1 = "Show serotonergic neurons in eb";
var neurotransmitter_1_query_2 = "Add glutamatergic neurons in eb";
var neurotransmitter_1_query_3 = "Add cholinergic neurons in eb";
var neurotransmitter_1_query_4 = "Add dopaminergic neurons in eb";
var neurotransmitter_1_query_5 = "Add gabaergic neurons in eb";
var neurotransmitter_1_script = [
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's query for serotonergic neurons in the Ellipsoid Body!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(neurotransmitter_1_query_1)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Let's bring in glutamatergic neurons in the Ellipsoid Body!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(neurotransmitter_1_query_2)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Let's add cholinergic neurons in the Ellipsoid Body!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(neurotransmitter_1_query_3)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Let's also have dopaminergic neurons in the Ellipsoid Body!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(neurotransmitter_1_query_4)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Finally, add gabaergic neurons in the Ellipsoid Body!"); }],
    [3000, function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [1000, auto_type(neurotransmitter_1_query_5)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [500,  function() { $("#search-wrapper").toggleClass("search-top search-middle"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { $("#btn-lpu-group-all").click(); }],
    [2000, function() { Notify("Done!"); }],
    [3000, function() { Notify("It is all yours now! Try it yourself!"); }]
];

/*
 * GUI demo
 */
var highlight_script = [
    [0,    function() { cursor = new mouseSVG(ffbomesh);}],
    [1000, function() { Notify("Hi!"); }],
    [3000, function() { Notify("Let's first bring up neurons in the Ellipsoid Body!"); }],
    [1000, auto_type(show_1_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Let's bring in a cursor!"); }],
    [2000, function() { var rect = $("body")[0].getBoundingClientRect(); cursor.show({'x':(2*rect.width/5), 'y':(2*rect.height/5)}); }],
    [500,  function() { cursor.blink(); }],
    [3000, function() { Notify("Let's move the cursor over the neurons to highlight them!"); }],
    [3000, function() { cursor.test(); }],
    [5000, function() { Notify("Try it yourself!"); }],
    [1000, function() { cursor.svg.remove(); delete cursor;} ]
];

var select_script = [
    [0,    function() { cursor = new mouseSVG(ffbomesh);}],
    [1000, function() { Notify("Hi!"); }],
    [2000, function() { Notify("Let's first bring up neurons in the Ellipsoid Body!"); }],
    [1000, auto_type(show_1_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Let's bring in a cursor!"); }],
    [2000, function() { var rect = $("body")[0].getBoundingClientRect(); cursor.show({'x':(2*rect.width/5), 'y':(2*rect.height/5)}); }],
    [500,  function() { cursor.blink(); }],
    [3000, function() { Notify("Let's move the cursor over a neuron, and click on it!"); }],
    [3000, function() { cursor.moveto(ffbomesh.getNeuronScreenPosition(chooseNeuron("VGlut-F-200478"))); }],
    [1500, function() { cursor.click(); ffbomesh.onDocumentMouseClick(); }],
    [3000, function() { Notify("The information of the selected neuron has been loaded from the FlyCircuit Database!"); }],
    [3000, function() { Notify("Let's enlarge the FlyCircuit information!"); }],
    [3000, function() { cursor.moveto("#flycircuit-info"); }],
    [1100, function() { $("#flycircuit-info").mouseenter().toggleClass("vis-info-sm vis-info-pin")}],
    [3000, function() { Notify("You can go back and forth between the information panel and the visualization!"); }],
    [3000, function() { cursor.moveto("#vis-3d"); }],
    [1000, function() { $("#flycircuit-info").toggleClass("vis-info-sm vis-info-pin").mouseleave()}],
    [3000, function() { cursor.moveto("#flycircuit-info"); }],
    [1100, function() { $("#flycircuit-info").mouseenter().toggleClass("vis-info-sm vis-info-pin")}],
    [3000, function() { Notify("You can pin the information panel to make it remain enlarged."); }],
    [2000, function() { cursor.moveto("#btn-flycircuit-pin"); }],
    [1100, function() { cursor.click(); }],
    [600,  function() { $("#btn-flycircuit-pin").text("unpin"); }],
    [1000, function() { cursor.moveto("#vis-3d"); }],
    [3000, function() { Notify("You can unpin the information panel."); }],
    [2000, function() { cursor.moveto("#btn-flycircuit-pin"); }],
    [1100, function() { cursor.click(); }],
    [600,  function() { $("#btn-flycircuit-pin").text("pin"); }],
    [1000, function() { cursor.moveto("#vis-3d"); }],
    [500,  function() { $("#flycircuit-info").toggleClass("vis-info-sm vis-info-pin").mouseleave()}],
    [3000, function() { Notify("Try it yourself!"); }],
    [1000, function() { cursor.svg.remove(); delete cursor;} ],
];

var pin_query = "Show gabaergic neurons in eb";
var pin_script = [
    [0,    function() { cursor = new mouseSVG(ffbomesh);}],
    [1000, function() { Notify("Hi!"); }],
    [2000, function() { Notify("Let's first bring up gabaergic neurons in the Ellipsoid Body!"); }],
    [1000, auto_type(pin_query)],
    [null, function() { }],
    [500,  function() { $('#srch_box_btn').addClass("search-hover"); }],
    [500,  function() { $('#srch_box_btn').removeClass("search-hover"); }],
    [2000, function() { srchBtn.click(); }],
    [null, function() { }],
    [2000, function() { Notify("Let's bring in a cursor!"); }],
    [2000, function() { var rect = $("body")[0].getBoundingClientRect(); cursor.show({'x':(2*rect.width/5), 'y':(2*rect.height/5)}); }],
    [500,  function() { cursor.blink(); }],
    [3000, function() { Notify("Let's move the cursor over some neurons, and use 'double click' to pin them!"); }],
    [3000, function() { cursor.moveto(ffbomesh.getNeuronScreenPosition(chooseNeuron("Gad1-F-400328"))); }],
    [1500, function() { cursor.dbclick(); ffbomesh.onDocumentMouseDBLClick(); }],
    [3000, function() { cursor.moveto(ffbomesh.getNeuronScreenPosition(chooseNeuron("Gad1-F-200171"))); }],
    [1500, function() { cursor.dbclick(); ffbomesh.onDocumentMouseDBLClick(); }],
    [3000, function() { cursor.moveto(ffbomesh.getNeuronScreenPosition(chooseNeuron("Gad1-F-600135"))); }],
    [1500, function() { cursor.dbclick(); ffbomesh.onDocumentMouseDBLClick(); }],
    [3000, function() { Notify("The pinned neurons always remain highlighted."); }],
    [3000, function() { Notify("Let's hide all unpinned neurons."); }],
    [3000, function() { cursor.moveto("#page-content-wrapper > nav > div > div.navbar-collapse.collapse > ul > li:nth-child(4)", 1500); }],
    [1600, function() { $("#vis-none").addClass("navbar-header-hover"); }],
    [500,  function() { cursor.click(); onHideAllClick();}],
    [500,  function() { Notify("Now we only have pinned neurons in the scene."); }],
    [3000, function() { var rect = $("body")[0].getBoundingClientRect(); cursor.moveto({'x':(1*rect.width/2), 'y':(2*rect.height/5)}); }],
    [200,  function() { $("#vis-none").removeClass("navbar-header-hover"); }],
    [3000, function() { Notify("Want to unpin a neuron?"); }],
    [2000, function() { Notify("Use 'Double click' on a pinned neuron to unpin it."); }],
    [2000, function() { cursor.moveto(ffbomesh.getNeuronScreenPosition(chooseNeuron("Gad1-F-600135")));}],
    [2000, function() { cursor.dbclick(); ffbomesh.onDocumentMouseDBLClick(); }],
    [1500, function() { var rect = $("body")[0].getBoundingClientRect(); cursor.moveto({'x':(1*rect.width/2), 'y':(4*rect.height/5)}); }],
    [5000, function() { Notify("Try it yourself!"); }],
    [1000, function() { cursor.svg.remove(); delete cursor;} ],
];
/*
 * Architecture Demo
 */
function ArchSVG(divID) {
    this.svg = d3.select("#"+divID)
        .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("height" , "100%")
        .attr("width" , "100%")
        .attr('id','arch-svg')
        .attr("viewBox", "0 0 100 300")

    this.browserBlk = this.svg.append("g")
        .style("opacity",0)
    this.browserBlk.append("rect")
        .attr("x", 10)
        .attr("y", 20)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width",80)
        .attr("height",60)
        .style("fill", "#ff7276")
        .style('stroke','#888888')
        .style('stroke-width',2);
    this.browserBlk.append('text')
        .attr("x", 50)
        .attr("y", 50)
        .attr("dy", 3)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr('font','Helvetica Neue')
        .attr('font-size','12px')
        .text('Browser');

    this.nlpBlk = this.svg.append("g")
        .style("opacity",0)
    this.nlpBlk.append("rect")
        .attr("x", 10)
        .attr("y", 120)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width",80)
        .attr("height",60)
        .style("fill", "#5aba7d")
        .style('stroke','#888888')
        .style('stroke-width',2);
    this.nlpBlk.append('text')
        .attr("x", 50)
        .attr("y", 150)
        .attr("dy", 3)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr('font-size','12px')
        .attr('font','Helvetica Neue')
        .text('NLP Module');

    this.naBlk = this.svg.append("g")
        .style("opacity",0);
    this.naBlk.append("rect")
        .attr("x", 10)
        .attr("y", 220)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width",80)
        .attr("height",60)
        .style("fill", "#8f70ff")
        .style('stroke','#888888')
        .style('stroke-width',2);
    this.naBlk.append('text')
        .attr("x", 50)
        .attr("y", 250)
        .attr("dy", 3)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .attr('font','Helvetica Neue')
        .attr('font-size','12px')
        .text('NeuroArch');

    this.br2nlp = this.svg.append("g")
        .style("opacity",0)
        .attr("class", "diagram-path")
    this.br2nlp.append("path")
        .attr("class", "diagram-path-line")
        .attr("d", "M 50 85 L 50 115")
        .style("fill", "none")
        .style('stroke','#ffffff')
        .style('stroke-width',2);
    this.br2nlp.append("path")
        .attr("class", "diagram-path-marker")
        .attr("d", d3.svg.symbol().type("triangle-up").size(30,30))
        .attr("fill","white")
        .attr("transform", "translate(50, 85)")
    this.br2nlp.append("text")
        .attr("x", 50)
        .attr("y", 100)
        .attr("dx", 3)
        .attr("dy", 3)
        .attr("fill", "white")
        .attr('font-size','8px')
        .attr('font','Helvetica Neue')
        .text('NLP Query');
    this.nlp2na = this.svg.append("g")
        .style("opacity",0)
        .attr("class", "diagram-path")
    this.nlp2na.append("path")
        .attr("class", "diagram-path-line")
        .attr("d", "M 50 185 L 50 215")
        .style("fill", "none")
        .style('stroke','#ffffff')
        .style('stroke-width',2);
    this.nlp2na.append("path")
        .attr("class", "diagram-path-marker")
        .attr("d", d3.svg.symbol().type("triangle-up").size(30,30))
        .attr("fill","white")
        .attr("transform", "translate(50, 185)")
    var x = this.nlp2na.append("text")
        .attr("x", 50)
        .attr("y", 200)
        .attr("fill", "white")
        .attr('font-size','8px')
        .attr('font','Helvetica Neue');
    x.append('tspan')
        .attr('x', 53).attr('dy', '-3')
        .text('Database');
    x.append('tspan')
        .attr('x', 53).attr('dy', '10')
        .text('Queries');
    this.na2br = this.svg.append("g")
        .style("opacity",0)
        .attr("class", "diagram-path")
    this.na2br.append("path")
        .attr("class", "diagram-path-line")
        .attr("d", "M 20 215 L 20 85")
        .style("fill", "none")
        .style('stroke','#ffffff')
        .style('stroke-width',2);
    this.na2br.append("path")
        .attr("class", "diagram-path-marker")
        .attr("d", d3.svg.symbol().type("triangle-up").size(30,30))
        .attr("fill","white")
        .attr("transform", "translate(30, 85)")
    x = this.na2br.append("text")
        .attr("x", 50)
        .attr("y", 140)
        .attr("fill", "white")
        .attr('font-size','8px')
        .attr('font','Helvetica Neue');
    x.append('tspan')
        .attr('x', 23).attr('dy', '9')
        .text('Morphology,');
    x.append('tspan')
        .attr('x', 23).attr('dy', '9')
        .text('Neuron Name,');
    x.append('tspan')
        .attr('x', 23).attr('dy', '9')
        .text('Neurotransmitter.');
    this.obj = {
        'na':this.naBlk,
        'nlp':this.nlpBlk,
        'browser':this.browserBlk,
        'br2nlp':this.br2nlp,
        'nlp2na':this.nlp2na,
        'na2br':this.na2br,
    }
    this.hide = function(x) {
        this.obj[x].style("opacity",0);
        return this;
    }
    this.show = function(x) {
        if (this.obj[x].classed('diagram-path')) {
            var line = this.obj[x].select(".diagram-path-line")
            var totalLength = line.node().getTotalLength();
            var dur = totalLength * 12;
            this.obj[x].style("opacity",1);
            this.obj[x].select("text")
                .style("opacity",0)
                .transition()
                    .duration(dur)
                    .style("opacity",1);
            this.obj[x].select(".diagram-path-marker")
                .transition()
                    .duration(dur)
                    .ease("linear")
                    .attrTween("transform", translateAlong(line.node()))

            line
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                    .duration(dur)
                    .ease("linear")
                    .attr("stroke-dashoffset", 0)
        } else
            this.obj[x].transition().duration(500).style("opacity",1);

        return this;
    }
    // Returns an attrTween for translating along the specified path element.
    function translateAlong(path) {
        var l = path.getTotalLength();
        var ps = path.getPointAtLength(0);
        return function(d, i, a) {
            return function(t) {
                var p = path.getPointAtLength(t * l);
                var angl = Math.atan2(p.y - ps.y, p.x - ps.x) * (180 / Math.PI)+90;
                return "translate(" + p.x + "," + p.y + ") rotate(" + angl + ")";
            };
        };
    };
}
var arch_script = [
    [100,  function() { $("#flycircuit-info").hide() }],
    [100,  function() { $("#arch-wrapper").show(); arch_diag = new ArchSVG("arch-wrapper")}],
    [1000, function() { $("#msg-diagram").html("<h1>Fruit Fly Brain Observatory</h1><h2>NeuroNLP Architecture Demo</h2>"); $("#msg-wrapper").fadeIn(500); }],
    [3000, function() { $("#msg-wrapper").fadeOut(500); }],
    [2000, function() { $("#msg-diagram").text("The NeuroNLP interface consists of two key components:"); $("#msg-wrapper").fadeIn(500); }],
    [2000, function() { $("#msg-diagram").html($("#msg-diagram").html()+"<br >&nbsp;&nbsp;&bull;&nbsp;Natural Language Processing Module"); }],
    [100,  function() { arch_diag.show('nlp'); }],
    [2000, function() { $("#msg-diagram").html($("#msg-diagram").html()+"<br >&nbsp;&nbsp;&bull;&nbsp;NeuroArch Database"); }],
    [100,  function() { arch_diag.show('na');}],
    [4000, function() { arch_diag.hide('nlp').hide('na')}],
    [100,  function() { $("#msg-wrapper").fadeOut(500, function() { arch_diag.show('browser'); $("#msg-diagram").html("When a user fires a query from the browser, say");}).fadeIn(500)}],
    [4000, function() { $("#msg-diagram").html($("#msg-diagram").html()+ "<br /><br /> '"); }],
    [100,  auto_type(show_1_query, document.getElementById('msg-diagram'))],
    [null, function() { $("#msg-diagram").html($("#msg-diagram").html()+ "'"); }],
    [2000, function() { $("#msg-wrapper").fadeOut(500, function() {$("#msg-diagram").html("The browser sends the query string to the NLP Module.");}).fadeIn(500)}],
    [100,  function() { arch_diag.show('br2nlp').show('nlp');}],
    [6000, function() { arch_diag.hide('browser'); $("#msg-wrapper").fadeOut(500, function() {$("#msg-diagram").html("The NLP Module parses the query string, ");}).fadeIn(500)}],
    [4000, function() { $("#msg-diagram").html($("#msg-diagram").html()+ "<br /><span style='color:red'>[Show] </span>"); }],
    [500,  function() { $("#msg-diagram").html($("#msg-diagram").html()+ "<span style='color:green'>[neurons]</span> "); }],
    [500,  function() { $("#msg-diagram").html($("#msg-diagram").html()+ "<span style='color:blue'>[in]</span> "); }],
    [500,  function() { $("#msg-diagram").html($("#msg-diagram").html()+ "the "); }],
    [500,  function() { $("#msg-diagram").html($("#msg-diagram").html()+ "<span style='color:yellow'>[Ellipsoid Body]</span>"); }],
    [2000, function() { arch_diag.hide('br2nlp').show('nlp2na').show('na'); $("#msg-diagram").html($("#msg-diagram").html()+ "<br /><br /> After parsing, the NLP Module compiles a set of database queries, and sends it to NeuroArch."); }],
    [6000, function() { $("#msg-wrapper").fadeOut(500, function() { arch_diag.hide('nlp').hide('nlp2na'); $("#msg-diagram").html("NeuroArch retrieves data from the database, and then sends the data back to the browser. "); }).fadeIn(500, function() {arch_diag.show('na2br').show('browser'); })}],
    [6000, function() { $("#msg-wrapper").fadeOut(500, function() { arch_diag.hide('na').hide('na2br'); $("#msg-diagram").html("After receiving the data, the browser uses the 3D engine to visualize neurons. ");}).fadeIn(500)}],
    [6000, function() { $("#msg-wrapper").fadeOut(500, function() { $("#msg-diagram").html("Now, let's launch the query!"); }).fadeIn(500)} ],
    [2000, function() { $("#msg-diagram").html($("#msg-diagram").html() + "<br /><br />You will see notification messages pop up at the bottom right corner."); } ],
    [4200, function() { arch_diag.svg.remove(); delete arch_diag; $("#arch-wrapper").hide(); }],
    [1000, function() { $("#msg-wrapper").fadeOut(500); srchBtn.click(); }],
    [null, function() { $("#vis-all").click(); }],
    [100,  function() { $("#flycircuit-info").show() }],
];

demo_json = [
    {
        'demo_name': 'FFBO Architecture Demo',
        'demo_id': 'arch_demo',
        'demo_list': [
            {
                'id': 'arch',
                'name':'FFBO Architecture',
                'description':'Demonstrate the work flow of the FFBO architecture.',
                'script':arch_script
            }
        ]
    },
    {
        'demo_name': 'Basic Usage',
        'demo_id': 'basic_usage',
        'demo_list': [
            {
                'id': 'show_1',
                'name':'Show',
                'description':'Show neurons in the Ellipsoid Body.',
                'script':show_1_script
            },
            {
                'id': 'show_2',
                'name':'Show',
                'description':'Visualize T4 neurons in the Medulla',
                'script':show_2_script
            },
            {
                'id': 'show_3',
                'name':'Show',
                'description':'Visualize neurons in the photocerebral bridge',
                'script':show_3_script
            },
            {
                'id': 'show_4',
                'name':'Show',
                'description':'Visualize neurons in the left lateral horn.',
                'script':show_4_script
            },
            {
                'id': 'add_1',
                'name':'Add',
                'description':'Show L1 neurons in the Lamina, add their postsynaptic neurons.',
                'script':add_1_script
            },
            {
                'id': 'add_2',
                'name':'Add',
                'description':'Visualize L1 neurons and then add Mi1 neurons.',
                'script':add_2_script
            },
            {
                'id': 'add_3',
                'name':'Add',
                'description':'Visualize neurons in Ellipsoid Body and then add neurons in the Photocerebral Bridge.',
                'script':add_3_script
            },
            {
                'id': 'undo_1',
                'name':'Undo',
                'description':'Go back to a previous step (UNDO).',
                'script': undo_1_script
            },
            {
                'id': 'keep_1',
                'name':'Keep',
                'description':'Filter neurons in the current workspace based on a specific query.',
                'script': keep_1_script
            },
            {
                'id': 'remove_1',
                'name':'Remove',
                'description':'Remove neurons from the current workspace based on a specific query.',
                'script': remove_1_script
            }
        ]
    },
    {
        'demo_name': 'GUI Usage',
        'demo_id': 'gui_demo',
        'demo_list': [
            {
                'id': 'gui_highlight',
                'name':'Highlight',
                'description':'Moving cursor over a neuron will highlight it.',
                'script':highlight_script
            },
            {
                'id': 'gui_select',
                'name':'Select',
                'description':'Click on a neuron to show its information from FlyCircuit Database.',
                'script':select_script
            },
            {
                'id': 'gui_pin',
                'name':'Pin',
                'description':'Pin a neuron via "Double Click" to make it stick in the scene.',
                'script': pin_script
            }

        ]
    },
    {
        'demo_name': 'Neurons and Neurotransmitters',
        'demo_id': 'nan_demo',
        'demo_list': [
            {
                'id': 'projection',
                'name':'Projection Neuron',
                'description':'Show projection neurons in the left mushroom body.',
                'script': project_1_script
            },
            {
                'id': 'local',
                'name':'Local Neuron/Interneurons',
                'description':'Show local neurons in the right antennal lobe, and add interneurons in the left antennal lobe.',
                'script':local_1_script
            },
            {
                'id': 'neurotransmitter',
                'name':'Serotonergic/Glutamatergic/Cholinergic/Dopaminergic/Gabaergic Neurons',
                'description':'Show serotonegic neurons in the Ellipsoid Body, and sequentially add glutamatergic, cholinergic, dopaminergic and gabaergic neurons.',
                'script':neurotransmitter_1_script
            }
        ]
    },
    {
        'demo_name': 'Advanced Demonstrations',
        'demo_id': 'adv_demo',
        'demo_list': [
            {
                'id': 'connecting_1',
                'name':'Tract based queries',
                'description':'Show neurons projecting from right Lobula to left optic glomerulus.',
                'script': connecting_1_script
            },
            {
                'id': 'innervating_1',
                'name':'Innervations/Arborizations',
                'description': 'Visualize neurons innervating the optic glomerulus.',
                'script': innervating_1_script
            },
            {
                'id': 'dendrite_axon_1',
                'name':'Dendritic Innervations/Arborizations',
                'description': 'Visualize neurons with dendrites in the right lateral horn.',
                'script': dendrite_axon_1_script
            },
            {
                'id': 'dendrite_axon_2',
                'name':'Axon/Dendrite Arborizations',
                'description': 'Visualize neurons connecting antennal lobe to both left and right lateral horn.',
                'script': dendrite_axon_2_script
            },
            {
                'id': 'lptc',
                'name': 'Lobula Plate Tangential Cells',
                'description': 'Query for Lobula Plate Tangential Cells.',
                'script': lptc_script
            }
/*
            {
                'id': 'visual',
                'name':'L1-Pathway',
                'description':'Visualize on-edge pathway in mention detection neural circuit.',
                'script':undefined
            }
*/
        ]
    }
]


function demoBtnCallback(script) {
    return function() {
        $("#btn-pin-unpinall").click();
        onHideAllClick();
        $("#demo-panel").slideUp(500);
        ffbomesh.controls.reset();
        script_loader(script);
    }
}

function chooseNeuron(name) {
    for(var i in ffbomesh.meshDict) {
        if (ffbomesh.meshDict[i].name == name) {
            return i;
        }
    }
}

function visual_highlight_neuron(demo_neuron_id) {
    demo_neuron_name = ffbomesh.meshDict[demo_neuron_id].name;
    cursor.dbclickshort();
    ffbomesh.togglePin(demo_neuron_id);
    if (ffbomesh.dispatch['dblclick'] !== undefined ) {
        ffbomesh.dispatch['dblclick'](demo_neuron_id, demo_neuron_name, ffbomesh.meshDict[demo_neuron_id]['pinned']);
    }
}

function add_neuron_click(demo_neuron_id) {
    demo_neuron_name = ffbomesh.meshDict[demo_neuron_id].name;
    ffbomesh.highlight(demo_neuron_id)
    ffbomesh.dispatch['click'](demo_neuron_id, demo_neuron_name);
}


for (var i = 0; i < demo_json.length; i++ ) {
    $("#demo-table-wrapper").append(
        "<h4>" + demo_json[i]['demo_name'] + "</h4>" +
        "<table id='table-demo-" + demo_json[i]['demo_id'] + "' class='table-demo table table-inverse table-hover'>" +
            "<thead class='thead-inverse'><tr><th>#</th><th>Keyword</th><th>Description</th><th></th></tr></thead>" +
            "<tbody id='basic-table-demo-body' class='table-demo-body'></tbody>" +
        "</table>"
    );
    var dlist = demo_json[i]['demo_list'];
    for (var j = 0; j < dlist.length; j++ ) {
        $("#table-demo-" + demo_json[i]['demo_id']).append(
            "<tr><th>" + (j+1) + "</th><td>" + dlist[j].name + "</td><td>" + dlist[j].description + "</td><td><button id='btn-demo-" + dlist[j].id + "' class='btn btn-danger btn-xs'>Launch</button></td></tr>"
        )
        if (dlist[j].script !== undefined)
            $("#btn-demo-" + dlist[j].id).click( demoBtnCallback(dlist[j].script) );
        else
            $("#btn-demo-" + dlist[j].id).prop( 'disabled', true);

    }
}
