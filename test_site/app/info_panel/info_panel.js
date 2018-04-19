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
  'app/info_panel/summary_table',
  'app/info_panel/conn_svg',
  'app/info_panel/conn_table',
  ],
  function(
    $,
    SummaryTable,
    ConnSVG,
    ConnTable
  )
{

  /**
   * InfoPanel Constructor
   */
  function InfoPanel(div_id){

    $(div_id).html("");
    innerhtml = "";
    innerhtml += '<table id="info-panel-summary" class="table table-inverse table-custom-striped"></table>';  // summary
    // innerhtml += '<div id="info-panel-summary-extra"></div>';  // summary
    innerhtml += '<div id="info-panel-conn"></div>';  // SVG
    innerhtml += '<div id="info-panel-table"></div>';
    innerhtml += '<div class="slider-bar ui-draggable ui-draggable-handle" draggable="true" id="info_panel_dragger"></div>';
    $(div_id).html(innerhtml);

    this.connSVG = new ConnSVG("#info-panel-conn");
    this.connTable = new ConnTable("#info-panel-table");//,synData,false,this.isInWorkspace);
    this.summaryTable = new SummaryTable("#info-panel-summary",this.isInWorkspace); // neuron information table

   }

  /**
   * Check if an object is in the workspace. 
   * Overwrite by caller
   */
  InfoPanel.prototype.isInWorkspace = function(key){
    return true;
  }

  /**
   * Check if an object is in the workspace. 
   * Overwrite by caller
   */
  InfoPanel.prototype.update = function(neuData,synData){
    // this.show();
    let new_name;
    if('label' in neuData){
      new_name = neuData['label'];  
    }else if('uname' in neuData){
      new_name = neuData['uname'];
    }else if('name' in neuData){
      new_name = neuData['name'];
    }

    if (this.name === new_name) {
      return;
    }else{
      this.name = new_name;
      this.connSVG.update(synData);
      this.connTable.update(synData,inferred=true);
      this.summaryTable.update(neuData);
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

