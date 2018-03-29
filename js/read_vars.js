/**
 * getAllUrlParams( @url );
 * url: https://www.sitepoint.com/get-url-parameters-with-javascript/
 */

function getAllUrlParams(url) {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};

    if (queryString) {
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');

        for (var i=0; i<arr.length; i++) {
            var a = arr[i].split('=');
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function(v) {
                    paramNum = v.slice(1,-1);
                    return '';
            });

            var paramValue = typeof(a[1])==='undefined' ? true : a[1];
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            if (obj[paramName]) {
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                if (typeof paramNum === 'undefined') {
                    obj[paramName].push(paramValue);
                } else {
                    obj[paramName][paramNum] = paramValue;
                }
            }
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}

function retrieve_tag_by_id(tag){
    retrieve_tag(tag)
}

function retrieve_by_id(key_type,key,session){
    var valid_key_types = {'na':true,'vfb':true,'tag':true};

    if (key_type in valid_key_types) {
        if (key_type=='tag')
            retrieve_tag_by_id(key);
        else
            retrieve_neuron_by_id(key_type, key, session);
    } else
        Notify("Invalid key type " + key_type ,null,null,'danger')
}


function retrieve_neuron_by_id(key_type,key,session) {
    /*
     * Hook into Information panel to retieve individual neuron information from NA
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
        Notify("Unable to contact Neuroarch server" ,null,null,'danger')

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
