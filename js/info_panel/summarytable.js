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
	       ['jquery','d3','overlay','modernizr'],
	       function($,d3,Overlay,Modernizr)
{
  /**
   * Summary Information Constructor
   * @constructor
   * @param {string} div_id -  ID for div in which to create Summary Table
   * @param {obj} parentObj -  parentObject
   */
  function Summary(div_id, parentObj){
    this.divId = div_id;  // wrapper
    this.parentObj = parentObj;
    
    this.colorId = "neu_col";
        
    this.overlay = new Overlay("img-viewer-overlay",'<img id="full-img"><h2 id="img-viewer-caption"></h2>');

    this.htmlTemplate = createTemplate(this);
    this.dom = document.getElementById(this.divId);
    this.reset();
  }

  /**
   * Create HTML template
   */
  function createTemplate(obj){
    var template = "";
    template += '<table class="table table-inverse table-custom-striped"><tbody></tbody></table>';
    template += '<div id="info-panel-extra-img" class="row">';
    template += '<div class="col-md-4" style="display:none"><h4>Confocal Image</h4><img class="clickable-image" style="width:100%" alt="not available" onerror="imgError(this);"></div>';
    template += '<div class="col-md-4" style="display:none"><h4>Segmentation</h4><img class="clickable-image" style="width:100%" alt="not available" onerror="imgError(this);"></div>';
    template += '<div class="col-md-4" style="display:none"><h4>Skeleton</h4><img class="clickable-image" style="width:100%" alt="not available" onerror="imgError(this);"></div>';
    template += '</div>';
    return template;
  }

  /*
   * Reset Summary Table
   */
  Summary.prototype.reset = function (){
    // purge div and add table
    this.dom.innerHTML = this.htmlTemplate;
  }


  /**
   * Summary Information show
   */
  Summary.prototype.show = function (){
    $('#'+this.divId).show();
    $('#'+this.extraDivId).show();
  }
  /**
   * Summary Information hide
   */
  Summary.prototype.hide = function (){
    $('#'+this.divId).hide();
    $('#'+this.extraDivId).hide();
  }

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
    return integrity  && data ;
  }
  
  /**
   * Summary Information Update
   *
   */
  Summary.prototype.update = function(data){

    if (verifyDataIntegrity(data) == false){
      return;
    }
    
    this.reset();
    $('#'+this.divId).show(); // show summary information


    // extra name and color
    var objName = ('uname' in data) ? data['uname'] : data['name'];
    if (data['class'] === 'synapse'){
      objName = "Synapse between" + objName.split("--")[0]+ "and" + objName.split("--")[1];
    }
    var objRId = data['rid'];
    var objColor = this.parentObj.getAttr(objRId,'color');
    
    var tableHtml = '<tr><td>Name :</td><td>' + objName + '</td>';
    
    if (objColor){
      // add choose color
      tableHtml += '<td>Choose Color</td><td> <input class="color_inp"';
      if(Modernizr.inputtypes.color){
        tableHtml+='type="color"';
      }else{
        tableHtml+='type="text"';
      }
      tableHtml+='name="neu_col" id="' + this.colorId+ '" value="#' + objColor  + '"/></td></tr>';
      
      // set callback <TODO> check this 
      if(!Modernizr.inputtypes.color){
        $('#'+this.colorId).spectrum({
          showInput: true,
          showPalette: true,
          showSelectionPalette: true,
          showInitial: true,
          localStorageKey: "spectrum.neuronlp",
          showButtons: false,
          move: (function(c){
            console.log('move');
            this.parentObj.setAttr(objRId,'color', c.toHexString());
          }).bind(this)
        });
      }
      else{
        $('#'+this.colorId).onchange = () => {
	  console.log("move");
	  this.parentObj.setAttr(objRId,'color', c.toHexString());
        };
      }

    }else{
      tableHtml += '</tr>';
    }
      
    let displayKeys = ['class','vfb_id','data_source','transgenic_lines','transmitters','expresses'];
    var displayCtr = 0;
    tableHtml += '<tr>';
    for (key of displayKeys){
      if (data[key]) {  // make sure data field is valid
	displayCtr += 1;

	if (displayCtr % 2 == 0 ){
	  tableHtml += '</tr><tr>';
	}
	
        if (key === 'vfb_id'){
          let vfbBtn = "<a target='_blank' href='http://virtualflybrain.org/reports/" + data[key] + "'>VFB link</a>";
          tableHtml += '<td>External Link:</td><td>' + vfbBtn + '</td>';
        }else{
	  tableHtml += '<td>' + snakeToSentence(key) + ':</td><td>' + data[key] + '</td>';
	}
      }
    }
    // check if we ended on an odd number
    if (tableHtml.substr(tableHtml.length-5) !== '</tr>'){
      tableHtml += '</tr>';
    }
    
    

    $('#'+this.divId + " tbody").html(tableHtml);

    // flycircuit data
    if (('data_source' in data) && (data['data_source'].indexOf("FlyCircuit") > -1)) { // see if flycircuit is in
      let extraTableHtml = "";
      var extraData = data['flycircuit_data'];
      if (!('error' in extraData)){
	// Fetch Key:value pair for flycircuit_data and add to table
        Object.entries(Object.keys(extraData)).forEach(
          ([idx, p]) => {
            if (idx % 2 === 0){
              extraTableHtml += "<tr><td>" + p + ":</td><td>" + extraData[p] +"</td>" ;
            }else{
              extraTableHtml += "<td>" + p + ":</td><td>" + extraData[p] +"</td></tr>" ;
            }
          }
        );

        $(this.divId+ " tbody").append(extraTableHtml);

        // set source for images
	if (extraData["Images"]["Original confocal image (Animation)"]){
	  $("#info-panel-extra-img >div>img")[0].src = extraData["Images"]["Original confocal image (Animation)"];
	  $("#info-panel-extra-img >div>img")[0].onclick = function(){
            $('#full-img')[0].src = this.src;
            $("#img-viewer-caption").html('Original confocal image');
            this.overlay.show();
          };
	}else{
	  $("#info-panel-extra-img >div>img").hide(); // <TODO> check this
	}
	
	if (extraData["Images"]["Segmentation"]){
	  $("#info-panel-extra-img >div>img")[1].src = extraData["Images"]["Segmentation"];
	  $("#info-panel-extra-img >div>img")[1].onclick = function(){
            $('#full-img')[1].src = this.src;
            $("#img-viewer-caption").html('Segmentation');
            this.overlay.show();
          };
	}else{
	  $("#info-panel-extra-img >div>img").hide(); // <TODO> check this
	}
	
	if (extraData["Images"]["Skeleton (download)"]){
	  $("#info-panel-extra-img >div>img")[2].src = extraData["Images"]["Skeleton (download)"];
	  $("#info-panel-extra-img >div>img")[2].onclick = function(){
            $('#full-img')[2].src = this.src;
            $("#img-viewer-caption").html('Skeleton');
            this.overlay.show();
          };
	}else{
	  $("#info-panel-extra-img >div>img").hide(); // <TODO> check this
	}

        $("#info-panel-extra-img").show();
      }
    }
    
  }




  return Summary;
});
