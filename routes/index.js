var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});

//============
//AUTH ROUTES
//============

//show register form
router.get("/register", function(req, res) {
    res.render("register", {page: 'register'});
});

//sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, newUser){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + newUser.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

//login form
router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});

//login logic
router.post("/login", passport.authenticate("local", {
    successRedirect:"/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
});

//logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;