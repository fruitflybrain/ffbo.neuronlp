// Adapted from https://stackoverflow.com/a/30538574                                                                                                                                                                                  
if( moduleExporter === undefined){
  var moduleExporter = function(name, dependencies, definition) {
    if (typeof module === 'object' && module && module.exports) {
      dependencies = dependencies.map(require);
      module.exports = definition.apply(context, dependencies);
    } else if (typeof require === 'function') {
      define(dependencies, definition);
    } else {
      window[name] = eval("definition(" + dependencies.toString() + ")");
    }
  };
}

moduleExporter("InfoPanel",
  [
  'jquery',
  'app/info_panel/summarytable',
  'app/info_panel/connsvg',
  'app/info_panel/conntable',
  ],
  function(
    $,
    SummaryTable,
    ConnSVG,
    ConnTable
  )
{

  /**
  * InfoPanel
  * @constuctor
  * @param {string} div_id - id for div element in which the connectivity table is held
  * @param {dict} [nameConfig={}] - configuration of children divs. The 3 children divs in ConnTable are `['connSVGId','connTableId','summaryTableId']`
  */
  function InfoPanel(div_id, nameConfig={}){
    this.divId = div_id;

    // nameConfig = nameConfig || {};
    Object.defineProperty(this,"connSVGId",{
      value: nameConfig.connSVGId || "info-panel-conn",
      configurable: false,
      writable: false
    });
    Object.defineProperty(this,"connTableId",{
      value: nameConfig.connTableId || "info-panel-table",
      configurable: false,
      writable: false
    });
    Object.defineProperty(this,"summaryTableId",{
      value: nameConfig.summaryTableId || "info-panel-summary",
      configurable: false,
      writable: false
    });

    this.connSVG = undefined; 
    this.connTable = undefined;
    this.summaryTable = undefined;

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
    template += '<div id="'+ obj.summaryTableId+ '"></div>';  // summary
    // innerhtml += '<div id="info-panel-summary-extra"></div>';  // summary
    template += '<div id="' + obj.connSVGId + '"></div>';  // SVG
    template += '<div id="' + obj.connTableId + '"></div>';
    template += '<div class="slider-bar ui-draggable ui-draggable-handle" draggable="true" id="info_panel_dragger"></div>';
    return template;
  }  


  /*
   * Reset to detaul HTML
   */
  InfoPanel.prototype.reset = function (){
    // purge div and add table
    this.dom.innerHTML = this.htmlTemplate;
    if (this.connSVG !== undefined){
      delete this.connSVG;
    }
    if (this.connTable === undefined){
      delete this.connTable;
    }
    if (this.summaryTable === undefined){
      delete this.summaryTable;
    }

    overwriteCallbacks = {'isInWorkspace': this.isInWorkspace,
                          'addObjById': this.addObjById}

    this.connSVG = new ConnSVG(this.connSVGId);
    this.connTable = new ConnTable(this.connTableId,
                                   {'isInWorkspace': this.isInWorkspace,
                                    'addObjById': this.addObjById}
                                  );
    this.summaryTable = new SummaryTable(this.summaryTableId,this.isInWorkspace); // neuron information table
  }



  /**
   * Check if an object is in the workspace. 
   * 
   * @param {string} id -  id of target object (neuron/synapse)
   */
  InfoPanel.prototype.isInWorkspace = function(id){
    return false;
  }

  /**
   * Add an object into the workspace. 
   * 
   * @param {string} id -  id of target object (neuron/synapse)
   */
  InfoPanel.prototype.addObjById = function(id){
    return;
  }


  /**
  * Update Info Panel
  * 
  * @param {obj} neuData - neuron Data
  * @param {obj} synData - synapse Data
  */
  InfoPanel.prototype.update = function(neuData,synData){
    let new_name;
    if('label' in neuData){
      new_name = neuData['label'];  
    }else if('uname' in neuData){
      new_name = neuData['uname'];
    }else if('name' in neuData){
      new_name = neuData['name'];
    }

    let data = reformatData(neuData,synData);


    if (this.name === new_name) {
      return;
    }else{
      this.name = new_name;
      this.connSVG.update(data.conn);
      this.connTable.update(data.conn,inferred=true);
      this.summaryTable.update(data.summary);
    }
  }

  /**
  * reformat
  * 
  * @param {obj} neuData - neuron Data
  * @param {obj} synData - synapse Data
  */
  function reformatData(neuData,synData){


    var summaryData = {};
    summaryData['Class'] =  neuData['class'];
    summaryData['vfbId'] = neuData['vfb_id'];
    summaryData['Data Source'] = neuData['Data Source'];
    summaryData['Name'] = ('uname' in neuData) ? neuData['uname']: ('label' in neuData)? neuData['label']:neuData['name'];
    summaryData['Flycircuit Data'] = neuData['flycircuit_data'];
    summaryData['Transmitters'] = neuData['Transmitters'];
    summaryData['Expresses'] = undefined;
    summaryData['Transgenic Lines'] = undefined;
    summaryData['Synapse Locations'] = undefined;


    if (synData === undefined){
      var connData = undefined;
    }
    else{
      var connData = {};
      connData['description'] = synData['description'];
      connData['pre'] = {'summary':{},'details':[]};
      connData['post'] = {'summary':{},'details':[]};

      connData['pre']['summary']['Number'] = synData['pre_N'];
      connData['pre']['summary']['Profile'] = synData['pre_sum'];
      connData['post']['summary']['Number'] = synData['post_N'];
      connData['post']['summary']['Profile'] = synData['post_sum'];

      connData['pre']['details'] = synData['pre'];
      connData['post']['details'] = synData['post'];

      for (x in connData['pre']['details']){
        if (connData['pre']['details'][x]['has_syn_morph'] == 0){
          connData['pre']['details'][x]['inferred']=1;
        }else{
          connData['pre']['details'][x]['inferred']=0;
        }
      }
      for (x in connData['post']['details']){
        if (connData['post']['details'][x]['has_syn_morph'] == 0){
          connData['post']['details'][x]['inferred']=1;
        }else{
          connData['post']['details'][x]['inferred']=0;
        }
      }

    }
    return {
      summary:summaryData,
      conn: connData
    }
  }


  /**
   * show infopanel
   */
  InfoPanel.prototype.show = function(){
    this.connSVG.show();
    this.connTable.show();
    this.summaryTable.show();
  }

  /**
   * hide infopanel
   */
  InfoPanel.prototype.hide = function(){
    this.connSVG.hide();
    this.connTable.hide();
    this.summaryTable.hide();
  }
  /**
   * Return Constructor for InfoPanel
   */
  return InfoPanel;
});

