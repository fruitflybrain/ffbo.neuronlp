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

moduleExporter("Overlay",
  ['jquery','d3'],
  function($,d3)
{
  /**
   * Overlay Constructor
   * @div_id: a id for overlay object
   * @content: HTML string for content of ovelay
   */
  function Overlay(div_id, content){
    if (document.getElementById(div_id)){
      return;
    }
    this.divId = div_id;
    this.content = content;

    this.dom = document.createElement("div");
    this.dom.setAttribute("id",this.divId);
    this.dom.setAttribute("class","overlay");
    this.dom.innerHTML = '<div class="container">' + this.content + '</div>';
    document.body.appendChild(this.dom);
  }


  Overlay.prototype.close = function(){
    setTimeout( function() {
      $('#'+this.divId).slideUp(500);
      $('#'+this.divId).hide();
      $('#'+this.divId).css("display","none");
    }, 500);
  }


  Overlay.prototype.show = function(){
    setTimeout( function() {
      $('#'+this.divId).slideDown(500);
      $('#'+this.divId).show();
      $('#'+this.divId).css("display","block");
    }, 500);
  }


  Overlay.prototype.update = function(content){
    $('#'+this.divId + " .container").html(content);
  }
  return Overlay;
});
