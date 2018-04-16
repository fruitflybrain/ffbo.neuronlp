defin(['jquery','client_session'],function($,ClientSession){
  const infoPanelId = "#info-panel";
  // overlay
  const infoOverlay = "#syn-info-overlay";

  // synapse information
  const synTableWrapperId = "#info-table-neu-wrapper";
  const svgWrapperId = "#syn-profile-svg";
  const synTextId = "#syn-profile-text";
  const synTableWrapperId = "#syn-table";
  const preSynTableId = "#syn-table-pre";
  const postSynTableId = "#syn-table-post";
  // synapse table: filter by name
  const preSynSearchId = "#syn-table-pre-srch";
  const postSynSearchId = "#syn-table-post-srch";
  // synapse table: N greater than
  const preSynNId = "#syn-table-pre-N";
  const postSynNId = "#syn-table-post-N";
  // synapse table: c3,c4 names for pre and post 
  const preNeuBtnColClass = '.neuron_add_pre';
  const preSynBtnColClass = '.synapse_add_pre';
  const postNeuBtnColClass = '.neuron_add_post';
  const postSynBtnColClass = '.synapse_add_post';

  /**
  * Update synapses
  */
  function updateSyn(data,inferred){
    if (inferred){
      const btnMoreInfo = '<a id="inferred-details-pre" class="info-panel-more-info inferred-more-info"> <i class="fa fa-info-circle" aria-hidden="true"></i></a>';
      $(synTableWrapperId + " h4")[0].innerHTML = 'Inferred Presynaptic Partners' + btnMoreInfo;
      $(synTableWrapperId + " h4")[1].innerHTML = 'Inferred Postsynaptic Partners'+ btnMoreInfo;
      $(".inferred-more-info").click(function(){
        info = "<h2>Inferred Synaptic Partners</h2>";
        $(infoOverlay + " .container").html(info + data['description']);
        mm_menu_right.close();
        setTimeout( function() {
          closeAllOverlay(true);
          $(infoOverlay).slideDown(500);
        }, 500);
      });
      var tbody = $(synTextId).children()[0];
      //var post_num= data['post_N'];
      //var pre_num = data['pre_N'];
      html = "";

      //html+='<tr class=""><td>Inferred Synaptic Summary</td><td> Total Synapses: '+(post_num+pre_num).toString()+' ( Presynaptic Sites: '+pre_num.toString()+', Postsynaptic Sites: '+post_num.toString()+' )</td></tr>';
      html+='<tr class=""><td>Synaptic(inferred) Profile Plot</td><td id="syn-reference-text" class="syn-reference">Click on/Hover over plot to extract detailed synaptic(inferred) information</td></tr>';
      tbody.innerHTML = html;
      $(synTextId).show();
      updateSynTable(data);
    }else{
      $(synTableWrapperId + "h4")[0].innerHTML = "Presynaptic Partners";
      $(synTableWrapperId + "h4")[1].innerHTML = "Postsynaptic Partners";

      var tbody = $(synTextId).children()[0];

      var post_num= data['post_N'];
      var pre_num = data['pre_N'];
      html = "";

      html+='<tr class=""><td>Synaptic Summary</td><td> Total Synapses: '+(post_num+pre_num).toString()+' ( Presynaptic Sites: '+pre_num.toString()+', Postsynaptic Sites: '+post_num.toString()+' )</td></tr>';
      html+='<tr class=""><td>Synaptic Profile Plot</td><td id="syn-reference-text" class="syn-reference">Click on/Hover over plot to extract detailed synaptic information</td></tr>';
      tbody.innerHTML = html;
      $(synTextId).show();
      updateSynTable(data);
    }
  }



  /**
   * Update synaptic partners table
   *  1. Parse incoming NeuroArch Data, 
   *  2. Populate pre and post synaptic tables
   *  3. 
   */
  function updateSynTable(data){
    if(!('pre' in data | 'post' in data)){
      return
    }

    // pre/post tbody
    var pre_table = $(preSynTableId).children()[1];
    var post_table = $(postSynTableId).children()[1];
    
    // show synaptic table
    $(synTableWrapperId).show();

    // preprocess data
    syn_sum_data = pre_process_profile_data({
      'pre_N': data['pre_N'],
      'post_N': data['post_N'],
      'pre_sum': data['pre_sum'],
      'post_sum': data['post_sum']
    });

    // purge table
    $(postSynTableId + " tbody tr").remove();
    $(postSynTableId + " tbody tr").remove();

    // flags for detecting if neuron or synapses have been added
    let neuron_add = false;
    let synapse_add = false;
    for(x in data['pre']){
      d = data['pre'][x];
      name = "";
      N = "";

      if('label' in d){
        name = d['label'];
      }else if('uname' in d) {
        name = d['uname'];
      }else if('name' in d) {
        name = d['name'];
      }else {
        name = d['rid'];
      }
      if('N' in d) {
        N = d['N'];
      }
      var row = pre_table.insertRow(0);
      var c1 = row.insertCell(0);
      var c2 = row.insertCell(1);
      var c3 = row.insertCell(2);
      c3.className = preNeuBtnColClass.slice(1); // remove the . character
      var c4 = row.insertCell(3);
      c4.className = preSynBtnColClass.slice(1);

      c1.innerHTML = name;
      c2.innerHTML = N;

      // generate add/remove button for each neuron
      if(d['has_morph'] && 'uname' in d){
        var btn = document.createElement('button');
        btn.className = 'btn';
        btn.id = 'btn-pre-add-' + d['uname'];
        btn.name = d['uname'];
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
    if (neuron_add){
      $(neuBtnColClass).show();
    } else{
      $(neuBtnColClass).hide();
    }

    if (synapse_add){
      $(synBtnColClass).show();
    } else{
      $(synBtnColClass).hide();
    }

    // postsynaptic add
    neuron_add = false  // flag for neuron added
    synapse_add = false // flag for synapse added
    for(x in data['post']){
      d = data['post'][x];
      name = ""
      N = ""

      if('label' in d){
        name = d['label'];
      }else if('uname' in d) {
        name = d['uname'];
      }else if('name' in d) {
        name = d['name'];
      }else {
        name = d['rid'];
      }
      if('N' in d) {
        N = d['N'];
      }

      var row = post_table.insertRow(0);
      var c1 = row.insertCell(0);
      var c2 = row.insertCell(1);
      c1.innerHTML = name;
      c2.innerHTML = N;
      var c3 = row.insertCell(2);
      c3.className = postNeuBtnColClass.slice(1);
      var c4 = row.insertCell(3);
      c4.className = postSynBtnColClass.slice(1);

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

    if (neuron_add){
      $(postNeuBtnColClass).show()
    }else{
      $(postNeuBtnColClass).hide()
    }

    if (synapse_add){
      $(postSynBtnColClass).show()
    }else{
      $(postSynBtnColClass).hide()
    }

    // filter by name and number
    searchFunction(preSynTableId.slice(1),document.getElementById(preSynSearchId.slice(1)).value, 0);
    filterGtFunction(preSynTableId.slice(1),document.getElementById(preSynNId.slice(1)).value, 1);
    searchFunction(postSynTableId.slice(1),document.getElementById(postSynSearchId.slice(1)).value, 0);
    filterGtFunction(postSynTableId.slice(1),document.getElementById(postSynNId.slice(1)).value, 1);
  }


  /**
  * Add/Remove neuron upon buttonclick in info panel and toggle button
  */
  function toggleBtn(btn){
    if(btn.className.includes('add')){
      ClientSession.addByUname(btn.name);
      btn.innerText = "-";
      btn.className = "btn btn-remove btn-danger";
    }
    else{
      ClientSession.removeByUname(btn.name);
      btn.innerText = "+";
      btn.className = "btn btn-add btn-success";
    }
  }

  /**
  * Add/Remove synapse upon buttonclick in info panel and toggle button
  */
  function toggleSynBtn(btn){
    if(btn.className.includes('add')){
      ClientSession.addSynapseByUname(btn.name);
      btn.innerText = "-";
      btn.className = "btn btn-remove btn-danger";
    } else{
      ClientSession.removeSynapseByUname(btn.name);
      btn.innerText = "+";
      btn.className = "btn btn-add btn-success";
    }
  }


  /**
  * Pure JS class helpers
  */
  function hasClass(el, className){
    if (el.classList)
      return el.classList.contains(className)
    else
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  }

  /**
  * Pure JS class helpers
  */
  function addClass(el, className){
    if (el.classList)
      el.classList.add(className)
    else if (!hasClass(el, className)) el.className += " " + className
  }

  /**
  * Pure JS class helpers
  */
  function removeClass(el, className){
    if (el.classList)
      el.classList.remove(className)
    else if (hasClass(el, className)){
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      el.className=el.className.replace(reg, ' ')
    }
  }


  /**
  * Dynamic table
  */
  function searchFunction(table_id, text, col_num){
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

  /**
  * Dynamic table
  */
  function filterGtFunction(table_id, N, col_num){
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


  /**
  * Bind the above functions to keyup and change
  */
  $(preSynSearchId).on('keyup change', function (){
    searchFunction(preSynTableId.slice(1), this.value, 0);
  });


  $(preSynNId).on('keyup change', function (){
    filterGtFunction(preSynTableId.slice(1), this.value, 1);
  });


  $(postSynSearchId).on('keyup change', function (){
    searchFunction(postSynTableId.slice(1), this.value, 0);
  });


  $(postSynNId).on('keyup change', function (){
    filterGtFunction(postSynTableId.slice(1), this.value, 1);
  });


  /**
   * Exposing Methods
   */
  return {
    update: updateSyn
  }
});