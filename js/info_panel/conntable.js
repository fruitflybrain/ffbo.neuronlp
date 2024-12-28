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

// var decodeEntities = (function() {
//   // this prevents any overhead from creating the object each time
//   var element = document.createElement('div');

//   function decodeHTMLEntities (str) {
//     if(str && typeof str === 'string') {
//       // strip script/html tags
//       str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
//       str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
//       element.innerHTML = str;
//       str = element.textContent;
//       element.textContent = '';
//     }

//     return str;
//   }

//   return decodeHTMLEntities;
// })();

function scrollAndHighlight(element) {
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  element.classList.add('exchange-highlight-flash');
  setTimeout(() => {
    element.classList.remove('exchange-highlight-flash');
  }, 800);
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

    let overlayText = `
<h3>Additional Annotations</h3>
<ul>
  <li>
    <p>
    &dagger;: Inferred synaptic partners are marked by &dagger; </p><p>The synaptic partners are inferred according to <a target="_blank" href="https://doi.org/10.3389/fninf.2018.00099">Yu-Chi Huang et al., A Single-Cell Level and Connectome-Derived Computational Model of the Drosophila Brain. Front. Neuroinform. 2019, 12:99</a>.
    </p>
  </li>
  <li>
    <p>
    <i class='fa fa-exchange fa-fw' aria-hidden='true'></i>: Both presynaptic neuron that is also postsynaptic and postsynaptic neuron that is also presynaptic will be labeled with <i class='fa fa-exchange fa-fw' aria-hidden='true'></i>. Clicking on this button will take you directly to the item reversing the connection.
    </p>
  </li>
</ul>
<h3>Filter by Name</h3>
<p> There are 2 ways to specify your filter in the "Filter by name" textbox.</p>
<ul>
  <li>
    <p>
    <b>Normal filter</b>: If your search text matches any part of the neuron name (in Neuron mode) or cell-type name (in Group by Type mode), then the neuron or type will be displayed. This search is case-insensitive. In addition, you can use '?' as a wild card to match any single character, and '*' as a wild card to match any number of characters (as the case in typical file name wild cards; the other unix file name matching such as [1-9] is not supported in normal filter). For example, if you type in "L1" in the search box, any of the following can be matched "abL1cd", "L1ij", "afL1", etc. If you type in "L?1" in the search box, any of the following can be matched: "abL21", "Lf1cd", etc. 
    </p>
  </li>
  <li>
    <p>
    <b>Regex filter</b>: You can specify a regex pattern match if you start the search with "/r". For example, if your regex pattern is "^(?!)segment" (which removes all untraced segments), then you should put in the search box (without the quotes) "/r^(?!segment)".
    </p>
  </li>
</ul>
<h3>Buttons</h3>
<ul>
  <li>
    <p>
    Buttons can be used to add/remove neurons or synapses. By clicking on the + button on a row with individual neuron, you will add the corresponding pre- or post-synaptic neuron or the synapses corresponding to this connection. Likewise, the - button will remove it. When the neuron/synapses is added into the visualization, hovering mouse on top of the buttons will highlight the neuron/synapse.
    <p>
  </li>
  <li>
    <p>
    When clicking on the buttons on the top of each table, you will add all the neuron/synapses that are in the current filtered tabled (i.e., it will only add the ones that satisfy the filter criteria). You can hover on top of these buttons, it will highlight all the neurons/synpases that are currently in the workspace AND in the table.
    </p>
  </li>
  <li>
    <p>
    When clicking on the buttons associated with a cell-type row, you will add all the neuron/synapses that associated with this cell-type. You can hover on top of these buttons, it will highlight all the neurons/synpases associated with this cell type that are currently in the workspace.
    </p>
  </li>
</ul>
`

    // remove existing overlay if exists
    $("#"+this.overlayId).remove();
    this.overlay = new Overlay(this.overlayId, overlayText);

    this.htmlTemplate = createTemplate(this);
    this.dom = document.getElementById(this.divId);
    this.reset();

    this.class_filters = {
      'filtered-N': new RegExp('(\\s|^)' + 'filtered-N' + '(\\s|$)'),
      'filtered-count': new RegExp('(\\s|^)' + 'filtered-count' + '(\\s|$)'),
      'filtered-name': new RegExp('(\\s|^)' + 'filtered-name' + '(\\s|$)'),
      'filtered': new RegExp('(\\s|^)' + 'filtered' + '(\\s|$)'),
      'conn-type': new RegExp('(\\s|^)' + 'conn-type' + '(\\s|$)'),
      'conn-cell': new RegExp('(\\s|^)' + 'conn-cell' + '(\\s|$)'),
      'type-expanded': new RegExp('(\\s|^)' + 'type-expanded' + '(\\s|$)'),
    }
  }


  /**
   * Create HTML template
   *
   * @param {object} obj - synonymous to `this`, refers to instance of ConnTable
   */
  function createTemplate(obj){
    var template = "";
    template = "";
    template += `<h4>&nbsp;
      <span id="toggle-pre-arrow" class="expander-arrow">&#9660;</span>
      Presynaptic Partners<a id="inferred-details-pre" class="info-panel-more-info inferred-more-info"> <i class="fa fa-info-circle" aria-hidden="true"></i></a></h4>`;
    template += '<table id="' + obj.preTabId + '" class="table table-inverse table-custom-striped">';
    template += '<colgroup> <col /><col /> <col /><col /> <col /> <col />';
    template += `
    <thead>
    <tr class="">
      <th></th>
      <th>Neuron <label class="toggle-switch"><input type="checkbox" id="pregroup-toggle-checkbox" class="toggle-switch-checkbox" checkedpre><span class="toggle-slider round"></span></label>Group by Type</th>
      <th id="cell-count-pre"></th>
      <th>Number of Synapses</th> 
      <th class="neuron_add_pre">+/- Neuron</th>
      <th class="synapse_add_pre">+/- Synapses</th>
    </tr>
    <tr class="">
      <th><span id='expand-pre-all'>button_pre_all</span></th>
      <th><span class="info-input-span"> Filter by name <br></span><input type="text" id="presyn-srch" value="" placeholder="start with /r for regex" class="info-input"/></th>
      <th id="cell-filter-pre"></th>
      <th><span class="info-input-span"> N greater than <br></span><input type="number" id="presyn-N" value="0" placeholder="0" class="info-input selectable"/></th>
      <th class="neuron_add_pre"><button class="btn btn-all btn-add btn-success" id="btn-pre-add-all-neuron" name="btn-pre-add-all-neuron">+</button><br></span><button class="btn btn-all btn-remove btn-danger" id="btn-pre-remove-all-neuron" name="btn-pre-remove-all-neuron">-</button></th>
      <th class="synapse_add_pre"><button class="btn btn-all btn-add btn-success" id="btn-pre-add-all-synapse" name="btn-pre-add-all-synapse">+</button><br></span><button class="btn btn-all btn-remove btn-danger" id="btn-pre-remove-all-synapse" name="btn-pre-remove-all-synapse">-</button></th>
      </tr>
    </thead>`;
    template += '<tbody></tbody></table>';
    template += `<h4>&nbsp;
      <span id="toggle-post-arrow" class="expander-arrow">&#9660;</span>
      Postsynaptic Partners<a id="inferred-details-pre" class="info-panel-more-info inferred-more-info"> <i class="fa fa-info-circle" aria-hidden="true"></i></a></h4>`;
    template += '<table id="' + obj.postTabId + '" class="table table-inverse table-custom-striped">';
    template += '<colgroup> <col /><col style="min-width=150px;" /> <col /><col /> <col /> <col />';
    template += `
    <thead>
    <tr class="">
      <th></th>
      <th>Neuron <label class="toggle-switch"><input type="checkbox" id="postgroup-toggle-checkbox" class="toggle-switch-checkbox" checkedpost><span class="toggle-slider round"></span></label>Group by Type</th>
      <th id="cell-count-post"></th>
      <th>Number of Synapses</th>
      <th class="neuron_add_post">+/- Neuron</th>
      <th class="synapse_add_post">+/- Synapses</th>
    </tr>
    <tr class="">
      <th><span id='expand-post-all'>button_post_all</span></th>
      <th><span class="info-input-span"> Filter by name <br></span><input type="text" id="postsyn-srch" value="" placeholder="start with /r for regex" class="info-input"/></th>
      <th id="cell-filter-post"></th>
      <th><span class="info-input-span"> N greater than <br></span><input type="number" id="postsyn-N" value="0" placeholder="0" class="info-input selectable"/></th>
      <th class="neuron_add_post"><button class="btn btn-all btn-add btn-success" id="btn-post-add-all-neuron" name="btn-post-add-all-neuron">+</button><br></span><button class="btn btn-all btn-remove btn-danger" id="btn-post-remove-all-neuron" name="btn-post-remove-all-neuron">-</button></th>
      <th class="synapse_add_post"><button class="btn btn-all btn-add btn-success" id="btn-post-add-all-synapse" name="btn-post-add-all-synapse">+</button><br></span><button class="btn btn-all btn-remove btn-danger" id="btn-post-remove-all-synapse" name="btn-post-remove-all-synapse">-</button></th>
    </tr>
    </thead>`;
    template += '<tbody></tbody></table>';
    return template;
  }

  /**
   * Reset to default HTML
   */
  ConnTable.prototype.reset = function (){
    // purge div and add table
    const tmp = this.htmlTemplate.replace('checkedpre', this.preGroupByName ? 'checked' : '').replace('checkedpost', this.postGroupByName ? 'checked' : '').replace('button_pre_all', this.preGroupByName ? `<i class="fa fa-plus-square-o aria-hidden"true">` : '').replace('button_post_all', this.postGroupByName ? `<i class="fa fa-plus-square-o aria-hidden"true">` : '');

    this.dom.innerHTML = tmp;
    
    // if (this.preGroupByName !== undefined) {
    //   if (this.preGroupByName && this.dataType === 'Neuron') {
    //     $("#cell-count-pre")[0].innerHTML="Cell Count";
    //     $("#cell-filter-pre")[0].innerHTML=`<span class="info-input-span"> N greater than <br></span><input type="number" id="precount-N" value="0" class="info-input selectable"/>`;
    //     $("#presyn-N")[0].value = 0;
    //   } else {
    //     $("#cell-count-pre")[0].innerHTML="";
    //     $("#cell-filter-pre")[0].innerHTML="";
    //     $("#presyn-N")[0].value = 0;
    //   }
    // } else {
    //   $("#cell-count-pre")[0].innerHTML="";
    //   $("#cell-filter-pre")[0].innerHTML="";
    //   $("#presyn-N")[0].value = 0;
    // }
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
  * @param {string} dataType - the type of data, 'Neuron', Synapse'
  */
  ConnTable.prototype.update = function(data, dataType){
    this.dataType = dataType;
    // show synaptic table
    if (verifyDataIntegrity(data) == false){
      return;
    }
    this.reset();
    this.show();

    let that = this;
    $('#'+this.divId+ " .inferred-more-info").off('click').on('click', function () {
      // info = "<h2>Inferred Synaptic Partners</h2>";
      // this.overlay.update(info + data['description']); //<TODO> overwrite in the future
      that.overlay.show();
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

    this.updateData(data);

    if (this.preGroupByName && this.dataType === 'Neuron') {
      $("#cell-count-pre")[0].innerHTML="Cell Count";
      $("#cell-filter-pre")[0].innerHTML=`<span class="info-input-span"> N greater than <br></span><input type="number" id="precount-N" value="0" class="info-input selectable"/>`;
      $("#presyn-N")[0].value = 0;
    } else {
      $("#cell-count-pre")[0].innerHTML="";
      $("#cell-filter-pre")[0].innerHTML="";
      $("#presyn-N")[0].value = 0;
    }

    if (this.postGroupByName && this.dataType === 'Neuron') {
      $("#cell-count-post")[0].innerHTML="Cell Count";
      $("#cell-filter-post")[0].innerHTML=`<span class="info-input-span"> N greater than <br></span><input type="number" id="postcount-N" value="0" class="info-input selectable"/>`;
      $("#postsyn-N")[0].value = 0;
    } else {
      $("#cell-count-post")[0].innerHTML="";
      $("#cell-filter-post")[0].innerHTML="";
      $("#postsyn-N")[0].value = 0;
    }

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
          preTypeData[name] = {
            'data': {}, // store unames
            'N': 0, // total synapse count
            'count': 0   // store the number of neurons
          };
        }
        
        preTypeData[name]['data'][uname] = {};
        preTypeData[name]['N'] += N;
        preTypeData[name]['count'] += 1;
        
        if(d['has_morph'] && ('uname' in d)){
          preTableData[uname]['n_rid'] = d['n_rid'];
          preTableData[uname]['orid'] = d['rid'];
          preTableData[uname]['has_morph'] = true;
          preTypeData[name]['data'][uname]['n_rid'] = d['n_rid'];
          preTypeData[name]['data'][uname]['o_rid'] = d['rid'];
        }
  
        if(d['has_syn_morph'] && 'syn_uname' in d){
          preTableData[uname]['has_syn_morph'] = true;
          preTableData[uname]['syn_uname'] = d['syn_uname'];
          preTableData[uname]['s_rid'] = d['s_rid'];
          preTableData[uname]['syn_rid'] = d['syn_rid'];
          preTypeData[name]['data'][uname]['s_rid'] = d['s_rid'];
          preTypeData[name]['data'][uname]['syn_rid'] = d['syn_rid'];
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
          postTypeData[name] = {
            'data': {}, 
            'N': 0,
            'count': 0
          };
        }
        postTypeData[name]['data'][uname] = {};
        postTypeData[name]['N'] += N;
        postTypeData[name]['count'] += 1;

        if(d['has_morph'] && ('uname' in d)){
          postTableData[uname]['n_rid'] = d['n_rid']
          postTableData[uname]['orid'] = d['rid'];
          postTableData[uname]['has_morph'] = true;
          postTypeData[name]['data'][uname]['n_rid'] = d['n_rid'];
          postTypeData[name]['data'][uname]['o_rid'] = d['rid'];
        }
  
        if(d['has_syn_morph'] && 'syn_uname' in d){
          postTableData[uname]['has_syn_morph'] = true;
          postTableData[uname]['syn_uname'] = d['syn_uname'];
          postTableData[uname]['s_rid'] = d['s_rid'];
          postTableData[uname]['syn_rid'] = d['syn_rid'];
          postTypeData[name]['data'][uname]['s_rid'] = d['s_rid'];
          postTypeData[name]['data'][uname]['syn_rid'] = d['syn_rid'];
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
      otherTableData = this.postTableData;

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
      otherTableData = this.preTableData;
    }

    // flags for detecting if neuron or synapses have been added
    let neuron_add = false;
    let synapse_add = false;
    if (group && this.dataType === 'Neuron') {
      for (var name in typeData) {
        var row = table.insertRow(0);
        row.className = "conn-type";
        var carrow = row.insertCell(0);
        var c1 = row.insertCell(1);
        var neuron_count = row.insertCell(2);
        var c2 = row.insertCell(3);
        var c3 = row.insertCell(4);
        c3.className = (connDir==='pre') ? 'neuron_add_type_pre': 'neuron_add_type_post'; // remove the . character
        var c4 = row.insertCell(5);
        c4.className = (connDir==='pre') ? 'synapse_add_type_pre': 'synapse_add_type_post';
        carrow.innerHTML = ((connDir==='pre') ? `<span id="toggle-expander-pre-` : `<span id="toggle-expander-post-`) + name + `" class="expander-arrow" title="Expand ` + name + `"><i class="fa fa-plus-square-o aria-hidden"true"></span>`;
        neuron_count.innerHTML = typeData[name]['count'];

        let N = typeData[name]['N'];
        let disp_name = name.replace('<', '&lt').replace('>', '&gt');
        c1.innerHTML =  disp_name;
        c2.innerHTML = N;

        nrids = {};
        srids = {};
        for (let [key, value] of Object.entries(typeData[name]['data'])){
          if ('n_rid' in value) {
            nrids[value['n_rid']] = value['o_rid'];
          }
          if ('s_rid' in value) {
            srids[value['s_rid']] = value['syn_rid'];
          }
        }
        
        if (Object.keys(nrids).length > 0) {
          let btn = document.createElement('button');
          btn.className = 'btn btn-type';
          btn.className += ' btn-add btn-success';
          btn.innerText = '+';
          
          btn.id = (connDir==='pre') ? 'btn-pre-add-type-' + name : 'btn-post-add-type' + name;
          btn.name = name;
          btn.rid = nrids;
          
          c3.appendChild(btn);

          btn = document.createElement('button');
          btn.className = 'btn btn-type';
          btn.className += ' btn-remove btn-danger';
          btn.innerText = '-';
          
          btn.id = (connDir==='pre') ? 'btn-pre-remove-type-' + name : 'btn-post-remove-type' + name;
          btn.name = name;
          btn.rid = nrids;

          c3.appendChild(btn);
          neuron_add = true;
        }

        if (Object.keys(srids).length > 0) {
          btn = document.createElement('button');
          btn.className = 'btn btn-type-syn';
          btn.className += ' btn-add btn-success';
          btn.innerText = '+';
          
          btn.id = (connDir==='pre') ? 'btn-pre-syn-add-type-' + name : 'btn-post-syn-add-type' + name;
          btn.name = name;
          btn.rid = srids;

          c4.appendChild(btn);

          btn = document.createElement('button');
          btn.className = 'btn btn-type-syn';
          btn.className += ' btn-remove btn-danger';
          btn.innerText = '-';
          
          btn.id = (connDir==='pre') ? 'btn-pre-syn-remove-type-' + name : 'btn-post-syn-remove-type' + name;
          btn.name = name;
          btn.rid = srids;
          
          c4.appendChild(btn);
          synapse_add = true;
        }

        for (let uname of Object.keys(typeData[name]['data'])){
          var row = table.insertRow(1); // insert to 2nd row as the first row is the cell type
          row.className = "conn-cell";
          var carrow = row.insertCell(0);
          var c1 = row.insertCell(1);
          var neuron_count = row.insertCell(2);
          var c2 = row.insertCell(3);
          var c3 = row.insertCell(4);
          c3.className = (connDir==='pre') ? 'neuron_add_pre': 'neuron_add_post'; // remove the . character
          var c4 = row.insertCell(5);
          c4.className = (connDir==='pre') ? 'synapse_add_pre': 'synapse_add_post';
          carrow.innerHTML = `|`;

          let N = tableData[uname]['N'];
          let disp_uname = uname.replace('<', '&lt').replace('>', '&gt');
          if (uname in otherTableData) {
            if (connDir === 'pre') {
              disp_uname += "<i class='fa fa-exchange fa-fw' aria-hidden='true'></i>";
            } else {
              disp_uname += "<i class='fa fa-exchange fa-fw' aria-hidden='true'></i>";
            }
          }
          if ( tableData[uname]['inferred'] == 1 ){
            c1.innerHTML = "&dagger;" + disp_uname;
          }else{
            c1.innerHTML = disp_uname;
          }
          c2.innerHTML = N;
          
          if( tableData[uname]['has_morph'] ){
            let btn = document.createElement('button');
            btn.className = 'btn btn-neuron';
            
            btn.id = (connDir==='pre') ? 'btn-pre-add-' + uname : 'btn-post-add-' + uname;
            btn.name = uname;
            let rid = tableData[uname]['orid'];
            btn.rid = {[tableData[uname]['n_rid']]: rid };

            if (this.parentObj.isInWorkspace(rid)){
              btn.innerText = '-';
              btn.className += ' btn-remove btn-danger';
            }else{
              btn.innerText = '+';
              btn.className += ' btn-add btn-success';
            }
            c3.appendChild(btn);
          }
        

          if( tableData[uname]['has_syn_morph'] ){
            let btn = document.createElement('button');
            btn.className = 'btn btn-syn';
            let syn_uname = tableData[uname]['syn_uname']; 
            btn.id = (connDir==='pre') ? 'btn-pre-syn-add-' + syn_uname : 'btn-post-syn-add-' + syn_uname;
            btn.name = syn_uname;
            let rid = tableData[uname]['syn_rid'];
            btn.rid = {[tableData[uname]['s_rid']]: rid};

            if (this.parentObj.isInWorkspace(rid)){
              btn.innerText = '-';
              btn.className += ' btn-remove btn-danger';
            }else{
              btn.innerText = '+';
              btn.className += ' btn-add btn-success';
            }

            c4.appendChild(btn);
          }
        }
      }
    } else {
      for (var uname in tableData) {
        var row = table.insertRow(0);
        var carrow = row.insertCell(0);
        var c1 = row.insertCell(1);
        var neuron_count = row.insertCell(2);
        var c2 = row.insertCell(3);
        var c3 = row.insertCell(4);
        c3.className = (connDir==='pre') ? 'neuron_add_pre': 'neuron_add_post'; // remove the . character
        var c4 = row.insertCell(5);
        c4.className = (connDir==='pre') ? 'synapse_add_pre': 'synapse_add_post';

        let N = tableData[uname]['N'];
        let disp_uname = uname.replace('<', '&lt').replace('>', '&gt');
        
        if (uname in otherTableData) {
          if (connDir === 'pre') {
            disp_uname += "<i class='fa fa-exchange fa-fw' aria-hidden='true'></i>";
          } else {
            disp_uname += "<i class='fa fa-exchange fa-fw' aria-hidden='true'></i>";
          }
        }

        if ( tableData[uname]['inferred'] == 1 ){
          c1.innerHTML = "&dagger;" + disp_uname;
        }else{
          c1.innerHTML = disp_uname;
        }
        c2.innerHTML = N;
        
        if( tableData[uname]['has_morph'] ){
          let btn = document.createElement('button');
          btn.className = 'btn btn-neuron';
          
          btn.id = (connDir==='pre') ? 'btn-pre-add-' + uname : 'btn-post-add-' + uname;
          btn.name = uname;
          let rid = tableData[uname]['orid'];
          btn.rid = {[tableData[uname]['n_rid']]: rid };

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
          btn.className = 'btn btn-syn';
          let syn_uname = tableData[uname]['syn_uname']; 
          btn.id = (connDir==='pre') ? 'btn-pre-syn-add-' + syn_uname : 'btn-post-syn-add-' + syn_uname;
          btn.name = syn_uname;
          let rid = tableData[uname]['syn_rid'];
          btn.rid = {[tableData[uname]['s_rid']]: rid};

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
    this.filterAll(connDir);
    // add callback
    $("#" + connDir + "syn-srch").off('keyup change').on('keyup change', debounce( (function(){
      this.filterByName(connDir);
    }).bind(this), 200));
    $("#" + connDir + "syn-N").off('keyup change').on('keyup change', debounce( (function (){
      this.filterByNum(connDir);
    }).bind(this), 200));
    if (group) {
      $("#" + connDir + "count-N").off('keyup change').on('keyup change', debounce( (function (){
        this.filterByCellCount(connDir);
      }).bind(this), 200));
    }
  }

  function debounce(fn, delay) {
    let timer;
    return function(...args) {
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    };
  }
  
  function wildcardToRegex(userInput) {
    const escapedInput = userInput.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    const regexPattern = escapedInput
                        .replace(/\*/g, '.*')
                        .replace(/\?/g, '.');
    return new RegExp(regexPattern, 'i'); 
  }

  /**
  * Pure JS class helpers
  */
  ConnTable.prototype.hasClass = function(el, className){
    if (el.classList)
      return el.classList.contains(className);
    else
      return !!el.className.match(this.class_filters[classname]);
  }

  /**
  * Pure JS class helpers
  */
  ConnTable.prototype.addClass = function(el, className){
    if (el.classList){
      el.classList.add(className);
    }else if (!this.hasClass(el, className)){
      el.className += " " + className;
    }
  }

  /**
  * Pure JS class helpers
  */
  ConnTable.prototype.removeClass = function(el, className){
    if (el.classList){
      el.classList.remove(className);
    }else if (this.hasClass(el, className)){
      var reg = this.class_filters[classname];
      el.className=el.className.replace(reg, ' ');
    }
  }

/**
  * Filter Connectivity Table by Name
  *
  * @param {string} connDir - 'pre' or 'post'
  */
  ConnTable.prototype.filterAll = function(connDir){
    var text, N, count, tableId, grouped;
    if (connDir == 'pre') {
      tableId = this.preTabId;
      grouped = this.preGroupByName && this.dataType === 'Neuron';
      text = $("#presyn-srch").val();
      N = Number($("#presyn-N").val());
      count = Number($("#precount-N").val());
    } else if (connDir == 'post') {
      tableId = this.postTabId;
      grouped = this.postGroupByName && this.dataType === 'Neuron';
      text = $("#postsyn-srch").val();
      N = Number($("#postsyn-N").val());
      count = Number($("#postcount-N").val());
    } else {
      return;
    }

    var filter, table, tr, td, i, name;
    if (text.startsWith('/r')) {
      try {
        filter = new RegExp(text.slice(2));
      } catch (error) {
        return;
      }
    } else {
      try {
        filter = wildcardToRegex(text);
      } catch (error) {
        return;
      }
    }
    table = document.getElementById(tableId).children[2];
    tr = table.getElementsByTagName("tr");

    var cell_type_visible;
    if (grouped) {
      for (i = 0; i < tr.length; i++) {
        if (this.hasClass(tr[i], "conn-type")){
          cell_type_visible = true;
          filtered_name = false;
          filtered_N = false;
          filtered_count = false;

          td = tr[i].getElementsByTagName("td")[1];
          if(td) {
            if (filter.test(td.textContent)) {
              this.removeClass(tr[i], "filtered-name");
            } else {
              this.addClass(tr[i], "filtered-name");
              cell_type_visible = false;
              filtered_name = true;
            }
          }
          td = tr[i].getElementsByTagName("td")[2];
          if(td) {
            if (Number(td.innerHTML) > count) {
              this.removeClass(tr[i], "filtered-count");
            } else {
              this.addClass(tr[i], "filtered-count");
              cell_type_visible = false;
              filtered_count = true;
            }
          }

          td = tr[i].getElementsByTagName("td")[3];
          if(td) {
            if (Number(td.innerHTML) > N) {
              this.removeClass(tr[i], "filtered-N");
            } else {
              this.addClass(tr[i], "filtered-N");
              cell_type_visible = false;
              filtered_N = true;
            }
          }

          if (cell_type_visible) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }

        } else if (this.hasClass(tr[i], "conn-cell")) {
          if (cell_type_visible) {
            this.removeClass(tr[i], "filtered");
            if(this.hasClass(tr[i], "type-expanded")) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          } else {
            this.addClass(tr[i], "filtered");
            tr[i].style.display = "none";
          }
        }
      }
    } else {
      for (i = 0; i < tr.length; i++) {
        cell_type_visible = true;
        td = tr[i].getElementsByTagName("td")[1];
        if(td) {
          if (filter.test(td.textContent)) {
            this.removeClass(tr[i], "filtered-name");
          } else {
            this.addClass(tr[i], "filtered-name");
            cell_type_visible = false;
          }
        }
        td = tr[i].getElementsByTagName("td")[3];
        if(td) {
          if (Number(td.innerHTML) > N) {
            this.removeClass(tr[i], "filtered-N");
          } else {
            this.addClass(tr[i], "filtered-N");
            cell_type_visible = false;
          }
        }

        if (cell_type_visible) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }


  /**
  * Filter Connectivity Table by Name
  *
  * @param {string} tableId - id of table being filtered
  * @param {boolean} grouped - whether it is grouped
  * @param {string} text - text used for filtering
  */
  ConnTable.prototype.filterByName = function(connDir){
    var text, tableId, grouped;
    if (connDir == 'pre') {
      tableId = this.preTabId;
      grouped = this.preGroupByName && this.dataType === 'Neuron';
      text = $("#presyn-srch").val();
    } else if (connDir == 'post') {
      tableId = this.postTabId;
      grouped = this.postGroupByName && this.dataType === 'Neuron';
      text = $("#postsyn-srch").val();
    } else {
      return;
    }

    var filter, table, tr, td, i, name;
    if (text.startsWith('/r')) {
      try {
        filter = new RegExp(text.slice(2));
      } catch (error) {
        return;
      }
    } else {
      try {
        filter = wildcardToRegex(text);
      } catch (error) {
        return;
      }
    }
    table = document.getElementById(tableId).children[2];
    tr = table.getElementsByTagName("tr");

    if (grouped) {
      var cell_type_visible = undefined;
      for (i = 0; i < tr.length; i++) {
        if (this.hasClass(tr[i], "conn-type")){
          td = tr[i].getElementsByTagName("td")[1];
          if(td) {
            if (filter.test(td.textContent)) {
              this.removeClass(tr[i], "filtered-name");
          
              if(!this.hasClass(tr[i], "filtered-N") && !this.hasClass(tr[i], "filtered-count")) {
                tr[i].style.display = "";
                cell_type_visible = true;
              } else {
                tr[i].style.display = "none";
                cell_type_visible = false;
              }
            } else {
              this.addClass(tr[i], "filtered-name");
              cell_type_visible = false;
              tr[i].style.display = "none";
            }
            
          }

        } else if (this.hasClass(tr[i], "conn-cell")) {
          if (cell_type_visible) {
            this.removeClass(tr[i], "filtered");
            if(this.hasClass(tr[i], "type-expanded")) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          } else {
            this.addClass(tr[i], "filtered");
            tr[i].style.display = "none";
          }
        }
      }
    } else {
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if(td) {
          if (filter.test(td.textContent)) {
            this.removeClass(tr[i], "filtered-name");
        
            if(!this.hasClass(tr[i], "filtered-N") && !this.hasClass(tr[i], "filtered-count")) {
              tr[i].style.display = "";
            }
          } else{
            this.addClass(tr[i], "filtered-name");
            tr[i].style.display = "none";
          }
        }
      }
    }
  }

  /**
  * Filter Connectivity Table by Number
  *
  * @param {string} connDIr - 'pre' or 'post'
  */
  ConnTable.prototype.filterByNum = function(connDir){
    var N, tableId, grouped;
    if (connDir == 'pre') {
      tableId = this.preTabId;
      grouped = this.preGroupByName && this.dataType === 'Neuron';
      N = Number($("#presyn-N").val());
    } else if (connDir == 'post') {
      tableId = this.postTabId;
      grouped = this.postGroupByName && this.dataType === 'Neuron';
      N = Number($("#postsyn-N").val());
    } else {
      return;
    }

    // Declare variables
    var table, tr, td, i, cell_type_visible;
    table = document.getElementById(tableId).children[2];
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    
    for (i = 0; i < tr.length; i++) {
      if (grouped) {
        if (this.hasClass(tr[i], "conn-type")){
          td = tr[i].getElementsByTagName("td")[3];
          if (td) {
            if (Number(td.innerHTML) > N) {
              this.removeClass(tr[i],"filtered-N");
              if(!this.hasClass(tr[i],"filtered-name") && !this.hasClass(tr[i], "filtered-count")){
                tr[i].style.display = "";
                cell_type_visible = true;
              } else {
                tr[i].style.display = "none";
                cell_type_visible = false;
              }
            } else {
              this.addClass(tr[i],"filtered-N");
              tr[i].style.display = "none";
              cell_type_visible = false;
            }
          }
        } else if (this.hasClass(tr[i], "conn-cell")){
          if (cell_type_visible) {
            this.removeClass(tr[i], "filtered");
            if(this.hasClass(tr[i], "type-expanded")) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          } else {
            this.addClass(tr[i], "filtered");
            tr[i].style.display = "none";
          }
        }

      } else {
        td = tr[i].getElementsByTagName("td")[3];
        if (td) {
          if (Number(td.innerHTML) > N) {
            this.removeClass(tr[i],"filtered-N");
            if(!this.hasClass(tr[i],"filtered-name") && !this.hasClass(tr[i], "filtered-count")){
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          } else {
            this.addClass(tr[i],"filtered-N");
            tr[i].style.display = "none";
          }
        }
      }
    }
  }


  /**
  * Filter Connectivity Table by Cell Count
  *
  * @param {string} connDir - 'pre' or 'post'
  */
  ConnTable.prototype.filterByCellCount = function(connDir){
    var N, tableId, grouped;
    if (connDir == 'pre') {
      tableId = this.preTabId;
      grouped = this.preGroupByName && this.dataType === 'Neuron';
      N = Number($("#precount-N").val());
    } else if (connDir == 'post') {
      tableId = this.postTabId;
      grouped = this.postGroupByName && this.dataType === 'Neuron';
      N = Number($("#postcount-N").val());
    } else {
      return;
    }

    // Declare variables
    var table, tr, td, i, cell_type_visible;
    table = document.getElementById(tableId).children[2];
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      if (grouped) {
        if (this.hasClass(tr[i], "conn-type")){
          td = tr[i].getElementsByTagName("td")[2];
          if (td) {
            if (Number(td.innerHTML) > N) {
              this.removeClass(tr[i],"filtered-count");
              if(!this.hasClass(tr[i],"filtered-name") && !this.hasClass(tr[i], "filtered-N")){
                tr[i].style.display = "";
                cell_type_visible = true;
              } else {
                tr[i].style.display = "none";
                cell_type_visible = false;
              }
            } else {
              this.addClass(tr[i],"filtered-count");
              tr[i].style.display = "none";
              cell_type_visible = false;
            }
          }
        } else if (this.hasClass(tr[i], "conn-cell")){
          if (cell_type_visible) {
            this.removeClass(tr[i], "filtered");
            if(this.hasClass(tr[i], "type-expanded")) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          } else {
            this.addClass(tr[i], "filtered");
            tr[i].style.display = "none";
          }
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

    $("#"+that.divId + " button").off("click").on("click", function(){
        if(this.name.includes('pre-add-all')){
          const rid_list = that.get_table_list('add', 'pre', this.name.includes('neuron') ? 'neuron' : 'synapse');
          that.parentObj.addByRid(rid_list);
        }else if(this.name.includes('pre-remove-all')){
          const rid_list = that.get_table_list('remove', 'pre', this.name.includes('neuron') ? 'neuron' : 'synapse');
          that.parentObj.removeByRid(rid_list);
        }else if(this.name.includes('post-add-all')){
          const rid_list = that.get_table_list('add', 'post', this.name.includes('neuron') ? 'neuron' : 'synapse');
          that.parentObj.addByRid(rid_list);
        }else if(this.name.includes('post-remove-all')){
          const rid_list = that.get_table_list('remove', 'post', this.name.includes('neuron') ? 'neuron' : 'synapse');
          that.parentObj.removeByRid(rid_list);
        } else if (this.className.includes('btn-type') ) { // group add/remove button
          if (this.className.includes('add')) {
            let rids = [];
            for (let [rid, orid] of Object.entries(this.rid)) {
              if (!that.parentObj.isInWorkspace(orid) ) {
                rids.push(rid);
              }
            }
            that.parentObj.addByRid(rids);
          } else if (this.className.includes('remove') ) {
            let rids = [];
            for (let [rid, orid] of Object.entries(this.rid)) {
              if (that.parentObj.isInWorkspace(orid) ) {
                rids.push(rid);
              }
            }
            that.parentObj.removeByRid(rids);
          }
        } else if(this.className.includes('add')){ 
          that.parentObj.addByRid(Object.keys(this.rid));
        } else if(this.className.includes('remove')){
          that.parentObj.removeByRid(Object.keys(this.rid));
        }
    })
    .mouseenter( function() {
      if (this.className.includes('btn-type')) {
        that.parentObj.highlight(Object.values(this.rid));
      } else if (this.className.includes('btn-all')) {
        const rid_list = that.get_table_list(
          'highlight', 
          this.name.includes('pre') ? 'pre' : 'post',
          this.name.includes('neuron') ? 'neuron' : 'synapse',
        );
        that.parentObj.highlight(rid_list);
      } else if (this.className.includes('remove')) {
        that.parentObj.highlight(Object.values(this.rid));
      }
    })
    .mouseleave( function() {
      if (this.className.includes('btn-type')) {
        that.parentObj.resume();
      } else if ( this.className.includes('btn-all') ) {
        that.parentObj.resume();
      } else if (this.className.includes('remove')) {
          that.parentObj.resume();
      }
    });

    

    $("#pregroup-toggle-checkbox").off("change").on("change", function() {
      that.preGroupByName = $(this).is(":checked");
      if (that.preGroupByName && that.dataType === 'Neuron') {
        let button = $('#expand-pre-all')[0]
        button.innerHTML = `<i class="fa fa-plus-square-o aria-hidden"true">`;
        button.setAttribute("title", "Expand all");
        $("#cell-count-pre")[0].innerHTML="Cell Count";
        $("#cell-filter-pre")[0].innerHTML=`<span class="info-input-span"> N greater than <br></span><input type="number" id="precount-N" value="0" placeholder="0" class="info-input selectable"/>`;
        $("#presyn-N")[0].value = 0;
      } else {
        $('#expand-pre-all')[0].innerHTML = "";
        $("#cell-count-pre")[0].innerHTML="";
        $("#cell-filter-pre")[0].innerHTML="";
        $("#presyn-N")[0].value = 0;
      }
      that.updateTable('pre');
      that.setupCallbacks();
    });

    $("#postgroup-toggle-checkbox").off("change").on("change", function() {
      that.postGroupByName = $(this).is(":checked");
      if (that.postGroupByName && that.dataType === 'Neuron') {
        let button = $('#expand-post-all')[0]
        button.innerHTML = `<i class="fa fa-plus-square-o aria-hidden"true">`;
        button.setAttribute("title", "Expand all");
        $("#cell-count-post")[0].innerHTML="Cell Count";
        $("#cell-filter-post")[0].innerHTML=`<span class="info-input-span"> N greater than <br></span><input type="number" id="postcount-N" value="0" placeholder="0" class="info-input selectable"/>`;
        $("#postsyn-N")[0].value = 0;
      } else {
        $('#expand-post-all')[0].innerHTML = "";
        $("#cell-count-post")[0].innerHTML="";
        $("#cell-filter-post")[0].innerHTML="";
        $("#postsyn-N")[0].value = 0;
      }
      that.updateTable('post');
      that.setupCallbacks();
    });


    $('*[id*="toggle-expander"]').off('click').on('click', function() {
      var pre = this.id.split('-')[2] === 'pre';
      var name = this.id.split('-').slice(3).join("-");

      let button = (pre ? $('#expand-pre-all') : $('#expand-post-all'))[0];

      var table, tr, td, i;
      table = document.getElementById(pre ? that.preTabId : that.postTabId).children[2];
      tr = table.getElementsByTagName("tr");

      // Loop through all table rows, and hide those who don't match the search query
      var found = false;
      var toexpand = undefined;
      for (i = 0; i < tr.length; i++) {
        if (that.hasClass(tr[i], "conn-type")){
          if (found) {
            break;
          }
          td = tr[i].getElementsByTagName("td")[1];

          if (td) {
            if (td.textContent === name) {
              var arrowSpan;
              found = true;
              if (that.hasClass(tr[i], "type-expanded")){
                that.removeClass(tr[i], "type-expanded");
                toexpand = false;

                td = tr[i].getElementsByTagName("td")[0];
                arrowSpan = td.querySelector("#"+this.id);
                if (arrowSpan) {
                  arrowSpan.innerHTML = `<i class="fa fa-plus-square-o aria-hidden"true">`;
                  arrowSpan.setAttribute("title", "Expand " + name)
                }
              } else {
                that.addClass(tr[i], "type-expanded");
                toexpand = true;

                if (!that.hasClass(button, "type-expanded")) {
                  that.addClass(button, "type-expanded");
                  button.innerHTML = `<i class="fa fa-minus-square-o aria-hidden"true">`
                  button.setAttribute("title", "Collapse all");
                }

                td = tr[i].getElementsByTagName("td")[0];
                arrowSpan = td.querySelector("#"+this.id);
                if (arrowSpan) {
                  arrowSpan.innerHTML = `<i class="fa fa-minus-square-o aria-hidden"true">`;
                  arrowSpan.setAttribute("title", "Collapse " + name)
                }
              }
            }
          }
        } else if (that.hasClass(tr[i], "conn-cell")){
          if (found) {
            if (toexpand) {
              that.addClass(tr[i], 'type-expanded');
              if (!that.hasClass(tr[i], 'filtered') ){
                tr[i].style.display = "";
              }
            } else {
              that.removeClass(tr[i], 'type-expanded');
              tr[i].style.display = "none";
            }
          }
        }
      }
    });

    $("#"+this.preTabId).off("click").on("click", ".fa-exchange", function() {
      let $cell = $(this).closest("td");
      let uname = $cell.text(); // closest td does not have the fa-exchange span, removing the trailing space

      let grouped = that.postGroupByName && that.dataType === "Neuron";
      var table, i, td;
      let button = $('#expand-post-all')[0];

      if (grouped) {
        table = $('#'+that.postTabId);
        if (!table.is(':visible')) {
          table.show();
          $("#toggle-post-arrow").html("&#9660;");
        }

        $("#postsyn-N").val(0);
        $("#postcount-N").val(0);
        $("#postsyn-srch").val("");
        that.filterAll('post');
        
        tr = table.children()[2].getElementsByTagName("tr");
        let name = that.preTableData[uname]['name'];
        var found = false;
        var target_tr;

        for (i = 0; i < tr.length; i++) {
          if (that.hasClass(tr[i], "conn-type")) {
            if (found) {
              break;
            }

            if( tr[i].getElementsByTagName("td")[1].textContent === name) {
              if(!that.hasClass(tr[i], 'type-expanded')) {
                that.addClass(tr[i], 'type-expanded');
                let arrowSpan = tr[i].getElementsByTagName("td")[0].getElementsByTagName("span")[0];
                arrowSpan.innerHTML = `<i class="fa fa-minus-square-o aria-hidden"true">`;
                arrowSpan.setAttribute("title", "Collapse " + name);
                
                if (!that.hasClass(button, 'type-expanded')){
                  that.addClass(button, 'type-expanded');
                  button.innerHTML = `<i class="fa fa-minus-square-o aria-hidden"true">`
                  button.setAttribute("title", "Collapse all");
                }
                
              }
              found = true;
            }
          } else if (found && that.hasClass(tr[i], "conn-cell") ) {
            if(!that.hasClass(tr[i], 'type-expanded')) {
              that.addClass(tr[i], 'type-expanded');
              tr[i].style.display = "";
            }
            if(tr[i].getElementsByTagName("td")[1].textContent === uname ) {
              target_tr = tr[i];
            }
          }
        }
        scrollAndHighlight(target_tr);
      } else {
        $("#postsyn-N").val(0);
        $("#postsyn-srch").val("");
        that.filterAll('post');
        table = $('#'+that.postTabId);
        
        if (!table.is(':visible')) {
          table.show();
          $("#toggle-post-arrow").html("&#9660;");
        }

        tr = table.children()[2].getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
          if( tr[i].getElementsByTagName("td")[1].textContent === uname)
          {
            scrollAndHighlight(tr[i]);
            break;
          }
        }
      }
    });

    $("#"+this.postTabId).off("click").on("click", ".fa-exchange", function() {
      let $cell = $(this).closest("td");
      let uname = $cell.text(); // closest td does not have the fa-exchange span, removing the trailing space

      let grouped = that.preGroupByName && that.dataType === "Neuron";
      var table, i, td;
      let button = $('#expand-pre-all')[0];

      if (grouped) {
        table = $('#'+that.preTabId);
        if (!table.is(':visible')) {
          table.show();
          $("#toggle-pre-arrow").html("&#9660;");
        }

        $("#presyn-N").val(0);
        $("#precount-N").val(0);
        $("#presyn-srch").val("");
        that.filterAll('pre');
        
        tr = table.children()[2].getElementsByTagName("tr");
        let name = that.postTableData[uname]['name'];
        var found = false;
        var target_tr;

        for (i = 0; i < tr.length; i++) {
          if (that.hasClass(tr[i], "conn-type")) {
            if (found) {
              break;
            }

            if( tr[i].getElementsByTagName("td")[1].textContent === name) {
              if(!that.hasClass(tr[i], 'type-expanded')) {
                that.addClass(tr[i], 'type-expanded');
                let arrowSpan = tr[i].getElementsByTagName("td")[0].getElementsByTagName("span")[0];
                arrowSpan.innerHTML = `<i class="fa fa-minus-square-o aria-hidden"true">`;
                arrowSpan.setAttribute("title", "Collapse " + name);
                if (!that.hasClass(button, 'type-expanded')){
                  that.addClass(button, 'type-expanded');
                  button.innerHTML = `<i class="fa fa-minus-square-o aria-hidden"true">`
                  button.setAttribute("title", "Collapse all");
                }
              }
              found = true;
            }
          } else if (found && that.hasClass(tr[i], "conn-cell") ) {
            if(!that.hasClass(tr[i], 'type-expanded')) {
              that.addClass(tr[i], 'type-expanded');
              tr[i].style.display = "";
            }
            if(tr[i].getElementsByTagName("td")[1].textContent === uname ) {
              target_tr = tr[i];
            }
          }
        }
        scrollAndHighlight(target_tr);
      } else {
        $("#presyn-N").val(0);
        $("#presyn-srch").val("");
        that.filterAll('pre');
        table = $('#'+that.preTabId);
        
        if (!table.is(':visible')) {
          table.show();
          $("#toggle-pre-arrow").html("&#9660;");
        }

        tr = table.children()[2].getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
          if( tr[i].getElementsByTagName("td")[1].textContent === uname)
          {
            scrollAndHighlight(tr[i]);
            break;
          }
        }
      }
    });

    $('#expand-pre-all').off("click").on("click", function() {
      // must have been grouped
      var tr = $('#'+that.preTabId).children()[2].getElementsByTagName("tr");
      
      if (that.hasClass(this, "type-expanded")) {
        that.removeClass(this, "type-expanded");
        this.innerHTML = `<i class="fa fa-plus-square-o aria-hidden"true">`
        this.setAttribute("title", "Expand all");
        var toRetract, arrowSpan;
        for (i = 0; i < tr.length; i++) {
          if (that.hasClass(tr[i], "conn-type")) {
            toRetract = false;
            if (that.hasClass(tr[i], "type-expanded")) {
              toRetract = true;
              that.removeClass(tr[i], "type-expanded");
              td = tr[i].getElementsByTagName("td")[0];
              arrowSpan = td.getElementsByTagName("span")[0];
              if (arrowSpan) {
                arrowSpan.innerHTML = `<i class="fa fa-plus-square-o aria-hidden"true">`;
                let name = tr[i].getElementsByTagName("td")[1].textContent;
                arrowSpan.setAttribute("title", "Expand " + name);
              }
            }
          } else { // conn-cell
            if (toRetract) {
              if (that.hasClass(tr[i], "type-expanded")) {
                that.removeClass(tr[i], "type-expanded");
              }
              tr[i].style.display = "none";
            }
          }
        }  
      } else {
        that.addClass(this, "type-expanded");
        this.innerHTML = `<i class="fa fa-minus-square-o aria-hidden"true">`
        this.setAttribute("title", "Collapse all");
        var toExpand, arrowSpan;
        for (i = 0; i < tr.length; i++) {
          if (that.hasClass(tr[i], "conn-type")) {
            toExpand = false;
            if (!that.hasClass(tr[i], "type-expanded")) {
              that.addClass(tr[i], "type-expanded");
              toExpand = true;
              td = tr[i].getElementsByTagName("td")[0];
              arrowSpan = td.getElementsByTagName("span")[0];
              if (arrowSpan) {
                arrowSpan.innerHTML = `<i class="fa fa-minus-square-o aria-hidden"true">`;
                const name = tr[i].getElementsByTagName("td")[1].textContent;
                arrowSpan.setAttribute("title", "Collapse " + name);
              }
            }
          } else { // conn-cell
            if (toExpand) {
              that.addClass(tr[i], 'type-expanded');
              if (!that.hasClass(tr[i], 'filtered') ){
                tr[i].style.display = "";
              }
            }
          }
        } 
      }
    });

    $('#expand-post-all').off("click").on("click", function() {
      // must have been grouped
      var tr = $('#'+that.postTabId).children()[2].getElementsByTagName("tr");
      
      if (that.hasClass(this, "type-expanded")) {
        that.removeClass(this, "type-expanded");
        this.innerHTML = `<i class="fa fa-plus-square-o aria-hidden"true">`
        this.setAttribute("title", "Expand all");
        var toRetract, arrowSpan;
        for (i = 0; i < tr.length; i++) {
          if (that.hasClass(tr[i], "conn-type")) {
            toRetract = false;
            if (that.hasClass(tr[i], "type-expanded")) {
              toRetract = true;
              that.removeClass(tr[i], "type-expanded");
              td = tr[i].getElementsByTagName("td")[0];
              arrowSpan = td.getElementsByTagName("span")[0];
              if (arrowSpan) {
                arrowSpan.innerHTML = `<i class="fa fa-plus-square-o aria-hidden"true">`;
                const name = tr[i].getElementsByTagName("td")[1].textContent;
                arrowSpan.setAttribute("title", "Collapse " + name);
              }
            }
          } else { // conn-cell
            if (toRetract) {
              if (that.hasClass(tr[i], "type-expanded")) {
                that.removeClass(tr[i], "type-expanded");
              }
              tr[i].style.display = "none";
            }
          }
        }  
      } else {
        that.addClass(this, "type-expanded");
        this.innerHTML = `<i class="fa fa-minus-square-o aria-hidden"true">`
        this.setAttribute("title", "Collapse all");
        var toExpand, arrowSpan;
        for (i = 0; i < tr.length; i++) {
          if (that.hasClass(tr[i], "conn-type")) {
            toExpand = false;
            if (!that.hasClass(tr[i], "type-expanded")) {
              that.addClass(tr[i], "type-expanded");
              toExpand = true;
              td = tr[i].getElementsByTagName("td")[0];
              arrowSpan = td.getElementsByTagName("span")[0];
              if (arrowSpan) {
                arrowSpan.innerHTML = `<i class="fa fa-minus-square-o aria-hidden"true">`;
                const name = tr[i].getElementsByTagName("td")[1].textContent;
                arrowSpan.setAttribute("title", "Expand " + name);
              }
            }
          } else { // conn-cell
            if (toExpand) {
              that.addClass(tr[i], 'type-expanded');
              if (!that.hasClass(tr[i], 'filtered') ){
                tr[i].style.display = "";
              }
            }
          }
        } 
      }
    });
  };

  ConnTable.prototype.get_table_list = function(addremovehighlight, prepost, neuronsynapse){
    var tableId, table, tr, td, i, cc, grouped, N, count;

    count = 0;
    if (prepost === 'pre') {
      tableId = this.preTabId;
      grouped = this.preGroupByName && this.dataType === 'Neuron';
    } else if (prepost === 'post') {
      tableId = this.postTabId;
      grouped = this.postGroupByName && this.dataType === 'Neuron';
    }

    table = document.getElementById(tableId).children[2];
    tr = table.getElementsByTagName("tr");

    var rid_list = [];
    if (grouped) {
      var cell_type_visible = undefined;
      for (i = 0; i < tr.length; i++) {
        if (this.hasClass(tr[i], "conn-type")){
          if (!this.hasClass(tr[i], "filtered-name") && !this.hasClass(tr[i], "filtered-N") && !this.hasClass(tr[i], "filtered-count") ) {
            td = tr[i].getElementsByTagName("td");
            if (neuronsynapse === 'neuron') {
              cc = td[4].getElementsByTagName("button")[0];
            } else if (neuronsynapse === 'synapse') {
              cc = td[5].getElementsByTagName("button")[0];
            }
            if (cc) {
              if (addremovehighlight === 'add'){
                for (let [rid, orid] of Object.entries(cc.rid)) {
                  if (!this.parentObj.isInWorkspace(orid) ) {
                    rid_list.push(rid);
                  }
                }
              } else if (addremovehighlight === 'remove'){
                for (let [rid, orid] of Object.entries(cc.rid)) {
                  if (this.parentObj.isInWorkspace(orid) ) {
                    rid_list.push(rid);
                  }
                }
              } else if (addremovehighlight === 'highlight'){
                for (let [rid, orid] of Object.entries(cc.rid)) {
                  if (this.parentObj.isInWorkspace(orid) ) {
                    rid_list.push(orid);
                  }
                }
              }
            }
          }
        }
      }
    } else {
      for (i = 0; i < tr.length; i++) {
        if (!this.hasClass(tr[i], "filtered-name") && !this.hasClass(tr[i], "filtered-N") && !this.hasClass(tr[i], "filtered-count") ) {
          td = tr[i].getElementsByTagName("td");
          if (neuronsynapse === 'neuron') {
            cc = td[4].getElementsByTagName("button")[0];
          } else if (neuronsynapse === 'synapse') {
            cc = td[5].getElementsByTagName("button")[0];
          }
          if (cc) {
            if (addremovehighlight === 'add'){
              if (cc.className.includes('add')){
                rid_list.push(...Object.keys(cc.rid));
              }
            } else if (addremovehighlight === 'remove'){
              if (cc.className.includes('remove')){
                rid_list.push(...Object.keys(cc.rid));
              }
            } else if (addremovehighlight === 'highlight'){
              if (cc.className.includes('remove')){
                rid_list.push(...Object.values(cc.rid));
              }
            }
          }
        }
      }
    }
    
    return rid_list;
  }
  /**
   * Expose constructor for SVG
   */
  return ConnTable;
})
