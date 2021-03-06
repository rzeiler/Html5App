/*
cordova plugin add https://github.com/floatinghotpot/cordova-httpd.git

*/
const navpos = new Array();
var colorData;



$(document).on('click', '.back', function() {
    if(navpos.length > 1) {
        var o = navpos[navpos.length - 2];
        $(o).trigger('click');
    }
});

function AddNavigtionPoint(v) {
    $('a.option').removeClass('show');
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
    if(navpos.length > 1) {
        $('#go_back').addClass('show');
    } else {
        $('#go_back').removeClass('show');
    }
}
var currentData, currentHtml, openCaregoryId, openCashId;


function toTimestamp(strDate) {
    /* 2017-12-01 */
    var d = new Date(strDate);
    var t = d.getTime() / 1000;
    return t;
}

function toDate(iDate) {
    /* 1490745600 */
    iDate = parseInt(iDate) * 1000;
    var date = new Date(iDate);
    var d = (date.getDate() > 9) ? date.getDate() : "0" + date.getDate();
    var m = (date.getMonth() + 1);
    m = (m > 9) ? m : "0" + m;
    var y = date.getFullYear();
    var t = y + "-" + m + "-" + d;
    date = null;
    return t;
}
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
