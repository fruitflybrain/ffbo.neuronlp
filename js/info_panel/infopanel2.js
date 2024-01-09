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

moduleExporter("InfoPanel2",[
  'jquery',
  'summarytable2',
  'connsvg',
  'conntable',
  ],
  function(
    $,
    SummaryTable2,
    SummaryTable,

  )
{

  /**
  * InfoPanel2
  * @constuctor
  * @param {string} div_id - id for div element in which the connectivity table is held
  * @param {dict} [nameConfig={}] - configuration of children divs. The 3 children divs in ConnTable are `['connSVGId','connTableId','summaryTableId']`
  */
  function InfoPanel2(div_id, dataset_name, nameConfig={},database="neo4j"){
    this.divId = div_id;
    this.dataset_name = dataset_name;
    this.database=database;

    // nameConfig = nameConfig || {};

    Object.defineProperty(this,"summaryTableId",{
      value: nameConfig.summaryTableId || "info-panel2-summary",
      configurable: false,
      writable: false
    });


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
    template += "<a onclick=\"$('#info-panel2').hide(); $('#info-intro2').show();\">Back to Overview</a>";
    template += '<div id="'+ obj.summaryTableId+ '"></div>';  // summary
    // innerhtml += '<div id="info-panel-summary-extra"></div>';  // summary

    template += '<div class="slider-bar ui-draggable ui-draggable-handle" draggable="true" id="info_panel2_dragger"></div>';
    return template;
  }


  /**
   * Reset to detaul HTML
   */
  InfoPanel2.prototype.reset = function (){
    // purge div and add table
    this.dom.innerHTML = this.htmlTemplate;

    if (this.summaryTable !== undefined){
      delete this.summaryTable;
    }

    this.summaryTable = new SummaryTable2(this.summaryTableId, this); // neuron information table
  };



  /**
   * Check if an object is in the workspace.
   *
   * @param {string} rid -  rid of target object (neuron/synapse)
   * @returns {bool} if object in workspace
   */
  InfoPanel2.prototype.isInWorkspace = function(rid){
    return false;
  };

  /**
   * Add an object into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel2.prototype.addByUname = function(uname){
    return;
  };

  /**
   * Add an object into the workspace.
   *
   * @param {string} rid -  uname of target object (neuron/synapse)
   */
  InfoPanel2.prototype.addByRid = function(rid){
    return;
  };

  /**
   * Add a neuron into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel2.prototype.addNeuronByUname = function(uname){
    return;
  };

  InfoPanel2.prototype.removeNeuronByUname = function(uname){
    return;
  };

 InfoPanel2.prototype.addByType = function(uname){
   return;
 };
 InfoPanel2.prototype.removeByType = function(uname){
   return;
 };
  /**
   * Add a synapse into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel2.prototype.addSynapseByUname = function(uname){
    return;
  };

  /**
   * Remove an object into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel2.prototype.removeByRid = function(rid){
    return;
  };

  /**
   * Add an object into the workspace.
   *
   * @param {string} rid -  uname of target object (neuron/synapse)
   */
  InfoPanel2.prototype.addByRid = function(rid){
    return;
  };

  /**
   * Remove a neuron into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel2.prototype.removeNeuronByUname = function(uname){
    return;
  };

  /**
   * Remove a synapse into the workspace.
   *
   * @param {string} uname -  uname of target object (neuron/synapse)
   */
  InfoPanel2.prototype.removeSynapseByUname = function(uname){
    return;
  };


  /**
   * Get attribute of an object in the workspace.
   *
   * @param {string} rid -  rid of target object
   * @returns {value} return Value as expected by the attribute
   */
  InfoPanel2.prototype.getAttr = function(rid,attr){
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
  InfoPanel2.prototype.renderAddRemoveBtn = function(btnName,state){
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


  InfoPanel2.prototype.renderAddRemoveBtnType = function(btnName,state){
    //let btn = $('#'+btnId)[0];
    if (! state){
      $('button[name="' + btnName + '"]').each(
        (idx,dom) => {
    dom.innerText = "+";
    dom.className = "btn btn-add-type btn-success";
        });
    }else{
      $('button[name="' + btnName + '"]').each(
        (idx,dom) => {
    dom.innerText = "-";
    dom.className = "btn btn-remove-type btn-danger";
        });
    }
  };
  /**
  * Update Info Panel
  *
  * @param {obj} neuData - neuron Data
  * @param {obj} synData - synapse Data
  */


  InfoPanel2.prototype.update = function(all_data,db="neuroarch"){
    console.log(1,all_data['summary'])
    var data ={}
    data["summary"]=all_data["summary"]["neuron"]
    if (db==="neuroarch"){
    var classOfObj = data['summary']['class'];
    var new_name = ('uname' in data['summary']) ? data['summary']['uname']: data['summar']['name'];
    }
    if (db==="neo4j"){
      console.log(2244)
      var new_name = data['summary']['Name']
      console.log(data,data['summary']['Name'],new_name)
    }
    if (this.name === new_name) {
      console.log(4,this.name)
      /** do not update if the object already exists, just show */
      this.show();
      this.resize();
      return;
    }else{
      console.log(2.5)
      this.name = new_name;
        console.log(3)
        // this.connSVG.hide();
        // this.connTable.hide();
        this.summaryTable.update(all_data['summary'],db);
        // this.summaryTable.show();
        this.show();
      

      this.resize();
    }
  };

  // InfoPanel2.prototype.update = function(data){
  //   let classOfObj = data['summary']['class'];
  //   let new_name = ('uname' in data['summary']) ? data['summary']['uname']: data['summar']['name'];

  //   if (this.name === new_name) {
  //     /** do not update if the object already exists, just show */
  //     this.show();
  //     this.resize();
  //     return;
  //   }else{
  //     this.name = new_name;

  //     if ('connectivity' in data){ // synapse data does not have connectivity
  //       if (data['summary']['class'] == 'Neuron') {

  //           this.summaryTable.update(data['summary']);
  //           this.show();
  //       }else{

  //           this.summaryTable.update(data['summary']);

  //           this.summaryTable.show(); //show all
  //       }
  //     }else{

  //       this.summaryTable.update(data['summary']);
  //       this.summaryTable.show();
  //     }

  //     this.resize();
  //   }
  // };

  /**
   * show infopanel
   */
  InfoPanel2.prototype.show = function(){
    $('#'+this.divId).show();

    this.summaryTable.show();
  };

  /**
   * hide infopanel
   */
  InfoPanel2.prototype.hide = function(){

    this.summaryTable.hide();
    $('#'+this.divId).hide();
  };

  /**
   * resize infopanel
   */
  InfoPanel2.prototype.resize = function(){
    this.summaryTable.resize();
  };

  /**
   * Return Constructor for InfoPanel2
   */
  return InfoPanel2;
});
