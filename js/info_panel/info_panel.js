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
  // `instance` is used to ensure that infoPanel is a singleton
  var instance;  

  /**
   * InfoPanel Constructor
   */
  function InfoPanel(div_id,neuData,synData){

    $(div_id).html("");
    innerhtml = "";
    innerhtml += '<table id="info-panel-summary" class="table table-inverse table-custom-striped"></table>';  // summary
    innerhtml += '<div id="info-panel-summary-extra"></div>';  // summary
    innerhtml += '<div id="info-panel-conn"></div>';  // SVG
    innerhtml += '<div id="info-panel-table"></div>'; 
    $(div_id).html(innerhtml);

    if('label' in neuData){
      this.name = neuData['label'];  
    }else if('uname' in neuData){
      this.name = neuData['uname'];
    }else if('name' in neuData){
      this.name = neuData['name'];
    }


    this.connSVG = new ConnSVG("#info-panel-conn",synData);
    this.connTable = new ConnTable("#info-panel-table",synData,false,this.isInWorkspace);
    this.summaryTable = new SummaryTable("#info-panel-summary","#info-panel-summary-extra",neuData,this.isInWorkspace); // neuron information table
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
      this.connSVG.update(synData);
      this.connTable.update(synData);
      this.summaryTable.update(neuData);
    }
  }

  /**
   * Return Constructor for InfoPanel
   */
  return InfoPanel;
});

