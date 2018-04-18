clientSession = new ClientSession();
clientSession.startConnection("guest", "guestPass", "wss://neuronlp.fruitflybrain.org:8888/ws")

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
  console.log("Data")
}

function testNLPquery(query){
  query = clientSession.translateNLPquery(query);
  clientSession.executeNAquery(query, {success: dataCallback})
}

function testConnectivity(){
  query = clientSession.connectivityQuery();
  clientSession.executeNAquery(query, {success: dataCallback})
}

function testAddByUname(uname){
  query = clientSession.addByUnameQuery(uname);
  clientSession.executeNAquery(query, {success: dataCallback})
}

function testNeuronInfo(rid){
  query = clientSession.neuronInfoQuery(rid);
  clientSession.executeNAquery(query, {success: dataCallback})
}
function testRetrieveTag(tag){
  query = clientSession.retrieveTagQuery(tag);
  clientSession.executeNAquery(query, {success: dataCallback})
}
