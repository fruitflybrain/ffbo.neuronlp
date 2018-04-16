define(['jquery',
  'neu_table',
  'syn_table',
  'syn_plot',
  'Modernizr',
  'ffbomesh',
  'client_session'],
function($,
  neuTable,
  synTable,
  synPlot,
  Modernizr,
  ffbomesh,
  ClientSession)
{
  last_click = "";
  synaptic_info = false;
  const neuId = "#neu-id";
  const infoPanelId = "#info-panel";
  const neuColorId = "#neu_col";
  const neuSummaryTableId = "#neu-info-summary";
  const infoTableWrapperId = "#info-table-wrap";


  /**
   * Update Info Panel
   */
  function updateInfoPanel(d) {
      if(last_click == d[1]) 
        return;
      last_click = d[1];
      $(neuId).attr('name',d[0]);
      d = [ffbomesh.meshDict[last_click].name,
                   last_click];
      data = ClientSession.fetchDetailInfo(d);
      $(infoPanelId).scrollTop(0);

      neuTable.update(data);
      synTable.update(data);
      synPlot.generate(data);
      synPlot.resize(data);
  }
  
  /**
   * Update information if selected synapse
   */
  function updateInfoPanelSynapse(data){
      if('label' in data){
        $(neuId).attr('label',data['label']);
      }else if('uname' in data){
        $(neuId).attr('label',data['uname']);
      }else if('uname' in data){
        $(neuId).attr('label',data['name']);
      }

      $(neuId).html("Synapses between " + $(neuId).attr('label').replace("--", " and "));
      var params = ['Data Source', 'Synapse Locations'];

      html ='<tr class="experimental" ><td>Choose Color</td><td> <input class="color_inp"'
      if(Modernizr.inputtypes.color)
      html+='type="color"'
      else
      html+='type="text"'
      n_id = last_click
      html+='name="neu_col" id="' + neu_col.slice(1)+ '" value="#' + ffbomesh.meshDict[n_id].color.getHexString() + '"/></td></tr>';

      for ( var i = 0; i < params.length; ++i ) {
          if (params[i] in data) {
              html += '<tr class="">'
              html += '<td>' + params[i] + ':</td>'
              s = JSON.stringify(data[params[i]]).replace(/[\[\]{}""]/g,"").replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();}).replace(",", ", ");
              html += '<td>' + s + '</td>';
              html += '</tr>';
      }
      }

      var table = document.getElementById(neuSummaryTableId.slice(1));
      table.innerHTML = '<tbody>' + html + '</tbody>';
      
      if(!Modernizr.inputtypes.color)
      $("#neu_col").spectrum({
          showInput: true,
          showPalette: true,
          showSelectionPalette: true,
          showInitial: true,
          localStorageKey: "spectrum.neuronlp",
          showButtons: false,
          move: function(c){
          ffbomesh.setColor($(neuId).attr('uid'), c.toHexString());
          }
      });
      else
      $(neuColorId).on('change', function(){
          ffbomesh.setColor($(neuId).attr('uid'), $(neuColorId)[0].value);
      });
      $(infoTableWrapperId).show()
      $(neuSummaryTableId).show()   
  }

  /**
   * Expose Method
   */
  return{
    update: updateInfoPanel,
    updateSyn: updateInfoPanelSynapse
  }

});
