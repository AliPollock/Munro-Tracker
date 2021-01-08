const middlewareObj = {};
const Campground = require("../models/campground");
const Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
		//if to check the user is signed in
		Campground.findById(req.params.id, function (err, foundCampground) {
			//statement to find campground
			if (err || !foundCampground) {
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				//to find if user is the author of the campground
				if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
					//equals is mongoose function which acts like === between string and mongoose object
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function (err, foundComment) {
			if (err || !foundComment) {
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

// middlewareObj.checkUserComment = function (req, res, next) {
//     Comment.findById(req.params.comment_id, function(err, foundComment){
//        if(err || !foundComment){
//            req.flash("error", "Sorry, that comment does not exist!");
//            res.redirect("/campgrounds");
//        } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
//             req.comment = foundComment;
//             next();
//        } else {
//            req.flash("error", "You don\'t have permission to do that!");
//            res.redirect("/campgrounds/" + req.params.id);
//        }
//     });
//   }

module.exports = middlewareObj;
