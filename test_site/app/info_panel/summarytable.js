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
moduleExporter("SummaryTable",
  ['jquery','d3','app/overlay'],
  function($,d3,Overlay)
{
  /**
   * Summary Information Constructor
   * @div_id: ID for div in which to create Summary Table
   * @data: initial data to instantiate Summary Table
   * @func_isInWorkspace: hook to function to determine is neuron is in workspace
   */
  function Summary(div_id, func_isInWorkspace){
    this.divId = div_id;  // wrapper
    this.colorId = "#neu_col";
    this.isInWorkspace = func_isInWorkspace;
    this.overlay = new Overlay("#img-viewer-overlay",'<img id="full-img"><h2 id="img-viewer-caption"></h2>');

    this.htmlTemplate = createTemplate(this);
    this.dom = document.getElementById(this.divId.slice(1));
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
    $(this.divId).show();
    $(this.extraDivId).show();
  }
  /**
   * Summary Information hide
   */
  Summary.prototype.hide = function (){
    $(this.divId).hide();
    $(this.extraDivId).hide();
  }

  /**
   * Summary Information Update
   *
   */
  Summary.prototype.update = function(data){

    this.reset();
    $(this.divId).show(); // show summary information
  
    let basicKeys = ['Class','Name','vfbId','Data Source'];
    let additionalKeys = ['Transmitters','Expresses','Transgenic Lines'];
    
    let tableHtml = "";

    for (key of basicKeys){
      if (data[key]) {  // make sure data field is valid
        if (key === 'vfbId'){
          let vfbBtn = "<a target='_blank' href='http://virtualflybrain.org/reports/" + data[key] + "'>VFB link</a>"
          tableHtml += '<tr><td>External Link:</td><td>' + vfbBtn + '</td></tr>';
          continue;
        }
        tableHtml += '<tr><td>' + key + ':</td><td>' + data[key] + '</td></tr>';
      }
    }
    for (key of additionalKeys){
      if (data[key]) {  // make sure data field is valid
        tableHtml += '<tr><td>' + key + ':</td><td>' + data[key] + '</td></tr>';
      }
    }
    // add color functionality
    // if(this.isInWorkspace(this.name)){
    //   tableHtml+='<tr class="experimental" ><td>Choose Color</td><td> <input class="color_inp"'
    //   if(Modernizr.inputtypes.color){
    //     tableHtml+='type="color"';
    //   }else{
    //     tableHtml+='type="text"';
    //   }
    //   tableHtml+='name="neu_col" id="' + this.colorId.slice(1)+ '" value="#' + "123141" + '"/></td></tr>'; //<TODO> remove ffbomesh dependency
    // }
    
    $(this.divId + " tbody").html(tableHtml);
    
    // flycircuit data
    if (data['Data Source'].indexOf("FlyCircuit") > -1) { // see if flycircuit is in 
      let extraTableHtml = "";
      var extraData = data['Flycircuit Data']
      if (!('error' in extraData)){
        var params = ["Author","Driver","Gender/Age","Lineage", "Putative birth time", "Putative neurotransmitter", "Soma Coordinate", "Stock"];

        Object.entries(params).forEach(
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
        $("#info-panel-extra-img >div>img")[0].src = extraData["Images"]["Original confocal image (Animation)"];
        $("#info-panel-extra-img >div>img")[1].src = extraData["Images"]["Segmentation"];
        $("#info-panel-extra-img >div>img")[2].src = extraData["Images"]["Skeleton (download)"];

        $("#info-panel-extra-img >div").show();
        $("#info-panel-extra-img >div").show();
        $("#info-panel-extra-img >div").show();
        $("#info-panel-extra-img").show();
        
        

      //   imagesPanel.children[0].children[1].onclick = function(){
      //     $('#full-img')[0].src = this.src;
      //     $("#img-viewer-caption").html('Original confocal image');
      //     this.overlay.show();
      // //mm_menu_right.close();
      //   }

      //   imagesPanel.children[1].children[1].onclick = function(){
      //     $('#full-img')[0].src = this.src;
      //     $("#img-viewer-caption").html('Segmentation');
      //     this.overlay.show();
      //   }

      //   imagesPanel.children[2].children[1].onclick = function(){
      //     $('#full-img')[0].src = this.src;
      //     $("#img-viewer-caption").html('Skeleton');
      //     this.overlay.show();
      //   }
      }
    }

    // Color Change - show palette
    if(this.isInWorkspace(this.name)){
      if(!Modernizr.inputtypes.color)
        $(this.colorId).spectrum({
          showInput: true,
          showPalette: true,
          showSelectionPalette: true,
          showInitial: true,
          localStorageKey: "spectrum.neuronlp",
          showButtons: false,
          move: function(c){
            console.log('move');
            //ffbomesh.setColor($(neuId).attr('uid'), c.toHexString());
          }
        });
      else{
        $(this.colorId).on('change', function(){
          console.log('move');
          //ffbomesh.setColor($(neuId).attr('uid'), $(neuColorId)[0].value);
        });
      }
    }


  }




  return Summary;
});


