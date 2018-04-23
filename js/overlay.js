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
	       ['d3','jquery'],
	       function(d3,$)
{
  /**
   * Overlay Constructor
   * @param {string} div_id - a id for overlay object
   * @param {string} content - HTML string for content of ovelay
   */
  function Overlay(div_id, content){
    if (document.getElementById(div_id)){
      console.error('[InfoPanel.Overlay] Instantiation Failure, Element "' + div_id + '" exists, aborting');
      return undefined;
    }
    this.divId = div_id;
    this.content = content;
    
    this.dom = document.createElement("div");
    this.dom.setAttribute("id",this.divId);
    this.dom.setAttribute("class","overlay");
    this.dom.innerHTML = '<div class="container">' + this.content + '</div>';
    $('#wrapper')[0].appendChild(this.dom);
  }


  /**
   * SlideUp animation for closing overlay
   */
  Overlay.prototype.close = function(){
    setTimeout( () => {
      $('#'+this.divId).slideUp(500);
      $('#'+this.divId).hide();
      $('#'+this.divId).css("display","none");
    }, 500);
  }

  /**
   * SlideDown animation for opening overlay
   */
  Overlay.prototype.show = function(){
    setTimeout( () => {
      $('#'+this.divId).slideDown(500);
      $('#'+this.divId).show();
      $('#'+this.divId).css("display","block");
    }, 500);
  }

  /**
   * Update Overlay content
   * @param {string} content - new content for overlay
   */
  Overlay.prototype.update = function(content){
    $('#'+this.divId + " .container").html(content);
  };

  /**
   * Return Overlay Constructor
   */
  return Overlay;
});
