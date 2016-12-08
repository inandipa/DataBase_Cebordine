var express = require('express');
var restaurant = express.Router();
var connection = require('../model/mysql');


restaurant.get('/login', function(req, res, next) {
    res.render('pages/rest_login');
    console.log('get');
});



restaurant.post('/login', function(req, res, next) {
    var emailId = req.body.username;
    var password = req.body.password;
       connection.query("SELECT * from Restaurant where rest_email = '" + emailId + "' and password = '" + password + "'", function (err, rows) {
           if (!err) {
               if (rows.length == 0) {
                   res.render('pages/rest_login', {error: "incorrect credentials"});
               } else {
                   console.log('The solution is: ', rows);
                   req.session.user = rows.restId;
                   console.log(rows[0].restId);
                   connection.query("SELECT * from Menu where restId = '" +  'pan1' +  "'", function (err, rows) {
                       if (!err) {
                           if (rows.length == 0) {
                               res.render('pages/rest_login', {error: "technical issue"});
                           } else {
                               var apppetizer,main_Course,Desserts;
                               console.log('The solution is: ', rows);
                               console.log(rows[0].menuId);
                               connection.query("SELECT * from apppetizer where menuId = '" +  rows[0].menuId +  "'", function (err, rows) {
                                   apppetizer = rows;
                                   console.log('The solution is: ', rows);
                                   connection.query("SELECT * from Desserts where menuId = '" +  rows[0].menuId +  "'", function (err, rows) {
                                       Desserts = rows;
                                       console.log('The solution is: ', rows);
                                       connection.query("SELECT * from Desserts where menuId = '" +  rows[0].menuId +  "'", function (err, rows) {
                                           main_Course = rows;
                                           console.log('The solution is: ', rows);
                                           res.render('pages/rest_home', {data : {apppetizer:apppetizer,main_Course:main_Course,Desserts:Desserts}});
                                       });
                                   });

                               });


                           }
                       } else {
                           console.log(err);
                       }
                   });

               }
           } else {
               console.log(err);
           }
       });
});



module.exports = restaurant;

