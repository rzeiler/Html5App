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
