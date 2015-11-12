var async = require('async');
var db = require.main.require('./src/database');
var winston = require('winston');

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

	Theme.addSignatureInlineImages = function(data, cb) {
		data.userData.signature = data.userData.signature.replace(/img-markdown/g, 'img-markdown img-signature');
		cb(null, data);
	};

	module.exports = Theme;

}(module));
