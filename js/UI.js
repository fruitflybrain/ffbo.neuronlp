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

moduleExporter("NeuroNLPUI", ["jquery", "notify", "jquery.mmenu"], function($, Notify){
  function NeuroNLPUI(){
    var mm_menu_right = undefined;

    function onShowTutorialVideo() {
      mm_menu_right.close();
      setTimeout( function() {
        closeAllOverlay(true);
        $("#video-panel").slideDown(500);
      }, 500);
    }

    function onShowNeuroNLP() {
      mm_menu_right.close();
      setTimeout( function() {
        closeAllOverlay(true);
        $("#neuronlp-switch").slideDown(500);
      }, 500);
    }

    function onShowIntro() {
      mm_menu_right.close();
      setTimeout( function() {
        closeAllOverlay(true);
        $("#intro-panel").slideDown(500);
      }, 500);
    }
    function onShowOverview() {
      mm_menu_right.close();
      setTimeout( function() {
        closeAllOverlay(true);
        $("#overview-panel").slideDown(500);
      }, 500);
    }
    function onShowAnnounce() {
      mm_menu_right.close();
      setTimeout( function() {
        closeAllOverlay(true);
        $("#announce-panel").slideDown(500);
      }, 500);
    }


    function mimicMouseOver(selector, flag) {
      if (flag) {
        mm_menu_right.open();
        $("a[href='#toggle_get_started']")[0].click()
      }
      $(selector).addClass("hover");
    };


    function mimicMouseOut(selector) {
      $(selector).removeClass("hover");
    };

    onGettingStarted = function() {
      mm_menu_right.open();
      $("a[href='#toggle_get_started']")[0].click()
    }
    onToggleTag = function() {
      mm_menu_right.open();
      $("a[href='#toggle_tag']")[0].click()
    }
    onToggleNeuClick = function() {
      mm_menu_right.open();
      $("a[href='#toggle_neuron']")[0].click()
    }
    onToggleLPUClick = function() {
      mm_menu_right.open();
      $("a[href='#toggle_neuropil']")[0].click()
    }
    openRightMenu = function() {
      mm_menu_right.open();
    }

    $(document).ready(() => {
      $("#ui_menu_nav").mmenu({
        onClick: {
          close: false
        },
        "extensions": ["effect-menu-zoom"],
        offCanvas: {
          pageSelector: "#page-content-wrapper",
          position  : "right",
          direction:"left",
        },
        navbar: {
          title: "FFBO UI Menu"
        }
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
