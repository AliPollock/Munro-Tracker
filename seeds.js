const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

let data = [
	{
		name: "Ben Lomond",
		image: "https://www.walkhighlands.co.uk/munros/ben-lomond-1.JPG",
		description:
			"Ben Lomond (Scottish Gaelic: Beinn Laomainn, 'Beacon Mountain'), 974 metres (3,196 ft), is a mountain in the Scottish Highlands. Situated on the eastern shore of Loch Lomond, it is the most southerly of the Munros. Ben Lomond lies within the Ben Lomond National Memorial Park and the Loch Lomond and The Trossachs National Park, property of the National Trust for Scotland.  Its accessibility from Glasgow and elsewhere in central Scotland, together with the relative ease of ascent from Rowardennan, makes it one of the most popular of all the Munros. On a clear day, it is visible from the higher grounds of Glasgow and across Strathclyde. Ben Lomond summit can also be seen from Ben Nevis, the highest peak in Britain, over 40 miles (64 km) away. The West Highland Way runs along the western base of the mountain, by the loch.",
	},
	{
		name: "Ben Macdui",
		image:
			"https://upload.wikimedia.org/wikipedia/commons/4/4e/Ben-macdui-from-carn-liath.jpg",
		description:
			"Ben Macdui (Scottish Gaelic: Beinn Mac Duibh, meaning Mac Duff's Hill) is the second highest mountain in Scotland (and all of the British Isles) after Ben Nevis, and the highest in the Cairngorms National Park. The summit elevation is 1,309 meters (4,295 feet) AMSL. Ben Macdui lies on the southern edge of the Cairn Gorm plateau, on the boundary between the historic counties of Aberdeenshire and Banffshire (currently on the border between the Aberdeenshire and Moray council areas).",
	},
	{
		name: "Ben Nevis",
		image:
			"https://www.grough.co.uk/lib/img/editorial/Ben-Nevis-Glen-Nevis-winter-1200-1024x682.jpg",
		description:
			"Ben Nevis (Scottish Gaelic: Beinn Nibheis, pronounced [peˈɲivəʃ]; English: /bɛnˈnɛvɪs/) is the highest mountain in the British Isles, the United Kingdom, Great Britain, Scotland and the historic county of Inverness-shire. The summit is 1,345 metres (4,413 ft)[1] above sea level. Ben Nevis stands at the western end of the Grampian Mountains in the Lochaber area of the Scottish Highlands, close to the town of Fort William. The summit is the highest land in any direction for 459 miles (739 km).",
	},
];

function seedDB() {
	Campground.deleteMany({}, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("removed campgrounds");
			Comment.deleteMany({}, function (err) {
				if (err) {
					console.log(err);
				} else {
					console.log("removed comments!");
					data.forEach(function (seed) {
						Campground.create(seed, function (err, campground) {
							if (err) {
								console.log(err);
							} else {
								console.log("added a campground");
								Comment.create(
									{
										text:
											"Classic walk nearby to glasgow with a well trodden path.",
										author: "Ali",
									},
									function (err, comment) {
										if (err) {
											console.log(err);
										} else {
											campground.comments.push(comment);
											campground.save();
											console.log("Created new comment");
										}
									}
								);
							}
						});
					});
				}
			});
		}
	});
}

module.exports = seedDB;
