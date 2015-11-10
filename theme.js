var async = require('async');

(function(module) {
	"use strict";

	var Theme = {};

	Theme.defineWidgetAreas = function(areas, cb) {
		areas = areas.concat([
			{
				name: "Categories Sidebar",
				template: "categories.tpl",
				location: "sidebar"
			}
		]);

		cb(null, areas);
	};

	Theme.fixHtmlEntities = function(data, cb) {
		var entFilter = /\&amp;.*?;/g;
		var userData = data.userData;
		var dataFields = Object.keys(userData);
		dataFields.forEach(function(field) {
			if (typeof userData[field] === 'string' && userData[field].match(entFilter) !== null) {
				userData[field] = userData[field].replace(/\&amp;#x2F;/g, '/').
													 								replace(/\&amp;quot;/g, '"').
													 								replace(/\&amp;gt;/g, '>').
													 								replace(/\&amp;lt;/g, '<').
													 								replace(/\&amp;#x27;/g, '\'');
        console.log(userData[field]);
			}
		});
		//console.log(userData);
		cb(null, data);
	};

	module.exports = Theme;

}(module));
