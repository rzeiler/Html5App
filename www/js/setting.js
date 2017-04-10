/*
cordova plugin add cordova-plugin-app-preferences
*/
var prefs;
$(document).on('deviceready', function() {
    prefs = plugins.appPreferences;
    console.log("loaded prefs");
});
