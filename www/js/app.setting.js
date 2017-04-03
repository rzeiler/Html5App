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

    var path = $(this).data('path');
    $(document).trigger('getFiles', [path, fileDirectory]);
});
/* rebuild data */
$(document).on('click', '.findFile', function() {
    $('#fileExplorer #list').html("");
    $('#fileExplorer').addClass('show');
   
    $(document).trigger('getFiles');
});
/* close explorer */
$(document).on('click', '#fileExplorer #close', function() {
    $('#fileExplorer').removeClass('show');
});
