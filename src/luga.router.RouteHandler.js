/**
 * @typedef {object} luga.router.IRouteHandler.options
 *
 * @property {string}           path              Path. Required
 * @property {array.<function>} enterCallBacks    Records to be loaded, either one single object containing value/name pairs, or an array of name/value pairs
 * @property {array.<function>} exitCallBacks     formatter  A formatting functions to be called once for each row in the dataSet. Default to null
 * @property {object} payload
 */

(function(){
	"use strict";

	/**
	 * Route class
	 * @param options {luga.router.IRouteHandler.options}
	 * @constructor
	 * @extends luga.router.IRouteHandler
	 */
	luga.router.RouteHandler = function(options){

		var CONST = {
			ERROR_MESSAGES: {
				INVALID_PATH_REGEXP: "luga.router.RouteHandler: Invalid path. You must use strings, RegExp are not allowed"
			}
		};

		/**
		 * @type {luga.router.IRouteHandler.options}
		 */
		var config = {
			path: "",
			enterCallBacks: [],
			exitCallBacks: [],
			payload: undefined
		};

		luga.merge(config, options);
		if(luga.type(config.enterCallBacks) === "function"){
			config.enterCallBacks = [config.enterCallBacks];
		}
		if(luga.type(config.exitCallBacks) === "function"){
			config.exitCallBacks = [config.exitCallBacks];
		}

		if(luga.type(config.path) === "regexp"){
			throw(CONST.ERROR_MESSAGES.INVALID_PATH_REGEXP);
		}

		// TODO: compile path
		this.path = config.path;

		/**
		 * Execute registered enter callbacks, if any
		 * @param {luga.router.routeContext} context
		 */
		this.enter = function(context){
			config.enterCallBacks.forEach(function(element, i, collection){
				element.apply(null, [context]);
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
		 * Return the handler payload, if any
		 * Return undefined if no payload is associated with the handler
		 * @returns {luga.router.routeContext|undefined}
		 */
		this.getPayload = function(){
			return config.payload;
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