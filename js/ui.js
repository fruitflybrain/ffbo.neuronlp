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
    var mm_menu_right = undefined;

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
      //mm_menu_right.initPanels($('#single-neu'));
      mm_menu_right.open();
      $("a[href='#toggle_neuron']")[0].click()
    }
    this.onToggleLPUClick = function() {
      mm_menu_right.open();
      $("a[href='#toggle_neuropil']")[0].click()
    }
    this.openRightMenu = function() {
      mm_menu_right.open();
    }

    $(document).ready(() => {
      $("#ui_menu_nav").mmenu({
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
        searchfield: {
          panel: true,
          showSubPanels: false
        },
      },{
        offCanvas: {
          pageSelector: "#page-content-wrapper",
        }
      });
      mm_menu_right = $("#ui_menu_nav").data( "mmenu" );

    });
  }

  return NeuroNLPUI;
});
