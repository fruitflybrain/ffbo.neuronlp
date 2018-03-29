// allow messages to be sent externally
var client_session;
var user;
var morphology_store = {};
var username;

var wsuri;
if (document.location.origin == "file://") {
    wsuri = "ws://127.0.0.1:8080/ws";
} else {
    wsuri ="wss://neuronlp.fruitflybrain.org:9000/ws";
}

var connection;
var login_succ = false;

var direct_access = false;
var params =  params =  getAllUrlParams()
keys = Object.keys(params);
if (keys.length >0) {direct_access = true}

function start_connection(authid, key){
    // the WAMP connection to the Router
    //
    function onchallenge (session, method, extra) {
          if (method === "wampcra") {
              salted_key = autobahn.auth_cra.derive_key(key,extra.salt, extra.iterations, extra.keylen)
              if(key=="guestpass" && authid=="guest"){
                    salted_key = "C5/c598Gme4oALjmdhVC2H25OQPK0M2/tu8yrHpyghA=";
              }
              return autobahn.auth_cra.sign(salted_key, extra.challenge);
          }
    }
    connection = new autobahn.Connection({
          url: wsuri,
          realm: "realm1",
          authmethods: ["wampcra"],
          authid: authid,
          onchallenge: onchallenge
    });

    connection.onopen = function(session, details) {

          console.log("Connected to FFBO");
          client_session = session;
          user = session.id;
          username = details.authid;
          // get feedback element
          var feedback = document.getElementById('auth_feedback');
          feedback.innerHTML = "Welcome " + username + "!";
        feedback.style.color = "green";
        if(login_succ==false){

              if (!direct_access){
                    /*setTimeout( function() {
                        $.unblockUI();
                        $("#welcomepage").hide();
                    }, 1000);
                    */
    /*

                    setTimeout( function() {
                        bootbox.confirm("Take me to the demos?", function (result) { if (result) script_loader(welcome_script);});
                    }, 2000);*/
              }
              else{
                    $.unblockUI();
                    //$("#welcomepage").hide();
              }

          }
          login_succ = true;



    // REGISTER a procedure for remote calling

    // Recieve a section of the morphology database
          function receive_partial_database (args) {

              data = {'ffbo_json': args[0],'type': 'morphology_json'};
              if(!($.isEmptyObject(metadata))){
                    //console.log(metadata);
                    for (var key in data['ffbo_json']) {
                        if (key in metadata['color']) {
                              var color = metadata['color'][key];
                              data['ffbo_json'][key]['color'] = new THREE.Color(color[0],color[1],color[2]);
                        }
                    }
              }
              processFFBOjson(data);
              /*if(!($.isEmptyObject(metadata))){
                    ffbomesh.import_state(metadata);
                    metadata={};
              }*/
              return true
          }
          session.register('ffbo.ui.receive_partial.' + session.id, receive_partial_database).then(
              function (reg) {
                    //console.log('procedure registered: ffbo.ui.recieve_partial.' + session.id);
              },
              function (err) {
                    console.log('failed to register procedure ffbo.ui.recieve_partial.' + session.id, err);
              }
          );

          function receive_msg (args) {
              //console.log(args)
              if('info' in args[0]){
                    if('error' in args[0]['info']){
                        Notify(args[0]['info']['error'], null,null,'danger');
                        $("body").trigger('demoproceed', ['error']);
                        $("#search-wrapper").unblock();
                    }
                    else if('success' in args[0]['info']){
                            Notify(args[0]['info']['success']);
                    }
              }
              if('commands' in args[0]){
                    if('reset' in args[0]['commands']){
                        neuList = [];
                        ffbomesh.reset();
                        resetNeuronButton();
                        $('#neu-id').attr('name','');
                        $('#neu-id').attr('uid','');
                        $('#neu-id').text('FlyCircuit DB: ');
                        $("#flycircuit-iframe").attr('src','');
                        delete args[0]['commands']['reset'];
                    }
                    if('remove' in args[0]['commands']){
                        ids = args[0]['commands']['remove'][0]
                        for(var i=0; i<ids.length; ++i) {
                              ind = neuList.indexOf(ids[i]);
                              $('#li-btn-'+uidDecode(ids[i])).remove();
                              try{
                                  $('#btn-keep-'+uidDecode(ids[i])).remove();
                              }
                              catch(e){};
                              if(ind>-1) neuList.splice(ind, 1);
                        }
                        //resetNeuronButton();
                        //generateNeuronButton(neuList);
                        // $("#num-of-neuron").text("Number of Neurons: " + neuList.length);
                    }
                    for(var cmd in args[0]["commands"]){
                        //console.log(cmd);
                        try{
                              //console.log({"commands":[cmd],"neurons": args[0]["commands"][cmd][0],"args":args[0]['commands'][cmd][1]});
                        }
                        catch(err){

                        }
                        ffbomesh.addCommand({"commands":[cmd],"neurons": args[0]["commands"][cmd][0],"args":args[0]['commands'][cmd][1]});
                    }
                    try{
                        if(synaptic_info && last_click){
                              if(last_click in ffbomesh.meshDict){
                                  d = [ffbomesh.meshDict[last_click].name,
                                         last_click];
                                  fetchDetailInfo(d);
                              }
                              /*else{
                                $('#info-table-wrap').hide();
                                $('#info-reset').show();
                                $("#info-intro").hide();
                                }*/
                        }

                    }
                    finally{
                        ffbomesh.updateInfoPanel();
                    }

              }


              //ffbomesh.updateInfoPanel();
              /*
                if('results_available' in args[0]){
                if(args[0]['results_available']['format'] == 'morphology'){
                task = args[0]['results_available']
                task['command'] = {"retrieve":{"state":0}}
                task['user'] = session.id

                Notify('Fetching results from Neuroarch')
                process_command(task)
                }
                }
              */
          }

          session.register('ffbo.ui.receive_msg.' + session.id, receive_msg).then(
              function (reg) {
                    //console.log('procedure registered: ffbo.ui.receive_msg.' + session.id);
              },
              function (err) {
                    console.log('failed to register procedure ffbo.ui.receive_msg.' + session.id, err);
              }
          );


          // SUBSCRIBE to a topic and receive events
          function on_server_update(args) {
            var directory = args[0];
            //console.log("on_server_update() event received with directory: " + directory);
            populate_server_lists(directory)
          }

          session.subscribe('ffbo.server.update', on_server_update).then(
            function(sub) {
                    //console.log('subscribed to server update');
            },
            function(err) {
                    console.log('failed to subscribe to server update', err);
            }
          );

          // SUBSCRIBE to a dynamic ui   updates from the processor
          //
          function on_ui_update(args) {
            var info = args[0];
            //console.log("on_ui_update() event received with: " + info);
            Notify(info, null,null,'danger')

          }

          session.subscribe('ffbo.ui.update.' + session.id, on_ui_update).then(
            function(sub) {
                    //console.log('subscribed to ui update on ffbo.ui.update.' + session.id);
            },
            function(err) {
                    console.log('failed to subscribe to ui update', err);
            }
          );

          session.call('ffbo.processor.server_information').then(
            function(res) {
                    //console.log("on_server_update() event received with directory: " + res);
                    populate_server_lists(res)
                    params =  getAllUrlParams()
                    console.log(params)
                    keys = Object.keys(params);
                    if (keys.length >0) {
                        retrieve_by_id(keys[0],params[keys[0]],client_session)
                    }
            },
            function(err) {
                    console.log("server retrieval error:", err);
            }
          );
    };

    // fired when connection was lost (or could not be established)
    //
    connection.onclose = function(reason, details) {
          console.log("Connection lost: " + reason);
          if(login_succ==false){
              var feedback = document.getElementById('auth_feedback');
              feedback.innerHTML = "Incorrect username or password...";
              feedback.style.color = "red";

          }
    };

    // now actually open the connection
    //
    connection.open();
}
