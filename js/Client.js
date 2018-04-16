// Former read_vars.js

var tags = require('./Tags.js');
var ui = require('./UI.js');
var autobahn = require('./autobahn.js');



function getAllUrlParams(url) {
  /**
   * Parse all parameters delivered with the URL and return a dictionary with the parsed parameters.
   */

  // Get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // We will store the parameters here
  var obj = {};

  // If query string exists
  if (queryString) {

  // stuff after # is not part of query string, so get rid of it
  queryString = queryString.split('#')[0];

  // split our query string into its component parts
  var arr = queryString.split('&');

  for (var i=0; i<arr.length; i++) {
    // separate the keys and the values
    var a = arr[i].split('=');

    // in case params look like: list[]=thing1&list[]=thing2
    var paramNum = undefined;
    var paramName = a[0].replace(/\[\d*\]/, function(v) {
    paramNum = v.slice(1,-1);
    return '';
    });

    // set parameter value (use 'true' if empty)
    var paramValue = typeof(a[1])==='undefined' ? true : a[1];

    // if parameter name already exists
    if (obj[paramName]) {
    // convert value to array (if still string)
    if (typeof obj[paramName] === 'string') {
      obj[paramName] = [obj[paramName]];
    }
    // if no array index number specified...
    if (typeof paramNum === 'undefined') {
      // put the value on the end of the array
      obj[paramName].push(paramValue);
    }
    // if array index number specified...
    else {
      // put the value at that index number
      obj[paramName][paramNum] = paramValue;
    }
    }
    // if param name doesn't exist yet, set it
    else {
    obj[paramName] = paramValue;
    }
  }
  }

  return obj;
}

function retrieveTagByID(tag){
  /**
   * Retrieve a tag by its ID.
   */
  tags.retrieveTag(tag);
}

function retrieveNeuronByID(key_type,key,session) {
  /*
   * Hook into the Information panel to retieve individual neuron information from NA.
  */

  msg = {}
  msg['username'] = username;
  msg['servers'] = {}
  msg['data_callback_uri'] = 'ffbo.ui.receive_partial'

  var na_servers = document.getElementById("na_servers");

  try {
  msg['servers']['na'] = na_servers.options[na_servers.selectedIndex].value;
  } catch (err) {
  console.log("na server not valid")
  UI.Notify("Unable to contact Neuroarch server" ,null,null,'danger')

  return;
  }
  msg['task'] = {}
  msg['task']['key_type'] = key_type;
  msg['task']['key'] = key;

  session.call('ffbo.processor.request_by_id', [msg], {}, {
  receive_progress: true
  }).then(
  function(res) {
    if(typeof res == 'object'){
    if ('error' in res) {
      Notify(res['error']['message'],null,null,'danger')
      $("body").trigger('demoproceed', ['error']);
      return;
    } else if('success' in res) {
      if('info' in res['success'])
      Notify(res['success']['info']);
      if('data' in res['success']){
      data = {'ffbo_json': res['success']['data'],
        'type': 'morphology_json'};
      processFFBOjson(data)
      }
    }
    }
    //console.log(res)
    $("#search-wrapper").unblock();
    $("body").trigger('demoproceed', ['success']);
  },
  function(err) {
    console.log(err)
    Notify(err,null,null,'danger');
    $("body").trigger('demoproceed', ['error']);
    $("#search-wrapper").unblock();
  },
  function(progress) {
    data = {'ffbo_json': progress,'type': 'morphology_json'};
    processFFBOjson(data);
  }
  );
}

function retrieveByID(key_type,key,session){
  /** 
   * Retrieve tags or neuron information from NA, depending in the key_type chosen.
  */
  var valid_key_types = {'na':true,'vfb':true,'tag':true};

  if (key_type in valid_key_types){

  if (key_type=='tag'){
    retrieveTagByID(key)
  } else {
    retrieveNeuronByID(key_type,key,session)
  }
  }else{
  ui.Notify("Invalid key type " + key_type ,null,null,'danger')
  }
}





// Former connection.js

// Define a number of user-related global variables, allowing messages to be sent externally.
var client_session;
var user;
var morphology_store = {};
var username;

var local_url = "wss://neuronlp.fruitflybrain.org:9050/ws";
var server_url = "ws://127.0.0.1:8080/ws";


var wsuri;
if (document.location.origin == "file://") {
  wsuri = server_url;
} else {
  wsuri = local_url;
}

var connection;
var login_success = false;

var direct_access = false;

var params =  getAllUrlParams();
keys = Object.keys(params);
if (keys.length >0) {
    direct_access = true;
}


