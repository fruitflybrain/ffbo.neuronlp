var loader = function(name, dependencies, definition) {
  if (typeof module === 'object' && module && module.exports) {
      dependencies = dependencies.map(require);
      module.exports = definition.apply(context, dependencies);
  } else if (typeof require === 'function') {
    define(dependencies, definition);
  } else {
    window[name] = definition();
  }
};

loader("Overlay",
  ['jquery','d3'],
  function($,d3)
{
  /** 
   * Overlay Constructor
   * @div_id: a id for overlay object
   * @content: HTML string for content of ovelay
   */
  function Overlay(div_id, content){
    if (document.getElementById(div_id.slice(1))){
      return;
    }
    this.divId = div_id;
    this.content = content;

    this.div = document.createElement("div");
    this.div.setAttribute("id",this.divId);
    this.div.setAttribute("class","overlay");
    this.div.innerHTML = this.content;
    document.body.appendChild(this.div);
  }


  Overlay.prototype.close = function(){
    setTimeout( function() {
      $(this.divId).slideUp(500);
    }, 500);
  }  


  Overlay.prototype.show = function(){
    setTimeout( function() {
      $(this.divId).slideDown(500);
    }, 500);
  }

	return Overlay;
});