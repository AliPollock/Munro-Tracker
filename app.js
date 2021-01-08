const express = require("express");
const app = express();
const ejs = require("ejs");
const async = require("async");
const bodyParser = require("body-parser");
const axios = require("axios");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const moment = require("moment");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//route file imports
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");
const campgroundsRoutes = require("./routes/campgrounds");

if (process.env.NODE_ENV !== "production") {
	const dotenv = require("dotenv").config();
	console.log("hi there");
}
var port = process.env.PORT || 3000;
const mongoKey = process.env.MONGO_URI;

//package configs
// mongoose.connect("mongodb://localhost/yelp_camp", {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// 	useFindAndModify: false
// });

mongoose.connect(mongoKey, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

//creates sample munros and comments from seed file
// seedDB();

// passport configuration
app.use(
	require("express-session")({
		secret: "This is the secret",
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session()); //method within express-session which keeps track of if you're logged in a nd user data (cookies)
passport.use(new LocalStrategy(User.authenticate())); //authentication method build into passport-local-mongoose
passport.serializeUser(User.serializeUser()); //encodes user info
passport.deserializeUser(User.deserializeUser()); //unincodes user info

//app.use statements
app.use(function (req, res, next) {
	//attaches the current user's username to the page view on any route
	res.locals.currentUser = req.user;
	//attaches the message in the header file to any route
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes); //imports all routes form campgrounds file and appends /campgrounds to the beginning
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, function (req, res) {
	console.log("Running app");
});
