var openCaregoryId, cashId, item = "";

function CashToList(data) {
    //content, createdate, category, repeat, total, iscloned, category
    var s = $(item);
    s.find(".w2").text(data.total);
    s.find("h4").text(data.content);
    s.find("p").text(data.createdate);
    s.find(".edit_cash").data('id', data.id);
    $('#list').append(s);
}
/* show all cashes */
$(document).on('click', '.open_cashs', function() {
    cashId = null;
    openCaregoryId = ($(this).data('id') != null) ? $(this).data('id') : openCaregoryId;
    AddNavigtionPoint('.open_cashs');
    $('#open_settings').addClass('show');
    $("header .title b").text('Ausgaben');
    $('body').removeClass('grey');
    $("main").load("template/cash/list.html", function() {
        $('#list').html('');
        $.get("template/cash/view.html", function(html) {
            item = html;
            CashesToListById(openCaregoryId, CashToList, null);
        });
    });
});


/* filter list */
$(document).on('keyup', '.cashs_filter', function() {
    var val = $(this).val();
    $('#list').html('');
    CashesToListById(openCaregoryId, CashToList, val);
});

/* save data */
$(document).on('click', '#save_cash', function() {
    if (myDB != null) {
        var cash = new Object();
        cash.id = (cashId != undefined || cashId != null) ? cashId : null;
        cash.content = $('#content').val();
        cash.createdate = toTimestamp($('#date').val());
        cash.repeat = $('#repeat').val();
        cash.total = $('#total').val();
        cash.category = openCaregoryId;
        myDB.transaction(function(transaction) {
            SaveCash(cash, transaction, function(result) {
                if (result.rowsAffected > 0) {
                    $("#toast").toast("Gespeichert");
                }
            }, null);
        });
        $('body').removeClass('grey');
        $('#save_cash').removeClass('show');
        $('.open_cashs').trigger('click');
    } else {
        alert("DB nicht vorhanden.");
    }
});
/* edit or create cash */
$(document).on('click', '.edit_cash', function() {
    AddNavigtionPoint('.edit_cash');
    cashId = $(this).data('id');
    $("header .title b").text('Bearbeiten');
    $('body').addClass('grey');
    $('#save_cash').addClass('show');
    $("main").load("template/cash/form.html", function() {
        if (cashId != undefined || cashId != null) {
            myDB.transaction(function(transaction) {
                GetCashById(transaction, cashId, function(item) {
                    $('#date').val(toDate(item.createdate));
                    $('#content').val(item.content);
                    $('#repeat').val(item.repeat);
                    $('#total').val(item.total);
                });
            });
        }
    });
});
