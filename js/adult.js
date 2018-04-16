$( window ).load(function(){
    if(!direct_access){
	/*onShowAnnounce();
	setTimeout( function() {
	    var isHovered = !!$('#announce-panel:hover').length;
	    if (!isHovered ) {
		$("#announce-panel").fadeOut(500);
		$(".overlay-background").hide();
	    }
	}, 7000);*/
    }
});

last_click = ""
synaptic_info = false
function updateInfoPanel(d) {
    if(last_click == d[1]) return;
    last_click = d[1];
    $('#neu-id').attr('name',d[0]);
    d = [ffbomesh.meshDict[last_click].name,
			     last_click];
    fetchDetailInfo(d);
    $('#info-panel').scrollTop(0);
}

ffbomesh.dispatch['click'] = updateInfoPanel



function update_basic_info(data, color_change=true){
    $('#summary').show();
    if('label' in data)
        $('#neu-id').attr('label',data['label']);
    else if('uname' in data)
        $('#neu-id').attr('label',data['uname']);
    else if('uname' in data)
        $('#neu-id').attr('label',data['name']);
    
    
    $('#neu-id').html("Neuron: " + $('#neu-id').attr('label'));
    if('vfb_id' in data && data['vfb_id']){
	$('#vfb-link').html("<a target='_blank' href='http://virtualflybrain.org/reports/" + data['vfb_id'] + "'>VFB link</a>")
	$('#vfb-link').show();
    }
    
    var params = ['Data Source', 'Transgenic Lines'];
    var html = ''

    if(color_change){
	html+='<tr class="experimental" ><td>Choose Color</td><td> <input class="color_inp"'
	if(Modernizr.inputtypes.color)
	    html+='type="color"'
	else
	    html+='type="text"'
	n_id = $('#neu-id').attr('uid');
	html+='name="neu_col" id="neu_col" value="#' + ffbomesh.meshDict[n_id].color.getHexString() + '"/></td></tr>';
    }
    for ( var i = 0; i < params.length; ++i ) {
        if (params[i] in data) {
            html += '<tr class="">'
            html += '<td>' + params[i] + ':</td>'
            s = data[params[i]].toString().replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();});
            html += '<td>' + s + '</td>';
            html += '</tr>';
	}
    }
    var table = document.getElementById("basic-info");
    table.innerHTML = '<tbody>' + html + '</tbody>';
    /*
      Color Change
    */
    if(color_change){
	if(!Modernizr.inputtypes.color)
	    $("#neu_col").spectrum({
		showInput: true,
		showPalette: true,
		showSelectionPalette: true,
		showInitial: true,
		localStorageKey: "spectrum.neuronlp",
		showButtons: false,
		move: function(c){
		    ffbomesh.setColor($('#neu-id').attr('uid'), c.toHexString());
		}
	    });
	else
	    $('#neu_col').on('change', function(){
		ffbomesh.setColor($('#neu-id').attr('uid'), $('#neu_col')[0].value);
	    });
    }
    

}

