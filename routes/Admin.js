var express = require('express');
var Admin = express.Router();
var connection = require('../model/mysql');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'indrakiran12896@gmail.com', // Your email id
        pass: 'Reddy@12896' // Your password
    }
});

Admin.get('/login', function(req, res, next) {
    res.render('pages/admin_login');
    console.log('get');
});

Admin.get('/add', function(req, res, next) {
    res.render('pages/add_restaurant');

});



Admin.post('/login', function(req, res, next) {
    var emailId = req.body.username;
    var password = req.body.password;
       connection.query("SELECT * from Admin where userName = '" + emailId + "' and adminPassword = '" + password + "'", function (err, rows) {
           if (!err) {
               if (rows.length == 0) {
                   res.render('pages/admin_Admin', {error: "incorrect credentials"});
               } else {
                   console.log('The solution is: ', rows);
                   req.session.user = emailId;
                   res.render('pages/admin_home', {data: rows});
               }
           } else {
               console.log(err);
           }
       });
});

Admin.post('/add', function(req, res, next) {

    console.log(req.body.id+"."+req.body.rating+"."+req.body.name+"."+req.body.location+"."+req.session.user+".");
    // INSERT into Restaurant values ('spa13',4.2,'Flying Spagetti','Concord','cebordine');
    connection.query("INSERT into Restaurant values ('" + req.body.id + "',"+  req.body.rating +  ",'"+  req.body.name +  "','"+  req.body.location + "','"+  req.session.user + "','" +  req.body.email + "','"+  req.body.password +"');", function (err, rows) {
        if (!err) {

            var mailOptions = {
                from: 'indrakiran12896@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: 'Registration to Cebordine', // Subject line

                generateTextFromHTML: true,
                html: '<b>Welcome to Cebordine!!!   enter menu and also can update Restaurant Details  </b><br />'
                + 'password :'+req.body.password+ '<br />'
                + '<a href=\"http://localhost:3000/restaurant/login \">Click here to Login into your account.</a>'
                + '<br />'

            };

            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                    res.json({yo: 'error'});
                }else{
                    console.log('Message sent: ' + info.response);
                    res.json({yo: info.response});
                };
            });

           // res.render('pages/admin_home', {data: rows});

        } else {
            res.render('pages/add_restaurant', {data: req.body});
            console.log(err);
        }
    });
});


Admin.get('/payment', function(req, res, next) {

    connection.query("SELECT * from Payment", function (err, rows) {
        if (!err) {
            if (rows.length == 0) {
                res.render('pages/payments', {data: "no data"});
            } else {
                console.log('The solution is: ', rows);
                res.render('pages/payments', {data: rows});
            }
        } else {
            console.log(err);
        }
    });
});

Admin.get('/authorize', function(req, res, next) {

    connection.query("update Payment SET status = 'successful', userName ='"+req.session.user+"' where paymentID = "+ req.query.id, function (err, rows) {
        if (!err) {
            connection.query("SELECT * from Payment", function (err, rows) {
                if (!err) {
                    if (rows.length == 0) {
                        res.render('pages/payments', {data: "no data"});
                    } else {
                        console.log('The solution is: ', rows);
                        res.render('pages/payments', {data: rows});
                    }
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});



module.exports = Admin;

