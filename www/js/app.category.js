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
    if(c.length > 0) {
        s.find(".circle").css('background-color', c[0].color);
        s.find(".title").css('color', c[0].color);
    }
    s.find(".title").text(data.title);
    if(data.total != null){
      var sum = data.total + "&euro;";
      s.find(".sum").html(sum);
    }
    s.find(".edit_category").data('id', data.id);
    s.find(".open_cashs").data('id', data.id);
    $('#list').append(s);
}
/* filter list */
$(document).on('search', '.categorys_filter', function() {
    var val = $(this).val();
    $('#list').html('');
    sqlite.CategorysToListByUser('rze', CategoryToList, val);
});
/* main view*/
$(document).on('click', '#open_categorys', function() {
    openCaregoryId = 0;
    AddNavigtionPoint('#open_categorys');
    $('#open_settings').addClass('show');
    $("header .title b").text('Kategorien');
    $('body').removeClass('grey');
    $("main").html(categoryList);
    sqlite.CategorysToListByUser('rze', CategoryToList, null);
});
/* save click */
$(document).on('click', '#save_category', function() {
    var category = new Object();
    category.id = (openCaregoryId != undefined || openCaregoryId != null) ? openCaregoryId : null;
    category.title = $('#title').val();
    category.createdate = toTimestamp($('#date').val());
    category.user = 'rze';
    category.rating = $('#rating').val();
    if(category.title != "" && category.createdate != "" && category.user != "" && category.rating != "") {
        sqlite.saveCategory(category, function(result) {
            if(result.rowsAffected > 0) {
                $("#toast").toast("Gespeichert");
            } else {
                alert("Fehler beim Speichern.");
            }
        }, null);
        $('body').removeClass('grey');
        $('#save_cash').removeClass('show');
        $('#open_categorys').trigger('click');
    } else {
        alert("Bitte prüfe deine eingaben.");
    }
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
    if(openCaregoryId == null) {
        $("header .title b").text('Neu');
    } else {
        $('#confirm_delete_category').addClass('show');
        $('#cut_category').addClass('show');
        $("header .title b").text('Bearbeiten');
    }
    $("main").html(categoryForm);
    if(openCaregoryId != undefined || openCaregoryId != null) {
        sqlite.GetCategoryById(openCaregoryId, function(item) {
            $('#date').val(toDate(item.createdate));
            $('#title').val(item.title);
            $('#rating').val(item.rating);
        });
    }
});
