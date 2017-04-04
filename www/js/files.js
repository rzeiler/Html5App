document.addEventListener("deviceready", InitFileSystem, fail);

var sdcard;

function InitFileSystem() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        sdcard = fileSystem.root;
    });
}

function OpenDirectoryByPath(path) {
    $('#fileExplorer #list').html("loading...");
    sdcard.getDirectory(path, {
        create: false
    }, function(dcim) {
        var directoryReader = dcim.createReader();
        directoryReader.readEntries(function(entries) {
            $('#fileExplorer #list').html("");
            for (i = 0; i < entries.length; i++) {
                var a = "<a class='" + ((entries[i].isDirectory) ? "dir" : "file") + "' data-path='" + entries[i].fullPath + "' >" + entries[i].name + "</a>";
                $('#fileExplorer #list').prepend(a);
            }
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
