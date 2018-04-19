// NeuroNLP.js

/*
 * prepare LPU mesh data
 */
var lpuList = [
    'al_l', 'al_r', 'ammc_l', 'ammc_r', 'cal_l', 'cal_r', 'ccp_l', 'ccp_r',
    'cmp_l', 'cmp_r', 'cvlp_l', 'cvlp_r', 'dlp_l', 'dlp_r', 'dmp_l', 'dmp_r',
    'eb', 'fb', 'fspp_l', 'fspp_r', 'idfp_l', 'idfp_r', 'idlp_l', 'idlp_r',
    'lat_l', 'lat_r', 'lh_l', 'lh_r', 'lob_l', 'lob_r', 'lop_l', 'lop_r',
    'mb_l', 'mb_r', 'med_l', 'med_r', 'nod_l', 'nod_r', 'og_l', 'og_r',
    'optu_l', 'optu_r', 'pan_l', 'pan_r', 'pb', 'sdfp_l', 'sdfp_r', 'sog_l',
    'sog_r', 'spp_l', 'spp_r', 'vlp_l', 'vlp_r', 'vmp_l', 'vmp_r'
];

lpuJSON = {}
for (var i=0; i < lpuList.length; i++ ) {
  var x = lpuList[i].split("_");
  var side = "";
    if (x.length > 1) {
      if (x[1] == "r")
        side = "Right "
      else
        side = "Left "
    }
    lpuJSON[lpuList[i]] = {
    'filename': '/lib/mesh/' + lpuList[i] + '.json',
    'label': side + x[0].toUpperCase(),
    'highlight': false,
    'background': true,
    'color': new THREE.Color( 0.15, 0.01, 0.15)
  };
}

var ffbomesh = new FFBOMesh3D('vis-3d', {"ffbo_json": lpuJSON, "showAfterLoadAll": true}, {"globalCenter": {'x': 0, 'y':-250, 'z':0}});
ffbomesh.createUIBtn("showSettings", "fa-cog", "Settings")
ffbomesh.createUIBtn("takeScreenshot", "fa-camera", "Download Screenshot")
ffbomesh.createUIBtn("showInfo", "fa-info-circle", "GUI guideline")
ffbomesh.createUIBtn("resetView", "fa-refresh", "Reset View")
ffbomesh.createUIBtn("resetVisibleView", "fa-align-justify", "Centre View To Visible Objects")
ffbomesh.createUIBtn("show_all", "fa-eye", "Unhide All")
ffbomesh.createUIBtn("hide_all", "fa-eye-slash", "Hide All")
ffbomesh.createUIBtn("removeUnpin", "fa-trash", "Remove Unpinned Neurons")
ffbomesh.createUIBtn("DownData", "fa-download", "Download Connectivity")

ffbomesh.dispatch['resetView'] = (function() {ffbomesh.resetView()})
ffbomesh.dispatch['resetVisibleView'] = (function() {ffbomesh.resetVisibleView()})
ffbomesh.dispatch['dblclick'] = updatePinNeuron;
ffbomesh.dispatch['showInfo'] = (function() {closeAllOverlay(true); $("#gui-3d").show()});
ffbomesh.dispatch['removeUnpin'] = (function() {$("#btn-pin-keep").trigger("click")});
ffbomesh.dispatch['hide_all'] = (function() {ffbomesh.hideAll()});
ffbomesh.dispatch['show_all'] = (function() {ffbomesh.showAll()});
ffbomesh.dispatch['takeScreenshot'] = (function() {ffbomesh._take_screenshot=true;});

ffbomesh.dispatch['showAll'] = function(){
    $('.btn-single-neu').each( function() {
        var x = $(this).html().substring(1);
        $(this).html('&FilledSmallSquare; ' + x );
        $(this).addClass("selected");
        $(this).removeClass("unselected");
    })
  for (var id in lpuJSON)
            toggleOBJ(id, true);
  }
ffbomesh.dispatch['hideAll'] = function(){
    $('.btn-single-neu').each( function() {
        var id = $(this).attr("id").substring(4);
        id = uidEncode(id);
        if (ffbomesh.pinned.has(id))
            return;
        var x = $(this).html().substring(1);
        $(this).html('&EmptySmallSquare; ' + x );
        $(this).removeClass("selected");
        $(this).addClass("unselected");
    });
    for (var id in lpuJSON)
        toggleOBJ(id, false);
}

