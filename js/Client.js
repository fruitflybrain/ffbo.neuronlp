define(["autobahn", "PropertyManager"], function(autobahn, PropertyManager){
  function ClientSession() {
    /**
     * This is the ClientSession object that holds client session
     */

    // Autobahn Session
    this.session = undefined;
    this.loginStatus = new PropertyManager(
       {
	 username: "",
	 connected: false,
	 sessionID: undefined,
       });


    // NA server crossbar id
    this.naServerID = undefined;
    // NLP server crossbar id
    this.nlpServerID = undefined;
    // EP server crossbar id
    this.epServerID = undefined;
    // nk server crossbar id
    this.nkServerID = undefined;

    // Threshold for chunking data
    this.threshold = 20;
    // Language for NLP queries
    this.language = "en";

    this.status = new PropertyManager();
  }

  // Should be overloaded by application
  ClientSession.prototype.receiveCommand = function(message){}

  // Should be overloaded by application
  ClientSession.prototype.notifySuccess = function(message){}

  // Should be overloaded by application
  ClientSession.prototype.notifyError = function(message){}

  ClientSession.prototype.onSuccessCallback(result, queryID, callback){
    if(typeof result == object && 'info' in result && 'success' in result.info){
      this.NotifySuccess(result['info']['success']);
      if( queryID !== undefined) this.status[queryID] = 1; //Success
    }
    if(typeof result == object && 'info' in result && 'error' in result.info){
      this.NotifyError(result['info']['success'])
      if( queryID !== undefined) this.status[queryID] = -1; //Error
    }
    if( 'data' in result ) callback(result.data);
  }

  ClientSession.prototype.onProgressCallback(progress, queryID, callback){
    callback(progress);
  }

  ClientSession.prototype.onErrorCallback(err, queryID, callback){
    this.NotifyError(err);
    if( queryID !== undefined) this.status[queryID] = -1; //Error
    callback(err);
  }

  ClientSession.prototype.guidGenerator = function() {
    var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  ClientSession.prototype.updateServers = function(serverInfo){
    /** Update the Crossbar Session IDs of servers
     *  If current server drops, switched to a new server if available
     */
    try{
      serverInfo = serverInfo[0];
    }
    catch(err){
    }
    if( typeof serverInfo==object && 'na' in serverInfo ){
      if( this.naServerID !== undefined && !(this.naServerID in serverInfo.na ))
	this.naServerID == undefined
      if( this.naServerID == undefined && Object.keys(serverInfo.na).length )
	this.naServerID = Object.keys(serverInfo.na)[0]
    }
    if( typeof serverInfo==object && 'nlp' in serverInfo ){
      if( this.nlpServerID !== undefined && !(this.nlpServerID in serverInfo.nlp ))
	this.nlpServerID == undefined
      if( this.nlpServerID == undefined && Object.keys(serverInfo.nlp).length )
	this.nlpServerID = Object.keys(serverInfo.nlp)[0]
    }
    if( typeof serverInfo==object && 'ep' in serverInfo ){
      if( this.nkServerID !== undefined && !(this.nkServerID in serverInfo.nk ))
	this.nkServerID == undefined
      if( this.nkServerID == undefined && Object.keys(serverInfo.nk).length )
	this.nkServerID = Object.keys(serverInfo.nk)[0]
    }
    if( typeof serverInfo==object && 'nk' in serverInfo ){
      if( this.epServerID !== undefined && !(this.epServerID in serverInfo.ep ))
	this.epServerID == undefined
      if( this.epServerID == undefined && Object.keys(serverInfo.ep).length )
	this.epServerID = Object.keys(serverInfo.ep)[0]
    }
  }

  ClientSession.prototype.translateNLPquery = function (query) {
    /**
     * Sends natrual language query to NLP Server.
     * If successfully interpreted by NLP modele,
     * sends NA query to NA server.
     */
    if( this.nlpServerID === undefined ){
      this.NotifyError( "NLP Server not available" );
      return null;
    }
    this.session.call( call, [nlp_query, this.language] ).then(
       function(res){
	 if( typeof(res) == Object && Object.keys(res).length ){
	   return res;
	 }
	 else{
	   this.NotifyError("NLP module did not understand the query");
	   return null;
	 }

       },
       function(err){
	 this.NotifyError(err);
       }
    );
  }

  ClientSession.prototype.executeNAquery = function (query, callbacks, format){
    /**
     * Sends a standard command to NA; allows for custom callbacks and calls.
     */
    if( this.naServerID === undefined ){
      this.NotifyError( "Neuroarch Server not available" );
      return null;
    }
    queryID = this.guidGenerator();
    uri = (query.uri || "ffbo.na.query") + "." + this.naServerID;
    callbacks = callbacks || {success: function(data){},
			      error: function(data){}};;
    msg = {
      query: query,
      threshold: this.threshold,
      queryID: queryID
    }
    if( format !== undefined ) msg.format = format
    if( progress in callbacks ){
      this.session.call(call, [msg], {receive_progress: true}).then(
	 (function(result){
	   this.onSuccessCallback(result, queryID, callback.success);
	 }).bind(this),
	 (function(err){
	   this.onErrorCallback(result, queryID, callback.error);
	 }).bind(this),
	 (function(progress){
	   this.onProgressCallback(result, queryID, callback.progress);
	 }).bind(this));
    }
    else{
      // Forcing Progressive Results
      this.session.call(call, [msg], {receive_progress: true}).then(
	 (function(result){
	   this.onSuccessCallback(result, queryID, callback.success);
	 }).bind(this),
	 (function(err){
	   this.onErrorCallback(result, queryID, callback.error);
	 }).bind(this),
	 (function(progress){
	   this.onProgressCallback(result, queryID, callback.success);
	 }).bind(this));
    }
    this.status[queryID] = 0;   // In Progress
    this.status.on("change", function(e){ setTimeout(10000, (function(){
      delete this.status[queryID];
    }).bind(this));}, queryID);
    return queryID;
  }

  /* Helper functions to generate commonly used NA queries */

  ClientSession.prototype.connectivityQuery(){
    /**
     * Query to retrieve Connectivity Data
     */
    return {
      format: "nx",
      query: [
	{
          action: { method: { add_connecting_synapses: {} } },
          object: { state: 0 }
	}
      ],
      temp: true
    }
    // Setting 'temp': true won't append results to the state memory, keeping front end interactions independent of this query
    // Passing keyword args to a method would be done something like this 'add_connecting_synapses': {'include_inferred': false}
    // Memory can be used to refer to intermediate results. For example, the following is the translation of show neurons in eb
    // msg['query'] = [{'action': {'method': {'query': {}}}, 'object': {'class': 'Neuropil'}},   // ALL neuropils
    //{'action': {'method': {'has': {'name': 'EB'}}}, 'object': {'memory': 0}},// ALL neuropils => has name eb
    //  {'action': {'method': {'traverse_owns': {'cls': 'Neuron'}}}, 'object': {'memory': 0}}] // eb => traverse for neurons
  }


  ClientSession.prototype.addByUnameQuery(uname) {
    /**
     * Query to add a neuron by its name.
     */
    return {
      format: "morphology",
      verb: "add",
      query: [
	{
          action: { method: { query: { uname: uname } } },
          object: { class: "Neuron" }
	}
      ]
    };
  }

  ClientSession.prototype.removeByUnameQuery(uname) {
    /**
     * Query to remove a neuron by its name.
     */
    return {
      format: "morphology",
      verb: "remove",
      query: [
        {
          action: { method: { query: { uname: uname } } },
          object: { class: "Neuron" }
        }
      ]
    };
  }

  ClientSession.prototype.addSynapseByUnameQuery(uname) {
    /**
     * Query to add a Synapse by its name.
     */
    return {
      format: "morphology",
      verb: "add",
      query: [
	{
          action: { method: { query: { uname: uname } } },
          object: { class: "Synapse" }
	}
      ]
    };
  }

  ClientSession.prototype.removeSynapseByUnameQuery(uname) {
    /**
     * Query to remove a Synapse by its name.
     */
    return {
      format: "morphology",
      verb: "remove",
      query: [
	{
          action: { method: { query: { uname: uname } } },
          object: { class: "Synapse" }
	}
      ]
    };
  }

  ClientSession.prototype.retrieveNeuronQuery = function(key, value, session) {
    /**
     *Query to retrieve a single neuron based on a key-value pair (key could be rid or vfb_id or uname)
     */
    if (! ['vfb_id', 'rid', 'uname'].includes(key) ) return null;
    return {
      format: "morphology",
      query: [
	{
          action: { method: { query: { key: value } } },
          object: { class: "Neuron" }
	}
      ]
    };
  }


  ClientSession.prototype.createTagQuery = function(tag_name, metadata, settings, keywords, decription){
    msg = {
      tag: tag_name,
      metadata: metadata,
      uri: 'ffbo.na.create_tag'
    }
    if( settings !== undefined) msg['settings'] = settings;
    if( keywords !== undefined) msg['keywords'] = settings;
    if( description !== undefined) msg['description'] = settings;
    return msg
  }

  ClientSession.prototype.retrieveTagQuery = function(tag_name){
    return {
      tag: tag_name,
      uri: 'ffbo.na.retrieve_tag'
    }
  }

  ClientSession.prototype.neuronInfoQuery = function(rid){
    return {
      id: rid,
      uri: 'ffbo.na.get_data'
    }
  }

  ClientSession.prototype.synapseInfoQuery = function(rid){
    return {
      id: rid,
      uri: 'ffbo.na.get_syn_data'
    }
  }


  ClientSession.prototype.startConnection = function(authid, key, url) {
    function onchallenge(session, method, extra) {
      if (method === "wampcra") {
	salted_key = autobahn.auth_cra.derive_key(
           key,
           extra.salt,
           extra.iterations,
           extra.keylen
	);
	if (key == "guestpass" && authid == "guest") {
          salted_key = "C5/c598Gme4oALjmdhVC2H25OQPK0M2/tu8yrHpyghA=";
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

      session.register("ffbo.ui.receive_cmd." + session.id,     ( function (args) {
	this.receiveCommand(args);
      } ).bind(this);).then(
	 function(reg) {},
	 function(err) {
           console.log("failed to register procedure ffbo.ui.receive_cmd." + session.id, err);
	 }
      );

      session.register("ffbo.ui.receive_msg." + session.id,     ( function (args) {
	this.onSuccessCallback(args[0], null, function(){});
      } ).bind(this);).then(
	 function(reg) {},
	 function(err) {
           console.log("failed to register procedure ffbo.ui.receive_msg." + session.id, err);
	 }
      );

      session.subscribe("ffbo.server.update", this.updateServers).then(
	 function(sub) {},
	 function(err) {
           console.log("failed to subscribe to server update", err);
	 }
      );

      session.call("ffbo.processor.server_information").then(
	 ( function(res){
	   this.updateServers([res]);
	 } ).bind(this),
      },
      function(err) {
        console.log("server retrieval error:", err);
      }

      this.session = session
      this.loginStatus.connected = true;
      this.loginStatus.sessionID = session.id;
      this.loginStatus.username = details.authid;
    }).bind(this);


    // fired when connection was lost (or could not be established)
    //
    connection.onclose = function(reason, details) {
      console.log("Connection lost: " + reason);
      this.loginStatus.connected = false;
      this.loginStatus.sessionID = undefined;
      this.loginStatus.username = undefined;
      this.naServerID = undefined;
      this.nkServerID = undefined;
      this.nlpServerID = undefined;
      this.epServerID = undefined;

    };

    // Finally, open the connection
    connection.open();
  }

  return ClientSession;
}