function startConnection(authid, key){
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
    var feedback = document.getElementById("auth_feedback");
    feedback.innerHTML = "Welcome " + username + "!";
    feedback.style.color = "green";
    if (login_succ == false) {
      if (!direct_access) {
      } else {
        $.unblockUI();
        //$("#welcomepage").hide();
      }
    }
    login_succ = true;

    // Start registering procedures for remote calls.

    function receivePartialDatabase(args) {
      /**
       * Receive a section of the morphology database
       */
      data = { ffbo_json: args[0], type: "morphology_json" };
      if (!$.isEmptyObject(metadata)) {
        for (var key in data["ffbo_json"]) {
          if (key in metadata["color"]) {
            var color = metadata["color"][key];
            data["ffbo_json"][key]["color"] = new THREE.Color(color[0], color[1], color[2]);
          }
        }
      }
      processFFBOjson(data);
      return true;
    }

    session.register("ffbo.ui.receive_partial." + session.id,receivePartialDatabase).then(
      function(reg) {},
      function(err) {
        console.log(
          "Failed to register procedure ffbo.ui.recieve_partial." +
            session.id,
          err
        );
      }
    );

    function receiveMessage(args) {
      if ("info" in args[0]) {
        if ("error" in args[0]["info"]) {
          Notify(args[0]["info"]["error"], null, null, "danger");
          $("body").trigger("demoproceed", ["error"]);
          $("#search-wrapper").unblock();
        } else if ("success" in args[0]["info"]) {
          Notify(args[0]["info"]["success"]);
        }
      }
      if ("commands" in args[0]) {
        if ("reset" in args[0]["commands"]) {
          neuList = [];
          ffbomesh.reset();
          resetNeuronButton();
          $("#neu-id").attr("name", "");
          $("#neu-id").attr("uid", "");
          $("#neu-id").text("FlyCircuit DB: ");
          $("#flycircuit-iframe").attr("src", "");
          delete args[0]["commands"]["reset"];
        }
        if ("remove" in args[0]["commands"]) {
          ids = args[0]["commands"]["remove"][0];
          for (var i = 0; i < ids.length; ++i) {
            ind = neuList.indexOf(ids[i]);
            $("#li-btn-" + uidDecode(ids[i])).remove();
            try {
              $("#btn-keep-" + uidDecode(ids[i])).remove();
            } catch (e) {}
            if (ind > -1) neuList.splice(ind, 1);
          }
        }
        for (var cmd in args[0]["commands"]) {
          try {
          } catch (err) {}
          ffbomesh.addCommand({
            commands: [cmd],
            neurons: args[0]["commands"][cmd][0],
            args: args[0]["commands"][cmd][1]
          });
        }
        try {
          if (synaptic_info && last_click) {
            if (last_click in ffbomesh.meshDict) {
              d = [ffbomesh.meshDict[last_click].name, last_click];
              fetchDetailInfo(d);
            }
          }
        } finally {
          ffbomesh.updateInfoPanel();
        }
      }
    }

    session.register("ffbo.ui.receive_msg." + session.id, receiveMessage).then(
      function(reg) {},
      function(err) {
        console.log(
          "failed to register procedure ffbo.ui.receive_msg." +
            session.id,
          err
        );
      }
    );

    // SUBSCRIBE to topics and receive events.

    function onServerUpdate(args) {
      var directory = args[0];
      populate_server_lists(directory);
    }

    session.subscribe("ffbo.server.update", onServerUpdate).then(
      function(sub) {},
      function(err) {
        console.log("failed to subscribe to server update", err);
      }
    );

    // SUBSCRIBE to dynamic UI updates from the processor:

    function onUIUpdate(args) {
      var info = args[0];
      Notify(info, null, null, "danger");
    }

    session.subscribe("ffbo.ui.update." + session.id, onUIUpdate).then(
      function(sub) {},
      function(err) {
        console.log("failed to subscribe to ui update", err);
      }
    );

    session.call("ffbo.processor.server_information").then(function(res) {
        populate_server_lists(res);
        params = getAllUrlParams();
        keys = Object.keys(params);
        if ("mode" in params && params.mode == "3d") {
          if (!ffbomesh.neurons_3d) $("#3d_rendering")[0].click();
        }
        if ("bp_strength" in params) {
          val = params["bp_strength"];
          $("#bloomstrength").bootstrapSlider("setValue", val);
          ffbomesh.bloomPass.strength = val;
        }

        if ("tag" in params) {
          $("#btn-info-pin").click();
          retrieve_tag(params["tag"]);
        } else if ("na" in params) {
          retrieve_neuron_by_id("na", params["na"], session);
        } else if ("vfb" in params) {
          retrieve_neuron_by_id("vfb", params["vfb"], session);
        }
      }, function(err) {
        console.log("server retrieval error:", err);
      });
  };

  // fired when connection was lost (or could not be established)
  //
  connection.onclose = function(reason, details) {
    console.log("Connection lost: " + reason);
    if (login_succ == false) {
      var feedback = document.getElementById("auth_feedback");
      feedback.innerHTML = "Incorrect username or password...";
      feedback.style.color = "red";
    }
  };

  // Finally, open the connection
  connection.open();
}

// auth.js functions

function createLoginContainer() {
  if (client.direct_access) {
    $.unblockUI();
    $("#welcomepage").hide();
    startGuestConnection();
  } else {
    $.blockUI({
      message: $("#login-container"),
      css: {
        "border-radius": "10px",
        background: "rgba(255,255,255,0.7)",
        "min-width": "300px",
        left: 0,
        right: 0,
        margin: "0 auto"
      }
    });
  }
}

var user;
var loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', function(event) {
    // get user
    user = document.getElementById('txt_user').value;
    // get password
    var password = document.getElementById('txt_password').value;
    // get feedback element
    var feedback = document.getElementById('auth_feedback');

    start_connection(user, password);
});

function startGuestConnection(){
    startConnection("guest", "guestpass");
}

var pwInput = document.getElementById('txt_password');
pwInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13)
        loginhBtn.click();
});



module.exports = {
  client_session: client_session,
  connection: connection,
  login_success: login_success,
  params: params,
  keys: keys,
  retrieveByID: retrieveByID,
  startConnection: startConnection,
  loginBtn: loginBtn,
  pwInput: pwInput,
  user: user,
  startGuestConnection: startGuestConnection,
  createLoginContainer: createLoginContainer,
};