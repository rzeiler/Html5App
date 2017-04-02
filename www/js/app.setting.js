$(document).on('CreateCategoryList', function(e, json, isSearch) {
    $('#list').html("");
    console.log("CreateCategoryList", e, json, isSearch);
    if (isSearch == false) {
        currentData = json.data;
    }
    /* load template */
    $.get("template/categoryListItem.html", function(html) {
        $.each(json.data, function(key, item) {
            var s = $(html);
            try {
                s.find(".circle").text(item.title.substring(0, 1));
                s.find(".title").text(item.title);
                s.find(".sum").text(item.sum);
                s.find(".edit_category").data('id', item.id);
                s.find(".open_cashs").data('id', item.id);
                var l = s.find(".circle").text().toLowerCase();
                var c = $.grep(colorData, function(n, i) {
                    return l === n.letter;
                });
                s.find(".circle").css('background-color', c[0].color);
            } catch (e) {
                s = e;
            } finally {
                /* show */
                $('#list').append(s);
            }
        });
    });
    $('#a .line').css('width', '36%');
    $('#b .line').css('width', '76%');
});
/* filter list */
$(document).on('keyup', '.categorys_filter', function() {
    var val = $(this).val();
    var as = currentData;
    if (val != "") {
        as = $.grep(currentData, function(n, i) {
            var t = n.title.toLowerCase();
            var f = val.toLowerCase();
            return t.indexOf(f) != -1;
        });
    }
    $(document).trigger('CreateCategoryList', [{
        data: as
    }, true]);
});

var fileExplorer, fileDirectory;
$(document).on('ready', function() {

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileDirectory = fileSystem.root;
    });


    $.get("template/fileOpen.html", function(html) {
        fileExplorer = $(html);
        fileExplorer.insertAfter("main");
        console.log('fileExplorer create');
    });
});

$(document).on('click', 'a.dir', function() {


    alert("adir");


});



/* rebuild data */
$(document).on('click', '.findFile', function() {
    var root = $("<a>Öffnen</a>");
    root.data('path','/');
    fileExplorer.append(root);
});
