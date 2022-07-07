// Adapted from https://stackoverflow.com/a/30538574
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

moduleExporter("NeuroNLPUI", ["jquery", "overlay", "jquery.mmenu"], function($, Overlay){
  function NeuroNLPUI(){
    var _this = this;
    var mm_menu_right = undefined;

    this.dispatch = {
      onWindowResize: (function() {}),
      removePinned: (function() {}),
      removeUnpinned: (function() {}),
      onShowAllNeuron: (function() {}),
      onHideAllNeuron: (function() {}),
      onShowAllNeuropil: (function() {}),
      onHideAllNeuropil: (function() {}),
      onUnpinAll: (function() {})
    }

    this.GUIinfoOverlay = new Overlay("gui-3d", "");
    this.overviewPanel = new Overlay("overview-panel", "");
    this.referencePanel = new Overlay("quick-reference-panel", "");
    this.announcePanel = new Overlay("announce-panel", "");
    this.featurePanel = new Overlay("feature-panel", "");
    this.neuronlpSwitch = new Overlay("neuronlp-switch", "");
    this.demoTable = new Overlay("demo-panel", `
<ul class="list-inline">
  <li><h2>Demos </h2></li>
</ul>
<div id="demo-table-wrapper" class="demo-table-wrapper"></div>`);

    this.onShowDemo = function(){
      mm_menu_right.close();
      this.demoTable.show()
    }
    this.onShowNeuroNLP = () => {
      mm_menu_right.close();
      this.neuronlpSwitch.show();
    }

    this.closeAllOverlay = () => {
      this.neuronlpSwitch.closeAll();
    }
    /*this.onShowIntro = () => {
      mm_menu_right.close();
      setTimeout( function() {
        closeAllOverlay(true);
        $("#intro-panel").slideDown(500);
      }, 500);
    }*/

    this.onShowOverview = () => {
      mm_menu_right.close();
      this.overviewPanel.show();
    }
    this.onShowReference = () => {
      mm_menu_right.close();
      this.referencePanel.show();
    }
    this.onShowAnnounce = () => {
      mm_menu_right.close();
      this.announcePanel.show();
    }
    this.onShowFeature = () => {
      mm_menu_right.close();
      this.featurePanel.show();
    }
    this.onShowGUIinfo = () => {
      mm_menu_right.close();
      this.GUIinfoOverlay.show();
    }

    this.mimicMouseOver = (selector, flag) => {
      if (flag) {
        mm_menu_right.closeAllPanels();
        mm_menu_right.open();
        $("a[href='#toggle_get_started']")[0].click()
      }
      $(selector).addClass("hover");
    };


    this.mimicMouseOut = (selector) => {
      $(selector).removeClass("hover");
    };

    this.onCreateTag = function() {}
    this.onRetrieveTag = function() {}

    this.onGettingStarted = function() {
      mm_menu_right.closeAllPanels();
      mm_menu_right.open();
      $("a[href='#toggle_get_started']")[0].click()
    }
    this.onToggleTag = function() {
      mm_menu_right.closeAllPanels();
      mm_menu_right.open();
      $("a[href='#toggle_tag']")[0].click()
    }
    this.onToggleNeuClick = function() {
      mm_menu_right.closeAllPanels();
      mm_menu_right.initPanels($('#single-neu'));
      mm_menu_right.initPanels($('#single-pin'));
      mm_menu_right.open();
      $("a[href='#toggle_neuron']")[0].click()
    }
    this.onToggleLPUClick = function() {
      mm_menu_right.closeAllPanels();
      mm_menu_right.initPanels($('#single-neuropil'));
      mm_menu_right.open();
      $("a[href='#toggle_neuropil']")[0].click()
    }
    this.onToggleCellTypeClick = function(neuropil) {
      if (loadcelltype === undefined){
        console.log('loading')
        this.loadAllCellTypes();
        loadcelltype = true;
      }
      mm_menu_right.closeAllPanels();
      mm_menu_right.initPanels($('#cell-type'));
      mm_menu_right.open();
      if( neuropil === undefined && lastOpenedCellType === undefined) {
        $("a[href='#toggle_celltype']")[0].click()
      } else {
        if (neuropil === undefined) {
          neuropil = lastOpenedCellType;
        }
        var name_with_out_parenthesis = neuropil.replaceAll('(R)', '_R').replaceAll('(L)', '_L');
        $("a[href='#"+name_with_out_parenthesis+"-cell-types']")[0].click();
        lastOpenedCellType = neuropil;
      }
    }
    this.onClickVisualizationSettings = function() {
      mm_menu_right.closeAllPanels();
      mm_menu_right.open();
      $("a[href='#toggle_visset']")[0].click()
    }
    this.openRightMenu = function() {
      mm_menu_right.open();
    }
    this.closeRightMenu = function() {
      mm_menu_right.close();
    }

    this.onRemovePinned = function() {
      _this.dispatch.onRemovePinned();
    }
    this.onRemoveUnpinned = function() {
      _this.dispatch.onRemoveUnpinned();
    }
    this.onShowAllNeuron = function() {
      _this.dispatch.onShowAllNeuron();
    }
    this.onHideAllNeuron = function() {
      _this.dispatch.onHideAllNeuron();
    }
    this.onShowAllNeuropil = function() {
      _this.dispatch.onShowAllNeuropil();
    }
    this.onHideAllNeuropil = function() {
      _this.dispatch.onHideAllNeuropil();
    }
    this.onUnpinAll = function() {
      _this.dispatch.onUnpinAll();
    }

    this.resizeInfoPanel = function() {
      $("#btn-info-pin").children().toggleClass("fa-compress fa-expand");
      $("#info-panel-dragger").toggle();
      $("#info-panel-wrapper").toggleClass("vis-info-sm vis-info-pin");
      $("#vis-3d").toggleClass("vis-3d-lg vis-3d-hf");
      $("#btn-info-pin").toggleClass('btn-clicked btn-unclicked');
    }

    $( ".slider-bar" ).draggable({
      axis: "x",
      delay: 200,
      start: function( event, ui ) {
        $(".vis-info-pin").addClass("notransition");
      },
      drag: function( event, ui ) {
        var rect;
        var objs = document.getElementsByClassName('vis-info-pin');
        for (var i=0; i < objs.length; ++i) {
          if ($(objs[i]).is(':visible')) {
            rect = objs[i].getBoundingClientRect();
          }
        }
        var width = ui.position.left - rect.left;
        $(".vis-info-pin").css("width", width + "px");
      },
      stop: function( event, ui ) {
        var perc = event.pageX / window.innerWidth * 100;
        if (perc < (315./window.innerWidth *100)){
          perc = 315./window.innerWidth *100; // minimum 315px
        }else if (perc > 50){
          perc = 50;   //maximum 50 percent
        }

        document.documentElement.style.setProperty("--boundary-horizontal", perc + "%");

        $(".vis-info-pin").removeClass("notransition");
        $("#info-panel-dragger").css({"top": "", "left":""});
        $(".vis-info-pin").css("width","");
      },
    });

    $(document).ready(() => {
      $("#ui_menu_nav").mmenu({
        //counters: true,
        onClick: {
          close: false,
        },
        "extensions": ["effect-menu-zoom", "position-right", "position-front"],
        navbar: {
          title: "FFBO UI Menu"
        },// We can add tabs here as well
        navbars: [
          {
            "position": "top",
            "content": [
              "searchfield"
            ]
          }
        ],
        searchfield:{
          panel: true,
          showSubPanels: true
        },
        hooks: {
        }
      },{
        offCanvas: {
          pageSelector: "#page-content-wrapper",
        },
        searchfield: {
          clear: true
        }
      });
      mm_menu_right = $("#ui_menu_nav").data( "mmenu" );
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  return NeuroNLPUI;
});
