/* init */
/* https://phonegappro.com/phonegap-tutorial/phonegap-sqlite-tutorial-with-example-apache-cordova/ */
var myDB = null;
try {
    $(document).on('deviceready', function() {
        myDB = window.sqlitePlugin.openDatabase({
            name: "fmhpro.db",
            location: 'default'
        });
        myDB.transaction(function(transaction) {
            var CREATE_CATEGORY_TABLE = "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY, title TEXT, createdate INTEGER, isdeleted INTEGER, user TEXT, rating INTEGER )";
            transaction.executeSql(CREATE_CATEGORY_TABLE, [], function(tx, result) {
                //alert("Table category created successfully");
            }, function(error) {
                console.log(error);
                alert("Error occurred while creating the table category.");
            });
            var CREATE_CASH_TABLE = "CREATE TABLE IF NOT EXISTS cash (id INTEGER PRIMARY KEY, content TEXT, createdate INTEGER, isdeleted INTEGER, category INTEGER, repeat INTEGER, total DECIMAL(10,2), iscloned INTEGER DEFAULT 0, FOREIGN KEY(category) REFERENCES category(id))";
            transaction.executeSql(CREATE_CASH_TABLE, [], function(tx, result) {
                //alert("Table cash created successfully");
            }, function(error) {
                console.log(error);
                alert("Error occurred while creating the table.");
            });
        });
        if (myDB != null) {
            var event = new CustomEvent("databaseready", {
                "detail": "fmhpro"
            });
            document.dispatchEvent(event);
        }
    });
    $(document).on('click', '#save_category', function() {
        var title = $('#title').val();
        var createdate = toTimestamp($('#date').val());
        var isdeleted = 0;
        var user = 'rze';
        var rating = 1;
        myDB.transaction(function(transaction) {
            console.log(title, createdate, isdeleted, user, rating);
            var executeQuery = "INSERT INTO category (title, createdate, isdeleted, user, rating) VALUES (?,?,?,?,?)";
            transaction.executeSql(executeQuery, [title, createdate, isdeleted, user, rating], function(tx, result) {
                alert('Inserted');
                console.log(result);
                $("#toast").toast(result);
                $('#save_category').hide();
                $('#open_categorys').trigger('click');
            }, function(error) {
                alert(error);
                console.log(error);
                result = 'Error occurred';
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
                for (i = 0; i < len; i++) {
                    var createdate = results.rows.item(i).createdate;
                    var date = new Date(createdate * 1000);
                    var d = date.getDate();
                    var m = "0" + date.getMonth();
                    var y = "0" + date.getYear();
                    var formattedTime = d + "." + m + "." + y;
                     formattedTime = date.toLocaleDateString();


                  //  formattedTime = date.toISOString();
                    console.log(formattedTime);
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

} catch (e) {
    alert(e);
} finally {}
