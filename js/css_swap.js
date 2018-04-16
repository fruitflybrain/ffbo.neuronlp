
function reloadCSS() {
    /** 
     * Reloads the CSS.
     */
    $('#main_css').replaceWith('<link id="main_css" rel="stylesheet" href="/lib/css/ffbo.layout.css?t=' + Date.now() + '"></link>');
  };
  
  function swapCSS(css_file, json) {
    /** 
     * Swaps the CSS.
    */
    var new_css = document.createElement("link");
    new_css.setAttribute("rel", "stylesheet");
    new_css.setAttribute("type", "text/css");
    new_css.setAttribute("id", "current_theme");
    new_css.setAttribute("href", css_file);
    document.getElementsByTagName("head").item(0).replaceChild(new_css, document.getElementById("current_theme"));
    reloadCSS();
    if (json != undefined) // Change mesh3d settings
    {
        

    }
}
