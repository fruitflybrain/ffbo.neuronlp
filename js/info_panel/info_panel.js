define([
  'jquery',
  'app/info_panel/summary_table',
  'app/info_panel/conn_svg',
  'app/info_panel/conn_table',
  ],
  function(
    $,
    Summary,
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


    this.connSVG = new ConnSVG("#info-panel-conn",synData);
    this.connTable = new ConnTable("#info-panel-table",synData,false,this.isInWorkspace);
    this.summary = new Summary("#info-panel-summary","#info-panel-summary-extra",neuData,this.isInWorkspace); // neuron information table

   }

  /**
   * Check if an object is in the workspace. 
   * Overwrite by caller
   */
  InfoPanel.prototype.isInWorkspace = function(key){
    return true;
  }

  /**
   * Return Constructor for InfoPanel
   */
  return InfoPanel;
});

