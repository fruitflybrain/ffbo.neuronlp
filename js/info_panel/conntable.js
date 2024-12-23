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

moduleExporter("ConnTable",
  ['jquery',
  'd3',
  'preprocess',
  'overlay'],
  function(
    $,
    d3,
    preprocess,
    Overlay)
{
  /**
   * Connectivity Table inside Info Panel
   * @constructor
   * @param {string} div_id - id for div element in which the connectivity table is held
   * @param {obj} parentObj - parent object (infopanel)
   * @param {dict} [nameConfig={}] - configuration of children divs. The 3 children divs in ConnTable are `['preTabId','postTabId','overlayId']`
   */
  function ConnTable(div_id,parentObj, nameConfig={}){
    this.divId = div_id;  // wrapper
    this.preGroupByName = false;
    this.postGroupByName = false;

    // nameConfig = nameConfig || {};
    Object.defineProperty(this,"preTabId",{
      value: nameConfig.preTabId || "info-panel-table-pre" ,
      configurable: false,
      writable: false
    });
    Object.defineProperty(this,"postTabId",{
      value: nameConfig.postTabId || "info-panel-table-post" ,
      configurable: false,
      writable: false
    });
    Object.defineProperty(this,"overlayId",{
      value: nameConfig.overlayId || "info-panel-table-overlay" ,
      configurable: false,
      writable: false
    });

    this.parentObj = parentObj;

    let overlayText = `<h3>Inferred Synaptic Partners</h3><p>Inferred synaptic partners are marked by &dagger; </p><p>The synaptic partners are inferred according to <a target="_blank" href="https://doi.org/10.3389/fninf.2018.00099">Yu-Chi Huang et al., A Single-Cell Level and Connectome-Derived Computational Model of the Drosophila Brain. Front. Neuroinform. 2019, 12:99</a>.</p>`

    // remove existing overlay if exists
    $("#"+this.overlayId).remove();
    this.overlay = new Overlay(this.overlayId, overlayText);

    this.htmlTemplate = createTemplate(this);
    this.dom = document.getElementById(this.divId);
    this.reset();
  }


  /**
   * Create HTML template
   *
   * @param {object} obj - synonymous to `this`, refers to instance of ConnTable
   */
  function createTemplate(obj){
    var template = "";
    template = "";
    template += '<h4>Presynaptic Partners</h4>';
    template += '<table id="' + obj.preTabId + '" class="table table-inverse table-custom-striped">';
    template += '<colgroup> <col style="min-width=150px;" /> <col /> <col /> <col />';
    template += '<thead><tr class=""><th>Neuron <label class="toggle-switch"><input type="checkbox" id="pregroup-toggle-checkbox" class="toggle-switch-checkbox" checkedpre><span class="toggle-slider round"></span></label>Group by Type</th> <th>Number of Synapses</th> <th class="neuron_add_pre">+/- Neuron</th><th class="synapse_add_pre">+/- Synapses</th></tr><tr class=""><th><span class="info-input-span"> Filter by name <br></span><input type="text" id="presyn-srch" value="" placeholder="start with /r for regex" class="info-input"/></th> <th><span class="info-input-span"> N greater than <br></span><input type="number" id="presyn-N" value="0" class="info-input selectable"/></th> <th class="neuron_add_pre"><button class="btn btn-add btn-success" id="btn-pre-add-all-neuron" name="btn-pre-add-all-neuron">+</button><br></span><button class="btn btn-remove btn-danger" id="btn-pre-remove-all-neuron" name="btn-pre-remove-all-neuron">-</button></th><th class="synapse_add_pre"><button class="btn btn-add btn-success" id="btn-pre-add-all-synapse" name="btn-pre-add-all-synapse">+</button><br></span><button class="btn btn-remove btn-danger" id="btn-pre-remove-all-synapse" name="btn-pre-remove-all-synapse">-</button></th></tr></thead>';
    template += '<tbody></tbody></table>';
    template += '<h4>Postsynaptic Partners</h4>';
    template += '<table id="' + obj.postTabId + '" class="table table-inverse table-custom-striped">';
    template += '<colgroup> <col style="min-width=150px;" /> <col /> <col /> <col />';
    template += '<thead><tr  class=""><th>Neuron <label class="toggle-switch"><input type="checkbox" id="postgroup-toggle-checkbox" class="toggle-switch-checkbox" checkedpost><span class="toggle-slider round"></span></label>Group by Type</th> <th>Number of Synapses</th> <th class="neuron_add_post">+/- Neuron</th><th class="synapse_add_post">+/- Synapses</th></tr><tr class=""><th><span class="info-input-span"> Filter by name <br></span><input type="text" id="postsyn-srch" value="" placeholder="start with /r for regex" class="info-input"/></th> <th><span class="info-input-span"> N greater than <br></span><input type="number" id="postsyn-N" value="0" class="info-input selectable"/></th> <th class="neuron_add_post"><button class="btn btn-add btn-success" id="btn-post-add-all-neuron" name="btn-post-add-all-neuron">+</button><br></span><button class="btn btn-remove btn-danger" id="btn-post-remove-all-neuron" name="btn-post-remove-all-neuron">-</button></th><th class="synapse_add_post"><button class="btn btn-add btn-success" id="btn-post-add-all-synapse" name="btn-post-add-all-synapse">+</button><br></span><button class="btn btn-remove btn-danger" id="btn-post-remove-all-synapse" name="btn-post-remove-all-synapse">-</button></th></tr></thead>';
    template += '<tbody></tbody></table>';
    return template;
  }

  /**
   * Reset to default HTML
   */
  ConnTable.prototype.reset = function (){
    // purge div and add table
    const tmp = this.htmlTemplate.replace('checkedpre', this.preGroupByName ? 'checked' : '').replace('checkedpost', this.postGroupByName ? 'checked' : '');
    this.dom.innerHTML = tmp;
  }

  /**
  * Hide all subcomponents
  */
  ConnTable.prototype.hide = function(){
    $('#'+this.preTabId).hide();
    $('#'+this.postTabId).hide();
    $('#'+this.divId).hide();
  }

  /**
  * Show all subcomponents
  */
  ConnTable.prototype.show = function(){
    $('#'+this.preTabId).show();
    $('#'+this.postTabId).show();
    $('#'+this.divId).show();
  }

  ConnTable.prototype.resize = function(){
    return;
  }


  function verifyDataIntegrity(data){
    let integrity = 1;
    return integrity  && data && ('pre' in data) && ('post' in data);
  }

  /**
  * Update synpatic reference and table
  *
  * @param {obj} data - connectivity data, must be in the format specified by `InfoPanel.reformatData()` method
  * @param {boolean} inferred - whether the connectivity is inferred or not
  */
  ConnTable.prototype.update = function(data){
    // show synaptic table
    if (verifyDataIntegrity(data) == false){
      return;
    }
    this.reset();
    this.show();

    const btnMoreInfo = '<a id="inferred-details-pre" class="info-panel-more-info inferred-more-info"> <i class="fa fa-info-circle" aria-hidden="true"></i></a>';
    $('#'+this.divId).children('h4').eq(0).html(`
      &nbsp;
      <span id="toggle-pre-arrow" class="expander-arrow">&#9660;</span>
      Presynaptic Partners
      ${btnMoreInfo}
    `);
    $('#'+this.divId).children('h4').eq(1).html(`
      &nbsp;
      <span id="toggle-post-arrow" class="expander-arrow">&#9660;</span>
      Postsynaptic Partners
      ${btnMoreInfo}
    `);


    $('#'+this.divId+ " .inferred-more-info").click(() => {
      // info = "<h2>Inferred Synaptic Partners</h2>";
      // this.overlay.update(info + data['description']); //<TODO> overwrite in the future
      this.overlay.show();
    });

    this.updateData(data);

    // create table
    this.updateTable('pre');
    this.updateTable('post');
    this.setupCallbacks();

  }

  ConnTable.prototype.updateData = function(data) {

    if ('pre' in data) {
      let preTableData = {};
      let preTypeData = {};

      for(const x in data['pre']['details']){ // loop through all partners
        const d = data['pre']['details'][x];
        const uname = ('uname' in d) ? d['uname'] : d['name'];
        const name = d['name'];
        const N = ('number' in d) ? d['number'] : 0;

        preTableData[uname] = {
          'name': name,
          'N': N
        };

        if (!(name in preTypeData)) {
          preTypeData[name] = {'unames': [],  'N': 0, 'count': 0, 'n_rids': [], 's_rids': []};
        }
        
        preTypeData[name]['unames'].push(uname);
        preTypeData[name]['N'] += N;
        preTypeData[name]['count'] += 1;
        
        if(d['has_morph'] && ('uname' in d)){
          preTableData[uname]['n_rid'] = d['n_rid'];
          preTableData[uname]['orid'] = d['rid'];
          preTableData[uname]['has_morph'] = true;
          preTypeData[name]['n_rids'].push(d['n_rid']);
        }
  
        if(d['has_syn_morph'] && 'syn_uname' in d){
          preTableData[uname]['has_syn_morph'] = true;
          preTableData[uname]['syn_uname'] = d['syn_uname'];
          preTableData[uname]['s_rid'] = d['s_rid'];
          preTableData[uname]['syn_rid'] = d['syn_rid'];
          preTypeData[name]['s_rids'].push(d['s_rid']);
        }
      }

      let entries = Object.entries(preTypeData);
      entries.sort(([keyA, valA], [keyB, valB]) => {
        return valA.N - valB.N;
      });
      this.preTypeData = Object.fromEntries(entries);

      entries = Object.entries(preTableData);
      entries.sort(([keyA, valA], [keyB, valB]) => {
        return valA.N - valB.N;
      });
      this.preTableData = Object.fromEntries(entries);
    
    } else {
      this.preTypeData = {};
      this.preTableData = {};
    }

    if ('post' in data ) {
      let postTableData = {};
      let postTypeData = {};
      for(const x in data['post']['details']){ // loop through all partners
        const d = data['post']['details'][x];
        const uname = ('uname' in d) ? d['uname'] : d['name'];
        const name = d['name'];
        const N = ('number' in d) ? d['number'] : 0;
        postTableData[uname] = {
          'name': name,
          'N': N,
          'inferred': d['inferred']
        };
        
        if (!(name in postTypeData)) {
          postTypeData[name] = {'unames': [],  'N': 0, 'count': 0, 'n_rids': [], 's_rids': []};
        }
        postTypeData[name]['unames'].push(uname);
        postTypeData[name]['N'] += N;
        postTypeData[name]['count'] += 1;

        if(d['has_morph'] && ('uname' in d)){
          postTableData[uname]['n_rid'] = d['n_rid']
          postTableData[uname]['orid'] = d['rid'];
          postTableData[uname]['has_morph'] = true;
          postTypeData[name]['n_rids'].push(d['n_rid']);
        }
  
        if(d['has_syn_morph'] && 'syn_uname' in d){
          postTableData[uname]['has_syn_morph'] = true;
          postTableData[uname]['syn_uname'] = d['syn_uname'];
          postTableData[uname]['s_rid'] = d['s_rid'];
          postTableData[uname]['syn_rid'] = d['syn_rid'];
          postTypeData[name]['s_rids'].push(d['s_rid']);
        }
      }

      let entries = Object.entries(postTypeData);
      entries.sort(([keyA, valA], [keyB, valB]) => {
        return valA.N - valB.N;
      });
      this.postTypeData = Object.fromEntries(entries);

      entries = Object.entries(postTableData);
      entries.sort(([keyA, valA], [keyB, valB]) => {
        return valA.N - valB.N;
      });
      this.postTableData = Object.fromEntries(entries);
    } else {
      this.postTypeData = {};
      this.postTableData = {};
    }

  }

  /**
    * Update synaptic partners table, child method of `ConnTable.update()`
    *
    *  @param {obj} data - inherited from caller `ConnTable.update()` method
    *  @param {string} connDir - Connectivity direction `['pre'/'post']`
    */
  ConnTable.prototype.updateTable = function(connDir){
    let tableData;
    let typeData;
    let group;

    if (connDir === 'pre') {
      if ( Object.keys(this.preTableData).length === 0 ) {
        return false;
      }

      // pre/post tbody
      var table = $('#'+this.preTabId + " tbody")[0];
      // reset table
      $('#'+this.preTabId + " tbody tr").remove();

      tableData = this.preTableData;
      group = this.preGroupByName;
      typeData = this.preTypeData;

    } else {
      if ( Object.keys(this.postTableData).length === 0 ) {
        return false;
      }

      // pre/post tbody
      var table = $('#'+this.postTabId + " tbody")[0];
      // reset table
      $('#'+this.postTabId + " tbody tr").remove();

      tableData = this.postTableData;
      group = this.postGroupByName;
      typeData = this.postTypeData;
    }

    // flags for detecting if neuron or synapses have been added
    let neuron_add = false;
    let synapse_add = false;
    if (group) {
      for (var name in typeData) {
        var row = table.insertRow(0);
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);
        var c3 = row.insertCell(2);
        c3.className = (connDir==='pre') ? 'neuron_add_type_pre': 'neuron_add_type_post'; // remove the . character
        var c4 = row.insertCell(3);
        c4.className = (connDir==='pre') ? 'synapse_add_type_pre': 'synapse_add_type_post';

        let N = typeData[name]['N'];
        let disp_name = name.replace('<', '&lt').replace('>', '&gt');
        c1.innerHTML = disp_name + ' - (' + typeData[name]['count'] + ')';
        c2.innerHTML = N;

        let btn = document.createElement('button');
        btn.className = 'btn';
        btn.className += ' btn-add btn-success';
        btn.innerText = '+';
        
        btn.id = (connDir==='pre') ? 'btn-pre-add-type-' + name : 'btn-post-add-type' + name;
        btn.name = name;
        btn.rid = typeData[name]['n_rids'];

        if (typeData[name]['n_rids'].length > 0) {
          neuron_add = true;
        }

        c3.appendChild(btn);

        btn = document.createElement('button');
        btn.className = 'btn';
        btn.className += ' btn-remove btn-danger';
        btn.innerText = '-';
        
        btn.id = (connDir==='pre') ? 'btn-pre-remove-type-' + name : 'btn-post-remove-type' + name;
        btn.name = name;
        btn.rid = typeData[name]['n_rids'];

        c3.appendChild(btn);

        btn = document.createElement('button');
        btn.className = 'btn';
        btn.className += ' btn-add btn-success';
        btn.innerText = '+';
        
        btn.id = (connDir==='pre') ? 'btn-pre-syn-add-type-' + name : 'btn-post-syn-add-type' + name;
        btn.name = name;
        btn.rid = typeData[name]['s_rids'];

        if (typeData[name]['s_rids'].length > 0) {
          synapse_add = true;
        }

        c4.appendChild(btn);

        btn = document.createElement('button');
        btn.className = 'btn';
        btn.className += ' btn-remove btn-danger';
        btn.innerText = '-';
        
        btn.id = (connDir==='pre') ? 'btn-pre-syn-remove-type-' + name : 'btn-post-syn-remove-type' + name;
        btn.name = name;
        btn.rid = typeData[name]['s_rids'];

        c4.appendChild(btn);

      }
    } else {
      for (var uname in tableData) {
        var row = table.insertRow(0);
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);
        var c3 = row.insertCell(2);
        c3.className = (connDir==='pre') ? 'neuron_add_pre': 'neuron_add_post'; // remove the . character
        var c4 = row.insertCell(3);
        c4.className = (connDir==='pre') ? 'synapse_add_pre': 'synapse_add_post';

        let N = tableData[uname]['N'];
        let disp_uname = uname.replace('<', '&lt').replace('>', '&gt');
        if ( tableData[uname]['inferred'] == 1 ){
          c1.innerHTML = "&dagger;" + disp_uname;
        }else{
          c1.innerHTML = disp_uname;
        }
        c2.innerHTML = N;
        
        if( tableData[uname]['has_morph'] ){
          let btn = document.createElement('button');
          btn.className = 'btn';
          
          btn.id = (connDir==='pre') ? 'btn-pre-add-' + uname : 'btn-post-add-' + uname;
          btn.name = uname;
          btn.rid = tableData[uname]['n_rid'];
          let rid = tableData[uname]['orid'];
          btn.orid = rid;

          if (this.parentObj.isInWorkspace(rid)){
            btn.innerText = '-';
            btn.className += ' btn-remove btn-danger';
          }else{
            btn.innerText = '+';
            btn.className += ' btn-add btn-success';
          }
          c3.appendChild(btn);
          neuron_add = true;
        }
      

        if( tableData[uname]['has_syn_morph'] ){
          let btn = document.createElement('button');
          btn.className = 'btn';
          let syn_uname = tableData[uname]['syn_uname']; 
          btn.id = (connDir==='pre') ? 'btn-pre-syn-add-' + syn_uname : 'btn-post-syn-add-' + syn_uname;
          btn.name = syn_uname;
          btn.rid = tableData[uname]['s_rid'];
          let rid = tableData[uname]['syn_rid'];
          btn.orid = rid;

          if (this.parentObj.isInWorkspace(rid)){
            btn.innerText = '-';
            btn.className += ' btn-remove btn-danger';
          }else{
            btn.innerText = '+';
            btn.className += ' btn-add btn-success';
          }

          c4.appendChild(btn);
          synapse_add = true;
        }
      }
    }

    if (neuron_add){
      $('.neuron_add_'+connDir).show();
    } else{
      $('.neuron_add_'+connDir).hide();
    }

    if (synapse_add){
      $('.synapse_add_'+connDir).show();
    } else{
      $('.synapse_add_'+connDir).hide();
    }

    // refresh list
    this.filterByName(this.preTabId,document.getElementById("presyn-srch").value);
    this.filterByNum(this.preTabId,document.getElementById("presyn-N").value);
    this.filterByName(this.postTabId,document.getElementById("postsyn-srch").value);
    this.filterByNum(this.postTabId,document.getElementById("postsyn-N").value);

    // add callback
    $("#presyn-srch").on('keyup change',(function(){
      this.filterByName(this.preTabId,document.getElementById("presyn-srch").value);
    }).bind(this));
    $("#presyn-N").on('keyup change', (function (){
      this.filterByNum(this.preTabId,document.getElementById("presyn-N").value);
    }).bind(this));
    $("#postsyn-srch").on('keyup change', (function (){
      this.filterByName(this.postTabId,document.getElementById("postsyn-srch").value);
    }).bind(this));
    $("#postsyn-N").on('keyup change', (function (){
      this.filterByNum(this.postTabId,document.getElementById("postsyn-N").value);
    }).bind(this));

  }


  /**
  * Add/Remove neuron upon buttonclick in info panel and toggle button
  */
  // ConnTable.prototype.toggleBtn = function(btn){
  //   if(btn.className.includes('add')){
  //     $('button[name="' + btn.name + '"]').each((idx,dom) => {
  //       dom.innerText = "-";
  //       dom.className = "btn btn-remove btn-danger";
  //     });
  //     this.parentObj.addByUname(btn.name);

  //   }
  //   else{
  //     $('button[name="' + btn.name + '"]').each((idx,dom) => {
  //       dom.innerText = "+";
  //       dom.className = "btn btn-add btn-success";
  //     });

  //     this.parentObj.removeByUname(btn.name);
  //     //$('button[name="' + btn.name + '"]').
  //   }
  // }

  // function toggleSynBtn(btn){
  //   if(btn.className.includes('add')){
  //     btn.innerText = "-";
  //     btn.className = "btn btn-remove btn-danger";
  //   } else{
  //     btn.innerText = "+";
  //     btn.className = "btn btn-add btn-success";
  //   }
  // }


  /**
  * Pure JS class helpers
  */
  function hasClass(el, className){
    if (el.classList)
      return el.classList.contains(className);
    else
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  }

  /**
  * Pure JS class helpers
  */
  function addClass(el, className){
    if (el.classList){
      el.classList.add(className);
    }else if (!hasClass(el, className)){
      el.className += " " + className;
    }
  }

  /**
  * Pure JS class helpers
  */
  function removeClass(el, className){
    if (el.classList){
      el.classList.remove(className);
    }else if (hasClass(el, className)){
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className=el.className.replace(reg, ' ');
    }
  }


  /**
  * Filter Connectivity Table by Name
  *
  * @param {string} tableId - id of table being filtered
  * @param {string} text - text used for filtering
  */
  ConnTable.prototype.filterByName = function(tableId, text){
    var filter, table, tr, td, i;
    if (text.startsWith('/r')) {
      try {
        filter = new RegExp(text.slice(2));
      } catch (error) {
        return;
      }
      table = document.getElementById(tableId).children[2];
      tr = table.getElementsByTagName("tr");

      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if(td) {
          if (filter.test(td.innerHTML.split(' - '[0]))) {
              removeClass(tr[i], "filtered-name");
            if(!hasClass(tr[i], "filtered-N"))
              tr[i].style.display = "";
          } else{
            addClass(tr[i], "filtered-name");
            tr[i].style.display = "none";
          }
        }
      }
    } else {
      filter = text.toLowerCase();
      table = document.getElementById(tableId).children[2];
      tr = table.getElementsByTagName("tr");

      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          if (td.innerHTML.split(' - ')[0].toLowerCase().indexOf(filter) > -1) {
            removeClass(tr[i],"filtered-name");
            if(!hasClass(tr[i],"filtered-N"))
              tr[i].style.display = "";
          } else {
            addClass(tr[i],"filtered-name");
            tr[i].style.display = "none";
          }
        }
      }
    }
  }

  /**
  * Filter Connectivity Table by Number
  *
  * @param {string} tableId - id of table being filtered
  * @param {string} N - filter neurons with number of connectivty `> N`
  */
  ConnTable.prototype.filterByNum = function(tableId,N){
    // Declare variables
    var table, tr, td, i;
    table = document.getElementById(tableId).children[2];
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        if (Number(td.innerHTML) > Number(N)) {
          removeClass(tr[i],"filtered-N");
          if(!hasClass(tr[i],"filtered-name"))
            tr[i].style.display = "";
        } else {
          addClass(tr[i],"filtered-N");
          tr[i].style.display = "none";
        }
      }
    }
  }

  /**
   * Setup Callback for add remove button
   */
  ConnTable.prototype.setupCallbacks = function(){
    let that = this;

    $("#pregroup-toggle-checkbox").prop("checked", that.preGroupByName);
    $("#postgroup-toggle-checkbox").prop("checked", that.postGroupByName);

    $("#"+that.divId + " button").click(function(){
        if(this.name.includes('pre-add-all')){
            var tableId, table, tr, td, i, cc;
            tableId = that.preTabId;
            text = document.getElementById("presyn-srch").value;
            N =  Number(document.getElementById("presyn-N").value);
            table = document.getElementById(tableId).children[2];
            tr = table.getElementsByTagName("tr");
            if (text.startsWith('/r')) {
              try {
                filter = new RegExp(text.slice(2));
                use_regex = true;
              } catch (error) {
                return;
              }
            } else {
              filter = text.toLowerCase();
              use_regex = false;
            }
            var rid_list = [];
            for (i = 0; i < tr.length; i++) {
              td = tr[i].getElementsByTagName("td");
              if (td[0]) {
                if (use_regex) {
                  test = filter.test(td[0].innerHTML.split(' - ')[0]);
                } else {
                  test = td[0].innerHTML.split(' - ')[0].toLowerCase().indexOf(filter) > -1
                }
                if (test && td[1].innerHTML > N) {
                  if(this.name.includes('neuron')){
                      //cc = document.getElementById("btn-pre-add-"+td[0].innerHTML);
                      cc = td[2].getElementsByTagName("button")[0];
                  }else {
                      cc = td[3].getElementsByTagName("button")[0];
                  }
                  if (that.preGroupByName){
                    rid_list.push(...cc.rid);
                  } else {
                    if (cc.className.includes('add')){
                      rid_list.push(cc.rid);
                    }
                  }
                }
              }
            }
            that.parentObj.addByRid(rid_list);
        }else if(this.name.includes('pre-remove-all')){
            var tableId, table, tr, td, i, cc;
            tableId = that.preTabId;
            text = document.getElementById("presyn-srch").value;
            N =  Number(document.getElementById("presyn-N").value);
            table = document.getElementById(tableId).children[2];
            tr = table.getElementsByTagName("tr");
            if (text.startsWith('/r')) {
              try {
                filter = new RegExp(text.slice(2));
                use_regex = true;
              } catch (error) {
                return;
              }
            } else {
              filter = text.toLowerCase();
              use_regex = false;
            }
            var rid_list = [];
            for (i = 0; i < tr.length; i++) {
              td = tr[i].getElementsByTagName("td");
              if (td[0]) {
                if (use_regex) {
                  test = filter.test(td[0].innerHTML.split(' - ')[0]);
                } else {
                  test = td[0].innerHTML.split(' - ')[0].toLowerCase().indexOf(filter) > -1
                }
                if (test && td[1].innerHTML > N) {
                  if(this.name.includes('neuron')){
                      cc = td[2].getElementsByTagName("button")[0];
                  }else {
                      cc = td[3].getElementsByTagName("button")[0];
                  }
                  if (that.preGroupByName){
                    rid_list.push(...cc.rid);
                  } else {
                    if (cc.className.includes('remove')){
                      rid_list.push(cc.rid);
                    }
                  }
                }
              }
            }
            that.parentObj.removeByRid(rid_list);
        }else if(this.name.includes('post-add-all')){
            var tableId, table, tr, td, i, cc;
            tableId = that.postTabId;
            text = document.getElementById("postsyn-srch").value;
            N =  Number(document.getElementById("postsyn-N").value);
            table = document.getElementById(tableId).children[2];
            tr = table.getElementsByTagName("tr");

            if (text.startsWith('/r')) {
              try {
                filter = new RegExp(text.slice(2));
                use_regex = true;
              } catch (error) {
                return;
              }
            } else {
              filter = text.toLowerCase();
              use_regex = false;
            }

            var rid_list = [];
            for (i = 0; i < tr.length; i++) {
              td = tr[i].getElementsByTagName("td");
              if (td[0]) {
                if (use_regex) {
                  test = filter.test(td[0].innerHTML.split(' - ')[0]);
                } else {
                  test = td[0].innerHTML.split(' - ')[0].toLowerCase().indexOf(filter) > -1
                }
                if (test && td[1].innerHTML > N) {
                  if(this.name.includes('neuron')){
                      cc = td[2].getElementsByTagName("button")[0];
                  }else {
                      cc = td[3].getElementsByTagName("button")[0];
                  }
                  if (cc){
                    if (that.postGroupByName){
                      rid_list.push(...cc.rid);
                    } else {
                      if (cc.className.includes('add')){
                        rid_list.push(cc.rid);
                      }
                    }
                  }
                }
              }
            }
            that.parentObj.addByRid(rid_list);
        }else if(this.name.includes('post-remove-all')){
            var tableId, table, tr, td, i, cc;
            tableId = that.postTabId;
            text = document.getElementById("postsyn-srch").value;
            N =  Number(document.getElementById("postsyn-N").value);
            table = document.getElementById(tableId).children[2];
            tr = table.getElementsByTagName("tr");
            if (text.startsWith('/r')) {
              try {
                filter = new RegExp(text.slice(2));
                use_regex = true;
              } catch (error) {
                return;
              }
            } else {
              filter = text.toLowerCase();
              use_regex = false;
            }

            var rid_list = [];
            for (i = 0; i < tr.length; i++) {
              td = tr[i].getElementsByTagName("td");
              if (td[0]) {
                if (use_regex) {
                  test = filter.test(td[0].innerHTML.split(' - ')[0]);
                } else {
                  test = td[0].innerHTML.split(' - ')[0].toLowerCase().indexOf(filter) > -1
                }
                if (test && td[1].innerHTML > N) {
                  if(this.name.includes('neuron')){
                      cc = td[2].getElementsByTagName("button")[0];
                  }else {
                      cc = td[3].getElementsByTagName("button")[0];
                  }
                  if (cc){
                    if (that.postGroupByName){
                      rid_list.push(...cc.rid);
                    } else {
                      if (cc.className.includes('remove')){
                          rid_list.push(cc.rid);
                      }      
                    }
                  }
                }
              }
            }
            that.parentObj.removeByRid(rid_list);
        } else if (this.className.includes('add_type')) {

        } else if (this.className.includes('remove_type')) {

        } else if(this.className.includes('add')){
          that.parentObj.addByRid(this.rid);
        } else if(this.className.includes('remove')){
          that.parentObj.removeByRid(this.rid);
        } else{}
    })
    .mouseenter( function() {
      if (this.className.includes('remove')) {
        that.parentObj.highlight(this.orid);
      }
    })
    .mouseleave( function() {
      if (this.className.includes('remove')) {
        that.parentObj.resume();
      }
    });

      // Add a click handler for the arrow
    $("#toggle-pre-arrow").off("click").on("click", function() {
      const preTable = $('#'+that.preTabId);
      if (preTable.is(':visible')) {
        preTable.hide();
        $(this).html("&#9658;");
      } else {
        preTable.show();
        $(this).html("&#9660;");
      }
    });

    $("#toggle-post-arrow").off("click").on("click", function() {
      const postTable = $('#'+that.postTabId);
      if (postTable.is(':visible')) {
        postTable.hide();
        $(this).html("&#9658;");
      } else {
        postTable.show();
        $(this).html("&#9660;");
      }
    });

    $("#pregroup-toggle-checkbox").off("change").on("change", function() {
      that.preGroupByName = $(this).is(":checked");
      that.updateTable('pre');
      that.setupCallbacks();
    });

    $("#postgroup-toggle-checkbox").off("change").on("change", function() {
      that.postGroupByName = $(this).is(":checked");
      that.updateTable('post');
      that.setupCallbacks();
    });
  };

  
  /**
   * Expose constructor for SVG
   */
  return ConnTable;
})
