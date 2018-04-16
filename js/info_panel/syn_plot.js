define(['d3','jquery'],function(d3,$){
  /** 
   * Plot Synaptic Concentration Profile
   */
  function generateSynProfile(d){
    // verify data integrity
    if(!('pre_sum' in data && 'post_sum' in data)) 
      return;
    var data = preprocessSynProfileData(d);


    // extract data
    var pre_sum = data['pre_sum'];    // presynaptic summary (in percentage)
    var post_sum = data['post_sum'];  // postsynaptic summary (in percentage)
    var pre_num = data['pre_N'];      // presynaptic number (total number)
    var post_num = data['post_N'];    // postsynaptic number (total number)

    // Total dimension for entire SVG div
    var height_tot = 150;
    var width_tot = $("#syn-profile-svg").getBoundingClientRect().width;

    // Calculate SVG dimension
    var margin = {top: 20, right: 40, bottom: 30, left: 80},
    var width = width_tot - margin.left - margin.right,
    var height = height_tot - margin.top - margin.bottom;

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

    
    d3.select("#syn-profile-svg").html("");

    // create SVG
    var svg = d3.select("#syn-profile-svg").append("svg")
                                       .attr("width", width_tot)
                                       .attr("height", height_tot)
                                       .attr("viewBox", "0 0 " + width_tot +" "+ height_tot )
                                       .append("g");

    // extract data, create axis, sort in descending percentage
    var data_pre = d3.entries(pre_sum).map( function (d,i) {
      return {
        y: 'Presynaptic', 
        x: d['value'],
        neuron: d['key']
      };
    });
    data_pre.sort(function(a,b){ return a.x > b.x ? 1 : -1;})

    var data_post = d3.entries(post_sum).map(function (d,i) {
      return {
        y:'Postsynaptic',
        x:d['value'],
        neuron:d['key']
      };
    });
    data_post.sort(function(a,b){ return a.x > b.x ? 1 : -1;})

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


    var bar1 = svg.append('g')
                    .attr("class", "syn-column pre");
    var bar2 = svg.append('g')
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


    svg.append("g")
         .attr("class", "syn-axis x")
         .attr("transform", "translate(0" + margin.left + "," + (height+margin.top) + ")")
         .call(xAxis);

    svg.append("g")
         .attr("class", "syn-axis y")
         .attr("transform", "translate(" + margin.left + "," + margin.top  + ")")
         .call(yAxis);

    svg.select(".syn-axis.x")
         .selectAll("text")

    svg.select(".syn-axis.y")
         .selectAll(".tick")
         .select("text")
         .attr("transform","rotate(-30)")


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
    addCallbackSynProfile();
  }


  /** 
   * Preprocess data for Synaptic plot
   */
   function preprocessSynProfileData(d){
    if (!d) {return};
    combine_regexes = [/(Dm[0-9]+)_?[0-9]*/, /(Pm[0-9]+)_?[0-9]*/ ];
    pre_sum = {};
    post_sum = {};
    // Pre_sum
    if ('pre_sum' in d){
      for (x in d['pre_sum']){
        matched = 0;
        for(i in combine_regexes){
          re = combine_regexes[i];
          if(re.exec(x)){
            key = re.exec(x)[1];
            if(key in pre_sum)
              pre_sum[key] += d['pre_sum'][x];
            else
              pre_sum[key] = d['pre_sum'][x];
            matched = 1;
            break;
          }
        }
        if (!matched)
          pre_sum[x] = d['pre_sum'][x];
      }
      d['pre_sum'] = pre_sum;
    }

    //Post_sum
    if ('post_sum' in d){
      for (x in d['post_sum']){
        matched = 0;
        for(i in combine_regexes){
          re = combine_regexes[i];
          if(re.exec(x)){
            key = re.exec(x)[1];
            if(key in post_sum)
              post_sum[key] += d['post_sum'][x];
            else
              post_sum[key] = d['post_sum'][x];
            matched = 1;
            break;
          }
        }
        if (!matched)
          post_sum[x] = d['post_sum'][x];
      }
      d['post_sum'] = post_sum;
    }
    return d;
  }


  /**
   * Resize Synaptic Profile plot
   */
  function resizeSynProfile(){
    if(d3.select("#syn-profile-svg").select("svg")[0][0]){ //check if an svg file exists, if not getBBox will throw error
      let svg = d3.select(".svg-syn svg").node();
      let bbox =  svg.getBBox();
      let width_margin = 40;
      svg.setAttribute("viewBox", (bbox.x-width_margin/2)+" "+(bbox.y)+" "+(bbox.width+width_margin)+" "+(bbox.height));
    }else{
      return;
    }
  }


  /**
   * Add callbacks to synaptic profile plot
   */
  function addCallbackSynProfile(){
    d3.select("#syn-profile-svg")
        .selectAll("rect")
          .on("mouseover",function(d){
            if (d['y']=='Presynaptic'){
              let ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'], 'number':d['x']*pre_num/100};
            }else{
              let ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'],'number':d['x']*post_num/100};
            }
            addSynReference(ref_data);
          })
          .on("click",function(d){
            if (d['y']=='Presynaptic'){
              let ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'], 'number':d['x']*pre_num/100};
            }else{
              let ref_data = {'type':d['y'],'neuron':d['neuron'],'percentage':d['x'],'number':d['x']*post_num/100};
            }
            addSynReference(ref_data);
          })
          .on("mouseout",function(){
            d3.select("#syn-profile-text")
                .text("Click on/Hover over plot to extract detailed synaptic information");;
          });
  };


  /**
   * Update synaptic reference above profile plot
   */
  function addSynReference(d){
    // d:type, neuron, percentage, number
    let target= d3.select("#syn-profile-text");
    let reference_info = d.type+" "+d.neuron+": "+ (d.percentage).toFixed(1) +"%("+Math.round(d.number).toString() +")";
    target.text(reference_info);
  }


  /**
   * hook, used in FFBOMesh3D.onMouseClick() to update information panel
   */
  function addSynHistogram(data){
    let pre_N_list = data['pre'].map(function(d){
      return d['N'];
    });
    let post_N_list= data['post'].map(function(d){
      return d['N'];
    });

    var hist_pre = d3.layout.histogram()(pre_N_list);
    var hist_post = d3.layout.histogram()(post_N_list);
    var max_pre = Max(hist_pre);
  }


  /**
   * Expose these methods 
   * @generate: generate plot
   * @resize: resize plot by parent div size
   * @addSynHistogram: hook?
   */
  return {
    generate: generateSynProfile,
    resize: resizeSynProfile,
    addSynHistogram: addSynHistogram
  }
});