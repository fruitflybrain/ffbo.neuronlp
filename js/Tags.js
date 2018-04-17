

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

  this.createTag = function(CurrentClient, fffbomesh, tag) {
    /**
     * Creates a tag with the given string.
     */
    msg = {}
    msg['tag'] = tag;
    msg['metadata'] = ffbomesh.export_state();

    Client.sendStandardNA(msg, Client.addNAServer('ffbo.na.create_tag'));
  }

  this.retrieveData = function (CurrentClient, ffbomesh, metadata, reset = true) {
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
    CurrentClient.sendStandardNA(msg, 'ffbo.processor.neuroarch_query', function (res) { $(".overlay-background").hide(); metadata = res['data']; Notify('Retrieved Tag.'); ffbomesh.resume();});
  }

  this.retrieveTag = function(CurrentClient, ffbomesh, metadata) {
    /**
     * Retrieves a tag from Neuroarch with the given name.
     */
    msg = {}
    msg['tag'] = tag;

    $('.overlay-background').show();
    $(".overlay-background").show();
    Notify("Fetching connectivity data");
    CurrentClient.sendStandardNA(msg, addNAServer('ffbo.na.retrieve_tag'), function(res) {$(".overlay-background").hide(); Notify('Retrieving Tag.'); this.retrieveData(CurrentClient, ffbomesh, metadata);});
  }
};

