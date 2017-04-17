var openCaregoryId = null,
    cashId = null,
    item = null,
    list = null,
    form = null;
$(document).on('sqliteready', function() {
    $.get("template/cash/view.html", function(html) {
        item = html;
    });
    $.get("template/cash/list.html", function(html) {
        list = html;
    });
    $.get("template/cash/form.html", function(html) {
        form = html;
    });
});

function CashToList(data) {
    var s = $(item);
    if(data.total != null) {
        var sum = data.total + "&euro;";
        s.find(".total").html(sum);
    }
    s.find(".content").text(data.content);
    s.find(".date").text(data.createdate);
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
    $('main').html(list)
    sqlite.db.transaction(function(tx) {
        sqlite.CashesToListById(openCaregoryId, tx, CashToList, null);
    });
});
/* filter list */
$(document).on('search', '.cashs_filter', function() {
    var val = $(this).val();
    $('#list').html('');
    sqlite.CashesToListById(openCaregoryId, CashToList, val);
});
/* save data */
$(document).on('click', '#save_cash', function() {
    var cash = new Object();
    cash.id = (cashId != undefined || cashId != null) ? cashId : null;
    cash.content = $('#content').val();
    cash.createdate = toTimestamp($('#date').val());
    cash.repeat = $('#repeat').val();
    cash.total = $('#total').val();
    cash.category = openCaregoryId;
    cash.iscloned = 0;
    if(cash.content != "" && cash.createdate != "" && cash.repeat != "" && cash.total != "" && cash.category != "") {
        sqlite.db.transaction(function(tx) {
            sqlite.saveCash(cash, tx, function(result) {
                if(result.rowsAffected > 0) {
                    $("#toast").toast("Gespeichert");
                } else {
                    alert("Fehler beim Speichern.");
                }
            }, null);
        });
        $('body').removeClass('grey');
        $('#save_cash').removeClass('show');
        $('.open_cashs').trigger('click');
    } else {
        alert("Bitte prüfe deine eingaben.");
    }
});
/* edit or create cash */
$(document).on('click', '.edit_cash', function() {
    AddNavigtionPoint('.edit_cash');
    cashId = $(this).data('id');
    if(cashId == null) {
        $("header .title b").text('Neu');
    } else {
        $('#confirm_delete_cash').addClass('show');
        $('#cut_cash').addClass('show');
        $("header .title b").text('Bearbeiten');
    }
    $('body').addClass('grey');
    $('#save_cash').addClass('show');
    $("main").html(form);
    if(cashId != undefined || cashId != null) {
        sqlite.GetCashById(cashId, function(item) {
            $('#date').val(toDate(item.createdate));
            $('#content').val(item.content);
            $('#repeat').val(item.repeat);
            $('#total').val(item.total);
        });
    }
});
