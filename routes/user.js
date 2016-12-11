var express = require('express');
var login = express.Router();
var connection = require('../model/mysql');


login.get('/', function(req, res, next) {
    res.render('user/index');

});

login.get('/signup', function(req, res, next) {
    res.render('user/signup');

});

login.get('/login', function(req, res, next) {

    res.render('user/login');

});

login.get('/logout', function(req, res, next) {

    req.session.user = null;
    req.session.cart = null;
    res.render('user/login');

});

login.get('/contact', function(req, res, next) {

    res.render('user/contact');

});

login.get('/placeorder', function(req, res, next) {
    cart = req.session.cart;
    console.log(cart);
    console.log("INSERT into Orders(emailId,restId,menuId,category) values('" + cart[0].user +"',"+ cart[0].restID+","+ cart[0].menuId +",'" +cart[0].category+"');");
    for(var i=0 ; i <cart.length ; i++){
        connection.query("INSERT into Orders(emailId,restId,menuId,category,item) values('" + cart[i].user +"',"+ cart[i].restID+","+ cart[i].menuId +",'" +cart[i].category+"','" +cart[i].name+"');", function (err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    res.render('add', {error: "error while adding data"});
                }
            } else {
                console.log(err);
            }
        });

    }
    res.redirect("/home");

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
                   req.session.user = emailId;
                   res.redirect("/home");
               }
           } else {
               console.log(err);
           }
       });
});

login.get('/home', function(req, res, next) {


    connection.query("SELECT * from Restaurant", function (err, rows) {
        if (!err) {
            if (rows.length == 0) {
                res.render('user/login', {error: "no data"});
            } else {
                console.log('The solution is: ', rows);
                rows = JSON.stringify(rows);
                //console.log(rows);
                res.render("user/hotel",{data : rows});
            }
        } else {
            console.log(err);
        }
    });
});

login.get('/cart', function(req, res, next) {

    console.log(req.session.cart);
    res.render('user/cart',{data : JSON.stringify(req.session.cart)})
});

login.get('/AddTOCart', function(req, res, next) {
    var cart;
    console.log(req.session.restID);
    console.log(req.session.user);
    console.log(req.query.id);

    if(req.session.cart == null){
        cart = [];
    }else{
        cart = req.session.cart;
    }

    cart.push({user:req.session.user, restID:req.session.restID , menuId : req.query.id, name : req.query.name, price : req.query.price, category : req.query.category });
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect("/home");

});



login.get('/menu', function(req, res, next) {

    console.log(req.query.hotel);

    connection.query("SELECT * from Restaurant", function (err, rows) {
        if (!err) {
            if (rows.length == 0) {
                res.render('user/login', {error: "no data"});
            } else {
                var restID = req.query.hotel;
                req.session.restID = restID;
                console.log(rows[0].restId);
                connection.query("SELECT * from Menu where restId = '" +  restID +  "'", function (err, rows) {
                    if (!err) {
                        if (rows.length == 0) {
                            res.redirect("/home");
                        } else {
                            var apppetizer,main_Course,Desserts;
                            console.log('The solution is: ', rows);
                            console.log(rows[0].menuId);
                            var menuID = rows[0].menuId;

                            connection.query("SELECT * from apppetizer where menuId = '" +  menuID +  "'", function (err, rows) {
                                apppetizer = JSON.stringify(rows);
                                console.log('The solution is: ', rows);

                                connection.query("SELECT * from Desserts where menuId = '" +  menuID +  "'", function (err, rows) {
                                    Desserts = JSON.stringify(rows);
                                    console.log('The solution is: ', rows);
                                    connection.query("SELECT * from main_Course where menuId = '" +  menuID +  "'", function (err, rows) {
                                        main_Course = JSON.stringify(rows);
                                        console.log('The solution is: ', rows);
                                       // res.json( {data : {apppetizer:apppetizer,main_Course:main_Course,Desserts:Desserts}});
                                        res.render('user/menu', {data : {apppetizer:apppetizer,main_Course:main_Course,Desserts:Desserts}});
                                    });
                                });

                            });


                        }
                    } else {
                        console.log(err);
                        res.redirect("/home");
                    }
                });


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
    connection.query("INSERT into DbProject_Cebordine.Customer values('" + req.body.email + "','" + req.body.address + "','" + req.body.password + "','" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.middlename + "');", function (err, rows) {
        if (!err) {
            if (rows.length == 0) {
                res.render('user/signup', {error: "incorrect credentials"});
            } else {
                console.log('The solution is: ', rows);
                res.render('user/login');
            }
        } else {
            console.log(err);
        }
    });
});

module.exports = login;