function update_synaptic_info_common(data){
    var pre_table = document.getElementById("presyn-neus").children[1];
    var post_table = document.getElementById("postsyn-neus").children[1];
    if(!('pre' in data | 'post' in data)){
	return
    }
    
    $("#syn-wrap").show();
    $("#svg-syn").show();

    syn_sum_data = pre_process_profile_data({'pre_N': data['pre_N'],
					     'post_N': data['post_N'],
					     'pre_sum': data['pre_sum'],
					     'post_sum': data['post_sum']});
    if($("#info-panel").hasClass('vis-info-pin')){
        plot_syn_profile(syn_sum_data);
        resize_syn_profile();
    }
    
    $("#postsyn-neus tbody tr").remove();
    $("#presyn-neus tbody tr").remove();
    
    neuron_add = false;
    synapse_add = false;
    for(x in data['pre']){
        d = data['pre'][x];
        name = ""
        N = ""
	
        if('label' in d){name = d['label']}
        else if('uname' in d) {name = d['uname']}
        else if('name' in d) {name = d['name']}
        else {name = d['rid']}
        if('N' in d) N = d['N']
	
	
        var row = pre_table.insertRow(0);
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);
	var c3 = row.insertCell(2);
	c3.className = 'neuron_add_pre'
	var c4 = row.insertCell(3);
	c4.className = 'synapse_add_pre'

        c1.innerHTML = name;
        c2.innerHTML = N;
	
        if(d['has_morph'] && 'uname' in d){
            
            var btn = document.createElement('button')
            btn.className = 'btn'
            btn.id = 'btn-pre-add-' + d['uname']
            btn.name = d['uname']
            if(d['rid'] in ffbomesh.meshDict){
		btn.innerText = '-';
		btn.className += ' btn-remove btn-danger';
		btn.onclick = function(){
                    toggleBtn(this);
		};
            }
            else{
		btn.innerText = '+';
		btn.className += ' btn-add btn-success';
		btn.onclick = function(){
                    toggleBtn(this);
		};
            }
            c3.appendChild(btn);
	    neuron_add = true;
        }
	if(d['has_syn_morph'] && 'syn_uname' in d){
            var btn = document.createElement('button')
            btn.className = 'btn'
            btn.id = 'btn-pre-syn-add-' + d['syn_uname']
            btn.name = d['syn_uname']
            if(d['syn_rid'] in ffbomesh.meshDict){
		btn.innerText = '-';
		btn.className += ' btn-remove btn-danger';
		btn.onclick = function(){
                    toggleSynBtn(this);
		};
            }
            else{
		btn.innerText = '+';
		btn.className += ' btn-add btn-success';
		btn.onclick = function(){
                    toggleSynBtn(this);
		};
            }
            c4.appendChild(btn);
	    synapse_add = true;
        }

    }
    if (neuron_add)
	$('.neuron_add_pre').show()
    else
	$('.neuron_add_pre').hide()
    if (synapse_add)
	$('.synapse_add_pre').show()
    else
	$('.synapse_add_pre').hide()

    neuron_add = false
    synapse_add = false
    for(x in data['post']){
        d = data['post'][x];
        name = ""
        N = ""
	
        if('label' in d){name = d['label']}
        else if('uname' in d) {name = d['uname']}
        else if('name' in d) {name = d['name']}
        else {name = d['rid']}
        if('N' in d) N = d['N']
	
	
        var row = post_table.insertRow(0);
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);
        c1.innerHTML = name;
        c2.innerHTML = N;
	var c3 = row.insertCell(2);
	c3.className = 'neuron_add_post'
	var c4 = row.insertCell(3);
	c4.className = 'synapse_add_post'

        if(d['has_morph'] && 'uname' in d){
            var btn = document.createElement('button')
            btn.className = 'btn'
            btn.id = 'btn-pst-add-' + d['uname']
            btn.name = d['uname']
            if(d['rid'] in ffbomesh.meshDict){
		btn.innerText = '-';
		btn.className += ' btn-remove btn-danger';
		btn.onclick = function(){
                    toggleBtn(this);
		};
            }
            else{
		btn.innerText = '+';
		btn.className += ' btn-add btn-success';
		btn.onclick = function(){
                    toggleBtn(this);
		};
            }
	    neuron_add = true;
            c3.appendChild(btn);
        }
	if(d['has_syn_morph'] && 'syn_uname' in d){
            var btn = document.createElement('button')
            btn.className = 'btn'
            btn.id = 'btn-pre-syn-add-' + d['syn_uname']
            btn.name = d['syn_uname']
            if(d['syn_rid'] in ffbomesh.meshDict){
		btn.innerText = '-';
		btn.className += ' btn-remove btn-danger';
		btn.onclick = function(){
                    toggleSynBtn(this);
		};
            }
            else{
		btn.innerText = '+';
		btn.className += ' btn-add btn-success';
		btn.onclick = function(){
                    toggleSynBtn(this);
		};
            }
            c4.appendChild(btn);
	    synapse_add = true;
        }
    }
    if (neuron_add)
	$('.neuron_add_post').show()
    else
	$('.neuron_add_post').hide()
    if (synapse_add)
	$('.synapse_add_post').show()
    else
	$('.synapse_add_post').hide()

    searchFunction('presyn-neus',document.getElementById('presyn-srch').value, 0);
    filterGtFunction('presyn-neus',document.getElementById('presyn-N').value, 1);
    searchFunction('postsyn-neus',document.getElementById('postsyn-srch').value, 0);
    filterGtFunction('postsyn-neus',document.getElementById('postsyn-N').value, 1);
    

}
function update_summary_1(data){
    $("#info-table-wrap").show()
    update_basic_info(data);
    
    //$("#neu-name").show();
    if('flycircuit_data' in data){
	res = data['flycircuit_data']
	if('error' in res)
	    return
	$("#flycircuit-table").show();
	
	
	var div =  document.getElementById("flycircuit-table");
	div.style.display = "block";
	var table = div.children[0];
	var imagesPanel = div.children[1];
	var params = ["Author","Driver","Gender/Age","Lineage", "Putative birth time", "Putative neurotransmitter", "Soma Coordinate", "Stock"];
	
	for ( var i = 0; i < params.length; ++i ) {
            var tr_idx = Math.floor(i/2);
            var td_idx = i % 2;
            table.children[0].children[tr_idx].children[2*td_idx].innerHTML = params[i];
            table.children[0].children[tr_idx].children[2*td_idx+1].innerHTML = res[params[i]].toString();
	}
	imagesPanel.children[0].children[1].src = res["Images"]["Original confocal image (Animation)"];
	imagesPanel.children[0].children[1].onclick = function(){
	    $('#full-img')[0].src = this.src;
	    $("#img-viewer-caption").html('Original confocal image');
	    mm_menu_right.close();
	    setTimeout( function() {
		closeAllOverlay(true);
		$("#img-viewer-overlay").slideDown(500);
	    }, 500);
	}
	
	imagesPanel.children[1].children[1].src = res["Images"]["Segmentation"];
	imagesPanel.children[1].children[1].onclick = function(){
	    $('#full-img')[0].src = this.src;
	    $("#img-viewer-caption").html('Segmentation');
	    mm_menu_right.close();
	    setTimeout( function() {
		closeAllOverlay(true);
		$("#img-viewer-overlay").slideDown(500);
	    }, 500);
	}
	
	imagesPanel.children[2].children[1].src = res["Images"]["Skeleton (download)"];
	imagesPanel.children[2].children[1].onclick = function(){
	    $('#full-img')[0].src = this.src;
	    $("#img-viewer-caption").html('Skeleton');
	    mm_menu_right.close();
	    setTimeout( function() {
		closeAllOverlay(true);
		$("#img-viewer-overlay").slideDown(500);
	    }, 500);
	}

    }
    
}

