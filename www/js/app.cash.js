var openCaregoryId;

function CashToList(data) {
    $('#list').html('');
    $.get("template/cashItem.html", function(html) {
        $.each(data, function(key, val) {
            //content, createdate, category, repeat, total, iscloned, category
            var s = $(html);
            s.find(".w2").text(val.total);
            s.find("h4").text(val.content);
            s.find("p").text(val.createdate);
            s.find(".edit_cash").data('id', val.id);
            $('#list').append(s);
        });
    });
}

$(document).on('click', '.open_cashs', function() {
    openCaregoryId = ($(this).data('id') != null) ? $(this).data('id') : openCaregoryId;
    AddNavigtionPoint('.open_cashs');
    $('#open_settings').addClass('show');
    $("header .title b").text('Ausgaben');
    $('body').removeClass('gray');
    $("main").load("template/cashs.html", function() {
        CashesToListById(openCaregoryId, CashToList);
    });
});
