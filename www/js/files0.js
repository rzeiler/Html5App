$(document).on('getFiles', function(e) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        var sdcard = fileSystem.root;
        alert("run");
        // $(document).on('click', 'a.file', function() {
        //     var path = $(this).data('path');
        //     window.resolveLocalFileSystemURL("file:///sdcard/" + path, readFile, onErrorReadFile);
        // });
        $(document).on('click', 'a.dir', function() {
            alert("ok run 2");
            var path = $(this).data('path');
            sdcard.getDirectory(path, {
                create: false
            }, function(dcim) {
                var directoryReader = dcim.createReader();
                directoryReader.readEntries(function(entries) {
                    $("#list").html("");
                    dcim.getParent(function(parent) {
                        $("#list").prepend(" <a class='dir' data-path='" + parent.fullPath + "' >..</a>");
                    }, function(error) {
                        $("#list").html(error.code);
                    });
                    for(i = 0; i < entries.length; i++) {
                        $("#list").prepend(" <a class='" + ((entries[i].isDirectory) ? "dir" : "file") + "' data-path='" + entries[i].fullPath + "' >" + entries[i].name + "</a></li>");
                    }
                }, function(e) {
                    $("#list").html(e.code);
                });
            }, function(error) {
                alert("Error" + $.param(error));
                $("#list").html(error.code);
            });
        });
    }, function(evt) { // error get file system
        $("#list").html(evt.target.error.code);
    });
});
