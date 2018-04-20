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

moduleExporter("preprocess",[],function(){
  /**
   * Preprocess data for Synaptic plot
   */
   function preprocessSynProfileData(d){
    if (!d) {
      return
    };
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
        if (!matched){
          pre_sum[x] = d['pre_sum'][x];
        }
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


  return{
    preprocessSynProfileData:preprocessSynProfileData
  }
});
