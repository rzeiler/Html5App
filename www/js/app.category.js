var currentData, currentHtml, openCaregoryId, openCashId;
var categoryView = null,
    categoryList = null,
    categoryForm = null;

$(document).on('sqliteready', function() {
    $.getJSON("data/color.json", function(data) {
        colorData = data;
    });
    $.get("template/category/view.html", function(html) {
        categoryView = html;
    });
    $.get("template/category/list.html", function(html) {
        categoryList = html;
        $('#open_categorys').trigger('click');
    });
    $.get("template/category/form.html", function(html) {
        categoryForm = html;
    });
});

function CategoryToList(data) {
    var s = $(categoryView);
    var lower = data.title.substring(0, 1);
    var c = $.grep(colorData, function(n, i) {
        return lower.toLowerCase() === n.letter;
    });
    s.find(".circle").text(lower.toUpperCase());
    if (c.length > 0)
        s.find(".s2").css('background-color', c[0].color);
    s.find(".title").text(data.title);
    s.find(".sum").text(data.sum);
    s.find(".edit_category").data('id', data.id);
    s.find(".open_cashs").data('id', data.id);
    $('#list').append(s);
}


/* filter list */
$(document).on('keyup', '.categorys_filter', function() {
    var val = $(this).val();
    $('#list').html('');
    CategorysToListByUser('rze', CategoryToList, val);
});
/* main view*/
$(document).on('click', '#open_categorys', function() {
    openCaregoryId = 0;
    AddNavigtionPoint('#open_categorys');
    $('#open_settings').addClass('show');
    $("header .title b").text('Kategorien');
    $('body').removeClass('grey');
    $("main").html(categoryList);
    CategorysToListByUser('rze', CategoryToList, null);


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
/* delete */
$(document).on('click', '#confirm_delete_category', function() {
    $('.alert').addClass('show');
    $('.alert .text').text("Wollen Sie den Eintrag wirklich löschen?");
    $('.alert .options button').unbind();
    $('.alert .options button.yes').bind("click", function() {
        alert(" category User clicked on 'yes");
        $('.alert').removeClass('show');
    });
    $('.alert .options button.no').bind("click", function() {
        alert("category User clicked on 'no");
        $('.alert').removeClass('show');
    });
});
/* edit category */
$(document).on('click', '.edit_category', function() {
    AddNavigtionPoint('.edit_category');
    $('#save_category').addClass('show');
    $('body').addClass('grey');
    openCaregoryId = $(this).data('id');
    if (openCaregoryId == null) {
        $("header .title b").text('Neu');
    } else {
        $('#confirm_delete_category').addClass('show');
        $('#cut_category').addClass('show');
        $("header .title b").text('Bearbeiten');
    }
    $("main").html(categoryForm);
    var title = $('#title'),
        date = $('#date'),
        rating = $('#rating');
    var d = $.grep(currentData, function(n, i) {
        return n.id == openCaregoryId;
    });
    console.log(d[0]);
    if (d[0] != null) {
        'title, createdate, isdeleted, user, rating'
        title.val(d[0].title);
        date.val(d[0].createdate);
        rating.val(d[0].rating);
    }
});
