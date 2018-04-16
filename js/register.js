// Imports
var autobahn = require("./autobahn.js");

// Global variable register_session
var register_session;

var wsuri;
if (document.location.origin == "file://") {
  wsuri = "ws://127.0.0.1:8080/ws";
} else {
  wsuri =
    (document.location.protocol === "http:" ? "ws:" : "wss:") +
    "//" +
    document.location.host +
    ":443/ws";
}

var register_connection = new autobahn.Connection({
  url: wsuri,
  realm: "realm1"
});

register_connection.onopen = function(session, details) {
  console.log("Connected to FFBO authentication server");
  register_session = session;
};

// Notify the console when connection is lost or could not be established.
register_connection.onclose = function(reason, details) {
  console.log("Connection lost: " + reason);
  var feedback = document.getElementById("auth_feedback");
  feedback.innerHTML = "Could not complete request. Please try again later";
  feedback.style.color = "red";
};

register_connection.open();

function userExists(username) {
  register_session.call("ffbo.server_auth.user_exists", username).then(
    function(res) {
      console.log("user_exists: " + res.toString());
    },
    function(err) {
      console.log("Could not check whether username exists");
    }
  );
}

function registerUser() {
  console.log("in register");
  // get user
  var username = document.getElementById("txt_user");
  var feedback = document.getElementById("auth_feedback");

  register_session.call("ffbo.auth_server.user_exists", [username.value]).then(
    function(res) {
      console.log(res);
      if (res) {
        feedback.innerHTML =
          "Username already exists.<br>Please select another username";
        feedback.style.color = "red";
        username.value = "";
      } else {
        user_details = {
          username: username.value,
          fname: document.getElementById("txt_fname").value,
          lname: document.getElementById("txt_lname").value,
          email: document.getElementById("txt_email").value,
          position: document.getElementById("txt_pos").value,
          affiliation: document.getElementById("txt_aff").value
        };
        register_session
          .call("ffbo.auth_server.register_user", [user_details])
          .then(
            function(res) {
              if ("success" in res) {
                bootbox.confirm(res["success"], function(result) {
                  if (result) window.location.href = "../";
                });
              } else if ("error" in res) {
                feedback.innerHTML = res["error"];
                feedback.style.color = "red";
              } else {
                feedback.innerHTML =
                  "We Apologize! An unexpected error occered.<br>Please try again later.";
                feedback.style.color = "red";
              }
            },
            function(err) {
              console.log(err);
            }
          );
      }
    },
    function(err) {
      console.log(err);
    }
  );
}

var pwInput = document.getElementById("txt_email");
pwInput.addEventListener("keyup", function(event) {
  event.preventDefault();
});

module.exports = { 
  register_session: register_session,
  userExists: userExists,
  registerUser: registerUser,
};
