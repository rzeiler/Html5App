/* init */
/* https://phonegappro.com/phonegap-tutorial/phonegap-sqlite-tutorial-with-example-apache-cordova/ */
var executeQuery = "",
    params = [],
    deleteCounter = 0;
/* class */
var sqlite = {
    db: null,
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.db = window.sqlitePlugin.openDatabase({
            name: "fmhpro.db",
            location: 'default'
        });
        this.db.transaction(function(transaction) {
            var CREATE_CATEGORY_TABLE = "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY, title TEXT, createdate INTEGER, isdeleted INTEGER, user TEXT, rating INTEGER )";
            transaction.executeSql(CREATE_CATEGORY_TABLE, [], function(tx, result) {
                console.log('category', result);
            }, fail);
            var CREATE_CASH_TABLE = "CREATE TABLE IF NOT EXISTS cash (id INTEGER PRIMARY KEY, content TEXT, createdate INTEGER, isdeleted INTEGER, category INTEGER, repeat INTEGER, total DECIMAL(10,2), iscloned INTEGER DEFAULT 0, FOREIGN KEY(category) REFERENCES category(id))";
            transaction.executeSql(CREATE_CASH_TABLE, [], function(tx, result) {
                console.log('cash', result);
            }, fail);
        });
        $(document).trigger('sqliteready');
    },
    saveCategory: function(data, toast, callback) {
        this.db.transaction(function(transaction) {
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
        });
    },
    saveCash: function(data, toast, callback) {
        this.db.transaction(function(transaction) {
            executeQuery = "";
            params = [];
            data.total = this.toSqliteNumber(data.total);
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
        });
    },
    CategorysToListByUser: function(user, callback, search) {
        this.db.transaction(function(transaction) {
            var query = 'SELECT a.id, a.title, SUM(b.total) AS total FROM category a LEFT JOIN cash b ON b.category=a.id WHERE a.user=? GROUP BY a.id ORDER BY a.title ASC, a.rating DESC ',
                params = [user];
            if(search != null && search.length > 0) {
                query = "SELECT * FROM category WHERE user=? AND (title LIKE ? OR title LIKE ?) ORDER BY title ASC, rating DESC ";
                params = [user, "%" + search + "%", search + "%"];
            }
            transaction.executeSql(query, params, function(tx, results) {
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
    },
    CashesToListById: function(id, callback, search) {
        this.db.transaction(function(transaction) {
            var query = 'SELECT * FROM cash WHERE category=? ORDER BY createdate LIMIT ?',
                params = [id, 50];
            if(search != null && search.length > 0) {
                query = "SELECT * FROM cash WHERE category=? AND (content LIKE ? OR content LIKE ?) ORDER BY createdate LIMIT ?";
                params = [id, "%" + search + "%", search + "%", 100];
            }
            transaction.executeSql(query, params, function(tx, results) {
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
    },
    GetCashById: function(id, callback) {
        this.db.transaction(function(transaction) {
            transaction.executeSql("SELECT * FROM cash WHERE id=?", [id], function(tx, result) {
                callback(result.rows.item(0));
            }, function(tx, e) {
                console.log("error", tx, e);
            });
        });
    },
    GetCategoryById: function(id, callback) {
        this.db.transaction(function(transaction) {
            transaction.executeSql("SELECT * FROM category WHERE id=?", [id], function(tx, result) {
                callback(result.rows.item(0));
            }, function(tx, e) {
                console.log("error", tx, e);
            });
        });
    },
    ResoreDataBaseByJson: function(json) {
        var data = $.parseJSON(json);
        executeQuery = "";
        this.db.transaction(function(transaction) {
            executeQuery = "DELETE FROM cash ";
            transaction.executeSql(executeQuery, params, function(tx, result) {
                executeQuery = "DELETE FROM category ";
                transaction.executeSql(executeQuery, params, function(tx, result) {
                    $.each(data, function(index, category) {
                        category.id = null;
                        category.createdate = this.getDate(category.createdate).getTime() / 1000;
                        this.SaveCategory(category, transaction, null, SaveCash);
                    });
                }, fail);
            }, fail);
        });
    },
    fail: function(tx, e) {
        console.log("fail", e, e.message);
        alert(e.message);
        return false;
    },
    getDate: function(s) {
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
    },
    toSqliteNumber: function(number) {
        var ret = parseFloat(number.replace(",", "."));
        ret = ret.toFixed(2);
        return ret;
    }
};
sqlite.initialize();
