
var mysql = require('mysql');


var con = mysql.createConnection({
    host     : 'mydbase.cwgnanpueibv.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'indra',
    password : 'qqqqqqqq',
    database : 'DbProject_Cebordine'
});
con.connect(function (err) {
    if (!err) {
        console.log("Database is connected ..");
    } else {
        console.log("Error connecting database ...");
    }
});

module.exports.query = function (s ,callback) {
    con.query(s,callback);
};


