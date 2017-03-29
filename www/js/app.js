const navpos = new Array();
var colorData;
/* get color */
$(document).on('deviceready', function() {
    $.getJSON("data/color.json", function(data) {
        colorData = data;
        console.log("color ready", colorData);
    });
});
/* run app with database */
$(document).on('databaseready', function() {
    $('#open_categorys').trigger('click');
});
$(document).on('click', '.left', function() {
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
var currentData, currentHtml, openCaregoryId, openCashId;

function toListCash(data) {
    $('#list').html('');
    $.each(data, function(key, val) {
        var s = $(currentHtml);
        s.find(".w2").text(val.sum);
        s.find("h4").text(val.title);
        s.find("p").text(val.date);
        s.find(".edit_category").data('id', val.id);
        var str = s.find(".w2").text();
        var c = $.grep(colorData, function(n, i) {
            return l == n.letter;
        });
        s.find(".w1").css('background-color', c[0].color);
        $('#list').append(s);
    });
    AnimateSection();
}
$(document).on('keyup', '.cashs_filter', function() {
    var val = $(this).val();
    var as = currentData;
    if(val != "") {
        as = $.grep(currentData, function(n, i) {
            var t = n.title.toLowerCase();
            var f = val.toLowerCase();
            return t.indexOf(f) != -1;
        });
    }
    toListCash(as);
});
$(document).on('click', '.open_cashs', function() {
    AnimateSection();
    openCaregoryId = ($(this).data('id') != null) ? $(this).data('id') : openCaregoryId;
    AddNavigtionPoint('.open_cashs');
    $('#open_settings').show();
    $('#save_cash').hide();
    $("header h2").text('Ausgaben');
    $('body').removeClass('gray');
    $("main").load("template/cashs.html", function() {
        AnimateMain();
        var tmplate;
        $.get("template/cashItem.html", function(html) {
            template = html;
            $.getJSON("data/cash.json", function(data) {
                currentData = $.grep(data, function(n, i) {
                    return n.id === openCaregoryId;
                });
                currentHtml = html;
                toListCash(currentData);
            });
            AnimateSection();
            $('#a').css('width', '66%');
            $('#b').css('width', '26%');
        });
    });
});
$(document).on('click', '.edit_cash', function() {
    AddNavigtionPoint('.edit_cash');
    $('#save_cash').show();
    $("header h2").text('Bearbeiten');
    $('body').addClass('gray');
    $("main").load("template/cash.html", function() {
        AnimateMain();
    });
});
$(document).on('click', '#open_settings', function() {
    AddNavigtionPoint('#open_settings');
    $('#open_settings').hide();
    $("header h2").text('Einstellungen');
    $('body').addClass('gray');
    $("main").load("template/settings.html", function() {
        AnimateMain();
    });
});

function toTimestamp(strDate) {
    /* 2017-12-01 */
    console.log("toTimestamp", strDate);
    var d = new Date(strDate);
    console.log("toTimestamp", d);
    var t = d.getTime() / 1000;
    console.log("toTimestamp", t);
    return t;
}

function toDate(iDate) {
    /* 1490745600 */
    console.log("toDate", iDate);
    iDate = parseInt(iDate) * 1000;
    var date = new Date(iDate);
    console.log("toDate", date);
    var d = (date.getDate() > 9) ? date.getDate() : "0" + date.getDate();
    var m = (date.getMonth() + 1);
    m = (m > 9) ? m : "0" + m;
    var y = date.getFullYear();
    var t = y + "-" + m + "-" + d;
    console.log("toDate", t);
    return t;
}
$(document).on('click', '#save_cash', function() {
    $("#toast").toast('Ausgabe gespeichert')
    $('#save_cash').hide();
    $('.open_cashs').trigger('click');
});
/* global functions */
var myVar;
$.fn.toast = function(text) {
    Materialize.toast(text, 5500);
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
    $('#list li').each(function(i) {
        $(this).delay((i * 50)).queue(function() {
            $(this).toggleClass('show');
            $(this).dequeue();
        });
    });
}

function AnimateMain() {
    $('main>div').delay(50).queue(function() {
        $(this).addClass('show');
        $(this).dequeue();
    });
}
