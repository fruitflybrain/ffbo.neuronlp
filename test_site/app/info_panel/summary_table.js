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
    this.neuNameId = "#neu-id";
    this.externalLinkId = "#vfb-link";
    this.colorId = "#neu_col";
    this.isInWorkspace = func_isInWorkspace;

    this.overlay = new Overlay("#img-viewer-overlay",'<img id="full-img"><h2 id="img-viewer-caption"></h2>');

    this.objName = 'Object Name';
    this.objType = 'Object Type';

    this.reset();
  }

  /*
   * Reset Summary Table
   */
  Summary.prototype.reset = function (){
    // purge div and add table
    $(this.divId).html("");
    var innerhtml = "";
    innerhtml += '<tbody></tbody>';
    $(this.divId).html(innerhtml);
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
   * >   {
            "class": "Neuron",
            "Data Source":[],
            "name":"Gad1-F-200292",
            "locality":false,   // if it's local neuron
            "flycircuit_data":{},
            "uname":"Gad1-F-200292",
            "Expresses":[],    // whether if it expresses a gene, e.g. fruitless
            "Transgenic Lines": [],  // e.g. GAL4
            "Transmitters":[], // 
            "Synapse Locations":[],
            "External Link":[],
         }
   *
   *
   */
  Summary.prototype.update = function(data){

    this.reset();
    $(this.divId).show(); // show summary information
  
    var objName = data['uname'];
    var objType = data['class'];
    // extract name of object into this.name
    // if('label' in data){
    //   this.objName = data['label'];  
    // }else if('uname' in data){
    //   this.name = data['uname'];
    // }else if('name' in data){
    //   this.name = data['name'];
    // }

    let tableHtml = "";
    tableHtml += '<tr><td>'+objType+'</td><td>' + objName + '</td></tr>';

    if ("External Link" in data){
      //<TODO>
          // // add External Link if necessary
      // if('vfb_id' in data && data['vfb_id']){
      //   $(this.externalLinkId).html("<a target='_blank' href='http://virtualflybrain.org/reports/" + data['vfb_id'] + "'>VFB link</a>")
      //   $(this.externalLinkId).show();
      // }
    }
    

    // add color functionality
    if(this.isInWorkspace(this.name)){
      tableHtml+='<tr class="experimental" ><td>Choose Color</td><td> <input class="color_inp"'
      if(Modernizr.inputtypes.color){
        tableHtml+='type="color"';
      }else{
        tableHtml+='type="text"';
      }
      tableHtml+='name="neu_col" id="' + this.colorId.slice(1)+ '" value="#' + "123141" + '"/></td></tr>'; //<TODO> remove ffbomesh dependency
    }

    // add additional params 
    var params = ['Data Source', 'Transgenic Lines'];
    for ( p in params) {
      if (params[p] in data) {
        tableHtml += '<tr class="">'
        tableHtml += '<td>' + params[p] + ':</td>'
        s = data[params[p]].toString().replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();});
        tableHtml += '<td>' + s + '</td>';
        tableHtml += '</tr>';
      }
    }
    
    $(this.divId).html(tableHtml);
    
    // flycircuit data
    if ('flycircuit' in data['Data Source']){
      var extraData = data['flycircuit_data'];
      if (!('error' in extraData)){
        var params = ["Author","Driver","Gender/Age","Lineage", "Putative birth time", "Putative neurotransmitter", "Soma Coordinate", "Stock"];

        Object.entries(params).forEach(
          ([idx, p]) => {
            if (idx % 2 === 0){
              tableHtml += "<tr><td>" + p + "</td><td>" + extraData[p] +"</td>" ;
            }else{
              tableHtml += "<td>" + p + "</td><td>" + extraData[p] +"</td></tr>" ;
            }
          }
        );

        tableHtml += '<div class="row">';
        tableHtml += '<div class="col-md-4"><h4>Confocal Image</h4><img class="clickable-image" style="width:100%" alt="not available" onerror="imgError(this);"></div>';

        tableHtml += '<div class="col-md-4"><h4>Segmentation</h4><img class="clickable-image" style="width:100%" alt="not available" onerror="imgError(this);"></div>';
        tableHtml += '<div class="col-md-4"><h4>Skeleton</h4><img class="clickable-image" style="width:100%" alt="not available" onerror="imgError(this);"></div>';
        tableHtml += '</div>';


        imagesPanel.children[0].children[1].src = extraData["Images"]["Original confocal image (Animation)"];
        imagesPanel.children[1].children[1].src = extraData["Images"]["Segmentation"];
        imagesPanel.children[2].children[1].src = extraData["Images"]["Skeleton (download)"];


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


