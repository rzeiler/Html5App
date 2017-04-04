var fileExplorer;
$(document).on('deviceready', function() {
    $.get("template/fileOpen.html", function(html) {
        fileExplorer = $(html);
        $('body').append(fileExplorer);
    });
});
/* rebuild data */
$(document).on('click', '.getBackupJsonFile', function() {
    $('#fileExplorer').addClass('show');
    $(document).trigger('getJsonFile');
});
/* close explorer */
$(document).on('click', '#fileExplorer #close', function() {
    $('#fileExplorer').removeClass('show');
});
$(document).on('fileSelected', function(e, data) {
    $('#fileExplorer').removeClass('show');
    alert("test" + data.text);
});
