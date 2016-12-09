var express = require('express');
var login = express.Router();
var connection = require('../model/mysql');


login.get('/', function(req, res, next) {
    res.render('user/index');
    console.log('get');
});

login.get('/login', function(req, res, next) {
    console.log('login');
    res.render('user/services');

});


login.post('/login', function(req, res, next) {
    var emailId = req.body.username;
    var password = req.body.password;

       connection.query("SELECT * from Customer where emailId = '" + emailId + "' and customerPassword = '" + password + "'", function (err, rows) {
           if (!err) {
               if (rows.length == 0) {
                   res.render('pages/login', {error: "incorrect credentials"});
               } else {
                   console.log('The solution is: ', rows);
                   req.session.user = {userData : rows};
                   res.render('pages/home');
               }
           } else {
               console.log(err);
           }
       });
});

module.exports = login;