function update_summary_2(data){
    $("#info-table-wrap").show()
    update_basic_info(data);
}


// TODO: synaptic_info_1 and synaptic_info_2 should use different divs
function update_synaptic_info_1(data){
    $("#syn-wrap h4")[0].innerHTML = 'Inferred Presynaptic Partners <a id="inferred-details-pre" class="info-panel-more-info inferred-more-info"> <i class="fa fa-info-circle" aria-hidden="true"></i></a>'
    $("#syn-wrap h4")[1].innerHTML = 'Inferred Postsynaptic Partners <a id="inferred-details-post" class="info-panel-more-info inferred-more-info"> <i class="fa fa-info-circle" aria-hidden="true"></i></a>'
    $(".inferred-more-info").click(function(){
	info = "<h2>Inferred Synaptic Partners</h2>";
	$("#information-overlay .container").html(info + data['description']);
	mm_menu_right.close();
	setTimeout( function() {
	    closeAllOverlay(true);
	    $("#information-overlay").slideDown(500);
	}, 500);
    });
    var tbody = document.getElementById("syn-profile-info").children[0];
    
    //var post_num= data['post_N'];
    //var pre_num = data['pre_N'];
    html = "";
    
    //html+='<tr class=""><td>Inferred Synaptic Summary</td><td> Total Synapses: '+(post_num+pre_num).toString()+' ( Presynaptic Sites: '+pre_num.toString()+', Postsynaptic Sites: '+post_num.toString()+' )</td></tr>';
    html+='<tr class=""><td>Synaptic(inferred) Profile Plot</td><td id="syn-reference-text" class="syn-reference">Click on/Hover over plot to extract detailed synaptic(inferred) information</td></tr>';
    tbody.innerHTML = html;
    $('#syn-profile-info-wrapper').show();
    update_synaptic_info_common(data);
}

