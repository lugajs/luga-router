/* eslint no-implicit-globals: "off" */
/* eslint strict: "off" */
/* global require, __dirname */

"use strict";

var gulp = require("gulp");
var changed = require("gulp-changed");
var concat = require("gulp-concat");
var fs = require("fs");
var header = require("gulp-header");
var rename = require("gulp-rename");
var runSequence = require("run-sequence");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var zip = require("gulp-zip");
var karmaServer = require("karma").Server;

var pkg = require("./package.json");

var CONST = {
	SRC_ROUTER: "src/luga.router.js",
	SRC_FILES: ["src/luga.router.js", "src/luga.router.utils.js", "src/luga.router.Router.js", "src/luga.router.RouteHandler.js", "src/luga.History.js"],
	DIST_FOLDER: "dist",
	MIN_SUFFIX: ".min.js",
	CONCATENATED_FILE: "luga.router.js",
	FOLDERS_TO_ARCHIVE: ["LICENSE", "dist/**/*", "docs/**/*", "lib/**/*", "src/**/*", "test/**/*"],
	ARCHIVE_FILE: "luga-router.zip",
	ARCHIVE_FOLDER: "archive",
	VERSION_PATTERN: new RegExp(".version = \"(\\d.\\d(.\\d\\d?(dev)?)?)\";")
};

/* Utilities */

function assembleBanner(name, version){
	var now = new Date();
	var banner = [
		"/*! ",
		name + " " + version + " " + now.toISOString(),
		"Copyright 2015-" + now.getFullYear() + " " + pkg.author.name + " (" + pkg.author.email + ")",
		"Licensed under the Apache License, Version 2.0 | http://www.apache.org/licenses/LICENSE-2.0",
		" */",
		""].join("\n");
	return banner;
}

function getVersionNumber(filePath){
	var buffer = fs.readFileSync(filePath);
	var fileStr = buffer.toString("utf8", 0, buffer.length);
	var version = CONST.VERSION_PATTERN.exec(fileStr)[1];
	return version;
}

function concatAndMinify(src, fileName, name, version){
	return gulp.src(src)
		.pipe(sourcemaps.init())
		.pipe(concat(fileName))
		// The "changed" task needs to know the destination directory upfront
		.pipe(changed(CONST.DIST_FOLDER))
		.pipe(header(assembleBanner(name, version))) // Banner for copy
		.pipe(gulp.dest(CONST.DIST_FOLDER))
		.pipe(rename({
			extname: CONST.MIN_SUFFIX
		}))
		.pipe(uglify({
			mangle: false
		}))
		.pipe(header(assembleBanner(name, version)))// Banner for minified
		.pipe(sourcemaps.write(".", {
			includeContent: true,
			sourceRoot: "."
		}))
		.pipe(gulp.dest(CONST.DIST_FOLDER));
}

/* Tasks */

gulp.task("coverage", function(done){
	// Use Karma only for the sake of producing a code coverage report
	new karmaServer({
		configFile: __dirname + "/test/karma.conf.js"
	}, done).start();
});

gulp.task("dist", function(){
	var dataVersion = getVersionNumber(CONST.SRC_ROUTER);
	return concatAndMinify(CONST.SRC_FILES, CONST.CONCATENATED_FILE, pkg.name, dataVersion);
});

gulp.task("zip", function(){
	return gulp.src(CONST.FOLDERS_TO_ARCHIVE, {base: "."})
		.pipe(zip(CONST.ARCHIVE_FILE))
		.pipe(gulp.dest(CONST.ARCHIVE_FOLDER));
});

gulp.task("default", function(callback){
	runSequence(
		"dist",
		"zip",
		"coverage",
		function(error){
			if(error){
				console.log(error.message);
			}
			else{
				console.log("BUILD FINISHED SUCCESSFULLY");
			}
			callback(error);
		});
});