const navpos = new Array();
$(document).on('deviceready', function() {
    $('#open_categorys').trigger('click');
});
$(document).on('click', '.ret', function() {
    if(navpos.length > 1) {
        var o = navpos[navpos.length - 2];
        $(o).trigger('click');
    }
 });

function AddNavigtionPoint(v) {
    console.log('AddNavigtionPoint');
    var a = navpos.indexOf(v);
    if(a == -1) {
        navpos.push(v);
    } else {
        navpos.length = a + 1;
    }
    $('.brad').html('');
    $.each(navpos, function(i, v) {
        console.log(i, v);
        var a = $("<span/>");
        if(v.indexOf('#') == 0) {
            a.attr('id', v.substring(1));
        } else {
            a.attr('class', v.substring(1));
        }
        a.text(v);
        $('.brad').append(a);
    });
}
$(document).on('click', '#open_categorys', function() {
    AddNavigtionPoint('#open_categorys');
    $('#open_settings').show();
    $('#save_category').hide();
    $('#save_cash').hide();
    $("header h2").text('Kategorien');
    $("main").load("template/categorys.html", function() {
        AnimateMain();
        var tmplate;
        $.get("template/categoryItem.html", function(data) {
            template = data;
            for(var i = 0; i < 4; i++) {
                var s = $(template);
                s.find(".w2").text(i);
                s.find(".edit_category").attr('id', i);
                $('#list').append(s);
            }
            AnimateSection();
        });
    });
});
$(document).on('click', '.open_cashs', function() {
    AddNavigtionPoint('.open_cashs');
    $('#open_settings').show();
    $('#save_cash').hide();
    $("header h2").text('Ausgaben');
    $("main").load("template/cashs.html");
});
$(document).on('click', '.edit_category', function() {
    AddNavigtionPoint('.edit_category');
    $('#save_category').show();
    $("header h2").text('Bearbeiten');
    $("main").load("template/category.html");
});
$(document).on('click', '.edit_cash', function() {
    AddNavigtionPoint('.edit_cash');
    $('#save_cash').show();
    $("header h2").text('Bearbeiten');
    $("main").load("template/cash.html");
});
$(document).on('click', '#open_settings', function() {
    AddNavigtionPoint('#open_settings');
    $('#open_settings').hide();
    $("header h2").text('Einstellungen');
    $("main").load("template/settings.html");
});
$(document).on('keyup', '.input-field input', function() {
    if(!$(this).val()) {
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
    $('.open_cashs').trigger('click');
});
/* global functions */
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
    if(navpos.length > 1) {
        $('.ret').show();
    } else {
        $('.ret').hide();
    }
});
/* animate section element */
function AnimateSection() {
    $('div.categorys div.table section').each(function(i) {
        $(this).delay((i * 80)).queue(function() {
            console.log("run");
            $(this).addClass('show');
            $(this).dequeue();
        });
    });
    $('#list li').each(function(i) {
        $(this).delay((i * 150)).queue(function() {
            console.log("run");
            $(this).addClass('show');
            $(this).dequeue();
        });
    });
}

function AnimateMain() {
    $('main>div').delay((20)).queue(function() {
        console.log("run");
        $(this).addClass('show');
        $(this).dequeue();
    });
}
