var fileExplorer, fileDirectory;
$(document).on('deviceready', function() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileDirectory = fileSystem.root;
        console.log('requestFileSystem ready');
    });
    $.get("template/fileOpen.html", function(html) {
        fileExplorer = $(html);
        $('body').append(fileExplorer);
        console.log('fileExplorer create');
    });
});
$(document).on('filesToList', function(e, json) {
    console.log('filesToList', json);
    $.each(json.data, function(key, item) {
        console.log(item);
    });
});
$(document).on('click', 'a.dir', function() {
    $(document).trigger('getFiles', ["/", fileDirectory]);
});
/* rebuild data */
$(document).on('click', '.findFile', function() {
    $('#fileExplorer').addClass('show');
    var root = $("<a>Öffnen</a>");
    root.data('path', '/');
    root.addClass('dir');
    $('#fileExplorer #list').append(root);
});
