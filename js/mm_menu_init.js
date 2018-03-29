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
    mm_menu_right = $("#ui_menu_nav").data( "mmenu" );


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
});
