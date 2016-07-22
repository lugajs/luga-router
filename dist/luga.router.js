/*! 
luga-router 0.1.0 2016-07-22T17:06:27.553Z
Copyright 2015-2016 Massimo Foti (massimo@massimocorner.com)
Licensed under the Apache License, Version 2.0 | http://www.apache.org/licenses/LICENSE-2.0
 */
/* istanbul ignore if */
if(typeof(luga) === "undefined"){
	throw("Unable to find Luga JS Core");
}

(function(){
	"use strict";

	luga.namespace("luga.router");
	luga.router.version = "0.1.0";

}());
(function(){
	"use strict";

	/**
	 * Router class
	 * @constructor
	 * @extends luga.Notifier
	 * @fires routeChanged
	 */
	luga.router.Router = function(){

		luga.extend(luga.Notifier, this);

		/** @type {luga.router.Router} */
		var self = this;

		/**
		 * Bootstrap the Router
		 * If inside a browser, start listening to the "hashchange" and "popstate" events
		 */
		this.start = function(){
			/* istanbul ignore else */
			if(window !== undefined){
				window.addEventListener("hashchange", self.onHashChange, false);
				window.addEventListener("popstate", self.onPopstate, false);
			}
		};

		/**
		 * Stop the Router
		 * If inside a browser, stop listening to the "hashchange" and "popstate" events
		 */
		this.stop = function(){
			/* istanbul ignore else */
			if(window !== undefined){
				window.removeEventListener("hashchange", self.onHashChange, false);
				window.removeEventListener("popstate", self.onPopstate, false);
			}
		};

		this.onHashChange = function(){

		};

		this.onPopstate = function(){

		};

	};

}());
/**
 * @typedef {object} luga.router.iRoute
 *
 * @property {string} path
 * @property {function} enter
 * @property {function} exit
 * @property {function} match
 */

/**
 * @typedef {object} luga.router.iRoute.options
 *
 * @property {string}           path              Path. Required
 * @property {array.<function>} enterCallBacks    Records to be loaded, either one single object containing value/name pairs, or an array of name/value pairs
 * @property {array.<function>} exitCallBacks     formatter  A formatting functions to be called once for each row in the dataSet. Default to null
 */

(function(){
	"use strict";

	/**
	 * Route class
	 * @param options {luga.router.iRoute.options}
	 * @constructor
	 * @extends luga.router.iRoute
	 */
	luga.router.Route = function(options){

		/**
		 * @type {luga.router.iRoute.options}
		 */
		var config = {
			path: "",
			enterCallBacks: [],
			exitCallBacks: []
		};

		luga.merge(config, options);

		/** @type {luga.router.iRoute} */
		var self = this;

		this.path = config.path;

		/**
		 * Execute registered exit callbacks, if any
		 */
		this.enter = function(){
			config.enterCallBacks.forEach(function(element, i, collection){
				element.call();
			});
		};

		/**
		 * Execute registered exit callbacks, if any
		 */
		this.exit = function(){
			config.exitCallBacks.forEach(function(element, i, collection){
				element.call();
			});
		};

		/**
		 * Return true if the given fragment matches the Route. False otherwise
		 * @param fragment
		 * @returns {boolean}
		 */
		this.match = function(fragment){
			// TODO: implement pattern matching
			return fragment === config.path;
		};

	};

}());