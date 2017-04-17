/*
cordova plugin add cordova-plugin-app-preferences
*/
var prefs;
$(document).on('deviceready', function() {
    prefs = plugins.appPreferences;
    console.log("loaded prefs");
});


function prefail(error) {
    alert(error);
}

function preok(value) {
    alert(value);
}
