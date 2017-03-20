const navpos = new Array();
$(document).on('deviceready', function() {
    $('#open_categorys').trigger('click');
});
$(document).on('click', '.ret', function() {

    if (navpos.length > 1) {
        var o = navpos[navpos.length - 2];
        $(o).trigger('click');

    }
navpos.pop();
navpos.pop();
    for (var i = 0; i < navpos.length; i++) {

        var s = $("<p>" + navpos[i] + "<p>");

        $('#open_categorys').append(s);
    }



    $("header p.d").text(navpos.length);

});
$(document).on('click', '#open_categorys', function() {
    navpos.push('#open_categorys');
    $('#open_settings').show();
    $('#save_category').hide();
    $('#save_cash').hide();
    $("header h2").text('Kategorien');
    $("main").load("template/categorys.html", function() {
        var tmplate;
        $.get("template/categoryItem.html", function(data) {
            template = data;
            for (var i = 0; i < 4; i++) {
                var s = $(template);
                s.find("h4").text(i);
                s.find(".edit_category").attr('id', i);
                $('div.categorys div.table').append(s);
            }
        });
    });
});
$(document).on('click', '#open_cashs', function() {
    navpos.push('#open_cashs');
    $('#open_settings').show();
    $('#save_cash').hide();
    $("header h2").text('Ausgaben');
    $("main").load("template/cashs.html");
});
$(document).on('click', '.edit_category', function() {
    navpos.push('.edit_category');
    $('#save_category').show();
    $("header h2").text('Bearbeiten');
    $("main").load("template/category.html");
});
$(document).on('click', '.edit_cash', function() {
    navpos.push('.edit_cash');
    $('#save_cash').show();
    $("header h2").text('Bearbeiten');
    $("main").load("template/cash.html");
});
$(document).on('click', '#open_settings', function() {
    navpos.push('#open_settings');
    $('#open_settings').hide();
    $("header h2").text('Einstellungen');
    $("main").load("template/settings.html");
});
$(document).on('keyup', '.input-field input', function() {
    if (!$(this).val()) {
        $(this).next().removeClass('active');
    } else {
        $(this).next().addClass('active');
    }
});
$(document).on('click', '#save_category', function() {
    $("#toast").toast('Kategory gespeichert');
    $('#save_category').hide();
    $('#open_categorys').trigger('click');
});
$(document).on('click', '#save_cash', function() {
    $("#toast").toast('Ausgabe gespeichert')
    $('#save_cash').hide();
    $('#open_cashs').trigger('click');
});
var myVar;
$.fn.toast = function(text) {
    var toast = this;
    clearTimeout(myVar);
    toast.find('p').text(text);
    toast.addClass('active')
    myVar = setTimeout(function() {
        toast.removeClass('active');
    }, 5000);
};

$(document).on('click', function() {
    if (navpos.length > 1) {
        $('.ret').show();
    } else {
        $('.ret').hide();
    }
});
