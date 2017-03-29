var currentData, currentHtml, openCaregoryId, openCashId;
$(document).on('CreateCategoryList', function(e, json, isSearch) {
    $('#list').html("");
    console.log("CreateCategoryList", e, json, isSearch);
    if(isSearch == false) {
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
            } catch(e) {
                s = e;
            } finally {
                /* show */
                $('#list').append(s);
            }
        });
    });
    $('#a .determinate').css('width', '36%');
    $('#b .determinate').css('width', '76%');
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
    }, true]);
});
$(document).on('click', '#open_categorys', function() {
    openCaregoryId = 0;
    AddNavigtionPoint('#open_categorys');
    $('.right li').removeClass('show');
    $('#open_settings').addClass('show');
    $("header .title b").text('Kategorien');
    $('body').removeClass('grey lighten-4');
    $("main").load("template/categorys.html", function() {
        $(document).trigger('getcategorys');
    });
});
/* fin */
$(document).on('categorySaved', function(e, o) {
    console.log(o.info);
    $("#toast").toast(o.info);
    $('#open_categorys').trigger('click');
});
/* save click */
$(document).on('click', '#save_category', function() {
    var title = $('#title').val();
    var createdate = toTimestamp($('#date').val());
    var user = 'rze';
    var rating = $('#rating').val();
    $(document).trigger('savingCategory', [{
        title: title,
        createdate: createdate,
        user: user,
        rating: rating,
        id: openCaregoryId
    }, ]);
});
/* edit category */
$(document).on('click', '.edit_category', function() {
    AddNavigtionPoint('.edit_category');
    $('.right li').removeClass('show');
    $('#save_category').addClass('show');
    $('body').addClass('grey lighten-4');
    openCaregoryId = $(this).data('id');
    if(openCaregoryId == null) {
        $("header .title b").text('Neu');
    } else {
        $('#delete_category').addClass('show');
        $('#cut_category').addClass('show');
        $("header .title b").text('Bearbeiten');
    }
    $("main").load("template/categoryItem.html", function() {
        var title = $('#title'),
            date = $('#date'),
            rating = $('#rating');
        var d = $.grep(currentData, function(n, i) {
            return n.id == openCaregoryId;
        });
        console.log(d[0]);
        if(d[0] != null) {
            'title, createdate, isdeleted, user, rating'
            title.val(d[0].title);
            date.val(d[0].createdate);
            rating.val(d[0].rating);
        }
        Materialize.updateTextFields();
        $('select').material_select();
    });
});
