/* init */
/* https://phonegappro.com/phonegap-tutorial/phonegap-sqlite-tutorial-with-example-apache-cordova/ */
var myDB = null;
document.addEventListener("deviceready", InitDatabaseSystem, fail);

function InitDatabaseSystem() {
    myDB = window.sqlitePlugin.openDatabase({
        name: "fmhpro.db",
        location: 'default'
    });
    myDB.transaction(function(transaction) {
        var CREATE_CATEGORY_TABLE = "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY, title TEXT, createdate INTEGER, isdeleted INTEGER, user TEXT, rating INTEGER )";
        transaction.executeSql(CREATE_CATEGORY_TABLE, [], function(tx, result) {
            console.log('category', result);
        }, fail);
        var CREATE_CASH_TABLE = "CREATE TABLE IF NOT EXISTS cash (id INTEGER PRIMARY KEY, content TEXT, createdate INTEGER, isdeleted INTEGER, category INTEGER, repeat INTEGER, total DECIMAL(10,2), iscloned INTEGER DEFAULT 0, FOREIGN KEY(category) REFERENCES category(id))";
        transaction.executeSql(CREATE_CASH_TABLE, [], function(tx, result) {
            console.log('cash', result);
        }, fail);
    });
    $(document).trigger('StartApp');
}
$(document).on('savingCategory', function(e, data) {
    myDB.transaction(function(transaction) {
        var executeQuery = "",
            params = [];
        if(data.id == null) {
            executeQuery = "INSERT INTO category (title, createdate, user, rating) VALUES (?,?,?,?)";
            params = [data.title, data.createdate, data.user, data.rating];
        } else {
            executeQuery = "UPDATE category SET title=?, createdate=?, user=?, rating=? WHERE id=?";
            params = [data.title, data.createdate, data.user, data.rating, data.id];
        }
        transaction.executeSql(executeQuery, params, function(tx, result) {
            $(document).trigger('categorySaved', [{
                info: 'save'
            }]);
        }, function(error) {
            $(document).trigger('categorySaved', [{
                info: error
            }]);
        });
    });
});
$(document).on('getcategorys', function() {
    myDB.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM category', [], function(tx, results) {
            var data = [];
            var len = results.rows.length,
                i;
            'title, createdate, isdeleted, user, rating'
            for(i = 0; i < len; i++) {
                var createdate = results.rows.item(i).createdate;
                var formattedTime = toDate(createdate);
                results.rows.item(i).createdate = formattedTime;
                data.push(results.rows.item(i));
            }
            $(document).trigger('CreateCategoryList', [{
                data: data
            }, false]);
        }, function(error) {
            console.log(error);
            result = 'Error SELECT';
        });
    });
});

function CashesToListById(id, callback) {
    myDB.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM cash WHERE category=?', [id], function(tx, results) {
            var len = results.rows.length,
                i;
            for(i = 0; i < len; i++) {
                var item = results.rows.item(i);
                var d = new Date(item.createdate * 1000);
                item.createdate = d.toLocaleDateString();
                callback(item);
                item = null;
            }
        }, fail);
    });
}

function fail(tx, e) {
    console.log("fail", e, e.message);
    return null;
}

function getDate(s) {
    var ret = null;
    var format = /^[0-9]{2}[.][0-9]{2}[.][0-9]{4}$/;
    if(s.match(format)) {
        var a = s.split(".");
        var b = a[2] + "/" + a[1] + "/" + a[0]
        ret = new Date(b);
    }
    format = /^[0-9]{4}[-][0-9]{2}[-][0-9]{2}/;
    if(s.match(format) && ret == null) {
        var b = s.replace("-", "/");
        ret = new Date(b);
    }
    format = /^[0-9]{4}[/][0-9]{2}[/][0-9]{2}/;
    if(s.match(format) && ret == null) {
        ret = new Date(s);
    }
    return ret;
}
var executeQuery = "",
    params = [],
    deleteCounter = 0;

function ResoreDataBaseByJson(json) {
    var data = $.parseJSON(json);
    executeQuery = "";
    myDB.transaction(function(transaction) {
        executeQuery = "DELETE FROM cash ";
        transaction.executeSql(executeQuery, params, function(tx, result) {
            executeQuery = "DELETE FROM category ";
            transaction.executeSql(executeQuery, params, function(tx, result) {
                $.each(data, function(index, category) {
                    category.id = null;
                    category.createdate = getDate(category.createdate).getTime() / 1000;
                    SaveCategory(category, transaction, null, SaveCash);
                });
            }, fail);
        }, fail);
    });
}

function SaveCategory(data, transaction, toast, callback) {
    executeQuery = "";
    params = [];
    if(data.id == null) {
        executeQuery = "INSERT INTO category (title, createdate, user, rating) VALUES (?,?,?,?)";
        params = [data.title, data.createdate, data.user, data.rating];
    } else {
        executeQuery = "UPDATE category SET title=?, createdate=?, user=?, rating=? WHERE id=?";
        params = [data.title, data.createdate, data.user, data.rating, data.id];
    }
    transaction.executeSql(executeQuery, params, function(tx, result) {
        if(toast != null) {
            /*toast*/
        }
        if(callback != null) {
            $.each(data.cash, function(index, cash) {
                cash.id = null;
                cash.category = result.insertId;
                cash.createdate = getDate(cash.createdate).getTime() / 1000;
                callback(cash, transaction);
            });
        }
    }, fail);
}

function SaveCash(data, transaction, toast, callback) {
    console.log(data);
    executeQuery = "";
    params = [];
    if(data.id == null) {
        executeQuery = "INSERT INTO cash (content, createdate, category, repeat, total, iscloned, category) VALUES (?,?,?,?,?,?,?)";
        params = [data.content, data.createdate, data.category, data.repeat, data.total, data.iscloned, data.category];
    } else {
        executeQuery = "UPDATE cash SET content=?, createdate=?, category=?, repeat=?, total=?, iscloned=?, category=? WHERE id=?";
        params = [data.content, data.createdate, data.category, data.repeat, data.total, data.iscloned, data.category, data.id];
    }
    transaction.executeSql(executeQuery, params, function(tx, result) {
        if(toast != null) {
            /*toast*/
            toast(result);
        }
        if(callback != null) {
            /* function*/
            callback(result);
        }
    }, fail);
}

function GetCashById(transaction, id, callback) {
    transaction.executeSql("SELECT * FROM cash WHERE id=?", [id], function(tx, result) {
        callback(result.rows.item(0));
    }, function(tx, e) {
        console.log("error", tx, e);
    });
}