var resize_listener;
window.addEventListener("resize", function(){
    clearTimeout(resize_listener);
    resize_listener = setTimeout(
  function() {
      ffbomesh.onWindowResize();
  }, 400 );
});
$(window).blur(function(){
    ffbomesh.hide3dToolTip();
});
$(document).mouseleave(function () {
    ffbomesh.hide3dToolTip();
});
$("#vis-3d").mouseleave(function () {
    ffbomesh.hide3dToolTip();
});



// FFBOui.js
function closeAllOverlay(e) {
    $(".overlay").each( function() {
  $(this).hide();
    });
    $( "#vis_set_dragger" ).hide();
    $(".overlay-background").css("width", "")

    if (e)
  $(".overlay-background").show();
    else
  $(".overlay-background").hide();
}
$("#neuronlp-switch").click( function() {
    closeAllOverlay();
});

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

var srchInput = document.getElementById('srch_box');
var srchBtn = document.getElementById('srch_box_btn');

//add event listener
srchBtn.addEventListener('click', function(event) {
    if ($("#demo-panel").is(":visible"))
        $("#btn-demo-close").click();
    if ($("#video-panel").is(":visible"))
        $("#btn-video-close").click();
    query = document.getElementById('srch_box').value;
    $("#search-wrapper").block({ message: null });
    srchInput.blur();
    send_query();
});

srchInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13)
        srchBtn.click();
});

$("#btn-info-pin").click( function() {
    $(this).children().toggleClass("fa-compress fa-expand");
    $("#info_panel_dragger").toggle();
    $("#info-panel").toggleClass("vis-info-sm vis-info-pin");
    $("#vis-3d").toggleClass("vis-3d-lg vis-3d-hf");
    $(this).toggleClass('btn-clicked btn-unclicked');
    setTimeout( function(){
      ffbomesh.onWindowResize();
      }, 500
    );
});

function imgError(image) {
    setTimeout(function (){
        image.src = image.src;
     }, 1000);
}

$('.vis-info').perfectScrollbar();
$('.demo-table-wrapper').perfectScrollbar();
$('.overview-content-wrapper').perfectScrollbar();

$( "#info_panel_dragger" ).draggable({
    axis: "x",
    delay: 200,
    start: function( event, ui ) {
  // $("#info-panel").addClass("notransition");
  $(".vis-info-pin").addClass("notransition");
    },
    drag: function( event, ui ) {
  //var rect = document.getElementById("info-panel").getBoundingClientRect()
        var rect;
        var objs = document.getElementsByClassName('vis-info-pin');
        for (var i=0; i < objs.length; ++i) {
           if ($(objs[i]).is(':visible')) {
             rect = objs[i].getBoundingClientRect();
           }
        }
  var width = ui.position.left - rect.left;
  // $("#info-panel").css("width",width);
  $(".vis-info-pin").css("width", width + "px");
    },
    stop: function( event, ui ) {
  var perc = event.pageX / window.innerWidth * 100;
  document.documentElement.style.setProperty("--boundary-horizontal", perc + "%");
 /*
  $("#info-panel").removeClass("notransition");
  $("#info_pannel_dragger").css({"top": "", "left":""});
  $("#info-panel").css("width","");
*/
  $(".vis-info-pin").removeClass("notransition");
  $("#info_panel_dragger").css({"top": "", "left":""});
      $(".vis-info-pin").css("width","");
      // This should possibly be triggered through a callback
  setTimeout( function() {
      ffbomesh.onWindowResize()}, 500 );
    },
});



// DemoHelper.js
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


// FFBODynamicMenu.js
/*
 * Buttons
 */
$("#btn-neu-all").click( function() {
    $('.btn-single-neu').each( function() {
        var x = $(this).html().substring(1);
        $(this).html('&FilledSmallSquare; ' + x );
        $(this).addClass("selected");
        $(this).removeClass("unselected");
        var id = $(this).attr("id").substring(4);
        id = uidEncode(id);
        ffbomesh.show(id);
  });
//    ffbomesh.showAll();
});
$("#btn-neu-none").click( function() {
    $('.btn-single-neu').each( function() {
        var id = $(this).attr("id").substring(4);
        id = uidEncode(id);
        if (ffbomesh.pinned.has(id))
            return;
        var x = $(this).html().substring(1);
        $(this).html('&EmptySmallSquare; ' + x );
        $(this).removeClass("selected");
        $(this).addClass("unselected");
        ffbomesh.hide(id);
  });
//    ffbomesh.hideAll();
});

