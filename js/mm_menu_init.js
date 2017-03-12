$(document).ready(function() {

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
    $("#sidebar-wrapper").mmenu({
        onClick: {
           close: false
        },
        "extensions": ["effect-menu-zoom"],
        offCanvas: {
            pageSelector: "#page-content-wrapper",
            position: "left",
            direction:"right",
        },
        navbar: {
          title: "FFBO Servers"
        }
    },{
        offCanvas: {
            pageSelector: "#page-content-wrapper",
        }
    });
    mm_menu_right = $("#ui_menu_nav").data( "mmenu" );
    mm_menu_left = $("#sidebar-wrapper").data( "mmenu" );
    var $left_hamburger = $("#server-icon");

    mm_menu_left.bind( "opened", function() {
       setTimeout(function() {
          $left_hamburger.addClass( "is-active" );
       }, 100);
    });
    mm_menu_left.bind( "closed", function() {
       setTimeout(function() {
          $left_hamburger.removeClass( "is-active" );
       }, 100);
    });

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
    openServerMenu = function() {
        mm_menu_left.open();
    }
});
