var currentData, currentHtml, openCaregoryId, openCashId;
var categoryView = null,
    categoryList = null,
    categoryForm = null,
    confirmForm = null;
$(document).on('sqliteready', function() {
    $.getJSON("data/color.json", function(data) {
        colorData = data;
        $.get("template/confirm.html", function(html) {
            confirmForm = html;
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
});

function CategoryToList(data) {
    var s = $(categoryView);
    var lower = data.title.substring(0, 1);
    var c = $.grep(colorData, function(n, i) {
        return lower.toLowerCase() === n.letter;
    });
    s.find(".circle").text(lower.toUpperCase());
    if (c.length > 0) {
        s.find(".circle").css('background-color', c[0].color);
        s.find(".title").css('color', c[0].color);
    }
    s.find(".title").text(data.title);
    var sum = "&sum; " + data.total + " &euro;";
    s.find(".sum").html(sum);
    s.find(".edit_category").data('id', data.id);
    s.find(".open_cashs").data('id', data.id);
    $('#list').append(s);
}
/* filter list */
$(document).on('search', '.categorys_filter', function() {
    var val = $(this).val();
    $('#list').html('');
    prefs.fetch(function(sum) {
        prefs.fetch(function(v) {
            sqlite.db.transaction(function(tx) {
                sqlite.CategorysToListByUser(v, tx, CategoryToList, val, sum);
            });
        }, prefail, 'user');
    }, prefail, 'sum');
});
/* main view*/
$(document).on('click', '#open_categorys', function() {
    openCaregoryId = 0;
    sqlite.GetOpenMonthCash('rze');
    AddNavigtionPoint('#open_categorys');
    $('#openDesktop').addClass('show');
    $('#open_settings').addClass('show');
    $("header .title b").text('Kategorien');
    $('body').removeClass('grey');
    $("main").html(categoryList);
    prefs.fetch(function(sum) {
        prefs.fetch(function(v) {
            sqlite.db.transaction(function(tx) {
                sqlite.CategorysToListByUser(v, tx, CategoryToList, null, sum);
            });
        }, prefail, 'user');
    }, prefail, 'sum');
});
/* save click */
$(document).on('click', '#save_category', function() {
    var category = new Object();
    category.id = (openCaregoryId != undefined || openCaregoryId != null) ? openCaregoryId : null;
    category.title = $('#title').val();
    category.createdate = toTimestamp($('#date').val());
    category.user = 'rze';
    category.rating = $('#rating').val();
    if (category.title != "" && category.createdate != "" && category.user != "" && category.rating != "") {
        sqlite.db.transaction(function(tx) {
            sqlite.saveCategory(category, tx, function(result) {
                if (result.rowsAffected > 0) {
                    $("#toast").toast("Gespeichert");
                } else {
                    alert("Fehler beim Speichern.");
                }
            }, false);
        });
        $('body').removeClass('grey');
        $('#save_cash').removeClass('show');
        $('#open_categorys').trigger('click');
    } else {
        alert("Bitte prüfe deine eingaben.");
    }
});
/* delete */
$(document).on('click', '#confirm_delete_category', function() {

    var cf = $(confirmForm);
    cf.on('click', 'button.yes', function() {
        var category = new Object();
        category.id = openCaregoryId;
        sqlite.db.transaction(function(tx) {
            sqlite.removeCategory(category, tx, function(result) {
                if (result.rowsAffected > 0) {
                    cf.remove();
                    $('.back').trigger('click');
                    $("#toast").toast("Kategory entfernt");
                } else {
                    alert("Fehler beim Speichern.");
                }
            });
        });
    });
    cf.on('click', 'button.no', function() {
        cf.remove();
    });
    $("main").append(cf);
    $('.alert .text').text("Wollen Sie den Eintrag wirklich löschen?");
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
    if (openCaregoryId != undefined || openCaregoryId != null) {
        sqlite.GetCategoryById(openCaregoryId, function(item) {
            $('#date').val(toDate(item.createdate));
            $('#title').val(item.title);
            $('#rating').val(item.rating);
        });
    }
});
