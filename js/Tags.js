

function Tags() {
  this.initialize = function() {
    $('#tagSubmit').click(function () {
      if ($('#tagSubmit').text() == 'Create tag')
        window.CurrentTag.createTag($('#tag').val());
      else
        window.CurrentTag.retrieveTag($('#tag').val());
      $('#tagModal').modal('hide');
    });
    $('#tag').keyup(function (event) {
      if (event.keyCode == 13) {
        if ($('#tagSubmit').text() == 'Create tag')
          window.CurrentTag.createTag($('#tag').val());
        else
          window.CurrentTag.retrieveTag($('#tag').val());
        $('#tagModal').modal('hide');
      }
    });
}
  
  this.onCreateTag = function() {
    $('#tagSubmit').text('Create Tag');
    $('#tagModal').modal('show');
    $('#tag').focus();
  }
  
  this.onRetrieveTag = function(){
    $('#tagSubmit').text('Retrieve Tag');
    $('#tagModal').modal('show');
    $('#tag').focus()
  }

  this.metadata = {};

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
};

$('#tags-search-menu').perfectScrollbar();

$('#tagSubmit').click(function () {
    if ($('#tagSubmit').text() == 'Create tag')
        window.tags.createTag($('#tag').val());
    else {
        if ($('#tag').val().length > 0)
        window.tags.retrieveTag($('#tag').val());
        else {
            var thisdata = tag_data[parseInt($('.tag-el.active').attr('data')) - 1];
            window.tags.retrieveTag(thisdata['name']);
        }
    }
    $('#tagModal').modal('hide');
});

$('#tag').keyup(function (event) {
    if (event.keyCode == 13) {
        if ($('#tagSubmit').text() == 'Create tag')
        window.tags.createTag($('#tag').val());
        else {
            if ($('#tag').val().length > 0)
            window.tags.retrieveTag($('#tag').val());
            else {
                var thisdata = tag_data[parseInt($('.tag-el.active').attr('data')) - 1];
                window.tags.retrieveTag(thisdata['name']);
            }
        }
        $('#tagModal').modal('hide');
    }
});

$('#tag_tag_editor').tagEditor({
    initialTags: ['mushroom body', 'kenyon cells'],
    delimiter: ',', /* Comma */
    placeholder: 'Enter Keywords'
});



function addTagBrowser(x, tag_data) {
  var a = document.createElement('a');
  a.className = "list-group-item list-group-item-action flex-column align-items-start tag-el";
  a.href = "#";
  tag_data.push(x);
  a.setAttribute("data", tag_data.length);
  var b = document.createElement('div');
  b.className = "d-flex w-100 justify-content-between";
  a.appendChild( b );

  $('#tags-search-menu').append(a);
  $(b).append('<h5 class="mb-1">' + x['name'] + '</h5> <div class="tags-aggregate">');
  var tags_text = '';
  for (i = 0; i < x['tags'].length; i++) { 
      tags_text += '<span class="badge badge-primary">' + x['tags'][i] + "</span>";
  }

  $(b).append(tags_text);
  $(b).append('<p class="mb-1">' + x['desc'] + '</p>');
  $(b).append('<small>' + x['extra'] + '</small>');

  $(".tag-el").on("click", function() {
      $(".tag-el").removeClass("active");
      $(this).addClass("active");
  });
}

// Test

current_tags = $('#tag_tag_editor').getTags();

var ex_tag = {'name': 'Alpha Lobe', 'desc': 'This tag shows the alpha lobe of the mushroom body.', 'tags': ['mushroom body', 'alpha lobe'], 'extra': 'This tag has been created by the FFBO team.'};

var tag_data = [];

addTagBrowser(ex_tag, tag_data);