function update_synaptic_info_2(data){
    $("#syn-wrap h4")[0].innerHTML = "Presynaptic Partners"
    $("#syn-wrap h4")[1].innerHTML = "Postsynaptic Partners"

    var tbody = document.getElementById("syn-profile-info").children[0];
    
    var post_num= data['post_N'];
    var pre_num = data['pre_N'];
    html = "";
    
    html+='<tr class=""><td>Synaptic Summary</td><td> Total Synapses: '+(post_num+pre_num).toString()+' ( Presynaptic Sites: '+pre_num.toString()+', Postsynaptic Sites: '+post_num.toString()+' )</td></tr>';
    html+='<tr class=""><td>Synaptic Profile Plot</td><td id="syn-reference-text" class="syn-reference">Click on/Hover over plot to extract detailed synaptic information</td></tr>';
    tbody.innerHTML = html;
    $('#syn-profile-info-wrapper').show();
    update_synaptic_info_common(data);
    
}

/*
  Hold synapse summary data so we can redraw svg
*/
var syn_sum_data = {}

/*

Functions to interact with neuroarch directly

*/
function add_by_uname(uname){
    msg = {'username': username,  'format': 'morphology',  'data_callback_uri': 'ffbo.ui.receive_partial', 'verb': 'add', 'query': [{'action': {'method': {'query': {'uname': uname}}}, 'object': {'class': 'Neuron'}}]};
    var na_servers = document.getElementById("na_servers");
    var na_server = na_servers.options[na_servers.selectedIndex].value;
    client_session.call('ffbo.na.query.'+na_server, [msg], {}).then(
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
	}
    );
}

function remove_by_uname(uname){
    msg = {'username': username,  'format': 'morphology',  'data_callback_uri': 'ffbo.ui.receive_partial', 'verb': 'remove', 'query': [{'action': {'method': {'query': {'uname': uname}}}, 'object': {'class': 'Neuron'}}]};
    var na_servers = document.getElementById("na_servers");
    var na_server = na_servers.options[na_servers.selectedIndex].value;
    client_session.call('ffbo.na.query.'+na_server, [msg], {}).then(
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
	}
    );
}

function add_synapse_by_uname(uname){
    msg = {'username': username,  'format': 'morphology',  'data_callback_uri': 'ffbo.ui.receive_partial', 'verb': 'add', 'query': [{'action': {'method': {'query': {'uname': uname}}}, 'object': {'class': 'Synapse'}}]};
    var na_servers = document.getElementById("na_servers");
    var na_server = na_servers.options[na_servers.selectedIndex].value;
    client_session.call('ffbo.na.query.'+na_server, [msg], {}).then(
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
	}
    );
}

function remove_synapse_by_uname(uname){
    msg = {'username': username,  'format': 'morphology',  'data_callback_uri': 'ffbo.ui.receive_partial', 'verb': 'remove', 'query': [{'action': {'method': {'query': {'uname': uname}}}, 'object': {'class': 'Synapse'}}]};
    var na_servers = document.getElementById("na_servers");
    var na_server = na_servers.options[na_servers.selectedIndex].value;
    client_session.call('ffbo.na.query.'+na_server, [msg], {}).then(
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
	}
    );
}


/*
 * Information panel
 */


/*

Add/Remove neuron upon buttonclick in info panel and toggle button

*/

function toggleBtn(btn){
    if(btn.className.includes('add')){
        add_by_uname(btn.name);
        btn.innerText = "-";
        btn.className = "btn btn-remove btn-danger";
    }
    else{
        remove_by_uname(btn.name);
        btn.innerText = "+";
        btn.className = "btn btn-add btn-success";
    }
}

function toggleSynBtn(btn){
    if(btn.className.includes('add')){
        add_synapse_by_uname(btn.name);
        btn.innerText = "-";
        btn.className = "btn btn-remove btn-danger";
    }
    else{
        remove_synapse_by_uname(btn.name);
        btn.innerText = "+";
        btn.className = "btn btn-add btn-success";
    }
}



/*
Pure JS class helpers
*/
function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}


/*
  Dynamic table
*/
function searchFunction(table_id,text, col_num ) {
    var filter, table, tr, td, i;
    filter = text.toLowerCase();
    table = document.getElementById(table_id).children[1];
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[col_num];
    if (td) {
        if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
        removeClass(tr[i],"filtered-name")
        if(!hasClass(tr[i],"filtered-N"))
            tr[i].style.display = "";
        } else {
        addClass(tr[i],"filtered-name")
        tr[i].style.display = "none";
        }
    }
    }
}

