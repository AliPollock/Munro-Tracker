const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");
const NodeGeocoder = require("node-geocoder");

var options = {
	provider: "google",
	httpAdapter: "https",
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null
};

const geocoder = NodeGeocoder(options);

//index route
router.get("/", function (req, res) {
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), "gi");
		Campground.find({ name: regex }, function (err, allCampgrounds) {
			//searching for campgrounds in db
			if (err) {
				console.log(err);
			} else {
				res.render("campgrounds/index", {
					campgrounds: allCampgrounds,
					page: "campgrounds"
				}); // for all campgrounds retrieved from db, send the through to the ejs file
			}
		});
	} else {
		Campground.find({}, function (err, allCampgrounds) {
			//searching for campgrounds in db
			if (err) {
				console.log(err);
			} else {
				res.render("campgrounds/index", {
					campgrounds: allCampgrounds,
					page: "campgrounds"
				}); // for all campgrounds retrieved from db, send the through to the ejs file
			}
		});
	}
});

//new route
router.get("/new", middleware.isLoggedIn, function (req, res) {
	res.render("campgrounds/new", { page: "login" });
});

//create route
router.post("/", middleware.isLoggedIn, function (req, res) {
	let name = req.body.name; //data from input form at /campgrounds/new
	let image = req.body.image;
	let description = req.body.description;
	let walkTime = req.body.walkTime;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	console.log(req.body.location);
	geocoder.geocode(req.body.location, (err, data) => {
		console.log(req.body.location);
		if (err || !data.length) {
			console.log(err);
			req.flash("error", "invalid address");
			return res.redirect("back");
		}
		let lat = data[0].latitude;
		let lng = data[0].longitude;
		let location = data[0].formattedAddress;

		let newCampground = { name: name, walkTime: walkTime, image: image, description: description, location: location, lat: lat, lng: lng, author: author }; //create object containing input data
		Campground.create(newCampground, function (err, newlyCreated) {
			//add object to database
			if (err) {
				console.log(err);
			} else {
				res.redirect("/campgrounds");
			}
		});
	});
});

//show route
router.get("/:id", function (req, res) {
	Campground.findById(req.params.id)
		.populate("comments")
		.exec(function (err, foundCampground) {
			if (err || !foundCampground) {
				req.flash("error", "Munro not found");
				res.redirect("back");
			} else {
				const googleKey = process.env.GOOGLE_API_KEY;
				res.render("campgrounds/show", { campground: foundCampground, googleKey: googleKey });
			}
		});
});

//edit route
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function (req, res) {
	Campground.findById(req.params.id, function (err, foundCampground) {
		res.render("campgrounds/edit", { campground: foundCampground });
	});
});

//Update route
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
	console.log(req.body);
	geocoder.geocode(req.body.location, (err, data) => {
		if (err || !data.length) {
			console.log(err);
			req.flash("error", "invalid address");
			return res.redirect("back");
		}
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longitude;
		req.body.campground.location = data[0].formattedAddress;

		Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
			if (err) {
				req.flash("error", err.message);
				res.redirect("/campgrounds");
			} else {
				req.flash("success", "Successfully updated!");
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
	});
});

//destroy route
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
	Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			Comment.deleteMany({ _id: { $in: campgroundRemoved.comments } }, (err) => {
				if (err) {
					console.log(err);
				}
				res.redirect("/campgrounds");
			});
		}
	});
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
