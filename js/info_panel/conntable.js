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
  'info_panel/preprocess',
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

    let overlayText = '<h2>Inferred Synaptic Partners</h2><p>Inferred synaptic partners are marked by &dagger; </p><h3>SPIN</h3><p>Inferred synaptic connections using axonic/dendritic polarity predicted by SPIN:Skeleton-based Polarity Identification for Neurons. Please refer to <br><a href="http://link.springer.com/article/10.1007/s12021-014-9225-6" target="_blank">SPIN: A Method of Skeleton-based Polarity Identification for Neurons. Neurinformatics 12:487-507. Yi-Hsuan Lee, Yen-Nan Lin, Chao-Chun Chuang and Chung-Chuan Lo (2014)</a> <br>for more details on the SPIN algorithm.</p>';
    overlayText += '<p>The polarity determined by spin was used to predict synaptic connections based on when an axonic segment of a neuron is within a specified distance to a dendritic segment of another neuron after registering to a standard brain template.</p>';

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
    template += '<thead><tr class=""><th>Neuron</th> <th>Number of Synapses</th> <th class="neuron_add_pre">+/- Neuron</th><th class="synapse_add_pre">+/- Synapses</th></tr><tr class=""><th><span class="info-input-span"> Filter by name <br></span><input type="text" id="presyn-srch" value="" class="info-input"/></th> <th><span class="info-input-span"> N greater than <br></span><input type="number" id="presyn-N" value="5" class="info-input selectable"/></th> <th class="neuron_add_pre"></th><th class="synapse_add_pre"></th></tr></thead>';
    template += '<tbody></tbody></table>';
    template += '<h4>Postsynaptic Partners</h4>';
    template += '<table id="' + obj.postTabId + '" class="table table-inverse table-custom-striped">';
    template += '<thead><tr  class=""><th>Neuron</th> <th>Number of Synapses</th> <th class="neuron_add_post">+/- Neuron</th><th class="synapse_add_post">+/- Synapses</th></tr><tr class=""><th><span class="info-input-span"> Filter by name <br></span><input type="text" id="postsyn-srch" value="" class="info-input"/></th> <th><span class="info-input-span"> N greater than <br></span><input type="number" id="postsyn-N" value="5" class="info-input selectable"/></th> <th class="neuron_add_post"></th><th class="synapse_add_post"></th></tr></thead>';
    template += '<tbody></tbody></table>';
    return template;
  }

  /**
   * Reset to default HTML
   */
  ConnTable.prototype.reset = function (){
    // purge div and add table
    this.dom.innerHTML = this.htmlTemplate;
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
    $('#'+this.divId).children('h4').eq(0).html("Presynaptic Partners"+ btnMoreInfo);
    $('#'+this.divId).children('h4').eq(1).html("Postsynaptic Partners"+ btnMoreInfo);


    $('#'+this.divId+ " .inferred-more-info").click(() => {
      // info = "<h2>Inferred Synaptic Partners</h2>";
      // this.overlay.update(info + data['description']); //<TODO> overwrite in the future
      this.overlay.show();
    });

    // create table
    this.updateTable(data,'pre');
    this.updateTable(data,'post');
    this.setupCallbacks();
  }

  /**
    * Update synaptic partners table, child method of `ConnTable.update()`
    *
    *  @param {obj} data - inherited from caller `ConnTable.update()` method
    *  @param {string} connDir - Connectivity direction `['pre'/'post']`
    */
  ConnTable.prototype.updateTable = function(data,connDir){
    if(!(connDir in data)){
      return false;
    }
    if (connDir === 'pre'){
      // pre/post tbody
      var table = $('#'+this.preTabId + " tbody")[0];
      // reset table
      $('#'+this.preTabId + " tbody tr").remove();
    }else{
      // pre/post tbody
      var table = $('#'+this.postTabId + " tbody")[0];
      // reset table
      $('#'+this.postTabId + " tbody tr").remove();

    }
    
    // flags for detecting if neuron or synapses have been added
    let neuron_add = false;
    let synapse_add = false;
    for(x in data[connDir]['details']){ // loop through all partners
      d = data[connDir]['details'][x];
      name = ('uname' in d) ? d['uname'] : d['name'];
      N = ('number' in d) ? d['number'] : "";

      var row = table.insertRow(0);
      var c1 = row.insertCell(0);
      var c2 = row.insertCell(1);
      var c3 = row.insertCell(2);
      c3.className = (connDir==='pre') ? 'neuron_add_pre': 'neuron_add_post'; // remove the . character
      var c4 = row.insertCell(3);
      c4.className = (connDir==='pre') ? 'synapse_add_pre': 'synapse_add_post';

      if ( d['inferred'] == 1 ){
        c1.innerHTML = "&dagger;" + name;
      }else{
        c1.innerHTML = name;
      }

      c2.innerHTML = N;

      // generate add/remove button for each neuron
      if(d['has_morph'] && ('uname' in d)){
        let btn = document.createElement('button');
        btn.className = 'btn';
        btn.id = (connDir==='pre') ? 'btn-pre-add-' + d['uname'] : 'btn-post-add-' + d['uname'];
        btn.name = d['uname'];

        if (this.parentObj.isInWorkspace(d['rid'])){
          btn.innerText = '-';
          btn.className += ' btn-remove btn-danger';
        }else{
          btn.innerText = '+';
          btn.className += ' btn-add btn-success';
        }

        c3.appendChild(btn);
        neuron_add = true;
      }
      if(d['has_syn_morph'] && 'syn_uname' in d){
        let btn = document.createElement('button');
        btn.className = 'btn';
        btn.id = (connDir==='pre') ? 'btn-pre-syn-add-' + d['syn_uname'] : 'btn-post-syn-add-' + d['syn_uname'];
        btn.name = d['syn_uname'];

        if (this.parentObj.isInWorkspace(d['syn_rid'])){
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
    filter = text.toLowerCase();
    table = document.getElementById(tableId).children[1];
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
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

  /**
  * Filter Connectivity Table by Number
  *
  * @param {string} tableId - id of table being filtered
  * @param {string} N - filter neurons with number of connectivty `> N`
  */
  ConnTable.prototype.filterByNum = function(tableId,N){
    // Declare variables
    var table, tr, td, i;
    table = document.getElementById(tableId).children[1];
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
    $("#"+that.divId + " button").click(function(){
      if(this.className.includes('add')){
        that.parentObj.addByUname(this.name);
      }else{
        that.parentObj.removeByUname(this.name); 
      }        
    });
  };


  /**
   * Expose constructor for SVG
   */
  return ConnTable;
})
