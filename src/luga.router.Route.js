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

		// TODO: turn path into RegExp
		this.path = config.path;

		/**
		 * Execute registered enter callbacks, if any
		 */
		this.enter = function(){
			config.enterCallBacks.forEach(function(element, i, collection){
				element.apply(null, []);
			});
		};

		/**
		 * Execute registered exit callbacks, if any
		 */
		this.exit = function(){
			config.exitCallBacks.forEach(function(element, i, collection){
				element.apply(null, []);
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