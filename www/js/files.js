document.addEventListener("deviceready", InitFileSystem, fail);
var sdcard;

function InitFileSystem() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        sdcard = fileSystem.root;
    });
}

function OpenDirectoryByPath(path) {
    $('#list').html("loading...");
    sdcard.getDirectory(path, {
        create: false
    }, function(dcim) {
        var directoryReader = dcim.createReader();
        directoryReader.readEntries(function(entries) {
            $('#list').html("");
            for(i = 0; i < entries.length; i++) {
                var a = "<div class='tr'><div class='td'><i class='material-icons'>insert_drive_file</i></div>";
                if(entries[i].isDirectory) {
                    a = "<div class='tr'><div class='td'><i class='material-icons'>folder_open</i></div>";
                }
                a += "<div class='td " + ((entries[i].isDirectory) ? "dir" : "file") + "' data-path='" + entries[i].fullPath + "' >" + entries[i].name + "</div></div>";
                $('#list').prepend(a);
            }
            dcim.getParent(function(parent) {
                var a = "<div class='td dir' data-path='" + parent.fullPath + "' >..</div></div>";
                $('#list').prepend(a);
            }, fail);
        }, fail);
    }, fail);
}

function OpenFileByPath(path) {
    window.resolveLocalFileSystemURL("file:///sdcard/" + path, function(fileEntry) {
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function() {
                ResoreDataBaseByJson(this.result);
            };
            reader.readAsText(file);
        }, fail);
    }, fail);
}

function fail(evt) {
    alert(evt.target.error.code);
}
/*
 * click events
 */
/* open directory */
$(document).on('click', 'div.dir', function() {
    var path = $(this).data('path');
    OpenDirectoryByPath(path);
});
/* open fiel */
$(document).on('click', 'div.file', function() {
    $('#open_settings').trigger('click');
    var path = $(this).data('path');
    OpenFileByPath(path);
});