/*
 * handy functions to get around '#' and ':'. Note that NA rid contains '#' and
 * ':', and these two signs are used in jQuery selection...
 */
function uidDecode(id) {

    id = id.replace(/#/g,'hashtag');
    id = id.replace(/:/g,'colon');
    return id;
}
function uidEncode(id) {

    if (id.indexOf("hashtag") > -1)
        id = id.replace("hashtag","#");
    if (id.indexOf("colon") > -1)
        id = id.replace("colon",":");
    return id;
}

/*
 * Show/Hide a single neuron or LPU mesh
 */
function toggleOBJ(id, visibility) {
    var btn = $("#btn-" + id);
    var btn_text = btn.html().substring(1);
    id = uidEncode(id);
    if (ffbomesh.pinned.has(id))
        return;
    var condition = (visibility === undefined) ? btn.hasClass("unselected") : visibility;
    if ( condition ){
         btn.html('&FilledSmallSquare; ' + btn_text)
         btn.addClass("selected");
         btn.removeClass("unselected");
         ffbomesh.show(id);
    } else {
         btn.html('&EmptySmallSquare; ' + btn_text)
         btn.addClass("unselected");
         btn.removeClass("selected");
         ffbomesh.hide(id);
    }
}

/*
 * Remove all buttons bound to neurons (evoked after 'reset')
 */
function resetNeuronButton() {
    $(".btn-single-neu").remove();
    $(".btn-single-pin").remove();
    $(".btn-single-obj").each( function() {
        btn_text = $(this).html().substring(1);
        $(this).addClass("unselected");
        $(this).removeClass("selected");
    });
}

/*
 * dynamically generate a button for each newly added neurons
 */
function generateNeuronButton(newNeuJson) {
    for (var x in newNeuJson ) {
        var name = newNeuJson[x]['name'];
        var id = uidDecode(newNeuJson[x]['id']);
        $("#single-neu").find( ".mm-listview" ).append("<li id='li-btn-" + id + "'><a id='" + "btn" + "-" + id + "'role='button' class='btn-single-obj btn-single-neu selected'>&FilledSmallSquare; " + name + "</a></li>");
        $("#btn-" + id).click( function() {
            var id = $(this).attr("id").substring(4);
            toggleOBJ(id);
        })
        .mouseenter( function() {
            var id = $(this).attr("id").substring(4);
            id = uidEncode(id);
            ffbomesh.highlight(id);
        })
        .mouseleave( function() {
            ffbomesh.resume();
        });
    }
}

/*
 * Show everything
 */
var onShowAllClick = function() {
    ffbomesh.showAll();
/*    $('.btn-single-obj').each( function() {
        var x = $(this).html().substring(1);
        $(this).html('&FilledSmallSquare; ' + x );
        $(this).addClass("selected");
        $(this).removeClass("unselected");
    });*/
}
/*
 * Hide everything
 */

var onHideAllClick = function() {
    ffbomesh.hideAll();
/*    for (var id in lpuJSON)
        toggleOBJ(id, false);
    $('.btn-single-obj').each( function() {
        var x = $(this).html().substring(1);
        $(this).html('&EmptySmallSquare; ' + x );
        $(this).removeClass("selected");
        $(this).addClass("unselected");
    });*/
}

/*
 * Create a button for each LPU
 */
for (var key in lpuJSON) {
    $("#single-lpu").append("<li><a id='" + "btn" + "-" + key + "'role='button' class='btn-single-obj selected'>&FilledSmallSquare; " + lpuJSON[key].label + "</a></li>");
}
lpuGroup = {
    'vis': {'div':'lpu-subsystem', 'data':'Vision', 'lpu':["med_r", "lop_r", "lob_r", "og_r", "vlp_r", "optu_r", "med_l", "lop_l", "lob_l", "og_l", "vlp_l", "optu_l"]},
    'olf': {'div':'lpu-subsystem', 'data':'Olfaction', 'lpu':["lh_r", "al_r", "mb_r", "lh_l", "al_l", "mb_l"]},
    'cx':  {'div':'lpu-subsystem', 'data':'Central Complex', 'lpu':["fb", "eb", "pb", "nod_r", "nod_l"]},
    'all': {'div':'lpu-whole-brain', 'data':'Show All', 'lpu':'all'},
    'none':{'div':'lpu-whole-brain', 'data':'Hide All', 'lpu':'none'},
}
$(".btn-single-obj").click( function() {
    var id = $(this).attr("id").substring(4);
    toggleOBJ(id);
});

/*
 * create a button for pre-defined LPU groups
 */
for (var key in lpuGroup)
    $("#" + lpuGroup[key]['div']).append("<li><a id='btn-lpu-group-" + key + "' class='btn-lpu-group' role='button'>" + lpuGroup[key]['data'] + "</a></li>");
$(".btn-lpu-group").click( function() {
    var x = $(this).attr("id").substring(14);
    var ll = lpuGroup[x].lpu;
    if (ll == "all") {
        for (var id in lpuJSON)
            toggleOBJ(id, true);
    } else if (ll == "none") {
        for (var id in lpuJSON)
            toggleOBJ(id, false);
    } else {
        for (var i in ll)
            toggleOBJ(ll[i], true);
    }
});

/*
 * create buttons for pinned neurons
 */

$("#btn-pin-unpinall").click( function() {
    $('.btn-single-pin').each( function() {
        var id = $(this).attr("id").substring(8);
        //$("#btn-" + id).show();
        $(this).remove();
    });
    ffbomesh.unpinAll();
})

$("#btn-pin-keep").click( function() {
    //if($.isEmptyObject(Array.from(ffbomesh.pinned))) return;
    if($.isEmptyObject(Array.from(ffbomesh.pinned))){
  Notify('There are no pinned neurons in the scene. Click on <i class="fa fa-info-circle" aria-hidden="true"></i> for information on how to pin neurons', null, null, 'danger');
  return;
    }
    var na_servers = document.getElementById("na_servers");
    var na_server = na_servers.options[na_servers.selectedIndex].value;
    msg = {};
    msg["query"] = [{"action": {"method": {"has":{"rid":Array.from(ffbomesh.pinned)}}}, "object":{"state":0}}];
    msg["verb"] = "keep";
    msg["data_callback_uri"] = "ffbo.ui.receive_partial"
    client_session.call('ffbo.na.query.'+na_server, [msg], {}, {
  receive_progress: true
    }).then(
  function(res) {
      if(typeof res == 'object'){
    if ('error' in res) {
        Notify(res['error']['message'],null,null,'danger')
        $("body").trigger('demoproceed', ['error']);
        return;
    } else if('success' in res) {
        if('info' in res['success'])
      Notify(res['success']['info']);
        if('data' in res['success']){
      data = {'ffbo_json': res['success']['data'],
        'type': 'morphology_json'};
      processFFBOjson(data)
        }
    }
      }
      $("body").trigger('demoproceed', ['success']);
  },
  function(err) {
      console.log(err)
      Notify(err,null,null,'danger');
      $("body").trigger('demoproceed', ['error']);
  },
  function(progress) {
      data = {'ffbo_json': progress,'type': 'morphology_json'};
      processFFBOjson(data);
  }
    );
})

function updatePinNeuron(id, name, pin) {
    id = uidDecode(id);
    if (pin) {
        $("#single-pin").find( ".mm-listview" ).append("<li><a id='" + "btn-pin-" + id + "'role='button' class='btn-single-pin'>" + name + "</a></li>");
        //$("#btn-" + id).hide();
        $("#btn-pin-" + id)
        .dblclick( function() {
            $(this).remove();
            var id = $(this).attr("id").substring(8);
            $("#btn-" + id).show();
            id = uidEncode(id);
            ffbomesh.togglePin(id);
        })
        .click( function() {
            var id = $(this).attr("id").substring(8);
            updateInfoPanel([$(this).text(), uidEncode(id)]);
        })
        .mouseenter( function() {
            var id = $(this).attr("id").substring(8);
            id = uidEncode(id);
            ffbomesh.highlight(id);
        })
        .mouseleave( function() {
            ffbomesh.resume();
        })
    } else {
        $("#btn-pin-"+id).remove();
        $("#btn-" + id).show();
    }
}