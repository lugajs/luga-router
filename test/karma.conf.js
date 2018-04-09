/* global module */

/*
Use Karma only for the sake of producing a code coverage report.
No need to use multiple browsers
*/
module.exports = function(config) {
	"use strict";
	config.set({
		basePath: "../",
		browsers: ["Chrome"],
		frameworks: ["jasmine"],
		files: [
			// Libs
			"lib/lugajs/luga.common.min.js",

			// Test libs
			"test/lib/jquery/jquery.min.js",
			"test/lib/jasmine/jasmineMatchers.min.js",
			"test/jasmine.config.js",

			// Source files
			"src/luga.history.js",
			"src/luga.router.js",
			"src/luga.router.utils.js",
			"src/luga.router.RouteHandler.js",
			"src/luga.router.Router.js",

			// Test specs
			"test/spec/*.Spec.js"
		],
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		preprocessors: {
			"src/**/*.js": ["coverage"]
		},

		coverageReporter: {
			reporters: [
				{type: "lcov", dir: "test/coverage/", subdir: "."},
				{type: "text", dir: "test/coverage/", subdir: ".", file: "coverage.txt"},
				{type: "text-summary"}
			]
		},

		reporters: ["progress", "coverage"],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true
	});
};