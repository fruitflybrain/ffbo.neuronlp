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
               ['jquery','perfectscrollbar'],
               function($,perfectScrollbar)
{

  var overlayBackground = undefined;
  var overlayRegistry = [];

  /**
   * Overlay Constructor
   * @param {string} div_id - a id for overlay object
   * @param {string} content - HTML string for content of ovelay
   */
  function Overlay(div_id, content){
    perfectScrollbar = perfectScrollbar || window.perfectScrollbar;
    this.divId = div_id;
    if (document.getElementById(div_id)){
      //console.error('[InfoPanel.Overlay] Instantiation Failure, Element "' + div_id + '" exists, aborting');
      //return undefined;
      this.dom = document.getElementById(this.divId);
      this.dom.setAttribute("class","overlay");
      if( !this.dom.querySelector('.overlay_container') )
      {
        this.dom.innerHTML = '<div class="overlay_container">' + this.dom.innerHTML + '</div>';
        $('.overlay_container').perfectScrollbar();
      }
    }
    else{
      this.content = content;
      this.dom = document.createElement("div");
      this.dom.setAttribute("id",this.divId);
      this.dom.setAttribute("class","overlay");
      this.dom.innerHTML = '<div class="overlay_container">' + this.content + '</div>';
      $('#wrapper')[0].appendChild(this.dom);
    }
    overlayRegistry.find((elem,idx) => { // check if overlay with same div_id already exists
      if (elem.divId === div_id){
        console.error('[InfoPanel.Overlay] Reinstantiating Overlay with Id = ' + div_id + ', overwritting registration');
        overlayRegistry.splice(idx,1); //remove existing overlay object
      }
    });
    overlayRegistry.push(this); //adding new object

    if (overlayBackground == undefined){
      if ($('#overlay-background')[0]){
        overlayBackground = $('#overlay-background')[0];
      }else if ($('.overlay-background')[0] ){
        overlayBackground = $('.overlay-background')[0];
      }else{
        let overlayDiv = document.createElement("div");
        overlayDiv.setAttribute("id",'overlay-background');
        overlayDiv.setAttribute("class",'overlay-background');
        $('#wrapper')[0].appendChild(overlayDiv);
        overlayBackground = overlayDiv;
      }

      overlayBackground.onclick = () => {
        if (overlayRegistry.length == 0){
          return;
        }
        for (let overlayObj of overlayRegistry){
          overlayObj.close();
        }
      };
    }
  }

  Overlay.prototype.closeAll = function(){
    if (overlayRegistry.length == 0){
      return;
    }
    for (let overlayObj of overlayRegistry){
      overlayObj.close();
    }
  }
  /**
   * SlideUp animation for closing overlay
   */
  Overlay.prototype.close = function(){
    setTimeout( () => {
      overlayBackground.style.display = "none";
      $('#'+this.divId).slideUp(200);
      $('#'+this.divId).hide();
      $('#'+this.divId).css("display","none");
    }, 200);
  }

  /**
   * SlideDown animation for opening overlay
   */
  Overlay.prototype.show = function(){
    this.closeAll();
    setTimeout( () => {
      overlayBackground.style.display = "block";

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
    $('#'+this.divId + " .overlay_container").html(content);
  };

  /**
   * Return Overlay Constructor
   */
  return Overlay;
});
