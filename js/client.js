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

moduleExporter("FFBOClient", ["autobahn", "propertymanager"], function(autobahn, PropertyManager){
  // NA server crossbar id
  naServerID = undefined;
  // NLP server crossbar id
  nlpServerID = undefined;
  // EP server crossbar id
  epServerID = undefined;
  // nk server crossbar id
  nkServerID = undefined;

  autobahn = autobahn || window.autobahn;
  PropertyManager = PropertyManager || window.PropertyManager;

  onSuccessCallback = function(result, queryID, callback){
    if( !(typeof result == "object") || (result==undefined) ) {
      if( queryID != undefined) this.status[queryID] = -1; //Error
      return;
    }
    try{
      if('info' in result && 'error' in result.info){
        this.notifyError(result['info']['error'])
        if( queryID != undefined) this.status[queryID] = -1; //Error
        return;
      }
      if('info' in result && 'success' in result.info)
        this.notifySuccess(result['info']['success']);
    }
    catch(err){
    }
    if( queryID != undefined) this.status[queryID] = 1; //Success

    if( typeof result == 'object' && result!= undefined  && 'data' in result )
      if( callback != undefined) callback(result.data);
  }

  onProgressCallback = function(progress, queryID, callback){
    if( callback != undefined)
      callback(progress);
  }

  onErrorCallback = function(err, queryID, callback){
    if( queryID != undefined) this.status[queryID] = -1; //Error
    if( callback != undefined)
      callback(err);
    this.notifyError(err.args[0]);
  }

  updateServers = function(serverInfo){
    /** Update the Crossbar Session IDs of servers
     *  If current server drops, switched to a new server if available
     */
    if(serverInfo.hasOwnProperty(0))
      serverInfo = serverInfo[0];
    if( typeof(serverInfo)=="object" && 'na' in serverInfo ){
      if( naServerID != undefined && !(naServerID in serverInfo.na ))
        naServerID = undefined
      if( naServerID == undefined && Object.keys(serverInfo.na).length )
        naServerID = Object.keys(serverInfo.na)[0]
    }
    if( typeof(serverInfo)=="object" && 'nlp' in serverInfo ){
      if( nlpServerID != undefined && !(nlpServerID in serverInfo.nlp ))
        nlpServerID = undefined
      if( nlpServerID == undefined && Object.keys(serverInfo.nlp).length )
        nlpServerID = Object.keys(serverInfo.nlp)[0]
    }
    if( typeof(serverInfo)=="object" && 'nk' in serverInfo ){
      if( nkServerID != undefined && !(nkServerID in serverInfo.nk ))
        nkServerID = undefined
      if( nkServerID == undefined && Object.keys(serverInfo.nk).length )
        nkServerID = Object.keys(serverInfo.nk)[0]
    }
    if( typeof(serverInfo)=="object" && 'ep' in serverInfo ){
      if( epServerID != undefined && !(epServerID in serverInfo.ep ))
        epServerID = undefined
      if( epServerID == undefined && Object.keys(serverInfo.ep).length )
        epServerID = Object.keys(serverInfo.ep)[0]
    }
  }

  guidGenerator = function() {
    var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }


  function FFBOClient() {
    /**
     * This is the FFBOClient object that holds client session
     */

    // Autobahn Session
    this.session = undefined;
    this.loginStatus = new PropertyManager(
       {
         username: "",
         connected: false,
         sessionID: undefined,
       });

    // Threshold for chunking data
    this.threshold = 20;
    // Language for NLP queries
    this.language = "en";

    this.status = new PropertyManager();
    this._callbacks = {};
    this.dataThroughRPCcall = true;
  }

  // Should be overloaded by application
  FFBOClient.prototype.receiveCommand = function(message){}

  // Should be overloaded by application
  FFBOClient.prototype.notifySuccess = function(message){}

  // Should be overloaded by application
  FFBOClient.prototype.notifyError = function(message){}



  FFBOClient.prototype.executeNLPquery = function (query, callbacks, format) {
    /**
     * Sends natrual language query to NLP Server.
     * If successfully interpreted by NLP modele,
     * sends NA query to NA server.
     */
    if( nlpServerID === undefined ){
      this.notifyError( "NLP Server not available" );
      return null;
    }
    uri = 'ffbo.nlp.query.' + nlpServerID;
    queryID = guidGenerator()
    this.status[queryID] = 0;
    this.session.call(uri , [query, this.language] ).then(
       (function(res){
         if( typeof(res) == "object" && Object.keys(res).length ){
           this.notifySuccess("NLP module successfully interpreted the query");
           this.executeNAquery(res, callbacks, format, queryID);
         }
         else{
           this.notifyError("NLP module did not understand the query");
           this.status[queryID] = -1;
         }

       }).bind(this),
       function(err){
         this.notifyError(err);
         this.status[queryID] = -1;
       }
    );
    return queryID;
  }

  FFBOClient.prototype.executeNAquery = function (msg, callbacks, format, queryID){
    /**
     * Sends a standard command to NA; allows for custom callbacks and calls.
     * msg should be an object with query field mandatory. The query should
     * be represented in NeuroArch JSON format. Optional fields include
     * format, threshold, temp, verb
     */
    if( naServerID === undefined ){
      this.notifyError( "Neuroarch Server not available" );
      return null;
    }
    uri = (msg.uri || "ffbo.na.query") + "." + naServerID;
    callbacks = callbacks || {};
    queryID = queryID || guidGenerator();
    this._callbacks[queryID] = callbacks;
    msg.queryID = queryID;
    if(this.dataThroughRPCcall)
      msg.data_callback_uri = 'ffbo.ui.receive_data';
    if( !('threshold' in msg) ) msg.threshold = this.threshold
    if( format != undefined ) {msg.format = format}
    if( 'progress' in callbacks ){
      this.session.call(uri, [msg], {}, {receive_progress: true}).then(
         (function(result){
           onSuccessCallback.bind(this)(result, queryID, callbacks.success);
         }).bind(this),
         (function(err){
           onErrorCallback.bind(this)(err, queryID, callbacks.error);
         }).bind(this),
         (function(progress){
           onProgressCallback.bind(this)(progress, queryID, callbacks.progress);
         }).bind(this));
    }
    else{
      // Forcing Progressive Results for Morphology Data
      if (format == undefined || format == 'morphology'){
        this.session.call(uri, [msg], {}, {receive_progress: true}).then(
           (function(result){
             onSuccessCallback.bind(this)(result, queryID, callbacks.success);
           }).bind(this),
           (function(err){
             onErrorCallback.bind(this)(err, queryID, callbacks.error);
           }).bind(this),
           (function(progress){
             onProgressCallback.bind(this)(progress, queryID, callbacks.success);
           }).bind(this));
      }
      else{
        this.session.call(uri, [msg], {}).then(
           (function(result){
             onSuccessCallback.bind(this)(result, queryID, callbacks.success);
           }).bind(this),
           (function(err){
             onErrorCallback.bind(this)(err, queryID, callbacks.error);
           }).bind(this));
      }
    }
    this.status[queryID] = 0;   // In Progress
    this.status.on("change", (function(e){
      setTimeout((function(){
        delete this.status[e['prop']];
        delete this._callbacks[e['prop']];
      }).bind(this), 10000);}).bind(this), queryID);

    return queryID;
  }

  /* Helper functions to generate commonly used NA queries */

  FFBOClient.prototype.getConnectivity = function(callbacks, format){
    /**
     * Query to retrieve Connectivity Data
     */
    return this.executeNAquery({
      format: "nx",
      query: [
        {
          action: { method: { add_connecting_synapses: {} } },
          object: { state: 0 }
        }
      ],
      temp: true
    }, callbacks, format);
    // Setting 'temp': true won't append results to the state memory, keeping front end interactions independent of this query
    // Passing keyword args to a method would be done something like this 'add_connecting_synapses': {'include_inferred': false}
    // Memory can be used to refer to intermediate results. For example, the following is the translation of show neurons in eb
    // msg['query'] = [{'action': {'method': {'query': {}}}, 'object': {'class': 'Neuropil'}},   // ALL neuropils
    //{'action': {'method': {'has': {'name': 'EB'}}}, 'object': {'memory': 0}},// ALL neuropils => has name eb
    //  {'action': {'method': {'traverse_owns': {'cls': 'Neuron'}}}, 'object': {'memory': 0}}] // eb => traverse for neurons
  }


  FFBOClient.prototype.addByUname = function(uname, callbacks, format){
    /**
     * Query to add a neuron/synapse by its name.
     */
    return this.executeNAquery({
      verb: "add",
      query: [
        {
          action: { method: { query: { uname: uname } } },
          object: { class: ["Neuron", "Synapse"] }
        }
      ]
    }, callbacks, format);
  }

  FFBOClient.prototype.addByRid = function(rid, callbacks, format){
    /**
     * Query to add a neuron/synapse by its name.
     */
    return this.executeNAquery({
      verb: "add",
      query: [
        {
          action: { method: { query: { rid: rid } } },
          object: { rid: rid }
        }
      ]
    }, callbacks, format);
  }

  FFBOClient.prototype.addNeuronByUname = function(uname, callbacks, format){
    /**
     * Query to add a neuron by its name.
     */
    return this.executeNAquery({
      verb: "add",
      query: [
        {
          action: { method: { query: { uname: uname } } },
          object: { class: ["Neuron"] }
        }
      ]
    }, callbacks, format);
  }

  FFBOClient.prototype.addSynapseByUname = function(uname, callbacks, format){
    /**
     * Query to add a synapse by its name.
     */
    return this.executeNAquery({
      verb: "add",
      query: [
        {
          action: { method: { query: { uname: uname } } },
          object: { class: ["Synapse"] }
        }
      ]
    }, callbacks, format);
  }


  FFBOClient.prototype.removeByUname = function(uname, callbacks, format){
    /**
     * Query to remove a neuron or synapse by its uname.
     */
    return this.executeNAquery({
      verb: "remove",
      query: [
        {
          action: { method: { query: { uname: uname } } },
          object: { class: ["Neuron", "Synapse"] }
        }
      ]
    }, callbacks, format);
  }

  FFBOClient.prototype.removeByRid = function(rid, callbacks, format){
    /**
     * Query to remove a neuron/synapse by its rid.
     */
    return this.executeNAquery({
      verb: "remove",
      query: [
        {
          action: { method: { query: { rid: rid } } },
          object: { rid: rid }
        }
      ]
    }, callbacks, format);
  }

  FFBOClient.prototype.removeNeuronByUname = function(uname, callbacks, format){
    /**
     * Query to remove a neuron by its uname.
     */
    return this.executeNAquery({
      verb: "remove",
      query: [
        {
          action: { method: { query: { uname: uname } } },
          object: { class: ["Neuron"] }
        }
      ]
    }, callbacks, format);
  }

  FFBOClient.prototype.removeSynapseByUname = function(uname, callbacks, format){
    /**
     * Query to remove a synapse by its uname.
     */
    return this.executeNAquery({
      verb: "remove",
      query: [
        {
          action: { method: { query: { uname: uname } } },
          object: { class: ["Synapse"] }
        }
      ]
    }, callbacks, format);
  }

  FFBOClient.prototype.retrieveNeuron = function(key, value, callbacks, format) {
    /**
     *Query to retrieve a single neuron based on a key-value pair (key could be rid or vfb_id or uname)
     */
    if (! ['vfb_id', 'rid', 'uname'].includes(key) ) return null;
    return this.executeNAquery({
      query: [
        {
          action: { method: { query: { key: value } } },
          object: { class: "Neuron" }
        }
      ]
    }, callbacks, format);
  }


  FFBOClient.prototype.createTag = function(tag_name, metadata){
    return this.executeNAquery({
      tag: tag_name,
      metadata: metadata,
      uri: 'ffbo.na.create_tag'
    });
  }

  FFBOClient.prototype.retrieveTag = function(tag_name, callbacks, format){
    return this.executeNAquery({
      tag: tag_name,
      uri: 'ffbo.na.retrieve_tag'
    }, callbacks, format);
  }

  FFBOClient.prototype.getInfo = function(rid, callbacks, format){
    return this.executeNAquery({
      id: rid,
      uri: 'ffbo.na.get_data'
    }, callbacks, format);
  }

  FFBOClient.prototype.removeObjs = function(rids, callbacks, format){
    /**
     * Query to remove a list of Objs based on their Rids. rids must be an array
     */
    return this.executeNAquery({
      verb: "remove",
      query: [
        {
          action: { method: { has: { rid: rids } } },
          object: { state: 0 }
        }
      ]
    }, callbacks, format);
  }

  FFBOClient.prototype.keepObjs = function(rids, callbacks, format){
    /**
     * Query to keep a list of Objs based on their Rids. rids must be an array
     */
    return this.executeNAquery({
      verb: "keep",
      query: [
        {
          action: { method: { has: { rid: rids } } },
          object: { state: 0 }
        }
      ]
    }, callbacks, format);
  }

  FFBOClient.prototype.retrieveState = function(callbacks, format){
    /**
     * Query to keep a list of Objs based on their Rids. rids must be an array
     */
    return this.executeNAquery({
      command:{
        retrieve:{
          state: 0
        }
      }
    }, callbacks, format);
  }

  FFBOClient.prototype.startConnection = function(authid, key, url) {
    function onchallenge(session, method, extra) {
      if (method === "wampcra") {
        salted_key = autobahn.auth_cra.derive_key(
           key,
           extra.salt,
           extra.iterations,
           extra.keylen
        );
        if (key == "guestpass" && authid == "guest") {
          salted_key = "Y/w6jYBIOLM48hEKn9zRLx9gZCYwwrFW7K/ELtWzVT8=";
        }
        return autobahn.auth_cra.sign(salted_key, extra.challenge);
      }
    }
    connection = new autobahn.Connection({
      url: url,
      realm: "realm1",
      authmethods: ["wampcra"],
      authid: authid,
      onchallenge: onchallenge
    });

    connection.onopen = (function(session, details) {
      // Start registering procedures for remote calls.

      session.register("ffbo.ui.receive_cmd." + session.id, ( function (args) {
        this.receiveCommand(args[0]);
      } ).bind(this)).then(
         function(reg) {},
         function(err) {
           console.log("failed to register procedure ffbo.ui.receive_cmd." + session.id, err);
         }
      );

      session.register("ffbo.ui.receive_data." + session.id,  (args) => {
        onProgressCallback(args[0].data, args[0].queryID,
                           this._callbacks[args[0].queryID].progress ||
                           this._callbacks[args[0].queryID].success);
      }).then(
         function(reg) {},
         function(err) {
           console.log("failed to register procedure ffbo.ui.receive_cmd." + session.id, err);
         }
      );

      session.register("ffbo.ui.receive_msg." + session.id, ( function (args) {
        onSuccessCallback.bind(this)(args[0], null, function(){});
      } ).bind(this)).then(
         function(reg) {},
         function(err) {
           console.log("failed to register procedure ffbo.ui.receive_msg." + session.id, err);
         }
      );

      session.subscribe("ffbo.server.update", updateServers).then(
         function(sub) {},
         function(err) {
           console.log("failed to subscribe to server update", err);
         }
      );

      session.call("ffbo.processor.server_information").then(
         ( function(res){
           updateServers([res]);
         } ).bind(this),
         function(err) {
           console.log("server retrieval error:", err);
         }
      );

      this.session = session
      setTimeout(() => {this.loginStatus.connected = true;}, 500);
      console.log("connected to FFBO");
      this.loginStatus.sessionID = session.id;
      this.loginStatus.username = details.authid;
    }).bind(this);


    // fired when connection was lost (or could not be established)
    //
    connection.onclose = (function(reason, details) {
      console.log("Connection lost: " + reason);
      this.loginStatus.connected = false;
      this.loginStatus.sessionID = undefined;
      this.loginStatus.username = undefined;
      naServerID = undefined;
      nkServerID = undefined;
      nlpServerID = undefined;
      epServerID = undefined;
    }).bind(this);

    // Finally, open the connection
    connection.open();
  }
  return FFBOClient;
});
