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
/* open directory */
$(document).on('click', 'a.dir', function() {
    var path = $(this).data('path');
    OpenDirectoryByPath(path);
});
/* open fiel */
$(document).on('click', 'a.file', function() {
    $('#fileExplorer').removeClass('show');
    var path = $(this).data('path');
    OpenFileByPath(path);
});


/* close explorer */
$(document).on('click', '#fileExplorer #close', function() {
    $('#fileExplorer').removeClass('show');
});
