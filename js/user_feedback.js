var options = [
    {value: '#', text: 'Choose one'},
    {value: 1, text: 'NLP returned wrong result'},
    {value: 2, text: 'Neuroarch returned wrong result'},
    {value: 3, text: 'Visualisation is not as expected'},
    {value: 4, text: 'No results have been shown'},
    {value: 5, text: 'Feedback is not correct'},

];


function showResult(result) {
    if (typeof result !== "undefined" && result !== null) {
        alert(result);
    }
}

function feedback_dialog(){
    bootbox.prompt({
        title: "User Feedback",
        inputType: "textarea",
        callback: function(result) {
            if (typeof result !== "undefined" && result !== null) {
                client_session.call('ffbo.server.log_feedback',[user,result]);
                Notify('Your feeback has been recorded. Thank you, ' + user + '!');
            }
        }
    });
}

jQuery("#leave-feedback").on("click", function() {
   feedback_dialog();
});
