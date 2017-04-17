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
        $('#change_user').text("Benutzer (" + v + ")");
    }, fail, 'user');
    prefs.fetch(function(a) {
        $('#sum').val(a);
    }, fail, 'sum');
    prefs.fetch(function(b) {
        $('#month_limit').text("Monatsgrenze (" + b + ")");
    }, fail, 'month_limit');
    prefs.fetch(function(c) {
        $('#year_limit').text("Jahresgrenze (" + c + ")");
    }, fail, 'year_limit');
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
                $('#change_user').text("Benutzer (" + person + ")");

            }, fail, 'user', person);
        }
    }, fail, 'user');
});

$(document).on('click', '#month_limit', function() {
    var month_limit = null;
    prefs.fetch(function(v) {
        month_limit = v;
        var person = prompt("Please enter your limit", month_limit);
        if (person != null) {
            prefs.store(function(v) {
                $('#month_limit').text("Monatsgrenze (" + person + ")");
            }, fail, 'month_limit', person);
        }
    }, fail, 'month_limit');
});
$(document).on('click', '#year_limit', function() {
    var year_limit = null;
    prefs.fetch(function(v) {
        year_limit = v;
        var person = prompt("Please enter your limit", year_limit);
        if (person != null) {
            prefs.store(function(v) {
                $('#year_limit').text("Jahresgrenze (" + person + ")");
            }, fail, 'year_limit', person);
        }
    }, fail, 'year_limit');
});
$(document).on('change', '#sum', function() {
    var v = $(this).val();
    prefs.store(function(a) {
        alert(a);
        $('#sum').val(v);

    }, fail, 'sum', v);

});
