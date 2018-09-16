var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
        }
    });
});

//CRESTE - adds a new campground
router.post("/",middleware.isLoggedIn, function(req, res){
    var name        = req.body.name;
    var price       = req.body.price;
    var img         = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
        
    };
    
    var newCampground = {
        name : name,
        price : price,
        image : img,
        description : description,
        author : author
    };
    Campground.create(newCampground, function(err, newCampground){
        if(err){
            console.log(err);
        } else {
          res.redirect("/campgrounds");  
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW - show more info about one campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT campground form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
//update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;