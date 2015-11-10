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

	Theme.fixHtmlEntities = function(data, cb) {
		var entFilter = /\&amp;.*?;/g;
		var userData = data.userData;
		var dataFields = Object.keys(userData);
		var match = null;
		dataFields.forEach(function(field) {
			if (typeof userData[field] === 'string') {
				async.whilst(
			    function () { return ((match = entFilter.exec(userData[field])) !== null); },
			    function (next) {
			    	if (match.index === entFilter.lastIndex) {
			        entFilter.lastIndex++;
			    	}
			    	var foundEntity = match[0];
			    	switch (foundEntity) {
				    	case '&amp;#x2F;':
				    		userData[field] = userData[field].replace(/&amp;#x2F;/g, '/');
				    		break;
							case '&amp;quot;':
								userData[field] = userData[field].replace(/&amp;quot;/g, '"');
								break;
							case '&amp;gt;':
								userData[field] = userData[field].replace(/&amp;gt;/g, '>');
								break;
							case '&amp;lt;':
								userData[field] = userData[field].replace(/&amp;lt;/g, '<');
								break;
							case '&amp;#x27;':
								userData[field] = userData[field].replace(/&amp;#x27;/g, '\'');
								break;
							case null:
								winston.warn('[debug:hent] match is NULL');
								break;
							default:
								db.isObjectField('debug:hent', foundEntity, function(err, isMember) {
									if (isMember) {
										db.incrObjectField('debug:hent', foundEntity, function(err) {
											if (err) {
												return winston.error('[debug:hent] increment failed.');
											}
											winston.verbose('[debug:hent] incremented ' + foundEntity);
										});
									} else {
										db.setObjectField('debug:hent', foundEntity, 1, function(err) {
											if (err) {
												return winston.error('[debug:hent] adding new failed');
											}
											winston.verbose('[debug:hent] added new: ' + foundEntity);
										});
									}
								});
				    }
				    next();
			    },
			    function (err) {
			        if (err) {
			        	winston.error('[debug:hent] parsing error');
			        }
			  	}
			  );
			}
		});
		cb(null, data);
	};

	module.exports = Theme;

}(module));
