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
    if (this.connTable === undefined){
      delete this.connTable;
    }
    if (this.summaryTable === undefined){
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
   * Remove an object into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel.prototype.removeByUname = function(uname){
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
   * Set attribute of an object in the workspace.
   *
   * @param {string} rid -  rid of target object
   */
  InfoPanel.prototype.getAttr = function(rid,attr,value){
    return;
  };


  /**
  * Update Info Panel
  *
  * @param {obj} neuData - neuron Data
  * @param {obj} synData - synapse Data
  */
  InfoPanel.prototype.update = function(data){
//    this.reset(); // <TODO> need to change this
    let classOfObj = data['summary']['class'];
    let new_name = ('uname' in data['summary']) ? data['summary']['uname']: data['summar']['name'];

    if (this.name === new_name) {
      return;
    }else{
      this.name = new_name;

      if ('connectivity' in data){ // synapse data does not have connectivity
	this.connSVG.update(data['connectivity']);
	this.connTable.update(data['connectivity']);
      }else{
	this.connSVG.hide();
	this.connTable.hide();
      }
      this.summaryTable.update(data['summary']);
    }
  };

  /**
   * show infopanel
   */
  InfoPanel.prototype.show = function(){
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
  };
  /**
   * Return Constructor for InfoPanel
   */
  return InfoPanel;
});
