function getFiles(path) {
    var files = [];
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            var sdcard = fileSystem.root;
            sdcard.getDirectory(path, {
                    create: false
                }, function(dcim) {

                    var directoryReader = dcim.createReader();
                    directoryReader.readEntries(function(entries) {
                            console.log('directoryReader start');
                            dcim.getParent(function(parent) {
                                files.push(parent);
                            }, function(error) {

                            });
                            for (i = 0; i < entries.length; i++) {
                                files.push(entries[i]);
                            }
                        },
                        function(e) {
                            console.log('directoryReader error', e);
                        });
                },
                function(e) {
                    console.log('directoryReader error', e);
                });
        },
        function(evt) { // error get file system

            console.log('directoryReader error', evt);
        });
    return files;
}
