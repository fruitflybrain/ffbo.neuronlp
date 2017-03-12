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
    'filename': 'https://cdn.rawgit.com/fruitflybrain/ffbo.lib/master/mesh/' + lpuList[i] + '.json',
    'label': side + x[0].toUpperCase(),
    'highlight': false,
    'background': true,
    'color': new THREE.Color( 1, 1, 1 )
  };
}

/*
 * pin/unpin the information panel
 */
$("#btn-flycircuit-pin").click( function() {
    if ($(this).hasClass('btn-unclicked')) {
        $(this).text("unpin");
        $('#flycircuit-info').toggleClass('vis-info-sm vis-info-pin');
    } else {
        $(this).text("pin");
        $('#flycircuit-info').toggleClass('vis-info-sm vis-info-pin');
    }
    $(this).toggleClass('btn-clicked btn-unclicked');
})
/*
 * change information panel content after it is enlarged; also resize 3D scene
 */
$("#flycircuit-info")
    .mouseenter( function() {
        if ($(this).hasClass("vis-info-sm")) {
          $("#vis-3d").toggleClass("vis-3d-lg vis-3d-hf");
          $("#btn-flycircuit-pin").show();
          $("#flycircuit-table").show();
        }
        ffbomesh.highlight($('#neu-id').attr('uid'));
    })
    .mouseleave( function() {
        if ($(this).hasClass("vis-info-sm")) {
          $("#btn-flycircuit-pin").hide();
          $("#vis-3d").toggleClass("vis-3d-lg vis-3d-hf");
          $("#flycircuit-table").hide();
        }
        ffbomesh.resume();
    })
/*
 * hook, used in FFBOMesh3D.onMouseClick() to update information panel
 */
function updateInfoPanel(d) {
    $('#neu-id').attr('name',d[0]);
    $('#neu-id').attr('uid',d[1]);
    $('#neu-id').text('FlyCircuit DB: ' + d[0]);
    $("#flycircuit-iframe").attr('src','http://flycircuit.tw/modules.php?name=clearpage&op=detail_table&neuron=' + d[0]);
}


function updateNeuroArchInfo(d,session) {
  /*
   * Hook into Information panel to retieve individual neuron information from NA
   */
   var na_servers = document.getElementById("na_servers");
   var na_server = na_servers.options[na_servers.selectedIndex].value;
   //console.log(d);
   session.call('ffbo.na.retrieve_neuron.'+na_server, [d[1]]).then(
         function (res) {
            //console.log(res);
         },
         function (err) {
            console.log(err);
         }
      );
}

function imgError(image) {
    setTimeout(function (){
        image.src = image.src;
     }, 1000);
}

function fetchFlycircuit(d,session) {

   session.call('ffbo.processor.fetch_flycircuit',[d[0]]).then(
         function (res) {
            //console.log(res);
            $('#neu-id').attr('name', d[0]);
            $('#neu-id').attr('uid', d[1]);
            $('#neu-id').text('FlyCircuit DB: ' + res['Name']);
            var div =  document.getElementById("flycircuit-table");
            div.style.display = "block";
            var table = div.children[0];
            var params = ["Author","Driver","Gender/Age","Lineage", "Putative birth time", "Putative neurotransmitter", "Soma Coordinate", "Stock"];

            for ( var i = 0; i < params.length; ++i ) {
              var tr_idx = Math.floor(i/2);
              var td_idx = i % 2;
              table.children[0].children[tr_idx].children[2*td_idx].innerHTML = params[i];
              table.children[0].children[tr_idx].children[2*td_idx+1].innerHTML = res[params[i]].toString();
            }
            div.children[1].children[0].children[1].src = res["Images"]["Original confocal image (Animation)"];
            div.children[1].children[1].children[1].src = res["Images"]["Segmentation"];
            div.children[1].children[2].children[1].src = res["Images"]["Skeleton (download)"];

         },
         function (err) {
            console.log(err);
            updateInfoPanel(d);
         }
      );
}

function getNeuronInformation(d) {
    updateInfoPanel(d)
    updateNeuroArchInfo(d,client_session)
}



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
    for (var id in newNeuJson ) {
        var name = newNeuJson[id];
        var id = uidDecode(id);
        $("#single-neu").find( ".mm-listview" ).append("<li><a id='" + "btn" + "-" + id + "'role='button' class='btn-single-obj btn-single-neu selected'>&FilledSmallSquare; " + name + "</a></li>");
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
    $('.btn-single-obj').each( function() {
        var x = $(this).html().substring(1);
        $(this).html('&FilledSmallSquare; ' + x );
        $(this).addClass("selected");
        $(this).removeClass("unselected");
    });
}
/*
 * Hide everything
 */
