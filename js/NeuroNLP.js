// For any third party dependencies, like jQuery, place them in the lib folder.
//define('modernizr', [], Modernizr);

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.

define('three', ['https://cdn.rawgit.com/mrdoob/three.js/r92/build/three.min.js'], function (THREE) {
  window.THREE = THREE;
  return THREE;
});
requirejs.config({
  baseUrl: '/js',
  paths: {
    // app: 'app',
    mesh3d: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.lib@flycircuit/js/mesh3d',
    client: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/client',
    overlay: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/overlay',
    visualizationsettings: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/visualizationsettings',
    ffbodemoplayer: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/ffbodemoplayer',
    dynamicmenu: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/dynamicmenu',
    tags: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/tags',
    propertymanager: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.lib@flycircuit/js/propertymanager',
    ui: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/ui',
    infopanel: 'info_panel/infopanel', //'//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/info_panel/infopanel',
    connsvg: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/info_panel/connsvg',
    conntable: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/info_panel/conntable',
    preprocess: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/info_panel/preprocess',
    summarytable: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.neuronlp@flycircuit/js/info_panel/summarytable',
    autobahn: '//cdn.jsdelivr.net/gh/crossbario/autobahn-js-browser@master/autobahn/autobahn.min',
    d3: '//cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min',
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
    detector: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/Detector',
    simplifymodifier: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/utils/SceneUtils',
    lut: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/math/Lut',
    copyshader: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/shaders/CopyShader',
    convolutionshader: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/shaders/ConvolutionShader',
    fxaashader: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/shaders/FXAAShader',
    ssaoshader: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/shaders/SSAOShader',
    luminosityhighpassshader: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/shaders/LuminosityHighPassShader',
    luminosityshader: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/shaders/LuminosityShader',
    tonemapshader: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/shaders/ToneMapShader',
    gammacorrectionshader: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/shaders/GammaCorrectionShader',
    effectcomposer: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/postprocessing/EffectComposer',
    renderpass: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/postprocessing/RenderPass',
    ssaarenderpass: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/postprocessing/SSAARenderPass',
    shaderpass: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/postprocessing/ShaderPass',
    ssaopass: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/postprocessing/SSAOPass',
    maskpass: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/postprocessing/MaskPass',
    bloompass: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/postprocessing/BloomPass',
    unrealbloompass: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/postprocessing/UnrealBloomPass',
    adaptivetonemappingpass: '//cdn.jsdelivr.net/gh/mrdoob/three.js@r92/examples/js/postprocessing/AdaptiveToneMappingPass',
    trackballcontrols: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.lib@flycircuit/js/TrackballControls',
    lightshelper: '//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.lib@flycircuit/js/lightshelper',
    modernizr: "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min",
    d3: "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3",
    jqueryui: "//code.jquery.com/ui/1.12.1/jquery-ui",
    perfectscrollbar: "//cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.7.0/js/perfect-scrollbar.jquery.min",
    "jquery.mobile": "//code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min",
    spectrum: "//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min",
    "jquery.mmenu": "//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.lib@flycircuit/js/jquery.mmenu.all",
    bootsrapslider: "//cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/10.0.0/bootstrap-slider.min",
    swiper: "//cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.2/js/swiper.min",
    bootstrap: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min",
    blockui: "//cdnjs.cloudflare.com/ajax/libs/jquery.blockUI/2.70/jquery.blockUI.min",
    tageditor: "//cdnjs.cloudflare.com/ajax/libs/tag-editor/1.0.20/jquery.tag-editor.min",
    izitoast: "//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.lib@flycircuit/js/iziToast.min",
    stats: "//cdn.jsdelivr.net/gh/fruitflybrain/ffbo.lib@flycircuit/js/stats.min"
    /* Notify, bootbox, colormaps, demos, mouse, vis_set, ResizeSensor, read_vars, colorm[aps */
  },
  shim: {
    bootstrap: { deps: ['jquery'] },
    modernizr: { exports: 'Modernizr' },
    detector: { deps: ['three'], exports: 'Detector' },
    trackballcontrols: { deps: ['three'] },
    simplifymodifier: { deps: ['three'] },
    lut: { deps: ['three'] },
    copyshader: { deps: ['three'] },
    convolutionshader: { deps: ['three'] },
    fxaashader: { deps: ['three'] },
    ssaoshader: { deps: ['three'] },
    luminosityhighpassshader: { deps: ['three'] },
    luminosityshader: { deps: ['three'] },
    tonemapshader: { deps: ['three'] },
    gammacorrectionshader: { deps: ['three'] },
    effectcomposer: { deps: ['three'] },
    renderpass: { deps: ['three', 'effectcomposer'] },
    ssaarenderpass: { deps: ['three', 'effectcomposer'] },
    shaderpass: { deps: ['three', 'effectcomposer'] },
    ssaopass: { deps: ['three', 'effectcomposer', 'shaderpass'] },
    maskpass: { deps: ['three', 'effectcomposer'] },
    bloompass: { deps: ['three', 'effectcomposer'] },
    unrealbloompass: { deps: ['three', 'effectcomposer'] },
    adaptivetonemappingpass: { deps: ['three', 'effectcomposer'] },
    tageditor: { deps: ['jquery'] },
  },
  waitSeconds: 15
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
  'dynamicmenu',
  'ui',
  'tags',
  'izitoast',
  'ffbodemoplayer',
  'visualizationsettings',
  'bootstrap',
  //'jquery.mobile',
  'jqueryui',
  'blockui'
]
  , function (
    $,
    FFBOClient,
    THREE,
    Detector,
    FFBOMesh3D,
    InfoPanel,
    FFBODynamicMenu,
    NeuroNLPUI,
    Tags,
    iziToast,
    FFBODemoPlayer,
    FFBOVisualizationSettings
  ) {

    iziToast.settings({
      timeout: 3000,
      resetOnHover: true,
      transitionIn: 'flipInX',
      transitionOut: 'flipOutX',
    })

    var isOnMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    //$.mobile.ajaxEnabled = false;
    window.NeuroNLPUI = new NeuroNLPUI();
    var infoPanel = new InfoPanel("info-panel");
    var dynamicNeuronMenu = new FFBODynamicMenu({ singleObjSel: '#single-neu > .mm-listview', pinnedObjSel: '#single-pin > .mm-listview', removable: true, pinnable: true });
    var dynamicNeuropilMenu = new FFBODynamicMenu({ singleObjSel: '#toggle_neuropil > .mm-listview', compare: 'LeftRight' });
    var ffbomesh = new FFBOMesh3D('vis-3d', undefined, { "globalCenter": { 'x': 0, 'y': -250, 'z': 0 } });
    var tagsPanel = new Tags('tagsMenu');
    var client = new FFBOClient();
    var visualizationSettings = new FFBOVisualizationSettings(ffbomesh);
    window.NeuroNLPUI.onCreateTag = (tagsPanel.onCreateTag).bind(tagsPanel);
    window.NeuroNLPUI.onRetrieveTag = (tagsPanel.onRetrieveTag).bind(tagsPanel);

    var tagLoad = false;
    var queryLoad = false;
    var searchParams = new URLSearchParams(document.location.search);
    if (searchParams.get('tag')) {
      tagLoad = true;
    }
    if (searchParams.get('query')) {
      queryLoad = true;
    }


    client.startConnection("guest", "guestpass", "wss://neuronlp.fruitflybrain.org/ws");

    //ffbomesh.settings.neuron3d = 1;
    function dataCallback(data) {
      var morph_data = {};
      var nodes = data['nodes'];
      var edges = data['edges'];
      var rid;
      for (var key in nodes) {
        var unit = nodes[key];
        if (unit['class'] != 'MorphologyData') {
          for (var i = 0; i < edges.length; i++) {
            if (edges[i][0] == key && edges[i][2]['class'] == 'HasData') {
              rid = edges[i][1];
              var morphology = nodes[edges[i][1]];
              if (morphology['class'] == 'MorphologyData') {
                for (var key1 in morphology) {
                  unit[key1] = morphology[key1];
                }
                morph_data[rid] = unit;
                break;
              }
            }
          }
        }
      }
      ffbomesh.addJson({ ffbo_json: morph_data, type: 'morphology_json' });
    }

    window.client = client;
    window.tagsPanel = tagsPanel;
    window.ffbomesh = ffbomesh;
    window.infoPanel = infoPanel;

    function retrieveTagData(metadata) {
      queryID = client.retrieveState({ success: dataCallback }, "add");
      client.status.on("change", function () {
        ffbomesh.import_state(metadata);
        $('#ui-blocker').hide();
      }, queryID);
    }

    function retrieveTagCallback(data) {
      metadata = data;
      if ('settings' in metadata) {
        settings = metadata.settings;
        delete metadata['settings'];
        if (tagLoad) {
          tagLoad = false;
          ffbomesh.import_settings(settings);
          retrieveTagData(metadata);
        }
        else {
          iziToast.info({
            close: false,
            timeout: false,
            drag: false,
            overlay: true,
            title: "Visualization Settings",
            message: "Load Visualization Settings from the tag and override your settings?",
            position: "center",
            buttons: [
              ['<button><b>YES</b></button>', function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                iziToast.info({ message: "Note that you can revert to default settings from the visualization settings menu" })
                $('#ui-blocker').show();
                ffbomesh.import_settings(settings);
                retrieveTagData(metadata);
              }, true],
              ['<button>NO</button>', function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
                $('#ui-blocker').show();
                retrieveTagData(metadata);
              }],
            ],
          });
        }
      }
      else { retrieveTagData(metadata); }
    }

    /*
     * Overload the create Tag function.
     */
    tagsPanel.createTag = function (tagName) {
      client.createTag(tagName, Object.assign({}, ffbomesh.export_state(), {
        settings: ffbomesh.export_settings(),
        //keywords: keywords
      }));
    }
    /*
     * Overload the retrieve Tag function.
     */
    tagsPanel.retrieveTag = function (tagName) {
      queryID = client.retrieveTag(tagName, { success: retrieveTagCallback });
      client.status.on("change", function (e) { if (e.value == -1) $('#ui-blocker').hide(); }, queryID);
    }

    var ex_tag = { 'name': 'nikul_7', 'desc': 'This tag shows the alpha lobe of the mushroom body.', 'keywords': ['mushroom body', 'alpha lobe'], 'FFBOdata': { extra: 'This tag has been created by the FFBO team.' } };
    tagsPanel.populateTags([ex_tag]);
    /*
   * Add tag retrieval functionality.
   */
    tagsPanel.activateTagLinks = (function (tagName) {
      $('.tag-el').click(() => {
        this.retrieveTag($(this).attr('tag_name'));
        this.overlay.closeAll();
      });
    }).bind(tagsPanel)
    tagsPanel.activateTagLinks();
    /*
   * Hide the tag search menu for now.
   */
    $('#tagSearchMenuWrapper').hide();

    var oldHeight = ffbomesh.container.clientHeight;
    var oldWidth = ffbomesh.container.clientWidth;

    setInterval(() => {
      if (oldHeight != ffbomesh.container.clientHeight || oldWidth != ffbomesh.container.clientWidth) {
        ffbomesh.onWindowResize();
        infoPanel.resize();
        oldHeight = ffbomesh.container.clientHeight;
        oldWidth = ffbomesh.container.clientWidth;
      }
    }, 200);


    if (!isOnMobile)
      client.notifySuccess = function (message) {
        if (message == "Fetching results from NeuroArch")
          iziToast.success({ message: message, icon: "fa fa-clock" })
        else
          iziToast.success({ message: message })
      }

    client.notifyError = function (message, timeout) {
      if (timeout == undefined) {
        iziToast.error({ message: message, timeout: false });
      }
      else {
        iziToast.error({ message: message, timeout: timeout });
      }
      $('#ui-blocker').hide();
    }

    client.receiveCommand = function (message) {
      if (!'commands' in message)
        return;
      if ('reset' in message['commands']) {
        ffbomesh.reset();
        delete message.commands.reset;
      }
      for (var cmd in message["commands"])
        ffbomesh.execCommand({ "commands": [cmd], "neurons": message["commands"][cmd][0], "args": message['commands'][cmd][1] });
    }


    infoPanel.isInWorkspace = (rid) => {
      return (rid in ffbomesh.meshDict);
    };

    infoPanel.addByUname = (uname) => {
      queryID = client.addByUname(uname, { success: dataCallback });
    };

    infoPanel.addByRid = (rid) => {
      queryID = client.addByRid(rid, { success: dataCallback });
    };

    infoPanel.addNeuronByUname = (uname) => {
      queryID = client.addNeuronByUname(uname, { success: dataCallback });
    };

    infoPanel.addSynapseByUname = (uname) => {
      queryID = client.addSynapseByUname(uname, { success: dataCallback });
    };

    infoPanel.removeByUname = (uname) => {
      queryID = client.removeByUname(uname);
    };

    infoPanel.removeByRid = (rid) => {
      queryID = client.removeByRid(rid);
    };

    infoPanel.removeNeuronByUname = (uname) => {
      queryID = client.removeNeuronByUname(uname);
    };

    infoPanel.removeSynapseByUname = (uname) => {
      queryID = client.removeSynapseByUname(uname);
    };

    infoPanel.getAttr = (id, attr) => {
      if (attr !== 'color') {
        return undefined;
      }
      return ffbomesh.meshDict[id].color.getHexString();
    };
    infoPanel.setAttr = (id, attr, value) => {
      if (attr !== 'color') {
        return;
      }
      ffbomesh.setColor(id, value);
    };

    ffbomesh.on('click', function (e) {
      $("#info-intro").hide();
      //$("#info-panel").show();
      queryID = client.getInfo(e.value, {
        success: function (data) {
          data['summary']['rid'] = e.value;
          infoPanel.update(data);
        }
      });
    })



    dynamicNeuronMenu.dispatch.highlight = function (id) { ffbomesh.highlight(id, true) };
    dynamicNeuronMenu.dispatch.resume = function (id) { ffbomesh.highlight(undefined) };
    dynamicNeuronMenu.dispatch.toggle = function (id) { ffbomesh.toggleVis(id) };
    dynamicNeuronMenu.dispatch.togglePin = function (id) { ffbomesh.togglePin(id) };
    dynamicNeuronMenu.dispatch.unpin = function (id) { ffbomesh.unpin(id) };
    dynamicNeuronMenu.dispatch.remove = function (id) { client.removeObjs(id) };
    dynamicNeuronMenu.dispatch.getInfo = function (id) { ffbomesh.select(id) };
    dynamicNeuropilMenu.dispatch.toggle = function (id) { ffbomesh.toggleVis(id) };
    dynamicNeuropilMenu.dispatch.getInfo = function (id) { ffbomesh.toggleVis(id) };
    dynamicNeuropilMenu.dispatch.highlight = function (id) { ffbomesh.highlight(id, true) };
    dynamicNeuropilMenu.dispatch.resume = function (id) { ffbomesh.highlight(undefined) };

    ffbomesh.on('add',
      function (e) {
        if (!e.value.background)
          dynamicNeuronMenu.addNeuron(e.prop, e.value.label);
        else
          dynamicNeuropilMenu.addNeuron(e.prop, e.value.label)
        infoPanel.renderAddRemoveBtn(e.value.label, true)
      });
    ffbomesh.on('remove', function (e) {
      if (!e.value.background)
        dynamicNeuronMenu.removeNeuron(e.prop)
      infoPanel.renderAddRemoveBtn(e.value.label, false)
    });
    ffbomesh.on('visibility', (function (e) {
      //if(this.states.highlight !== e.path[0])
      dynamicNeuronMenu.toggleVisibility(e.path[0], e.value)
    }
    ).bind(ffbomesh));
    ffbomesh.on('pinned', function (e) { dynamicNeuronMenu.updatePinnedNeuron(e.path[0], e.obj.label, e.value) });


    function updateThreshold(e) { client.threshold = e.value ? "auto" : "auto"; }
    updateThreshold({ value: ffbomesh.settings.neuron3d })
    ffbomesh.settings.on('change', updateThreshold, 'neuron3d')

    function removeUnpinned() {
      var list = ffbomesh.getPinned();
      client.keepObjs(list);
    }

    function removePinned() {
      var list = ffbomesh.getPinned();
      client.removeObjs(list);
    }

    var srchInput = document.getElementById('srch_box');
    var srchBtn = document.getElementById('srch_box_btn');

    window.NLPsearch = function (query) {
      window.NeuroNLPUI.closeAllOverlay();
      return new Promise(function (resolve, reject) {
        if (query == undefined) {
          query = document.getElementById('srch_box').value;
        }
        $("#search-wrapper").block({ message: null });
        srchInput.blur();

        queryID = client.executeNLPquery(query, { success: dataCallback });
        client.status.on("change", function (e) {
          $("#search-wrapper").unblock();
          if (!isOnMobile)
            srchInput.focus();
          srchInput.value = "";
          if (e.value == -1)
            reject();
          else
            resolve();
        }, queryID);
      });
    }

    //add event listener
    srchBtn.addEventListener('click', function (event) {
      NLPsearch();
    });

    srchInput.addEventListener("keyup", function (event) {
      event.preventDefault();
      if (event.keyCode == 13)
        srchBtn.click();
    });

    window.NeuroNLPUI.dispatch.onRemovePinned = (function () { removePinned() });
    window.NeuroNLPUI.dispatch.onRemoveUnpinned = (function () { removeUnpinned() });
    window.NeuroNLPUI.dispatch.onShowAllNeuron = (function () { ffbomesh.showFrontAll() });
    window.NeuroNLPUI.dispatch.onHideAllNeuron = (function () { ffbomesh.hideFrontAll() });
    window.NeuroNLPUI.dispatch.onShowAllNeuropil = (function () { ffbomesh.showBackAll() });
    window.NeuroNLPUI.dispatch.onHideAllNeuropil = (function () { ffbomesh.hideBackAll() });
    window.NeuroNLPUI.dispatch.onUnpinAll = (function () { ffbomesh.unpinAll() });

    ffbomesh.createUIBtn("showSettings", "fa-cog", "Settings")
    ffbomesh.createUIBtn("takeScreenshot", "fa-camera", "Download Screenshot")
    ffbomesh.createUIBtn("showInfo", "fa-info-circle", "GUI guideline")
    ffbomesh.createUIBtn("resetView", "fa-refresh", "Reset View")
    ffbomesh.createUIBtn("resetVisibleView", "fa-align-justify", "Center and zoom into visible Neurons/Synapses")
    ffbomesh.createUIBtn("showAll", "fa-eye", "Show All")
    ffbomesh.createUIBtn("hideAll", "fa-eye-slash", "Hide All")
    ffbomesh.createUIBtn("removeUnpin", "fa-trash", "Remove Unpinned Neurons")
    ffbomesh.createUIBtn("downData", "fa-download", "Download Connectivity")

    ffbomesh.on('showSettings', (function () { window.NeuroNLPUI.onClickVisualizationSettings() }));
    ffbomesh.on('resetView', (function () { ffbomesh.resetView() }));
    ffbomesh.on('resetVisibleView', (function () { ffbomesh.resetVisibleView() }));
    ffbomesh.on('removeUnpin', (function () { removeUnpinned() }));
    ffbomesh.on('hideAll', (function () { ffbomesh.hideAll() }));
    ffbomesh.on('showAll', (function () { ffbomesh.showAll() }));
    ffbomesh.on('takeScreenshot', (function () { ffbomesh._take_screenshot = true; }));
    ffbomesh.on('showInfo', function () { window.NeuroNLPUI.GUIinfoOverlay.show(); });

    $.getJSON("/data/config.json", function (json) {
      ffbomesh.addJson({
        ffbo_json: json,
        showAfterLoadAll: true
      }).then(function () {

        var c = json[Object.keys(json)[0]].color;
        var rgb = parseInt(c.b * 255) | (parseInt(c.g * 255) << 8) | (parseInt(c.r * 255) << 16);
        var hex = '#' + (0x1000000 + rgb).toString(16).slice(1);
        visualizationSettings.setColorPickerBackground(hex);
        if (!tagLoad) $('#ui-blocker').hide();
        srchInput.focus();
        if (client.loginStatus.connected) {
          tagsPanel.retrieveTag(searchParams.get('tag'))
        } else {
          client.loginStatus.on("change", function () {
            if (tagLoad) tagsPanel.retrieveTag(searchParams.get('tag'))
            if (queryLoad) NLPsearch(searchParams.get('query'))
          }, "connected");
        }
      });
    });
    demoLoad = false;
    //ffbomesh.settings.defaultSynapseRadius = 0.4;
    $(document).ready(function () {
      window.ffbomesh.createUIBtn("showGraph", "fa-bar-chart", "Show Connectivity Graph");
      GvisInitCallbacks();
      GvisInitGraphs();
      if (isOnMobile)
        ffbomesh.backrenderSSAO.enabled = false;
      FFBODemoPlayer = new FFBODemoPlayer(ffbomesh, $('#ui_menu_nav').data('mmenu'));
      window.FFBODemoPlayer = FFBODemoPlayer;
      FFBODemoPlayer.onLoadingTag = () => {
        tagLoad = true;
      };
      FFBODemoPlayer.notify = function (message, settings) {
        iziToast.info(Object.assign({ message: message }, settings))
      }
      FFBODemoPlayer.afterDemo = function () {
        iziToast.hide({ transitionOut: 'fadeOut' }, document.querySelector('.demoplayer-status-notify'));
      }
      FFBODemoPlayer.beforeDemo = (function (keyword) {
        timeout = demoLoad && isOnMobile ? 2000 : false
        this.ffbomesh.resetView();
        iziToast.info({
          close: true,
          class: 'demoplayer-status-notify',
          timeout: timeout,
          drag: false,
          overlay: false,
          color: 'yellow',
          title: "Demo",
          message: "Running <u>" + keyword + "</u> Demo",
          position: "topCenter",
          buttons: [
            ['<button><b>Stop</b></button>', function (instance, toast) {
              instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
              FFBODemoPlayer.stopDemo();
            }, true],
          ],
        });
        window.NeuroNLPUI.closeAllOverlay();
      }).bind(FFBODemoPlayer);
      $.getJSON("/data/demos.json", function (json) {
        FFBODemoPlayer.addDemos(json);
        FFBODemoPlayer.updateDemoTable('#demo-table-wrapper');
        if (searchParams.get('demo') && !searchParams.get('tag')) {
          demoLoad = true;
          FFBODemoPlayer.startDemo(searchParams.get('demo'))
        }
      });
    });
    var textFile = null;
    ffbomesh.on("downData", function () {
      if (!ffbomesh.uiVars.frontNum) {
        client.notifyError("No neurons present in scene");
        return;
      }
      if (ffbomesh.uiVars.frontNum > 500) {
        client.notifyError("NeuroNLP currently limits this feature for use with upto 500 neurons");
        return;
      }
      iziToast.info({
        class: 'fetching_conn_notification',
        message: "Fetching Connectivity Data",
        timeout: 2000,
        color: 'green',
        close: false
      })
      $('#ui-blocker').show();
      client.getConnectivity(function () { $('#ui-blocker').hide(); });
    });
  });


window.onbeforeunload = function () {
  return true;
};
