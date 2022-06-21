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

moduleExporter("InfoPanel",[
  'jquery',
  'info_panel/summarytable',
  'info_panel/connsvg',
  'info_panel/conntable',
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
    template += "<a onclick=\"$('#info-panel').hide(); $('#info-intro').show();\">Back to Introduction</a>";
    template += '<div id="'+ obj.summaryTableId+ '"></div>';  // summary
    // innerhtml += '<div id="info-panel-summary-extra"></div>';  // summary
    template += '<div id="' + obj.connSVGId + '"></div>';  // SVG
    template += '<div id="' + obj.connTableId + '"></div>';
    template += '<div class="slider-bar ui-draggable ui-draggable-handle" draggable="true" id="info_panel_dragger"></div>';
    return template;
  }


  /**
   * Reset to detaul HTML
   */
  InfoPanel.prototype.reset = function (){
    // purge div and add table
    this.dom.innerHTML = this.htmlTemplate;
    if (this.connSVG !== undefined){
      delete this.connSVG;
    }
    if (this.connTable !== undefined){
      delete this.connTable;
    }
    if (this.summaryTable !== undefined){
      delete this.summaryTable;
    }

    this.connSVG = new ConnSVG(this.connSVGId, this);
    this.connTable = new ConnTable(this.connTableId, this);
    this.summaryTable = new SummaryTable(this.summaryTableId, this); // neuron information table
  };



  /**
   * Check if an object is in the workspace.
   *
   * @param {string} rid -  rid of target object (neuron/synapse)
   * @returns {bool} if object in workspace
   */
  InfoPanel.prototype.isInWorkspace = function(rid){
    return false;
  };

  /**
   * Add an object into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel.prototype.addByUname = function(uname){
    return;
  };

  /**
   * Add an object into the workspace.
   *
   * @param {string} rid -  uname of target object (neuron/synapse)
   */
  InfoPanel.prototype.addByRid = function(rid){
    return;
  };

  /**
   * Add a neuron into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel.prototype.addNeuronByUname = function(uname){
    return;
  };

  /**
   * Add a synapse into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel.prototype.addSynapseByUname = function(uname){
    return;
  };

  /**
   * Remove an object into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel.prototype.removeByRid = function(rid){
    return;
  };

  /**
   * Add an object into the workspace.
   *
   * @param {string} rid -  uname of target object (neuron/synapse)
   */
  InfoPanel.prototype.addByRid = function(rid){
    return;
  };

  /**
   * Remove a neuron into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel.prototype.removeNeuronByUname = function(uname){
    return;
  };

  /**
   * Remove a synapse into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel.prototype.removeSynapseByUname = function(uname){
    return;
  };


  /**
   * Get attribute of an object in the workspace.
   *
   * @param {string} rid -  rid of target object
   * @returns {value} return Value as expected by the attribute
   */
  InfoPanel.prototype.getAttr = function(rid,attr){
    return undefined;
  };

  /**
   * Render Add/Remove buttons to a specific type. all buttons with the
   * same name will be set
   *
   * @param {string} btnId - Id of button to be rendered
   * @param {bool} state - new state of button (true false)
   * @example
   * infoPanel.renderAddRemoveBtn("pre-add-mi1-5",true);
   */
  InfoPanel.prototype.renderAddRemoveBtn = function(btnName,state){
    //let btn = $('#'+btnId)[0];
    if (! state){
      $('button[name="' + btnName + '"]').each(
        (idx,dom) => {
    dom.innerText = "+";
    dom.className = "btn btn-add btn-success";
        });
    }else{
      $('button[name="' + btnName + '"]').each(
        (idx,dom) => {
    dom.innerText = "-";
    dom.className = "btn btn-remove btn-danger";
        });
    }
  };
  /**
  * Update Info Panel
  *
  * @param {obj} neuData - neuron Data
  * @param {obj} synData - synapse Data
  */
  InfoPanel.prototype.update = function(data){
    let classOfObj = data['summary']['class'];
    let new_name = ('uname' in data['summary']) ? data['summary']['uname']: data['summar']['name'];

    if (this.name === new_name) {
      /** do not update if the object already exists, just show */
      this.show();
      this.resize();
      return;
    }else{
      this.name = new_name;

      if ('connectivity' in data){ // synapse data does not have connectivity
        if (data['summary']['class'] == 'Neuron') {
            this.connSVG.update(data['connectivity']);
            this.connTable.update(data['connectivity']);
            this.summaryTable.update(data['summary']);
            this.show();
        }else{
            this.connSVG.hide();
            this.connTable.update(data['connectivity']);
            this.summaryTable.update(data['summary']);
            this.connTable.show();
            this.summaryTable.show(); //show all
        }
      }else{
        this.connSVG.hide();
        this.connTable.hide();
        this.summaryTable.update(data['summary']);
        this.summaryTable.show();
      }

      this.resize();
    }
  };

  /**
   * show infopanel
   */
  InfoPanel.prototype.show = function(){
    $('#'+this.divId).show();
    this.connSVG.show();
    this.connTable.show();
    this.summaryTable.show();
  };

  /**
   * hide infopanel
   */
  InfoPanel.prototype.hide = function(){
    this.connSVG.hide();
    this.connTable.hide();
    this.summaryTable.hide();
    $('#'+this.divId).hide();
  };

  /**
   * resize infopanel
   */
  InfoPanel.prototype.resize = function(){
    this.connSVG.resize();
    this.connTable.resize();
    this.summaryTable.resize();
  };

  /**
   * Return Constructor for InfoPanel
   */
  return InfoPanel;
});
