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

moduleExporter("NeuroNLPUI", ["jquery", "overlay", "mmenu"], function($, Overlay){
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
      // mm_menu_right.close();
      this.demoTable.show()
    }
    this.onShowNeuroNLP = () => {
      // mm_menu_right.close();
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
      // mm_menu_right.close();
      this.overviewPanel.show();
    }
    this.onShowReference = () => {
      // mm_menu_right.close();
      this.referencePanel.show();
    }
    this.onShowAnnounce = () => {
      // mm_menu_right.close();
      this.announcePanel.show();
    }
    this.onShowFeature = () => {
      // mm_menu_right.close();
      this.featurePanel.show();
    }
    this.onShowGUIinfo = () => {
      // mm_menu_right.close();
      this.GUIinfoOverlay.show();
    }

    this.mimicMouseOver = (selector, flag) => {
      if (flag) {
        mm_menu_right.openPanel(document.querySelector('#toggle_get_started'));
        mm_menu_right.open();
      }
      $(selector).addClass("hover");
    };


    this.mimicMouseOut = (selector) => {
      $(selector).removeClass("hover");
    };

    this.onCreateTag = function() {}
    this.onRetrieveTag = function() {}

    this.onGettingStarted = function() {
      mm_menu_right.openPanel(document.querySelector('#toggle_get_started'));
      mm_menu_right.open();
    }
    this.onToggleTag = function() {
      mm_menu_right.openPanel(document.querySelector('#toggle_tag'));
      mm_menu_right.open();
    }
    this.onToggleNeuClick = function() {
      mm_menu_right.openPanel(document.querySelector('#toggle_neuron'));
      mm_menu_right.open();
    }
    this.onToggleNeuListClick = function() {
      mm_menu_right.openPanel(document.querySelector('#single-neu'));
      mm_menu_right.open();
    }
    this.onToggleSynListClick = function() {
      mm_menu_right.openPanel(document.querySelector('#single-syn'));
      mm_menu_right.open();
    }
    this.onTogglePinClick = function() {
      mm_menu_right.openPanel(document.querySelector('#single-pin'));
      mm_menu_right.open();
    }
    this.onToggleLPUClick = function() {
      mm_menu_right.openPanel(document.querySelector("#toggle_neuropil"));
      mm_menu_right.open();
    }
    this.onToggleCellTypeClick = function(neuropil) {
      if( neuropil === undefined && lastOpenedCellType === undefined) {
        mm_menu_right.openPanel(document.querySelector('#toggle_celltype'))
      } else {
        if (neuropil === undefined) {
          neuropil = lastOpenedCellType;
        }
        var name_with_out_parenthesis = neuropil.replaceAll('(', '____').replaceAll(')', '--__');
        mm_menu_right.openPanel(document.querySelector('#'+name_with_out_parenthesis+"-cell-types"));
        lastOpenedCellType = neuropil;
      }
      mm_menu_right.open();
    }

    this.loadCellTypes = function(name) {
      name = name.toString();
      name_with_out_parenthesis = name.replaceAll('(', '____').replaceAll(')', '--__');
      for (var neuronType of window.CellTypes[name]) {
          window.dynamicCellTypeNeuropilMenu[name].addCellType(neuronType);
      }
    }

    this.onClickVisualizationSettings = function() {
      mm_menu_right.openPanel(document.querySelector('#toggle_visset'));
      mm_menu_right.open();

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

    function updateVis3D() {
      // Check the current state of both info panels
      var panel1Pinned = $("#info-panel-wrapper").hasClass("vis-info-pin");
      var panel2Pinned = $("#info-panel2-wrapper").hasClass("vis-info-pin");
  
      // Determine the appropriate class for #vis-3d
      if (panel1Pinned || panel2Pinned) {
          // If either panel is pinned, set to half-size
          $("#vis-3d").removeClass("vis-3d-lg").addClass("vis-3d-hf");
      } else {
          // If both panels are not pinned, set to large
          $("#vis-3d").removeClass("vis-3d-hf").addClass("vis-3d-lg");
      }
  }
    this.resizeInfoPanel = function() {
      $("#btn-info-pin").children().toggleClass("fa-compress fa-expand");
      $("#info-panel-dragger").toggle();
      $("#info-panel-wrapper").toggleClass("vis-info-sm vis-info-pin");
      // $("#vis-3d").toggleClass("vis-3d-lg vis-3d-hf");
      $("#btn-info-pin").toggleClass('btn-clicked btn-unclicked');
      updateVis3D();
    }
    this.resizeInfoPanel2 = function() {

      $("#btn-info-pin2").children().toggleClass("fa-compress fa-expand");
      $("#info-panel2-dragger").toggle();
      $("#info-panel2-wrapper").toggleClass("vis-info-pin vis-info-sm");
      // $("#vis-3d").toggleClass("vis-3d-hf vis-3d-lg");
      $("#btn-info-pin2").toggleClass('btn-clicked btn-unclicked');
      updateVis3D();
    }
    // $( ".slider-bar2" ).draggable({
    //   axis: "x",
    //   delay: 200,
    //   start: function( event, ui ) {
    //     $(".vis-info-pin").addClass("notransition");
    //   },
    //   drag: function( event, ui ) {
    //     var rect;
    //     var objs = document.getElementsByClassName('vis-info-pin');
    //     for (var i=0; i < objs.length; ++i) {
    //       if ($(objs[i]).is(':visible')) {
    //         rect = objs[i].getBoundingClientRect();
    //       }
    //     }
    //     var width = ui.position.left - rect.left;
    //     $(".vis-info-pin").css("width", width + "px");
    //   },
    //   stop: function( event, ui ) {
    //     var perc = event.pageX / window.innerWidth * 100;
    //     if (perc < (315./window.innerWidth *100)){
    //       perc = 315./window.innerWidth *100; // minimum 315px
    //     }else if (perc > 50){
    //       perc = 50;   //maximum 50 percent
    //     }

    //     document.documentElement.style.setProperty("--boundary-horizontal", perc + "%");

    //     $(".vis-info-pin").removeClass("notransition");
    //     $("#info-panel-dragger").css({"top": "", "left":""});
    //     $(".vis-info-pin").css("width","");
    //   },
    // });

    $(document).ready(() => {
      const menu = new Mmenu( "#ui_menu_nav", {
        "theme": "dark",
        "slidingSubmenus": true,
        navbar: {
          title: "NeuroNLP UI Menu"
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
          // panel: true,
          // showSubPanels: true
          // add: true,
          // addTo: "[id^=toggle_]"
        },
        hooks: {
        },
        offCanvas: {
          "use": true,
          "position": "right-front"
        },
        scrollBugFix: {
          fix: true
        },
        "setSelected": {
          "hover": true
        },
        scrollBugFix: {
           "fix": true  
        },
        iconbar: {
         "use": true,
         "position": "left",
         "top": [
           `<a onclick="NeuroNLPUI.closeRightMenu();"><span title="Close Menu"><i class='fa fa-times fa-fw'></i></span></a>`,
           `<a onclick="NeuroNLPUI.onGettingStarted();"><span title="Get Started"><i class='fa fa-play fa-fw'></i></span></a>`,
           `<a onclick="NeuroNLPUI.onToggleTag();"><span title="Tags"><i class='fa fa-tag fa-fw'></i></span></a>`,
           `<a onclick="NeuroNLPUI.onToggleNeuListClick();"><span title="Neuron List"><i class='fa fa-list fa-fw'></i></span></a>`,
           `<a onclick="NeuroNLPUI.onToggleSynListClick();"><span title="Synapse List"><i class='fa fa-circle-o fa-fw'></i></span></a>`,
           `<a onclick="NeuroNLPUI.onTogglePinClick();"><span title="Pinned List"><i class='fa fa-thumb-tack fa-fw'></i></span></a>`,
           `<a onclick="NeuroNLPUI.onToggleLPUClick();"><span title="Neuropils"><i class='fa fa-map-o fa-fw'></i></span></a>`,
         ],
         "bottom": [
           //`<a onclick="NeuroNLPUI.closeRightMenu();"><i class='fa fa-times'></i></a>`
         ]
        }
      },{
        offCanvas: {
          page: {
              selector: "#page-content-wrapper"
          }
        },
        searchfield: {
          clear: true
        }
      });
      mm_menu_right = menu.API;
      $('[data-toggle="tooltip"]').tooltip();

      mm_menu_right.bind( "openPanel:after",
        ( panel ) => {
            if ( panel.id === 'toggle_celltype' ) {
              if (loadcelltype === undefined){
                this.loadAllCellTypesNeuropil();
                loadcelltype = true;
              }
              if (window.lastOpenedCellType !== undefined)
              {
                window.dynamicCellTypeNeuropilMenu[window.lastOpenedCellType].reset()
                window.lastOpenedCellType = undefined;
              }
            } else if (panel.id.includes('-cell-types')) {
                var neuropil = panel.id.replaceAll('-cell-types', '').replaceAll('--__', ')').replaceAll('____', '('); // replace --__ first because ) can be followed by (
                if (neuropil !== window.lastOpenedCellType) {
                  this.loadCellTypes(neuropil);
                }
            } else if (panel.id === 'toggle_neuropil') {
              if (window.dynamicNeuropilMenu.btnLabelList.length > $(window.dynamicNeuropilMenu.config.singleObjSel)[0].children.length) {
                window.dynamicNeuropilMenu.reset();
                for (var key in window.Neuropils) {
                  dynamicNeuropilMenu.addNeuron(key, key);
                }
              }
            }
        }
      );
    });
  }

  return NeuroNLPUI;
});
