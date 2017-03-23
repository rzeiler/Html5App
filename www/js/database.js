// /* init */
// var SQLite = window.cordova.require('cordova-sqlite-plugin.SQLite');
//
// var sqlite = new SQLite('fmhpro');
//
// function err(message , fileName, lineNumber) {
// 	alert(message);
// }
//
// sqlite.open(function(err) {
//   if (err) throw err;
//   sqlite.query('SELECT ? + ? AS solution', [2, 3], function(err, res) {
//     if (err) throw err;
// 		alert("res.rows[0].solution"+ res.rows[0].solution);
//
//   });
// });
