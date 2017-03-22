const navpos = new Array();
$(document).on('deviceready', function() {
    $('#open_categorys').trigger('click');
    //$('#open_settings').trigger('click');
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
                var str = s.find(".w2").text();
                var color = '#' + (255 - str.charCodeAt(i)).toString(16) + 'A';
                var color = '#' + parseInt(255 / 4 * (i + 1)).toString(16) + 'A';
                console.log(color);
                s.find(".w1").css('background-color', color);
                $('#list').append(s);
            }
            AnimateSection();
            $('#a').css('width', '36%');
            $('#b').css('width', '76%');
        });
    });
});
$(document).on('click', '.open_cashs', function() {
    AddNavigtionPoint('.open_cashs');
    $('#open_settings').show();
    $('#save_cash').hide();
    $("header h2").text('Ausgaben');
    $("main").load("template/cashs.html", function() {
        AnimateMain();
        var tmplate;
        $.get("template/cashItem.html", function(data) {
            template = data;
            for(var i = 0; i < 4; i++) {
                var s = $(template);
                s.find(".w2").text(i);
                s.find(".edit_category").attr('id', i);
                var str = s.find(".w2").text();
                var color = '#' + (255 - str.charCodeAt(i)).toString(16) + 'A';
                var color = '#' + parseInt(255 / 4 * (i + 1)).toString(16) + 'A';
                console.log(color);
                s.find(".w1").css('background-color', color);
                $('#list').append(s);
            }
            AnimateSection();
            $('#a').css('width', '66%');
            $('#b').css('width', '26%');
        });
    });
});
$(document).on('click', '.edit_category', function() {
    AddNavigtionPoint('.edit_category');
    $('#save_category').show();
    $("header h2").text('Bearbeiten');
    $("main").load("template/category.html", function() {
        AnimateMain();
    });
});
$(document).on('click', '.edit_cash', function() {
    AddNavigtionPoint('.edit_cash');
    $('#save_cash').show();
    $("header h2").text('Bearbeiten');
    $("main").load("template/cash.html", function() {
        AnimateMain();
    });
});
$(document).on('click', '#open_settings', function() {
    AddNavigtionPoint('#open_settings');
    $('#open_settings').hide();
    $("header h2").text('Einstellungen');
    $("main").load("template/settings.html", function() {
        AnimateMain();
      });
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
        $('.ret').addClass('show');
    } else {
        $('.ret').removeClass('show');
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
    $('main>div').delay(20).queue(function() {
        console.log("run");
        $(this).addClass('show');
        $(this).dequeue();
    });
}