function filterGtFunction(table_id,N, col_num ) {
    // Declare variables
    var table, tr, td, i;
    table = document.getElementById(table_id).children[1];
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[col_num];
    if (td) {
        if (Number(td.innerHTML) > Number(N)) {
        removeClass(tr[i],"filtered-N")
        if(!hasClass(tr[i],"filtered-name"))
            tr[i].style.display = "";
        } else {
        addClass(tr[i],"filtered-N")
        tr[i].style.display = "none";
        }
    }
    }
}


/*
  Bind the above functions to keyup and change
*/

$("#presyn-srch").on('keyup change', function (){
    searchFunction('presyn-neus', this.value, 0);
});


$("#presyn-N").on('keyup change', function (){
    filterGtFunction('presyn-neus', this.value, 1);
});


$("#postsyn-srch").on('keyup change', function (){
    searchFunction('postsyn-neus', this.value, 0);
});


$("#postsyn-N").on('keyup change', function (){
    filterGtFunction('postsyn-neus', this.value, 1);
});



/*
  Collapse synpatic table upon click header
*/
/*
$("#syn-wrap > h4").click(function(){
    $("#presyn-neus > tbody tr").slideToggle(500);
});
*/

// Create Synaptic Profile Plot
/* new ResizeSensor($("#syn-wrap"), function() {
    setTimeout( function() {
    plot_syn_profile(syn_sum_data);
    }, 500);
    }); */

new ResizeSensor($("#svg-syn"), function() {
    if ( $("#btn-info-pin").hasClass("btn-clicked") ) {
        setTimeout( function() {
                plot_syn_profile(syn_sum_data);
                resize_syn_profile();
	        ffbomesh.onWindowResize();
        }, 500);
    }
});

