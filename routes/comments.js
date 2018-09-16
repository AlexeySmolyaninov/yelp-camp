var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//=================================
//COMENTS ROUTES
//=================================
//comment new form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           res.render("comments/new", {campground: foundCampground});
       }
    });
    
});

//create a comment
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, createdComment){
                if(err){
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    //add username and id to comment
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/"+ foundCampground._id);
                }
            });
        }
    });
});

//comments edit form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground){
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                res.redirect("back");
            } else {
                 res.render("../views/comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;