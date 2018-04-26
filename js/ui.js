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

moduleExporter("NeuroNLPUI", ["jquery", "jquery.mmenu"], function($){
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

    this.onShowTutorialVideo = () => {
      mm_menu_right.close();
      setTimeout( function() {
        closeAllOverlay(true);
        $("#video-panel").slideDown(500);
      }, 500);
    }

    this.onShowNeuroNLP = () => {
      mm_menu_right.close();
      setTimeout( function() {
        closeAllOverlay(true);
        $("#neuronlp-switch").slideDown(500);
      }, 500);
    }

    this.onShowIntro = () => {
      mm_menu_right.close();
      setTimeout( function() {
        closeAllOverlay(true);
        $("#intro-panel").slideDown(500);
      }, 500);
    }

    this.onShowOverview = () => {
      mm_menu_right.close();
      setTimeout( function() {
        closeAllOverlay(true);
        $("#overview-panel").slideDown(500);
      }, 500);
    }
    this.onShowAnnounce = () => {
      mm_menu_right.close();
      setTimeout( function() {
        closeAllOverlay(true);
        $("#announce-panel").slideDown(500);
      }, 500);
    }

    this.mimicMouseOver = (selector, flag) => {
      if (flag) {
        mm_menu_right.open();
        $("a[href='#toggle_get_started']")[0].click()
      }
      $(selector).addClass("hover");
    };


    this.mimicMouseOut = (selector) => {
      $(selector).removeClass("hover");
    };

    this.onGettingStarted = function() {
      mm_menu_right.open();
      $("a[href='#toggle_get_started']")[0].click()
    }
    this.onToggleTag = function() {
      mm_menu_right.open();
      $("a[href='#toggle_tag']")[0].click()
    }
    this.onToggleNeuClick = function() {
      mm_menu_right.initPanels($('#single-neu'));
      mm_menu_right.initPanels($('#single-pin'));
      mm_menu_right.open();
      $("a[href='#toggle_neuron']")[0].click()
    }
    this.onToggleLPUClick = function() {
      mm_menu_right.initPanels($('#single-neuropil'));
      mm_menu_right.open();
      $("a[href='#toggle_neuropil']")[0].click()
    }
    this.openRightMenu = function() {
      mm_menu_right.open();
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
          close: false
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
    });
  }

  return NeuroNLPUI;
});