function pre_process_profile_data(d){
    if (!d) {return};
    combine_regexes = [/(Dm[0-9]+)_?[0-9]*/, /(Pm[0-9]+)_?[0-9]*/ ];
    pre_sum = {};
    post_sum = {};
    if ('pre_sum' in d){
	for (x in d['pre_sum']){
	    matched = 0;
	    for(i in combine_regexes){
		re = combine_regexes[i];
		if(re.exec(x)){
		    key = re.exec(x)[1];
		    if(key in pre_sum)
			pre_sum[key] += d['pre_sum'][x];
		    else
			pre_sum[key] = d['pre_sum'][x];
		    matched = 1;
		    break;
		}
	    }
	    if (!matched)
		pre_sum[x] = d['pre_sum'][x];
	}
	d['pre_sum'] = pre_sum;
    }
    if ('post_sum' in d){
	for (x in d['post_sum']){
	    matched = 0;
	    for(i in combine_regexes){
		re = combine_regexes[i];
		if(re.exec(x)){
		    key = re.exec(x)[1];
		    if(key in post_sum)
			post_sum[key] += d['post_sum'][x];
		    else
			post_sum[key] = d['post_sum'][x];
		    matched = 1;
		    break;
		}
	    }
	    if (!matched)
		post_sum[x] = d['post_sum'][x];
	}
	d['post_sum'] = post_sum;
    }
    return d;
}
function plot_syn_profile(d){
    if(!('pre_sum' in d && 'post_sum' in d)) return;
    var data = d;
    //data = pre_process_profile_data(data);
    var height_tot = 150;
    var width_tot = $(".svg-syn")[0].getBoundingClientRect().width;
    //console.log(width_tot);
    var margin = {top: 20, right: 40, bottom: 30, left: 80},
    width = width_tot - margin.left - margin.right,
    height = height_tot - margin.top - margin.bottom;
    var pre_sum = data['pre_sum'];
    var post_sum = data['post_sum'];
    var pre_num = data['pre_N'];
    var post_num = data['post_N'];

    var y = d3.scale.ordinal()
        .domain(["Postsynaptic","Presynaptic"])
        .rangeRoundBands([height,0], .1);


    var x = d3.scale.linear()
        .rangeRound([0,width]);
    //.domain([height,0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    d3.select("#svg-syn").html("");
    var svg = d3.select("#svg-syn").append("svg")
        .attr("width", width_tot)
        .attr("height", height_tot)
        .attr("viewBox", "0 0 " + width_tot +" "+ height_tot )
        .append("g")

    var data_pre = d3.entries(pre_sum).map(function (d,i) {
    return {y:'Presynaptic', x:d['value'],neuron:d['key']};
    });
    data_pre.sort(function(a,b){ return a.x > b.x ? 1 : -1;})

    var data_post = d3.entries(post_sum).map(function (d,i) {
    return {y:'Postsynaptic', x:d['value'],neuron:d['key']};
    });
    data_post.sort(function(a,b){ return a.x > b.x ? 1 : -1;})

    data_pre.map(function(d,i){
    if (i==0){
        data_pre[i]['x0']=0;
    }else{
        data_pre[i]['x0']=data_pre[i-1]['x']+data_pre[i-1]['x0'];
    }
    });
    data_post.map(function(d,i){
    if (i==0){
        data_post[i]['x0']=0;
    }else{
        data_post[i]['x0']=data_post[i-1]['x']+data_post[i-1]['x0'];
    }
    });

    var bar1 = svg.append('g').attr("class", "syn-column pre");
    var bar2 = svg.append('g').attr("class", "syn-column post");

    bar1.selectAll("rect")
        .data(data_pre)
        .enter().append("rect")
        .each(function(d){
        d3.select(this).attr({
        class: d.neuron.replace(/ /g,"_"),
        y: height/8 + margin.top,
        x: x(1-(d.x+d.x0)/100) + margin.left,
        width: x(d.x/100),
        height: height/8*2.5
        });

        var tooltip_info = d.neuron+": "+ (d.x).toFixed(1) +"%("+Math.round(pre_num*d.x/100).toString() +")";
        d3.select(this).append("title").text(tooltip_info);
    });
    bar2.selectAll("rect")
        .data(data_post)
        .enter().append("rect")
        .each(function(d){
        d3.select(this).attr({
        class: d.neuron.replace(/ /g,"_"),
        y: height/8*5 + margin.top,
        x: x(1 - (d.x+d.x0)/100) + margin.left,
        width: x(d.x/100),
        height: height/8*2.5
        });
        var tooltip_info = d.neuron+": "+ (d.x).toFixed(1) +"%("+Math.round(post_num*d.x/100).toString() +")";
        d3.select(this).append("title").text(tooltip_info);

    });
    svg.append("g")
        .attr("class", "syn-axis x")
        .attr("transform", "translate(0" + margin.left + "," + (height+margin.top) + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "syn-axis y")
        .attr("transform", "translate(" + margin.left + "," + margin.top  + ")")
        .call(yAxis);
    svg.select(".syn-axis.x")
      .selectAll("text")

    svg.select(".syn-axis.y")
       .selectAll(".tick")
        .select("text")
        .attr("transform","rotate(-30)")


         // format x-axis as percentage
    d3.selectAll(".syn-axis.x").selectAll("text").each(function(d){
    if (d==1){
        this.textContent = d*100 +"%";
    }else{
        this.textContent = d*100;
    }
    });

    d3.select("#svg-syn").selectAll("rect")
           .on("click",function(d){
          if (d['y']=='Presynaptic'){
                 var ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'], 'number':d['x']*pre_num/100};
          }else{
             var ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'],'number':d['x']*post_num/100};
          }
          add_syn_reference(ref_data);
   });
   d3.select("#svg-syn").selectAll("rect")
      .on("mouseover",function(d){
          if (d['y']=='Presynaptic'){
           var ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'], 'number':d['x']*pre_num/100};
          }else{
                   var ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'],'number':d['x']*post_num/100};
              }
              add_syn_reference(ref_data);
          
       })
          .on("mouseout",function(){
              reset_syn_reference();
   });
}

function resize_syn_profile(){
    if(d3.select("#svg-syn").select("svg")[0][0]){ //check if an svg file exists, if not getBBox will throw error
    var svg = d3.select(".svg-syn svg").node();
    var bbox =  svg.getBBox();
    var width_margin = 40;
    svg.setAttribute("viewBox", (bbox.x-width_margin/2)+" "+(bbox.y)+" "+(bbox.width+width_margin)+" "+(bbox.height));
    }else{
    return;
    }
}
function add_syn_reference(d){
    // d:type, neuron, percentage, number
    var target= d3.select("#syn-reference-text");
    var reference_info = d.type+" "+d.neuron+": "+ (d.percentage).toFixed(1) +"%("+Math.round(d.number).toString() +")";
    target.text(reference_info);
}
function reset_syn_reference(d){
    // d:type, neuron, percentage, number
    var target= d3.select("#syn-reference-text");
    target.text("Click on/Hover over plot to extract detailed synaptic information");
}

