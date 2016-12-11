var express = require('express');
var restaurant = express.Router();
var connection = require('../model/mysql');


restaurant.get('/login', function(req, res, next) {
    res.render('restaurant/restaurantLogin');
    console.log('get');
});
restaurant.get('/', function(req, res, next) {
    res.render('restaurant/restaurantLogin');
    console.log('get');
});

restaurant.get('/add', function(req, res, next) {
    res.render('restaurant/restaurantAddItem');

});

restaurant.get('/logout', function(req, res, next) {
    req.session.restaurant = null;
    res.render('restaurant/restaurantLogin');

});
restaurant.get('/orders', function(req, res, next) {

    console.log(req.session.restaurant);
    if (req.session.restaurant == null) {
        res.render('restaurant/restaurantLogin');
    } else {
        connection.query("SELECT * from Orders where restId = '" + req.session.restaurant + "'", function (err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    res.render('restaurant/restaurantLogin', {error: "technical issue"});
                } else {
                    res.render('restaurant/restaurantOrders', {
                        data: JSON.stringify(rows)
                    });
                }

            }
        });
    }
});


restaurant.get('/home', function(req, res, next) {
    console.log(req.session.restaurant);
    if(req.session.restaurant ==null){
        res.render('restaurant/restaurantLogin');
    }else {
        connection.query("SELECT * from Menu where restId = '" + req.session.restaurant + "'", function (err, rows) {
            if (!err) {
                if (rows.length == 0) {
                    res.render('restaurant/restaurantLogin', {error: "technical issue"});
                } else {
                    var apppetizer, main_Course, Desserts;
                    console.log(rows[0].menuId);
                    var menuId = rows[0].menuId;
                    connection.query("SELECT * from apppetizer where menuId = '" + menuId + "'", function (err, rows) {
                        apppetizer = JSON.stringify(rows);
                        console.log('The solution is: ', rows);
                        connection.query("SELECT * from Desserts where menuId = '" + menuId + "'", function (err, rows) {
                            Desserts =  JSON.stringify(rows);
                            console.log('The solution is: ', rows);
                            connection.query("SELECT * from main_Course where menuId = '" + menuId + "'", function (err, rows) {
                                main_Course =  JSON.stringify(rows);
                                console.log('The solution is: ', rows);
                                res.render('restaurant/restaurantMenu', {
                                    data: {
                                        apppetizer: apppetizer,
                                        main_Course: main_Course,
                                        Desserts: Desserts
                                    }
                                });
                            });
                        });

                    });


                }
            } else {
                console.log(err);
            }
        });
    }

});



restaurant.post('/login', function(req, res, next) {
    var emailId = req.body.username;
    var password = req.body.password;
       connection.query("SELECT * from Restaurant where rest_email = '" + emailId + "' and password = '" + password + "'", function (err, rows) {
           if (!err) {
               if (rows.length == 0) {
                   res.render('restaurant/restaurantLogin', {error: "incorrect credentials"});
               } else {
                   console.log('The solution is: ', rows[0].restId);

                   req.session.restaurant = rows[0].restId;
                   res.redirect('/restaurant/home')
               }
           } else {
               console.log(err);
           }
       });
});

//Insert into Desserts values
//('101','icecream',10.5),

restaurant.post('/add', function(req, res, next) {
    console.log(req.body.name);
    console.log(req.body.price);
    console.log(req.body.image);
    console.log(req.body.food_type);
    connection.query("SELECT * from Menu where restId = '" + req.session.restaurant + "'", function (err, rows) {
        if (!err) {
            if (rows.length == 0) {
                res.render('restaurant/restaurantLogin', {error: "incorrect credentials"});
            } else {
                console.log('The solution is: ', rows[0].menuId);
                var menuId = rows[0].menuId;
                console.log("INSERT into "+ req.body.food_type +" values(" + menuId +",'"+ req.body.name+"',"+ req.body.price +");");
                connection.query("INSERT into "+ req.body.food_type +" values(" + menuId +",'"+ req.body.name+"',"+ req.body.price +");", function (err, rows) {
                    if (!err) {
                        if (rows.length == 0) {
                            res.render('add', {error: "error while adding data"});
                        } else {
                            res.redirect('/restaurant/home');

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

