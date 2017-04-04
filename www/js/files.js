var sdcard;

function readFile(fileEntry) {
    fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function() {
            $(document).trigger('fileSelected', [{
                text: this.result
            }]);
        };
        reader.readAsText(file);
    }, onErrorReadFile);
}

 

function fail(evt) {
    alert(evt.target.error.code);
}
$(document).on('getJsonFile', function(e) {
    $('#fileExplorer #list').html("loading");
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        $('#fileExplorer #list').html("loading...");
        sdcard = fileSystem.root;
        $(document).on('click', 'a.file', function() {
            var path = $(this).data('path');
            window.resolveLocalFileSystemURL("file:///sdcard/" + path, readFile, fail);
        });
        var btn = $("<a class='dir' data-path='/'>Root</a>");
        $('#fileExplorer #list').append(btn);
        $(document).on('click', 'a.dir', function() {
            var path = $(this).data('path');
            console.log(path);
            $("#list").html("");
            sdcard.getDirectory(path, {
                create: false
            }, function(dcim) {
                $('#fileExplorer #list').html("");
                var directoryReader = dcim.createReader();
                directoryReader.readEntries(function(entries) {
                    $("#list").html("");
                    dcim.getParent(function(parent) {
                        $('#fileExplorer #list').prepend(" <a class='dir' data-path='" + parent.fullPath + "' >..</a>");
                    }, function(error) {
                        console.log(error);
                    });
                    for(i = 0; i < entries.length; i++) {
                        $('#fileExplorer #list').prepend(" <a class='" + ((entries[i].isDirectory) ? "dir" : "file") + "' data-path='" + entries[i].fullPath + "' >" + entries[i].name + "</a>");
                    }
                }, function(e) {
                    console.log(e);
                });
            }, function(error) {
                console.log(error);
            });
        });
        btn.trigger("click");
    }, fail);
});