/*
 * hook, used in FFBOMesh3D.onMouseClick() to update information panel
 */
function add_syn_histogram(data){
    var pre_N_list = data['pre'].map(function(d){
    return d['N'];
    });
    var post_N_list= data['post'].map(function(d){
    return d['N'];
    });

    var hist_pre = d3.layout.histogram()(pre_N_list);
    var hist_post = d3.layout.histogram()(post_N_list);
    var max_pre = Max(hist_pre);
}

function get_connectivity_data(){
    msg = {}
    msg['format'] = 'nx';    // Format can be one of 'morphology', 'na','no_result', 'df', 'nk' or 'get_data'. Defaults to morphology
    msg['username'] = username;
    var na_servers = document.getElementById("na_servers");
    var na_server = na_servers.options[na_servers.selectedIndex].value;
    msg['server'] = na_server;
    msg['query'] = [{'action': {'method': {'add_connecting_synapses': {}}}, 'object': {'state': 0}}];
    msg['temp'] = true;
    // Setting 'temp': true won't append results to the state memory, keeping front end interactions independent of this query
    // Passing keyword args to a method would be done something like this 'add_connecting_synapses': {'include_inferred': false}
    // Memory can be used to refer to intermediate results. For example, the following is the translation of show neurons in eb
    // msg['query'] = [{'action': {'method': {'query': {}}}, 'object': {'class': 'Neuropil'}},   // ALL neuropils
    //{'action': {'method': {'has': {'name': 'EB'}}}, 'object': {'memory': 0}},// ALL neuropils => has name eb
    //  {'action': {'method': {'traverse_owns': {'cls': 'Neuron'}}}, 'object': {'memory': 0}}] // eb => traverse for neurons
    $(".overlay-background").show();
    Notify('Fetching connectivity data');
    client_session.call('ffbo.processor.neuroarch_query', [msg], {}).then(
	function(res) {
	    if(typeof res == 'object'){
		if ('error' in res) {
		    console.log('Error');
		    console.log(res);
		} else if('success' in res) {
		    $(".overlay-background").hide();
		    Notify('Finished fetching connectivity data');
		    process_connectivity_data(res);
		}
	    }}
    );
}

function process_connectivity_data(res){
    csv = 'If Inferred=1, the connectivity between neurons was inferred using axonic/dendritic polarity predicted by SPIN:Skeleton-based Polarity Identification for Neurons. Please refer to \nSPIN: A Method of Skeleton-based Polarity Identification for Neurons. Neurinformatics 12:487-507. Yi-Hsuan Lee, Yen-Nan Lin, Chao-Chun Chuang and Chung-Chuan Lo (2014)\nfor more details\n'
    csv += 'PreSynaptic Neuron,PostSynaptic Neuron,N,Inferred'
    nodes = res['success']['result']['nodes']
    edges = res['success']['result']['edges']
    
    for(e_pre in edges){
	if(nodes[e_pre]['class'] == 'Neuron'){
	    if('uname' in nodes[e_pre])
		pre = nodes[e_pre]['uname']
	    else
		pre = nodes[e_pre]['name']
	    synapse_nodes = edges[e_pre]
	    for(synapse in synapse_nodes){
		if(nodes[synapse]['class'] == 'Synapse')
		    inferred=0
		else
		    inferred=1
		N = nodes[synapse]['N']
		post_node = nodes[Object.keys(edges[synapse])[0]]
		if('uname' in post_node)
		    post = post_node['uname']
		else
		    post = post_node['name']
		csv += ('\n' + pre + ',' + post + ',' + N + ',' + inferred)
	    }
	}
    }
    makeTextFile(csv);
}

