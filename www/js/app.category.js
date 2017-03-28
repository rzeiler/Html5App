var currentData, currentHtml, openCaregoryId, openCashId;
$(document).on('CreateCategoryList', function(e, json, isSearch) {
    $('#list').html('');
    if(isSearch === false) {
        currentData = json.data;
        console.log("init data", currentData);
    }
    /* load template */
    $.get("template/categoryItem.html", function(html) {
        $.each(json.data, function(key, item) {
            var s = $(html);
            try {
                s.find(".w2 .fab").text(item.title.substring(0, 1));
                s.find("h4").text(item.title);
                s.find("p").text(item.sum);
                s.find(".edit_category").data('id', item.id);
                s.find(".open_cashs").data('id', item.id);
                var str = s.find(".w2 .fab").text();
                var l = s.find(".w2 .fab").text().toLowerCase();
                var c = $.grep(colorData, function(n, i) {
                    return l === n.letter;
                });
                s.find(".w2 .fab").css('background-color', c[0].color);
            } catch(e) {
                s = e;
            } finally {
                /* show */
                $('#list').append(s);
            }
        });
        AnimateSection();
    });
    $('#a').css('width', '36%');
    $('#b').css('width', '76%');
});
/* filter list */
$(document).on('keyup', '.categorys_filter', function() {
    var val = $(this).val();
    var as = currentData;
    if(val != "") {
        as = $.grep(currentData, function(n, i) {
            var t = n.title.toLowerCase();
            var f = val.toLowerCase();
            return t.indexOf(f) != -1;
        });
    }
    $(document).trigger('CreateCategoryList', [{
        data: as
    }, false]);
});
$(document).on('click', '#open_categorys', function() {
    openCaregoryId = 0;
    AddNavigtionPoint('#open_categorys');
    $('#open_settings').show();
    $('#save_category').hide();
    $('#save_cash').hide();
    $("header h2").text('Kategorien');
    $('body').removeClass('gray');
    $("main").load("template/categorys.html", function() {
        AnimateMain();
        $(document).trigger('getcategorys');
    });
});
/* edit category */
$(document).on('click', '.edit_category', function() {
    AddNavigtionPoint('.edit_category');
    $('#save_category').show();
    $("header h2").text('Bearbeiten');
    $('body').addClass('gray');
    var id = $(this).data('id');
    $("main").load("template/category.html", function() {
        AnimateMain();
        var d = $.grep(currentData, function(n, i) {
            return n.id == id;
        });
        'title, createdate, isdeleted, user, rating'
        $('#title').val(d[0].title);
        alert(d[0].createdate);
        $('#date').val(d[0].createdate);
        $('#rating').val(d[0].rating);
    });
});
