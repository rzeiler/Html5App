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
    OpenDirectoryByPath("/");
});
