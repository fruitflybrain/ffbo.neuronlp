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

moduleExporter("ConnSVG",
 ['jquery',
  'd3',
  'info_panel/preprocess'],
  function(
    $,
    d3,
    preprocess)
{
  /**
   * Connectivity SVG inside Info Panel
   * @constructor
   * @param {string} div_id - id for div element in which the connectivity table is held
   * @param {obj} parentObj - parent object (infopanel)
   * @param {dict} [nameConfig={}] - configuration of children divs. The 3 children divs in ConnTable are `['tabId','tabTextId','svgId']`. 
   *    `tabId`: holder for table showing information over each rectangle in svg on hover/click,
   *    `tabTextId`: the `<td>` element in tabId div where the text is being held
   *    `svgId`: div for where the svg will be rendered
   */   
  function ConnSVG(div_id,parentObj,nameConfig={}){
    this.divId = div_id;  // wrapper
    this.parentObj = parentObj;
    
    Object.defineProperty(this,"tabId",{
      value: nameConfig.tabId || "info-panel-conn-table",
      configurable: false,
      writable: false
    });
    Object.defineProperty(this,"tabTextId",{
      value: nameConfig.tabTextId || "info-panel-conn-table-text",
      configurable: false,
      writable: false
    });
    Object.defineProperty(this,"svgId",{
      value: nameConfig.svgId || "info-panel-conn-svg",
      configurable: false,
      writable: false
    });


    this.svg = undefined; // initialize svg object to undefined
    this.htmlTemplate = createTemplate(this);
    this.dom = document.getElementById(this.divId);
    this.reset();
  }

  /**
   * Create HTML template. It is not an object method because it should be hidden
   * @param {obj} obj - this ConnSVG object
   */
  function createTemplate(obj){
    var template = "";
    let tableText = '<tr><td>Synaptic Profile Plot</td><td id="' + obj.tabTextId + '" class="syn-reference">Click on/Hover over plot to extract detailed synaptic information</td></tr>';
    template = "";
    template += '<table id="' + obj.tabId + '" class="table table-inverse table-custom-striped">';
    template += '<tbody>' + tableText + '</tbody>';
    template += '</table>';  // table
    template += '<div id="' + obj.svgId + '"></div>';
    return template;
  }

  /**
   * Reset SVG plot to default state, remove this.svg object
   */
  ConnSVG.prototype.reset = function (){
    // purge div and add table
    this.dom.innerHTML = this.htmlTemplate;
    if (this.svg){
      delete this.svg;
      this.svg = undefined;
    }
  };

  /**
   * Hide SVG table and plot
   */
  ConnSVG.prototype.hide = function(){
    $('#'+this.tabId).hide();
    $('#'+this.svgId).hide();
  };

  /**
   * Show SVG table and plot
   */
  ConnSVG.prototype.show = function(){
    $('#'+this.tabId).show();
    $('#'+this.svgId).show();
  };

  /**
   * Verify that data used for updating plot is valid
   * @param {obj} data - data for SVG plot
   */
  function verifyDataIntegrity(data){
    let integrity = 1;
    return integrity  && data && ('pre' in data) && ('post' in data);
  }
  /**
   * Update SVG
   */
  ConnSVG.prototype.update = function(data){
    if (verifyDataIntegrity(data) == false){
      return;
    }
  
    this.reset();

    // extract data
    var pre_sum = data['pre']['summary']['profile'];    // presynaptic summary (in percentage)
    var post_sum = data['post']['summary']['profile'];  // postsynaptic summary (in percentage)
    var pre_num = data['pre']['summary']['number'];      // presynaptic number (total number)
    var post_num = data['post']['summary']['number'];;    // postsynaptic number (total number)

    // Total dimension for entire SVG div
    let margin = {'left':10,'right':10,'top':10,'bottom':10};
    let width = 600;
    let height = 150;
    
    // SVG x-axis setup
    var x = d3.scale.linear()
                      .rangeRound([0,width]);

    // SVG y-axis setup
    var y = d3.scale.ordinal()
                      .domain(["Postsynaptic","Presynaptic"])
                      .rangeRoundBands([height,0], .1);

    // SVG x-axis ticks
    var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom")
                      .ticks(5);

    // SVG y-axis ticks
    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

    // create SVG
    this.svg = d3.select('#'+this.svgId)
                   .append("svg")
                   .attr("width", '100%')
                   .attr("height", '100%')
                   .attr("viewBox", "-70 5 " + (width+95) + " " + (height+25))
      .attr("preserveAspectRatio", "none")
      .append('g');

    // extract data, create axis, sort in descending percentage
    var data_pre = d3.entries(pre_sum).map( function (d,i) {
      return {
        y: 'Presynaptic',
        x: d['value'],
        neuron: d['key']
      };
    });
    data_pre.sort(function(a,b){ return a.x > b.x ? 1 : -1;});

    var data_post = d3.entries(post_sum).map(function (d,i) {
      return {
        y:'Postsynaptic',
        x:d['value'],
        neuron:d['key']
      };
    });
    data_post.sort(function(a,b){ return a.x > b.x ? 1 : -1;});

    data_pre.map(function(d,i){
      if (i==0){
        data_pre[i]['x0']=0;
      }else{
        data_pre[i]['x0']=data_pre[i-1]['x']+data_pre[i-1]['x0'];
      }
    });
    data_post.map(function(d,i){
      if (i==0){
        data_post[i]['x0']=0;
      }else{
        data_post[i]['x0']=data_post[i-1]['x']+data_post[i-1]['x0'];
      }
    });


    var bar1 = this.svg.append('g')
                    .attr("class", "syn-column pre");
    var bar2 = this.svg.append('g')
                    .attr("class", "syn-column post");

    bar1.selectAll("rect")
        .data(data_pre)
        .enter().append("rect")
          .each(function(d){
            d3.select(this).attr({
              class: d.neuron.replace(/ /g,"_"),
              y: height/8 + margin.top,
              x: x(1-(d.x+d.x0)/100) + margin.left,
              width: x(d.x/100),
              height: height/8*2.5
            });
            var tooltip_info = d.neuron+": "+ (d.x).toFixed(1) +"%("+Math.round(pre_num*d.x/100).toString() +")";
            d3.select(this).append("title").text(tooltip_info);
          });

    bar2.selectAll("rect")
        .data(data_post)
        .enter().append("rect")
          .each(function(d){
            d3.select(this).attr({
              class: d.neuron.replace(/ /g,"_"),
              y: height/8*5 + margin.top,
              x: x(1 - (d.x+d.x0)/100) + margin.left,
              width: x(d.x/100),
              height: height/8*2.5
            });
            var tooltip_info = d.neuron+": "+ (d.x).toFixed(1) +"%("+Math.round(post_num*d.x/100).toString() +")";
            d3.select(this).append("title").text(tooltip_info);
          });


    this.svg.append("g")
              .attr("class", "syn-axis x")
              .attr("transform", "translate(0" + margin.left + "," + (height+margin.top) + ")")
              .call(xAxis);
    
    this.svg.append("g")
              .attr("class", "syn-axis y")
              .attr("transform", "translate(" + margin.left + "," + margin.top  + ")")
              .call(yAxis);
    
    this.svg.select(".syn-axis.x")
            .selectAll("text");
    
    this.svg.select(".syn-axis.y")
            .selectAll(".tick")
            .select("text")
              .attr("transform","rotate(-30)");
    

    // format x-axis as percentage
    d3.selectAll(".syn-axis.x")
        .selectAll("text")
          .each(function(d){
            if (d==1){
              this.textContent = d*100 +"%";
            }else{
              this.textContent = d*100;
            }
          });

    // add callback
    var tabTextId = this.tabTextId;
    this.svg.selectAll("rect")
        .on("click", (d) => {
          if (d['y']=='Presynaptic'){
            var ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'], 'number':d['x']*pre_num/100};
          }else{
            var ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'],'number':d['x']*post_num/100};
          }
          var reference_info = ref_data.type+" "+ref_data.neuron+": "+ (ref_data.percentage).toFixed(1) +"%("+Math.round(ref_data.number).toString() +")";
          d3.select("#"+tabTextId)
            .text(reference_info);
        })
        .on("mouseover", (d) => {
          if (d['y']=='Presynaptic'){
            var ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'], 'number':d['x']*pre_num/100};
          }else{
            var ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'],'number':d['x']*post_num/100};
          }
          var reference_info = ref_data.type+" "+ref_data.neuron+": "+ (ref_data.percentage).toFixed(1) +"%("+Math.round(ref_data.number).toString() +")";
          d3.select("#"+tabTextId)
              .text(reference_info);
        })
        .on("mouseout",() => {
          d3.select("#"+tabTextId)
              .text("Click on/Hover over plot to extract detailed synaptic information");
        });

    this.svg.dom = $('#'+this.svgId)[0]; // save dom 
  };


  /**
   * Resize Synaptic Profile plot
   */
  ConnSVG.prototype.resize = function(){
//     if(this.svg){ //check if an svg file exists, if not getBBox will throw
//       let svgBbox = this.svg.dom.getBBox();
//       let width_margin = 40;
//       let divBbox = $('#'+this.svgId)[0].getBoundingClientRect();
// //      this.svg.dom.setAttribute("width", width_tot);
//       this.svg.dom.setAttribute("viewBox", (svgBbox.x-width_margin/2)+" "+(svgBbox.y)+" "+(divBbox.width+width_margin)+" "+(divBbox.height));
//     }else{
//       return;
    //     }
    return;
  };


  /**
   * hook, used in FFBOMesh3D.onMouseClick() to update information panel
   */
  // ConnSVG.prototype.addSynHistogram = function(data){
  //   var pre_N_list = data['pre'].map(function(d){
  //     return d['N'];
  //   });
  //   var post_N_list= data['post'].map(function(d){
  //     return d['N'];
  //   });

  //   var hist_pre = d3.layout.histogram()(pre_N_list);
  //   var hist_post = d3.layout.histogram()(post_N_list);
  //   var max_pre = Max(hist_pre);
  // }


  /**
   * Expose constructor for SVG
   */
  return ConnSVG;
})
