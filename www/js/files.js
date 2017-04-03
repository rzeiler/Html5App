$(document).on('getFiles', function(e, path, sdcard) {
    var files = [];
    console.log('path', path);
    sdcard.getDirectory(path, {
        create: false
    }, function(dcim) {
        var directoryReader = dcim.createReader();
        directoryReader.readEntries(function(entries) {
            console.log('directoryReader start');
            dcim.getParent(function(parent) {
                console.log('push', parent);
                files.push(parent);
            }, function(error) {
                console.log('getParent error', e);
            });
            for(i = 0; i < entries.length; i++) {
                console.log('push', entries[i]);
                files.push(entries[i]);
            }
            $(document).trigger('filesToList', [{
                data: files
            }]);
        }, function(e) {
            console.log('directoryReader error', e);
        });
    }, function(e) {
        console.log('directoryReader error', e);
    });
    return files;
});
