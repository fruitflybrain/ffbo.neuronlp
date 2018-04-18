clientSession = new ClientSession();
clientSession.startConnection("guest", "guestpass", "wss://neuronlp.fruitflybrain.org:8888/ws")

clientSession.notifySuccess = function(message){
  console.log("Success: " + message);
}

clientSession.notifyError = function(message){
  console.log("Error: " + message);
}

clientSession.receiveCommand = function(message){
  console.log("Command Received")
  console.log(message);
}

function dataCallback(data){
  console.log("Data Received");
  console.log(data)
}

clientSession.status.on("remove", function(e){
  console.log("Removed status for Query with ID: " + e.prop)
});

function logAndMonitorQuery(queryID){
  console.log("Query Fired: ID - " + queryID);
  clientSession.status.on("change", function(e){
    console.log("Query Status Changed, ID: " + e.prop + ", Value: ", e.value);
  }, queryID)
}
function testNLPquery(query){
  queryID = clientSession.executeNLPquery(query, {success: dataCallback});
  logAndMonitorQuery(queryID)
}

function testConnectivity(){
  query = clientSession.connectivityQuery();
  queryID = clientSession.executeNAquery(query, {success: dataCallback})
  logAndMonitorQuery(queryID)
}

function testAddByUname(uname){
  query = clientSession.addByUnameQuery(uname);
  queryID = clientSession.executeNAquery(query, {success: dataCallback})
  logAndMonitorQuery(queryID)
}

function testNeuronInfo(rid){
  query = clientSession.neuronInfoQuery(rid);
  queryID = clientSession.executeNAquery(query, {success: dataCallback})
  logAndMonitorQuery(queryID)
}
function testRetrieveTag(tag){
  query = clientSession.retrieveTagQuery(tag);
  queryID = clientSession.executeNAquery(query, {success: dataCallback})
  logAndMonitorQuery(queryID)
}
