/*$(document).ready(function() {
    if (direct_access) {
	$.unblockUI();
	$("#welcomepage").hide();

	start_guest_connection();
    }else{
	$.blockUI({
	    message: $('#login-container'),
	    css: {
		'border-radius': '10px',
		'background': 'rgba(255,255,255,0.7)',
		'min-width': '300px',
		'left': 0,
		'right': 0,
		'margin': '0 auto'
	    }
	});
    }
    });*/
start_guest_connection();


var welcome_script = [
    [1000, function() { Notify("A cursor will appear at the center of the window, and bring up the demo page!"); }],
    [3000, function() { cursor = new mouseSVG(); cursor.show(); cursor.blink()}],
    [3000, function() { cursor.moveto(".ffbo-app > li > a")} ],
    [2000, function() { $(".ffbo-app > li > a").addClass("ffbo-app-hover"); $(".ffbo-app > li > a").click()} ],
    [500,  function() { $(".ffbo-app > li > a").removeClass("ffbo-app-hover"); cursor.moveto("#btn-demo")} ],
    [1000, function() { $("#btn-demo").addClass("dropdown-li-a-hover");} ],
    [1000, function() { cursor.click();} ],
    [700,  function() { $("#btn-demo").click(); $("#btn-demo").removeClass("dropdown-li-a-hover");} ],
    [200,  function() { cursor.svg.remove(); delete cursor;} ],
];


var user;
var loginhBtn = document.getElementById('loginBtn');
loginhBtn.addEventListener('click', function(event) {
    // get user
    user = document.getElementById('txt_user').value;
    // get password
    var password = document.getElementById('txt_password').value;
    // get feedback element
    var feedback = document.getElementById('auth_feedback');

    start_connection(user, password);
});

function start_guest_connection(){
    start_connection("guest", "guestpass");
}

var pwInput = document.getElementById('txt_password');
pwInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13)
        loginhBtn.click();
});
