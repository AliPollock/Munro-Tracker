const express = require("express");
const router = express.Router({ mergeParams: true }); //merge params object means that :id and user data is accessible in app.js
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//comments/new
router.get("/new", middleware.isLoggedIn, function (req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", { campground: campground });
		}
	});
});

//comments / create;
router.post("/", middleware.isLoggedIn, function (req, res) {
	Campground.findById(req.params.id, function (err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function (err, comment) {
				if (err) {
					req.flash("error", "Something went wrong");
					res.redirect("/campgrounds");
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "successfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Campground.findById(req.params.id, function (err, foundCampground) {
		if (err || !foundCampground) {
			req.flash("error", "Cannot find that campground");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				res.redirect("back");
			} else {
				res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
			}
		});
	});
});

//update route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("back");
		}
	});
});

module.exports = router;