var textFile = null,
    makeTextFile = function (text) {
	var data = new Blob([text], {type: 'text/csv'});

	// If we are replacing a previously generated file we need to
	// manually revoke the object URL to avoid memory leaks.
	if (textFile !== null) {
	    window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	var link = document.createElement('a');
	link.setAttribute('download', 'ffbo_connectivity.csv');
	link.href = textFile;
	document.body.appendChild(link);

	// wait for the link to be added to the document
	window.requestAnimationFrame(function () {
	    var event = new MouseEvent('click');
	    link.dispatchEvent(event);
	    document.body.removeChild(link);
	});
    };

ffbomesh.dispatch["DownData"] = get_connectivity_data

function updateInfoPanelSynapse(data){
    if('label' in data)
        $('#neu-id').attr('label',data['label']);
    else if('uname' in data)
        $('#neu-id').attr('label',data['uname']);
    else if('uname' in data)
        $('#neu-id').attr('label',data['name']);

    $('#neu-id').html("Synapses between " + $('#neu-id').attr('label').replace("--", " and "));
    var params = ['Data Source', 'Synapse Locations'];

    html ='<tr class="experimental" ><td>Choose Color</td><td> <input class="color_inp"'
    if(Modernizr.inputtypes.color)
	html+='type="color"'
    else
	html+='type="text"'
    n_id = last_click
    html+='name="neu_col" id="neu_col" value="#' + ffbomesh.meshDict[n_id].color.getHexString() + '"/></td></tr>';

    for ( var i = 0; i < params.length; ++i ) {
        if (params[i] in data) {
            html += '<tr class="">'
            html += '<td>' + params[i] + ':</td>'
            s = JSON.stringify(data[params[i]]).replace(/[\[\]{}""]/g,"").replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();}).replace(",", ", ");
            html += '<td>' + s + '</td>';
            html += '</tr>';
	}
    }

    var table = document.getElementById("basic-info");
    table.innerHTML = '<tbody>' + html + '</tbody>';
    
    if(!Modernizr.inputtypes.color)
	$("#neu_col").spectrum({
	    showInput: true,
	    showPalette: true,
	    showSelectionPalette: true,
	    showInitial: true,
	    localStorageKey: "spectrum.neuronlp",
	    showButtons: false,
	    move: function(c){
		ffbomesh.setColor($('#neu-id').attr('uid'), c.toHexString());
	    }
	});
    else
	$('#neu_col').on('change', function(){
	    ffbomesh.setColor($('#neu-id').attr('uid'), $('#neu_col')[0].value);
	});
    $("#info-table-wrap").show()
    $("#summary").show()
    
}

function fetchDetailInfo(d) {
    $("#info-intro").hide();
    $("#info-reset").hide();
    $("#info-table-wrap").hide()
    $("#neu-name").show();
    $("#flycircuit-table").hide();
    $("#vfb-link").hide();
    $("#syn-wrap").hide();
    $("#svg-syn").hide();
    $("#syn-profile-info-wrapper").hide();
    $("#info-physiology").hide();

    $('#neu-id').attr('name',d[0]);
    $('#neu-id').attr('uid',d[1]);
    $('#neu-id').attr('label',d[0]);

    if(ffbomesh.meshDict[d[1]]['background'])
	return
    var na_servers = document.getElementById("na_servers");
    var na_server = na_servers.options[na_servers.selectedIndex].value;

    if('morph_type' in ffbomesh.meshDict[d[1]] && ffbomesh.meshDict[d[1]]['morph_type'] == 'Synapse SWC'){
	client_session.call('ffbo.na.get_syn_data.'+na_server,[{'id':d[1]}]).then(
            function (res) {
		if ('error' in res)
                    return;
		
		data = res['success']['data'];
		if(!data)
                    return;
		if ('synapse_details_1' in data)
		    updateInfoPanelSynapse(data['synapse_details_1'])
		
            },
            function (err) {
		console.log(err);
            }
	);
	return
    }
    
    var na_servers = document.getElementById("na_servers");
    var na_server = na_servers.options[na_servers.selectedIndex].value;
    client_session.call('ffbo.na.get_data.'+na_server,[{'id':d[1]}]).then(
        function (res) {
            if ('error' in res)
                return;
	    
            data = res['success']['data'];
	    if(!data)
                return;
            if ('summary_1' in data)
		update_summary_1(data['summary_1'])
	    if ('summary_2' in data)
		update_summary_2(data['summary_2'])
	    if ('synaptic_info_1' in data)
		update_synaptic_info_1(data['synaptic_info_1'])
	    if ('synaptic_info_2' in data)
		update_synaptic_info_2(data['synaptic_info_2'])
	    
	    
         /*
         div.children1[1].children[0].children[1].src = res["Images"]["Original confocal image (Animation)"];
             div.children[1].children[1].children[1].src = res["Images"]["Segmentation"];
             div.children[1].children[2].children[1].src = res["Images"]["Skeleton (download)"];*/

             },
         function (err) {
            console.log(err);
         }
      );
}

