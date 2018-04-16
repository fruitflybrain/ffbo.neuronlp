define(['jquery','Modernizr'],function($,Modernizr){
  // neuron information
  const neuTableWrapperId = "#info-table-neu-wrapper";
  const neuSummaryTableId = "#neu-info-summary";
  const neuId = "#neu-id";
  const neuColorId = "#neu_col";
  const vfbLinkId = "#vfb-link";

  /**
   * Update Neuron Summary Info
   */
  function updateNeu(data, color_change=true){
    $(neuSummaryTableId).show(); // show summary information
    if('label' in data){
      $(neuId).attr('label',data['label']);
    }
    else if('uname' in data){
      $(neuId).attr('label',data['uname']);
    }
    else if('uname' in data){
      $(neuId).attr('label',data['name']);
    }


    $(neuId).html("Neuron: " + $(neuId).attr('label'));
    if('vfb_id' in data && data['vfb_id']){
      $(vfbLinkId).html("<a target='_blank' href='http://virtualflybrain.org/reports/" + data['vfb_id'] + "'>VFB link</a>")
      $(vfbLinkId).show();
    }

    var params = ['Data Source', 'Transgenic Lines'];
    var html = '';

    if(color_change){
      html+='<tr class="experimental" ><td>Choose Color</td><td> <input class="color_inp"'
      if(Modernizr.inputtypes.color){
        html+='type="color"';
      }else{
        html+='type="text"';
      }
      n_id = $(neuId).attr('uid');
      html+='name="neu_col" id="' + neu_col.slice(1)+ '" value="#' + ffbomesh.meshDict[n_id].color.getHexString() + '"/></td></tr>';
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
    var table = document.getElementById(neuSummaryTableId);
    table.innerHTML = '<tbody>' + html + '</tbody>';
    // Color Change
    if(color_change){
      if(!Modernizr.inputtypes.color)
        $(neuColorId).spectrum({
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
      else{
        $(neuColorId).on('change', function(){
          ffbomesh.setColor($(neuId).attr('uid'), $(neuColorId)[0].value);
        });
      }
    }
  }


  /**
   * Exposing Methods
   */
  return {
    update: updateNeu
  }
});

  