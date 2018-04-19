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

moduleExporter('Tags', ['perfectScrollbar', 'tagEditor', 'jquery'], function(perfectScrollbar, tagEditor, $){
  $ = $ || window.$;
  perfectScrollbar = perfectScrollbar || window.perfectScrollbar;
  tagEditor = tagEditor || window.tagEditor;
  
  function Tags(inDiv, tagsConfigUpdate = { tag: '#tag', tagSubmit: '#tagSubmit', tagModal: '#tagModal', tagSearchMenu: '#tagSearchMenu', tagTagEditor: '#tagTagEditor'}) {
    this.tagsConfig = { tag: '#tag', tagSubmit: '#tagSubmit', tagModal: '#tagModal', tagSearchMenu: '#tagSearchMenu', tagTagEditor: '#tagTagEditor', createTag: '.createtag', loadTag: '.loadtag'};
    this.tagsConfig = Object.assign({}, this.tagsConfig, tagsConfigUpdate);
    this.metadata = {};
    this.inDiv = inDiv;
    this.initialize = function () {
      /**
       * Initializes the Tags menus.
       */
      var a = `
          <div class="modal" id="tagModal" tabindex="-1" role="dialog" aria-labelledby="tagLabel" aria-hidden="true">
          <div class="modal-dialog">
          <div class="modal-content">
          <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&#10005;</span>
          </button>
        <h4 class="modal-title" id="tagLabel">Create A Tag</h4>
        </div>
        <div class="modal-body createtag">
        <h5 type="text" id="tag_name" style="float: left; width:60%">Tag Name</h5>
        <textarea type="text" name="tag" class="tag-text" rows="1" id="tag_name_input" style="display: block; width:100%; resize: none;"></textarea>
        <h5 type="text" id="tag_desc" style="float: left; width:60%">Tag Description</h5>
        <textarea type="text" name="tag" class="tag-text" rows="3" id="tag_desc_input" style="display: block; width:100%; resize: none;"></textarea>
        <h5 type="text" id="tag_keys" style="float: left; width:100%">Tag Keywords</h5>

        <div id="tagTagEditor" style="float: left; width:100%"></div>
        </div>
        <div class="modal-body loadtag">
        <h5 type="text" id="tag_name" style="float: left; width:60%">Retrieve a Tag by Name</h5>
        <textarea type="text" name="tag" rows="1" id="retrieve_tag_name_input" style="display: block; width:100%; resize: none; max-width: 100%;"></textarea>
        <h5 type="text" id="tag_desc" style="display: block; width:60%">Browse Tags</h5>
        <br />
        <div id="tagSearchMenu" class="list-group" style="overflow:scroll; height:400px; overflow-x: hidden; max-width: 100%;">
        <a href="#" class="list-group-item list-group-item-action flex-column align-items-start tag-el active">
        <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">Mushroom Body Alpha Lobe</h5>
        <div class="tags-aggregate">
        <span class="badge badge-primary">alpha-lobe</span>
        <span class="badge badge-primary">mushroom-body</span>
        </div>
        </div>
        <p class="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
        &nbsp;&nbsp;
        <small>This Tag is currently featured.</small>
        </a>
        </div>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id="tagSubmit"></button>
        </div>
        </div>
        </div>
        </div>`;
      this.inDiv.append(a);
      $(this.tagsConfig['tagSubmit']).click(function () {
        if ($(this.tagsConfig['tagSubmit']).text() == 'Create tag')
          window.currentTag.createTag($(this.tagsConfig['tag']).val());
        else
          window.currentTag.retrieveTag($(this.tagsConfig['tag']).val());
        $(this.tagsConfig['tagModal']).modal('hide');
      });
      $(this.tagsConfig['tag']).keyup(function (event) {
        if (event.keyCode == 13) {
          if ($(this.tagsConfig['tagSubmit']).text() == 'Create tag')
            window.currentTag.createTag($(this.tagsConfig['tag']).val());
          else
            window.currentTag.retrieveTag($(this.tagsConfig['tag']).val());
          $(this.tagsConfig['tagModal']).modal('hide');
        }
      });

      $(this.tagsConfig['tagSearchMenu']).perfectScrollbar();

      $(this.tagsConfig['tagSubmit']).click(function () {
        if ($(this.tagsConfig['tagSubmit']).text() == 'Create tag')
          window.tags.createTag($(this.tagsConfig['tag']).val());
        else {
          if ($(this.tagsConfig['tag']).val().length > 0)
            window.tags.retrieveTag($(this.tagsConfig['tag']).val());
          else {
            var thisdata = tag_data[parseInt($('.tag-el.active').attr('data')) - 1];
            window.tags.retrieveTag(thisdata['name']);
          }
        }
        $(this.tagsConfig['tagModal']).modal('hide');
      });

      $(this.tagsConfig['tag']).keyup(function (event) {
        if (event.keyCode == 13) {
          if ($(this.tagsConfig['tagSubmit']).text() == 'Create tag')
            window.tags.createTag($(this.tagsConfig['tag']).val());
          else {
            if ($(this.tagsConfig['tag']).val().length > 0)
              window.tags.retrieveTag($(this.tagsConfig['tag']).val());
            else {
              var thisdata = tag_data[parseInt($('.tag-el.active').attr('data')) - 1];
              window.tags.retrieveTag(thisdata['name']);
            }
          }
          $(this.tagsConfig['tagModal']).modal('hide');
        }
      });

      $(this.tagsConfig['tagTagEditor']).tagEditor({
        initialTags: ['mushroom body', 'kenyon cells'],
        delimiter: ',', /* Comma */
        placeholder: 'Enter Keywords'
      });

    }

    this.onCreateTag = function() {
      /**
       * Opens the Create Tag menu.
       */
      $(this.tagsConfig['tagSubmit']).text('Create Tag');
      $(this.tagsConfig['tagModal']).modal('show');
      $(this.tagsConfig['tag']).focus();
      $(this.tagsConfig['createTag']).show();
      $(this.tagsConfig['loadTag']).hide();
    }

    this.onRetrieveTag = function(){
      /**
       * Opens the Retrieve Tag menu.
       */
      $(this.tagsConfig['tagSubmit']).text('Retrieve Tag');
      $(this.tagsConfig['tagModal']).modal('show');
      $(this.tagsConfig['tag']).focus()
      $(this.tagsConfig['createTag']).hide();
      $(this.tagsConfig['loadTag']).show();
    }



    this.createTag = function(currentClient, fffbomesh, tag) {
      /**
       * Creates a tag with the given string.
       */
      msg = {}
      msg['tag'] = tag;
      msg['metadata'] = ffbomesh.export_state();

      Client.sendStandardNA(msg, Client.addNAServer('ffbo.na.create_tag'));
    }

    this.retrieveData = function (currentClient, ffbomesh, metadata, reset = true) {
      /**
       * Retrieves data during the retrieval of a tag.
       */
      if (reset) {
        neuList = [];
        ffbomesh.reset();
        resetNeuronButton();
        $('#neu-id').attr('name', '');
        $('#neu-id').attr('uid', '');
        $('#neu-id').text('FlyCircuit DB: ');
        $("#flycircuit-iframe").attr('src', '');
      }
      msg = {}
      msg['data_callback_uri'] = 'ffbo.ui.receive_partial';
      msg['username'] = username;
      var na_servers = document.getElementById("na_servers");
      var na_server = na_servers.options[na_servers.selectedIndex].value;
      msg['server'] = na_server;
      msg['query'] = "{'command':'retrieve':{'state':0}}"
      msg["threshold"] = 20
      if (ffbomesh.neurons_3d)
        msg["threshold"] = 1
      currentClient.sendStandardNA(msg, 'ffbo.processor.neuroarch_query', function (res) { $(".overlay-background").hide(); metadata = res['data']; Notify('Retrieved Tag.'); ffbomesh.resume();});
    }

    this.retrieveTag = function(currentClient, ffbomesh, metadata) {
      /**
       * Retrieves a tag from Neuroarch with the given name.
       */
      msg = {}
      msg['tag'] = tag;

      $('.overlay-background').show();
      $(".overlay-background").show();
      Notify("Fetching connectivity data");
      currentClient.sendStandardNA(msg, addNAServer('ffbo.na.retrieve_tag'), function(res) {$(".overlay-background").hide(); Notify('Retrieving Tag.'); this.retrieveData(currentClient, ffbomesh, metadata);});
    }

    function addTagToBrowser(tagData) {
      /**
       * Adds a Tag to the Tag Browser.
       */
      if( !tag_data.constructor.name == "Array" ) tag_data = Array(tagData);
      tagData.forEach(
         function(tag){
           var a = document.createElement('a');
           a.className = "list-group-item list-group-item-action flex-column align-items-start tag-el";
           a.href = "#";
           a.setAttribute("data", tag.name);
           var b = document.createElement('div');
           b.className = "d-flex w-100 justify-content-between";
           a.appendChild( b );

           $(this.tagsConfig.tagSearchMenu).append(a);
           $(b).append('<h5 class="mb-1">' + tag['name'] + '</h5> <div class="tags-aggregate">');
           var tags_text = '';
           for (i = 0; i < x['keywords'].length; i++) {
             tags_text += '<span class="badge badge-primary">' + tag['tags'][i] + "</span>";
           }

           try{
             $(b).append(tags_text);
             $(b).append('<p class="mb-1">' + tag['desc'] + '</p>');
             $(b).append('<small>' + tag['FFBOdata']['extra'] + '</small>');
           }
           catch(err){}
           $(".tag-el").on("click", function() {
             $(".tag-el").removeClass("active");
             $(this).addClass("active");
           });
         }
      )
  };
  return Tags;
});

/*

  currentTag = new Tags($('#wrapper'));
  currentTag.initialize();

  current_tags = $('#tagTagEditor').tagEditor('getTags')[0].tags;

  var ex_tag = {'name': 'Alpha Lobe', 'desc': 'This tag shows the alpha lobe of the mushroom body.', 'keywords': ['mushroom body', 'alpha lobe'], 'FFBOdata': {extra: 'This tag has been created by the FFBO team.'}};

  var tag_data = [];

  addTagBrowser(ex_tag, tag_data);
  *]
