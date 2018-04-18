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
  function Summary(div_id,extra_div_id, data, func_isInWorkspace){
    this.divId = div_id;  // wrapper
    this.extraDivId = extra_div_id;  // wrapper
    this.neuNameId = "#neu-id";

    this.externalLinkId = "#vfb-link";
    this.colorId = "#neu_col";
  

    this.isInWorkspace = func_isInWorkspace;

    this.remove()
    this.create(data);
  }


  /**
   * Update Summary Information 
   */
  Summary.prototype.update = function(data){
    this.remove();
    this.create(data);
  }



  /**
   * Summary Information Remove
   */
  Summary.prototype.remove = function (){
    $(this.divId).html(""); // purge result
  }

  /**
   * Summary Information Create
   */
  Summary.prototype.create = function(data){
    // purge div and add table
    $(this.divId).html("");
    var innerhtml = "";
    innerhtml += '<tbody><tr><td>Neuron:</td><td id="' + this.neuNameId.slice(1) + '"></td><td>External Link</td><td id="' + this.externalLinkId.slice(1) + '"></td></tr>';
    innerhtml += '</tbody>'
    $(this.divId).html(innerhtml);
    $(this.divId).show(); // show summary information
    

    // extract name of object into this.name
    if('label' in data){
      this.name = data['label'];  
    }else if('uname' in data){
      this.name = data['uname'];
    }else if('name' in data){
      this.name = data['name'];
    }

    $(this.neuNameId).attr('label',this.name);
    $(this.neuNameId).text(this.name);


    // add External Link if necessary
    if('vfb_id' in data && data['vfb_id']){
      $(this.externalLinkId).text("<a target='_blank' href='http://virtualflybrain.org/reports/" + data['vfb_id'] + "'>VFB link</a>")
      $(this.externalLinkId).show();
    }

    // add 
    var params = ['Data Source', 'Transgenic Lines'];
    var html = '';

    if(this.isInWorkspace(this.name)){
      html+='<tr class="experimental" ><td>Choose Color</td><td> <input class="color_inp"'
      if(Modernizr.inputtypes.color){
        html+='type="color"';
      }else{
        html+='type="text"';
      }
      // n_id = $(neuId).attr('uid');
      html+='name="neu_col" id="' + this.colorId.slice(1)+ '" value="#' + "123141" + '"/></td></tr>'; //<TODO> remove ffbomesh dependency
      //html+='name="neu_col" id="' + neuColorId.slice(1)+ '" value="#' + ffbomesh.meshDict[n_id].color.getHexString() + '"/></td></tr>';
    }
    for ( var i = 0; i < params.length; ++i ) {
      if (params[i] in data) {
        html += '<tr class="">'
        html += '<td>' + params[i] + ':</td>'
        s = data[params[i]].toString().replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();});
        html += '<td>' + s + '</td>';
        html += '</tr>';
      }
    }
    
    $(this.divId).append(html);
    
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

    // flycircuit data
    if ('flycircuit_data' in data){
      var extraData = data['flycircuit_data'];
      if (!('error' in extraData)){
        this.createExtraInformation(extraData);
      }
    }
  }


  /**
   * Create pane for extra information. 
   * @extraData: e.g. data['flycircuit_data']
   */
  Summary.prototype.createExtraInformation = function(extraData) {
    '<table class="table table-inverse"></table><div></div>'
    var innerhtml = "";
    innerhtml += '<table class="table table-inverse">'
    innerhtml += "<tr><td></td><td></td><td></td><td></td></tr>";
    innerhtml += "<tr><td></td><td></td><td></td><td></td></tr>";
    innerhtml += "<tr><td></td><td></td><td></td><td></td></tr>";
    innerhtml += "<tr><td></td><td></td><td></td><td></td></tr>";
    innerhtml += '</table>';
    innerhtml += '<div class="row">';
    innerhtml += '<div class="col-md-4"><h4>Confocal Image</h4><img class="clickable-image" style="width:100%" alt="not available" onerror="imgError(this);"></div>';
    innerhtml += '<div class="col-md-4"><h4>Segmentation</h4><img class="clickable-image" style="width:100%" alt="not available" onerror="imgError(this);"></div>';
    innerhtml += '<div class="col-md-4"><h4>Skeleton</h4><img class="clickable-image" style="width:100%" alt="not available" onerror="imgError(this);"></div>'
    innerhtml += '</div>';

    this.overlay = new Overlay("#img-viewer-overlay",'<img id="full-img"><h2 id="img-viewer-caption"></h2>');
    $(this.extraDivId).html(innerhtml);

    
    var div =  document.getElementById(this.extraDivId.slice(1));
    div.style.display = "block";
    var table = div.children[0];
    var imagesPanel = div.children[1];

    var params = ["Author","Driver","Gender/Age","Lineage", "Putative birth time", "Putative neurotransmitter", "Soma Coordinate", "Stock"];

    for ( var i = 0; i < params.length; ++i ) {
      var tr_idx = Math.floor(i/2);
      var td_idx = i % 2;
      table.children[0].children[tr_idx].children[2*td_idx].innerHTML = params[i];
      table.children[0].children[tr_idx].children[2*td_idx+1].innerHTML = extraData[params[i]].toString();
    }
    imagesPanel.children[0].children[1].src = extraData["Images"]["Original confocal image (Animation)"];
    imagesPanel.children[0].children[1].onclick = function(){
      $('#full-img')[0].src = this.src;
      $("#img-viewer-caption").html('Original confocal image');
      this.overlay.show();
      //mm_menu_right.close();
    }

    imagesPanel.children[1].children[1].src = extraData["Images"]["Segmentation"];
    imagesPanel.children[1].children[1].onclick = function(){
      $('#full-img')[0].src = this.src;
      $("#img-viewer-caption").html('Segmentation');
      this.overlay.show();
    }

    imagesPanel.children[2].children[1].src = extraData["Images"]["Skeleton (download)"];
    imagesPanel.children[2].children[1].onclick = function(){
      $('#full-img')[0].src = this.src;
      $("#img-viewer-caption").html('Skeleton');
      this.overlay.show();
    }
  }





  return Summary;
});


