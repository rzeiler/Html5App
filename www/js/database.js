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

            var CREATE_CATEGORY_TABLE = "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY," +
                "title TEXT, createdate INTEGER, isdeleted INTEGER, user " +
                " TEXT, rating INTEGER" + ")";

            transaction.executeSql(CREATE_CATEGORY_TABLE, [],
                function(tx, result) {
                    //alert("Table category created successfully");
                },
                function(error) {
                    alert("Error occurred while creating the table.");
                });

            var CREATE_CASH_TABLE = "CREATE TABLE cash(id INTEGER PRIMARY KEY, content" +
                " TEXT, createdate INTEGER, isdeleted INTEGER, category INTEGER," +
                " repeat INTEGER, total DECIMAL(10,2)," +
                " iscloned INTEGER DEFAULT 0, FOREIGN KEY(category) REFERENCES category(id))";

            transaction.executeSql(CREATE_CASH_TABLE, [],
                function(tx, result) {
                    //alert("Table cash created successfully");
                },
                function(error) {
                    alert("Error occurred while creating the table.");
                });
        });
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

                },
                function(error) {
                    alert(error);
                    console.log(error);
                    result = 'Error occurred';
                });
        });
    });


    function getCategorys(callback) {
        var rows = null;
        myDB.transaction(function(transaction) {
            transaction.executeSql('SELECT * FROM category', [], function(tx, results) {
                rows = results.rows;
                var len = results.rows.length,
                    i;

                    //     currentData = data;
                    //     currentHtml = html;
                    //     toListCategory(currentData);

                $("#rowCount").append(len);
                for (i = 0; i < len; i++) {
                    $("#TableData").append("<tr><td>" + results.rows.item(i).id + "</td><td>" + results.rows.item(i).title + "</td><td>" + results.rows.item(i).desc + "</td></tr>");
                }
            }, null);
        });
        return rows;
    }



} catch (e) {
    alert(e);
} finally {

}