var onHideAllClick = function() {
    ffbomesh.hideAll();
    for (var id in lpuJSON)
        toggleOBJ(id, false);
    $("#btn-neu-none").click();
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
        $("#btn-" + id).show();
        $(this).remove();
    });
    ffbomesh.unpinAll();
})
function updatePinNeuron(id, name, pin) {
    id = uidDecode(id);
    if (pin) {
        $("#single-pin").find( ".mm-listview" ).append("<li><a id='" + "btn-pin-" + id + "'role='button' class='btn-single-pin'>" + name + "</a></li>");
        $("#btn-" + id).hide();
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
            updateInfoPanel([$(this).text(), id]);
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

var element = $("#vis-3d");
new ResizeSensor(element, function() {
    ffbomesh.onWindowResize();
});
var ffbomesh = new FFBOMesh3D('vis-3d', {"ffbo_json": lpuJSON, "showAfterLoadAll": true}, {"globalCenter": {'x': 0, 'y':-250, 'z':0}});
ffbomesh.dispatch['click'] = (function (d) { $("#flycircuit-table").show(); fetchFlycircuit(d,client_session);});
ffbomesh.dispatch['dblclick'] = updatePinNeuron;

/*
 * communication between frontend and processor_component
 */
function populate_server_lists(directory) {
    var valid_server_type = ['na', 'nlp'];
    for (var type in directory) {
        if (valid_server_type.indexOf(type) > -1) {
            select = document.getElementById(type + '_servers');
            select.innerHTML = "";

            servers = directory[type];

            for (var id in servers) {
                var opt = document.createElement('option');
                opt.value = id;
                opt.innerHTML = servers[id]['name'];
                select.appendChild(opt);
            }
        }
    }
}

var neuList = [];

function processFFBOjson(data) {
    var newNeuList = {};
    for (key in data['ffbo_json']) {
        var x = data['ffbo_json'][key];
        newNeuList[key] = x['name'];
    }
    neuList = neuList.concat(Object.keys(newNeuList));
    generateNeuronButton(newNeuList);
    ffbomesh.addJson(data);
    $("#num-of-neuron").text("Number of Neurons: " + neuList.length);
}




var srchInput = document.getElementById('srch_box');
var srchBtn = document.getElementById('srch_box_btn');
//add event listener
srchBtn.addEventListener('click', function(event) {
    if ($("#demo-panel").is(":visible"))
        $("#btn-demo-close").click();
    if ($("#video-panel").is(":visible"))
        $("#btn-video-close").click();
    $("#search-wrapper").block({ message: null });
    srchInput.blur();
    send_query();
});

srchInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13)
        srchBtn.click();
});

function send_query() {

    var msg = construct_query(client_session);
    if (typeof msg === "undefined") {
        Notify("Server List is not Complete", null,null,'danger')
        $("#search-wrapper").unblock();
        $("body").trigger('demoproceed', ['error']);
    } else {
        //console.log("sending message: " + msg);
        send(msg, client_session);
    }

};

function send(msg, session) {

    session.call('ffbo.processor.nlp_to_visualise', [msg], {}, {
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
	    //console.log(res)
            $("#search-wrapper").unblock();
	    $("body").trigger('demoproceed', ['success']);
        },
        function(err) {
	    console.log(err)
	    Notify(err,null,null,'danger');
            $("body").trigger('demoproceed', ['error']);
            $("#search-wrapper").unblock();
        },
        function(progress) {
            data = {'ffbo_json': progress,'type': 'morphology_json'};
	    processFFBOjson(data);
        }
    );
};

function construct_query(session) {
    msg = {}
    msg['username'] = username;
    msg['servers'] = {}
    msg['data_callback_uri'] = 'ffbo.ui.receive_partial'

    var language_selector = document.getElementById("query_language");
    msg['language'] = language_selector.options[language_selector.selectedIndex].value;

    var nlp_servers = document.getElementById("nlp_servers");
    var na_servers = document.getElementById("na_servers");

    try {
        msg['servers']['nlp'] = nlp_servers.options[nlp_servers.selectedIndex].value;
    } catch (err) {
        console.log("nlp server not valid");
        return;
    }

    try {
        msg['servers']['na'] = na_servers.options[na_servers.selectedIndex].value;
    } catch (err) {
        console.log("na server not valid")
        return;
    }



    msg['nlp_query'] = document.getElementById('srch_box').value;
    return msg
}
