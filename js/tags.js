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

moduleExporter('Tags', ['perfectscrollbar', 'tageditor', 'overlay', 'jquery'], function(perfectScrollbar, tagEditor, Overlay, $){
  $ = $ || window.$;
  perfectScrollbar = perfectScrollbar || window.perfectScrollbar;
  tagEditor = tagEditor || window.tagEditor;
  Overlay = Overlay || window.Overlay;
  function Tags(div_id, tagsConfigUpdate = { }) {
    this.tagsConfig = { retrieveTag: '#retrieve_tag_name_input', tag: '#tag_name_input', tagSubmit: '#tagSubmit', tagModal: '#tagModal',
                        tagSearchMenu: '#tagSearchMenu', tagTagEditor: '#tagTagEditor',
                        createTag: '.createtag', loadTag: '.loadtag', tagClose: '#tagClose'};
    this.tagsConfig = Object.assign({}, this.tagsConfig, tagsConfigUpdate);
    this.metadata = {};
    this.div_id = div_id;
    /**
     * Initializes the Tags menus.
     */
    var a = `
        <div class="createtag">
          <h4 class="tagLabel">Create Tag</h4>
          <h5 type="text" id="tag_name">Tag Name</h5>
          <input type="text" name="tag" class="tag-text tag-name" id="tag_name_input"/>
          <!-- <h5 type="text" id="tag_desc" style="float: left; width:60%">Tag Description</h5>
          <textarea type="text" name="tag" class="tag-text" rows="3" id="tag_desc_input"></textarea>
          <h5 type="text" id="tag_keys" style="float: left; width:100%">Tag Keywords</h5>
          <div id="tagTagEditor"></div> -->
        </div>
        <div class="loadtag">
          <div class="retrieveTagWrapper">
            <h4 class="tagLabel">Retrieve Tag</h4>
            <h5 type="text" id="tag_name">Retrieve a Tag by Name</h5>
            <input type="text" name="tag" class="tag-text tag-name"  id="retrieve_tag_name_input"/>
          </div>
          <div id="tagSearchMenuWrapper">
          <h5 type="text" id="tag_desc">Browse Tags</h5>
          <div id="tagSearchMenu" class="list-group"></div>
        </div>
        </div>
        <div class="tag-footer">
          <button type="button" class="btn btn-primary" id="tagSubmit"></button>
          <button type="button" class="btn btn-default" id="tagClose">Close</button>
        </div>`;
    this.overlay = new Overlay(div_id, a)
    this.overlay.dom.classList.add('ps')
    //this.inDiv.append(a);
    //this.overlay.dom.style['height'] = '30%';      

    $(this.tagsConfig['tagClose']).click( () => {this.overlay.closeAll();} );
    $(this.tagsConfig['tagSubmit']).click( () => {
      if ($(this.tagsConfig['tagSubmit']).text() == 'Create Tag')
        this.createTag($(this.tagsConfig['tag']).val());
      else
        this.retrieveTag($(this.tagsConfig['retrieveTag']).val());
      this.overlay.closeAll();
      //$(this.tagsConfig['tagModal']).modal('hide');
    });
    $('.tag-name').keyup( (event) => {
      if (event.keyCode == 13) {
        if ($(this.tagsConfig['tagSubmit']).text() == 'Create Tag')
          this.createTag($(this.tagsConfig['tag']).val());
        else
          this.retrieveTag($(this.tagsConfig['retrieveTag']).val());
        //$(this.tagsConfig['tagModal']).modal('hide');
        this.overlay.closeAll();
      }
    });

    $(this.tagsConfig['tagSearchMenu']).perfectScrollbar();
    $(this.div_id + ' .overlay_container').perfectScrollbar();
    $(this.tagsConfig['tag']).keyup( (event) => {
      if (event.keyCode == 13) {
        if ($(this.tagsConfig['tagSubmit']).text() == 'Create tag')
          this.createTag($(this.tagsConfig['tag']).val());
        else {
          if ($(this.tagsConfig['tag']).val().length > 0)
            this.retrieveTag($(this.tagsConfig['tag']).val());
          else {
            var thisdata = tag_data[parseInt($('.tag-el.active').attr('data')) - 1];
            this.retrieveTag(thisdata['name']);
          }
        }
        //$(this.tagsConfig['tagModal']).modal('hide');
      }
    });

    /*$(this.tagsConfig['tagTagEditor']).tagEditor({
      initialTags: ['mushroom body', 'kenyon cells'],
      delimiter: ',',
      placeholder: 'Enter Keywords'
      });
    */

    this.onCreateTag = function() {
      /**
       * Opens the Create Tag menu.
       */
      window.NeuroNLPUI.closeRightMenu();   // This should be done somewhere else
      $(this.tagsConfig['tagSubmit']).text('Create Tag');
      $(this.tagsConfig['createTag']).show();
      $(this.tagsConfig['loadTag']).hide();
      this.overlay.show();
      $(this.tagsConfig['tag']).focus();
    }

    this.onRetrieveTag = function(){
      /**
       * Opens the Retrieve Tag menu.
       */
      window.NeuroNLPUI.closeRightMenu();  // This should be done somewhere else
      $(this.tagsConfig['tagSubmit']).text('Retrieve Tag');
      $(this.tagsConfig['createTag']).hide();
      $(this.tagsConfig['loadTag']).show();
      this.overlay.show();
      //this.overlay.dom.style['height'] = '30%';
      //this.overlay.dom.style['min-height'] = '200px';
      //this.overlay.dom.style.height = '30%'; // Must be 80% normally
      $(this.tagsConfig['retrieveTag']).focus()
    }


    // Should be Overloaded by application
    this.createTag = function(tagName) {}

    // Should be Overloaded by application
    this.retrieveTag = function(tagName) {}

    // Should be Overloaded by application
    this.activateTagLinks = function(tagName) {}

    this.clearTagBrowser = function() {
      $(this.tagsConfig.tagSearchMenu).html('');
    }

    this.populateTags = function(tagDataList) {
       /*
       * Populates the Tag Browser.
       */
      this.clearTagBrowser();
      for (var i = 0; i < tagDataList.length; i++) {
        this.addTagToBrowser(tagDataList[i]);
      }
      this.activateTagLinks();
    }

    this.addTagToBrowser = function(tagData) {
      /**
       * Adds Tags to the Tag Browser.
       */
           var a = document.createElement('a');
           a.className = "list-group-item list-group-item-action flex-column align-items-start tag-el";
           a.href = "#";
           a.setAttribute("tag_name", tagData.name);
           var b = document.createElement('div');
           b.className = "d-flex w-100 justify-content-between";
           a.appendChild( b );

           $(this.tagsConfig['tagSearchMenu']).append(a);
           $(b).append('<h5 class="mb-1">' + tagData['name'] + '</h5> <div class="tags-aggregate">');
           var tags_text = '';
           for (i = 0; i < tagData['keywords'].length; i++) {
             tags_text += '<span class="badge badge-primary">' + tagData['keywords'][i] + "</span>";
           }

           try{
             $(b).append(tags_text);
             $(b).append('<p class="mb-1">' + tagData['desc'] + '</p>');
             $(b).append('<small>' + tagData['FFBOdata']['extra'] + '</small>');
           }
           catch(err){}
           $(".tag-el").on("click", function() {
             $(".tag-el").removeClass("active");
             $(this).addClass("active");
           });
         }
  }
  return Tags;
});
/*

  currentTag = new Tags($('#wrapper'));
  currentTag.initialize();

  current_tags = $('#tagTagEditor').tagEditor('getTags')[0].tags;

  var ex_tag = {'name': 'Alpha Lobe', 'desc': 'This tag shows the alpha lobe of the mushroom body.', 'keywords': ['mushroom body', 'alpha lobe'], 'FFBOdata': {extra: 'This tag has been created by the FFBO team.'}};

  var tag_data = [];

  addTagBrowser(ex_tag, tag_data);
*/
