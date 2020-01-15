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

moduleExporter("SummaryTable",
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
  function SummaryTable(div_id, parentObj, nameConfig={}){
    this.divId = div_id;  // wrapper
    this.parentObj = parentObj;

    // nameConfig = nameConfig || {};
    Object.defineProperty(this, "colorId",{
      value: nameConfig.colorId || "info-panel-summary-neu-col",
      configurable: false,
      writable: false
    });
    Object.defineProperty(this, "tabId",{
      value: nameConfig.tabId || "info-panel-summary-table",
      configurable: false,
      writable: false
    });
    Object.defineProperty(this, "extraImgId",{
      value: nameConfig.extraImgId || "info-panel-extra-img",
      configurable: false,
      writable: false
    });
    Object.defineProperty(this,"overlayId",{
      value: nameConfig.overlayId || "info-panel-extra-img-viewer-overlay",
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
  SummaryTable.prototype.reset = function (){
    // purge div and add table
    this.dom.innerHTML = this.htmlTemplate;
  };


  /**
   * SummaryTable Information show
   */
  SummaryTable.prototype.show = function (){
    $('#'+this.divId).show();
  };
  /**
   * SummaryTable Information hide
   */
  SummaryTable.prototype.hide = function (){
    $('#'+this.divId).hide();
  };

  SummaryTable.prototype.resize = function(){

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

  function camelToSentence(word_in_snake) {
    var result = word_in_snake.replace(/([A-Z])/g, " $1");
    var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
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
  SummaryTable.prototype.update = function(data){

    if (verifyDataIntegrity(data) == false){
      return;
    }

    this.reset();
    $('#'+this.divId).show(); // show summary information


    // extra name and color
    var objName = ('uname' in data) ? data['uname'] : data['name'];
    if (data['class'] === 'Synapse'){
//      objName = "Synapse between " + objName.split("--")[0]+ " and " + objName.split("--")[1];
      objName = objName.split("--")[0]+ " to " + objName.split("--")[1];
    }
    var objRId = data['rid'];
    var objColor = this.parentObj.getAttr(objRId,'color');

    var tableHtml = '<div> <p>Name :</p><p>' + objName;

    if (this.parentObj.isInWorkspace(objRId)){
      tableHtml += '<button class="btn btn-remove btn-danger" id="btn-add-' + objName + '" name="'+ objName + '" style="margin-left:20px;">-</button>';
    }else{
      tableHtml += '<button class="btn btn-add btn-success" id="btn-add-' + objName + '" name="'+ objName +  '" style="margin-left:20px;">+</button>';
    }
    tableHtml +=  '</p></div>';


    if (objColor){
      // add choose color
      tableHtml += '<div><p>Choose Color:</p><p> <input class="color_inp"';
      if(Modernizr.inputtypes.color){
        tableHtml+='type="color"';
      }else{
        tableHtml+='type="text"';
      }
      tableHtml+='name="neu_col" id="' + this.colorId+ '" value="#' + objColor  + '"/></p></div>';

    }else{
      //do nothing;
    }

    let displayKeys = ['class','vfb_id','data_source','transgenic_lines','transmitters','expresses',"totalLength", "totalSurfaceArea", "totalVolume", "maximumEuclideanDistance", "width", "height", "depth", "numberOfBifurcations", "maxPathDistance", "averageDiameter"];
    let displayDict = {"totalLength": 'Total Length (µm)',
                       "totalSurfaceArea": 'Total Surface Area (µm<sup>2</sup>)',
                       "totalVolume": 'Total Volume (µm<sup>3</sup>)',
                       "maximumEuclideanDistance": 'Maximum Euclidean Distance (µm)',
                       "width": 'Width (µm)',
                       "height": 'Height (µm)',
                       "depth": 'Depth (µm)',
                       "maxPathDistance": 'Max Path Distance (µm)',
                       "averageDiameter": "Average Diameter (µm)"}
    var displayCtr = 0;

    let keyCounter = 0;
    for (let key of displayKeys){
      if (!(key in data) || data[key] == 0){
        continue;
      }

      let fieldName = camelToSentence(snakeToSentence(key));
      if (key in displayDict) {
        fieldName = displayDict[key];
      }
      let fieldValue = data[key];

      if (key === 'vfb_id'){
        let vfbBtn = "<a target='_blank' href='http://virtualflybrain.org/reports/" + data[key] + "'>VFB link</a>";
        fieldName = 'External Link';
        fieldValue = vfbBtn;
      }

      tableHtml += "<div><p>" + fieldName + ":</p><p>" + fieldValue +"</p></div>" ;
    }

    $('#'+this.tabId ).html(tableHtml);

    // set callback <TODO> check this
    if(!Modernizr.inputtypes.color){
      $('#'+this.colorId).spectrum({
        showInput: true,
        showPalette: true,
        showSelectionPalette: true,
        showInitial: true,
        localStorageKey: "spectrum.neuronlp",
        showButtons: false,
        move: (c) => {
          this.parentObj.setAttr(objRId,'color', c.toHexString());
          }
      });
    }
    else{
      $('#'+this.colorId).on('change',(c) => {
        this.parentObj.setAttr(objRId,'color', $('#'+this.colorId)[0].value);
      });
    }

    // flycircuit data
    if (('data_source' in data) && (data['data_source'].indexOf("FlyCircuit") > -1)) { // see if flycircuit is in
      let extraTableHtml = "";
      var extraData = data['flycircuit_data'];
      let extraKeys = ["Lineage", "Author", "Driver", "Gender/Age",  "Soma Coordinate", "Putative birth time", "Stock"];
      if (!('error' in extraData)){
        // Fetch Key:value pair for flycircuit_data and add to
        for (let key of extraKeys){
          if (!(key in extraData) || extraData[key] == 0){
            continue;
          }
          extraTableHtml += "<div><p>" + key + ":</p><p>" + extraData[key] +"</p></div>" ;
        }



        $('#'+this.tabId).append(extraTableHtml);

        // set source for images
        if ("Images" in extraData){
          let imgList = ["Original confocal image (Animation)","Segmentation","Skeleton (download)"];
          Object.entries(imgList).forEach(
            ([idx,imgName]) => {

              $('#'+this.extraImgId + " img")[idx].onerror = function(){
                this.parentElement.style.display = "none";
                if (Number(this.getAttribute("tryCtr")) < Number(this.getAttribute("maxTry"))){  // try 5 times max
                  let currTry = Number(this.getAttribute("tryCtr"));
                  setTimeout( () => {
                    this.src = extraData["Images"][imgName];
                  }, 1000);
                  //console.log("[InfoPanel.SummaryTable > Retry] Image: "+ imgName);
                  this.setAttribute("tryCtr" , currTry += 1);
                  return;
                }else{
                  //console.log("[InfoPanel.SummaryTable > Failed] Image "+ imgName);
                  this.setAttribute("tryCtr" , 0);
                  return;
                }
              };

              $('#'+this.extraImgId + " img")[idx].onload = function(){
                this.setAttribute("tryCtr",0);
                //console.log("[InfoPanel.SummaryTable > Success] Image "+ imgName);
                this.parentElement.style.display = "block";
              };
              if (extraData["Images"][imgName]){
                let _source = extraData["Images"][imgName];
                $('#'+this.extraImgId + " img")[idx].src = _source;
                // add overlay callback
                $('#'+this.extraImgId + " img")[idx].onclick = () => {
                  this.overlay.update('<h2>' + imgName + '</h2><img src="' + _source + '"></img>');
                  this.overlay.show();
                };
              }else{
                $('#'+this.extraImgId + " img")[idx].style.display = "none";
              }
            });
          $("#" + this.extraImgId).show();
        }
      }
    }

    this.setupCallbacks();

  };

  /**
   * Setup Callback for add remove button
   */
  SummaryTable.prototype.setupCallbacks = function(){
    let that = this;
    $("#"+that.divId + " button").click(function(){
      if(this.className.includes('add')){
        that.parentObj.addByUname(this.name);
      }else{
        that.parentObj.removeByUname(this.name);
      }
    });
  };



  return SummaryTable;
});
