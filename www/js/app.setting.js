

function ok(value) {
    alert(value);
}

function fail(error) {
    alert(error);
}
// // cordova interface
// // store key => value pair
// prefs.store(ok, fail, 'key', 'value');
// // fetch value by key (value will be delivered through "ok" callback)
// prefs.fetch(ok, fail, 'key');
// // show application preferences
// prefs.show(ok, fail);
var fileExplorer, settingHtml = "";
$(document).on('sqliteready', function() {
    $.get("template/setting/view.html", function(data) {
        settingHtml = data;
    });
    $.get("template/setting/explorer.html", function(html) {
        fileExplorer = html;
    });

});
$(document).on('click', '#open_settings', function() {
    AddNavigtionPoint('#open_settings');
    $("header .title b").text('Einstellungen');
    $('body').addClass('gray');
    $('#close_setting').removeClass('show');
    $("main").html(settingHtml);
    prefs.fetch(function(v) {
        $('#change_user').text(v);
    }, fail, 'user');
});
/* rebuild data */
$(document).on('click', '.getBackupJsonFile', function() {
    $("main").html(fileExplorer);
    $('#close_setting').addClass('show');
    OpenDirectoryByPath("/");
});
/* close */
$(document).on('click', '#close_setting', function() {
    $('#open_settings').trigger('click');
});
$(document).on('click', '#change_user', function() {
    var user = null;
    prefs.fetch(function(v) {
        user = v;
        var person = prompt("Please enter your name", user);
        if (person != null) {
            prefs.store(function(v) {
                $('#change_user').text(person);
            }, fail, 'user', person);
        }
    }, fail, 'user');

});
