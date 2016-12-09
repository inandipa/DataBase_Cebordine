var express = require('express');
var login = express.Router();
var connection = require('../model/mysql');


login.get('/', function(req, res, next) {
    res.render('user/index');
    console.log('get');
});

login.get('/signup', function(req, res, next) {
    res.render('user/signup');
    console.log('signup');
});

login.get('/login', function(req, res, next) {
    console.log('login');
    res.render('user/login');

});


login.post('/login', function(req, res, next) {

    var emailId = req.body.username;
    var password = req.body.password;

    console.log(emailId+"+"+password);
       connection.query("SELECT * from Customer where emailId = '" + emailId + "' and customerPassword = '" + password + "'", function (err, rows) {
           if (!err) {
               if (rows.length == 0) {
                   res.render('user/login', {error: "incorrect credentials"});
               } else {
                   console.log('The solution is: ', rows);
                   req.session.user = {userData : rows};
                   res.render('user/index');
               }
           } else {
               console.log(err);
           }
       });
});


login.post('/signup', function(req, res, next) {
    var emailId = req.body.username;
    var password = req.body.password;
    //INSERT into DbProject_Cebordine.Customer values
    //('131','indra@gmail.com','kittansett street d NC','afg','Santosh','Peesu','Reddy');
    connection.query("INSERT into DbProject_Cebordine.Customer values('" + emailId + "' and customerPassword = '" + password + "'", function (err, rows) {
        if (!err) {
            if (rows.length == 0) {
                res.render('user/signup', {error: "incorrect credentials"});
            } else {
                console.log('The solution is: ', rows);
                req.session.user = {userData : rows};
                res.render('user/index');
            }
        } else {
            console.log(err);
        }
    });
});

module.exports = login;

