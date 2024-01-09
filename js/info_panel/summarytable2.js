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

moduleExporter("SummaryTable2",
               ['jquery','d3','overlay','modernizr', 'spectrum'],
               function($,d3,Overlay,Modernizr, spectrum)
{
  /**
   * SummaryTable Information Constructor
   * @constructor
   * @param {string} div_id -  ID for div in which to create SummaryTable
   * @param {obj} parentObj -  parentObject
   * @param {dict} [nameConfig={}] - configuration of children divs. The 3 children divs in ConnTable are `['colorId','extraImgId','overlayId']`
   */
  function SummaryTable2(div_id, parentObj, nameConfig={}){
    this.divId = div_id;  // wrapper
    this.parentObj = parentObj;
    this.dataset_name = parentObj.dataset_name;

    // nameConfig = nameConfig || {};
    Object.defineProperty(this, "colorId",{
      value: nameConfig.colorId || "info-panel2-summary-neu-col",
      configurable: false,
      writable: false
    });
    Object.defineProperty(this, "tabId",{
      value: nameConfig.tabId || "info-panel2-summary-table",
      configurable: false,
      writable: false
    });
    Object.defineProperty(this, "extraImgId",{
      value: nameConfig.extraImgId || "info-panel2-extra-img",
      configurable: false,
      writable: false
    });
    Object.defineProperty(this,"overlayId",{
      value: nameConfig.overlayId || "info-panel2-extra-img-viewer-overlay",
      configurable: false,
      writable: false
    });

    $('#'+this.overlayId).remove();
    this.overlay = new Overlay(this.overlayId,'<img></img><h2></h2>');

    this.htmlTemplate = createTemplate(this);
    this.dom = document.getElementById(this.divId);
    this.reset();
  }

  /**
   * Create HTML template
   * @param {obj} obj - SummaryTable Instance
   */
  function createTemplate(obj){
    var template = "";
    template += '<div id="' + obj.tabId + '" class="table-grid"></div>';
    template += '<div id="' + obj.extraImgId + '">';
    template += '<div style="display:none"><h4>Confocal Image</h4><img class="clickable-image" alt="not available" tryCtr=0 maxTry=5></div>';
    template += '<div style="display:none"><h4>Segmentation</h4><img class="clickable-image" alt="not available" tryCtr=0 maxTry=5></div>';
    template += '<div style="display:none"><h4>Skeleton</h4><img class="clickable-image" alt="not available" tryCtr=0 maxTry=5></div>';
    template += '</div>';
    return template;
  }

  /*
   * Reset SummaryTable Table
   */
  SummaryTable2.prototype.reset = function (){
    // purge div and add table
    this.dom.innerHTML = this.htmlTemplate;
  };


  /**
   * SummaryTable Information show
   */
  SummaryTable2.prototype.show = function (){
    $('#'+this.divId).show();
  };
  /**
   * SummaryTable Information hide
   */
  SummaryTable2.prototype.hide = function (){
    $('#'+this.divId).hide();
  };

  SummaryTable2.prototype.resize = function(){

    return;
  };

  /**
   * Convert snake_case to Sentence Case
   *
   * @param {string} word_in_snake - Word in snake_case
   */

  function snakeToSentence(word_in_snake){
    return word_in_snake.split("_")
                         .map(word => word.charAt(0).toUpperCase()+word.slice(1))
                         .join(" ");
  }

  /**
   * Verify integrity of data
   */
  function verifyDataIntegrity(data){
    let integrity = 1;
    return integrity && data;
  }

  /**
   * SummaryTable Information Update
   *
   */
  SummaryTable2.prototype.update = function(all_data){
    if (verifyDataIntegrity(all_data) == false){
      return;
    }

    data = all_data["neuron"]
    paper_data = all_data["papers"]
    this.reset();
    $('#'+this.divId).show(); // show summary information
    console.log("redfs")
    console.log(data)
    // extra name and color
    var objName;
    var objType;
    if ('uname' in data){
        objName = data['uname'];
        objType = data['name'];
    }else{
        objName = data['Name'];
        objType = data['Name'];
    }
    var objName_changed = objName.replace('<', '&lt').replace('>', '&gt')
    if (data['class'] === 'Synapse'){
//      objName = "Synapse between " + objName.split("--")[0]+ " and " + objName.split("--")[1];
        // removed as it is not consistent with uname naming, and cannot removal this synapse based on uname
      // objName = objName.split("--")[0]+ " to " + objName.split("--")[1];
    }

    var tableHtml = '<div> <p>Name :</p><p>' + objName_changed;
    tableHtml +=  '</p></div>';
    
    // var oRId = data['orid'];

    console.log(objRId)


    tableHtml += '<div> <p>Type :</p><p>' + objType;
    tableHtml +=  '</p></div>';
    var dum =tableHtml
    // if (objColor){
    //   // add choose color
    //   tableHtml += '<div><p>Choose Color:</p><p> <input class="color_inp"';
    //   if(Modernizr.inputtypes.color){
    //     tableHtml+='type="color"';
    //   }else{
    //     tableHtml+='type="text"';
    //   }
    //   tableHtml+='name="neu_col" id="' + this.colorId+ '" value="#' + objColor  + '"/></p></div>';

    // }else{
    //   //do nothing;
    // }

    console.log(897)
  
    let displayKeys = ['FBID','Comment','Definition','Flywire_ref','Hemibrain_ref','References','Synonyms'];
    var displayCtr = 0;
    hemiHTML =""
    paperHtml=""
    let keyCounter = 0;
    for (let key of displayKeys){
      if (!(key in data) || data[key] == 0){
        continue;
      }

      let fieldName = snakeToSentence(key);
      let fieldValue = undefined;

      if (key == 'data_source'){
          fieldValue = [];
          for (k in data[key]){
              if (data[key][k] != ''){
                  fieldValue.push(k + ' ' + data[key][k]);
              }else{
                  fieldValue.push(k);
              }
          }
      }else if(key == 'Hemibrain_ref'){

        var objRIds = data['Hemibrain_ref'];
        for (var i = 0; i < objRIds.length; i++) {
          var objRId = objRIds[i];
    
          console.log(objRId)
          fieldValue = '<p>' + objRId;
      
          if (this.parentObj.isInWorkspace(objRId)) {
            fieldValue += '<button class="btn btn-remove-type btn-danger" id="btn-add-type' + objRId + '" name="' + objRId + '" style="margin-left:20px;">-</button>';
          } else {
            fieldValue += '<button class="btn btn-add-type btn-success" id="btn-add-type' + objRId + '" name="' + objRId + '" style="margin-left:20px;">+</button>';
          }
          fieldValue += '</p>';
      }

      hemiHTML = "<div><p>" + fieldName + ":</p><p>" + fieldValue +"</p></div>" ;
      }else if(key == 'References'){

        var objRIds = data['References'];
        var listItems = "";
        for (var i = 0; i < objRIds.length; i++) {
          var objRId = objRIds[i]["Title"];
          var objDOI = objRIds[i]["DOI"];
          
          fieldValue = '<p><span class="copy-doi" data-doi="' + objDOI + '">' +"- "+ objRId + '</span>';
      
          if (this.parentObj.isInWorkspace(objRId)) {
              fieldValue += '<button class="btn btn-remove-paper btn-danger" id="btn-add-paper' + objRId + '" name="' + objRId + '" style="margin-left:20px;">-</button>';
          } else {
              fieldValue += '<button class="btn btn-add-paper btn-success" id="btn-add-paper' + objRId + '" name="' + objRId + '" style="margin-left:20px;">+</button>';
          }
          fieldValue += '</p><br>';

          listItems += fieldValue;
          // listItems += '<li>' + fieldValue + '</li>';

      }
      // paperHtml = "<div><p>" + fieldName + ":</p><br/><p><ul>" + listItems + "</ul></p></div>";
       paperHtml = "<div><p>" + fieldName + ":</p>" + listItems +"</div>" ;
      }
      else{
        fieldValue = data[key];
        tableHtml += "<div><p>" + fieldName + ":</p><p>" + fieldValue +"</p></div>" ;
      }

    }

    // for (const [key, value] of Object.entries(data)) {
    //   tableHtml += "<div><p>" + snakeToSentence(key) + ":</p><p>" + value +"</p></div>" ;
    // }

    $('#'+this.tabId ).html(tableHtml+hemiHTML+paperHtml);
    console.log(tableHtml)
    this.setupCallbacks();
  };
  /**
   * Setup Callback for add remove button
   */
  SummaryTable2.prototype.setupCallbacks = function(){
    let that = this;
    $("#"+that.divId + " button").click(function(){
      if(this.className.includes('type')){
        if(this.className.includes('add')){
          console.log("show this",this.id.replace('btn-add-type', ''))
          that.parentObj.addByType(this.id.replace('btn-add-type', ''))
          that.parentObj.renderAddRemoveBtnType(this.id.replace('btn-add-type', ''),true)
      }else{
        that.parentObj.removeByType(this.id.replace('btn-add-type', ''))
        that.parentObj.renderAddRemoveBtnType(this.id.replace('btn-add-type', ''),false)
        
      }
      }else{
      if(this.className.includes('add')){
          that.parentObj.addByRid(this.id.replace('btn-add-', ''))
      }else{
        that.parentObj.removeByRid(this.id.replace('btn-add-', ''))
      }
    }})

    .mouseenter( function() {
      if (this.className.includes('remove')) {
        that.parentObj.highlight(this.name);
      }
    })
    .mouseleave( function() {
      if (this.className.includes('remove')) {
        that.parentObj.resume();
      }
    });

    // Adding click event listener for DOI copying
    $("#" + that.divId).on('click', '.copy-doi', function() {
      var doi = $(this).data('doi');
      navigator.clipboard.writeText("doi:"+doi).then(function() {
          console.log('DOI copied to clipboard:', doi);
      }).catch(function(error) {
          console.error('Error copying DOI to clipboard:', error);
      });
  });




  };



return SummaryTable2;
});
