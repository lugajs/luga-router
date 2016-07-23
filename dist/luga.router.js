/*! 
luga-router 0.1.0 2016-07-23T12:03:29.177Z
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

	/**
	 * Return true if the given object implements the luga.router.iRouteHandler interface. False otherwise
	 * @param {*} obj
	 * @returns {boolean}
	 */
	luga.router.isValidRouteHandler = function(obj){
		if(luga.type(obj) === "object"){
			if((luga.type(obj.path) === "string") &&
				(luga.type(obj.enter) === "function") &&
				(luga.type(obj.exit) === "function") &&
				(luga.type(obj.match) === "function")){
				return true;
			}
		}
		return false;
	};

}());
/**
 * @typedef {object} luga.router.options
 *
 * @property {string} rootPath     Default to empty string
 * @property {boolean} greedy      Set it to true to allow multiple routes matching. Default to false
 */

(function(){
	"use strict";

	/**
	 * Router class
	 * @param options {luga.router.options}
	 * @constructor
	 * @extends luga.Notifier
	 * @fires routeEnter
	 * @fires routeExit
	 */
	luga.router.Router = function(options){

		var CONST = {
			ERROR_MESSAGES: {
				INVALID_ROUTE: "luga.router.Router: Invalid route passed to .add() method",
				DUPLICATE_ROUTE: "luga.router.Router: Duplicate route, path {0} already specified"
			}
		};

		luga.extend(luga.Notifier, this);

		/**
		 * @type {luga.router.options}
		 */
		var config = {
			rootPath: "",
			greedy: false
		};

		luga.merge(config, options);

		/** @type {luga.router.Router} */
		var self = this;

		/** @type {array.<luga.router.iRouteHandler>} */
		var routeHandlers = [];

		/** @type {array.<luga.router.iRouteHandler>} */
		var currentHandlers = [];

		/**
		 * Add a Route. It can be invoked with two different sets of arguments:
		 * 1) Only one single Route object:
		 * ex: Router.add({luga.router.iRouteHandler})
		 *
		 *
		 * @param {string|luga.router.iRouteHandler} path            Either a Route object or a path expressed as string. Required
		 * @param {function|array.<function>} enterCallBack   Either a single callBack function or an array of functions to be invoked before entering the route
		 * @param {function|array.<function>} exitCallBack    Either a single callBack function or an array of functions to be invoked before leaving the route. Optional
		 * @param {object} payload                            A payload object to be passed to the callBacks. Optional
		 */
		this.add = function(path, enterCallBack, exitCallBack, payload){
			if((arguments.length === 1) && (luga.type(arguments[0]) === "object")){
				if(luga.router.isValidRouteHandler(arguments[0]) !== true){
					throw(CONST.ERROR_MESSAGES.INVALID_ROUTE);
				}
				addHandler(arguments[0]);
			}
		};

		/**
		 *
		 * @param {luga.router.iRouteHandler} route
		 */
		var addHandler = function(route){
			if(self.getHandlerByPath(route.path) !== undefined){
				throw(luga.string.format(CONST.ERROR_MESSAGES.DUPLICATE_ROUTE, [route.path]));
			}
			routeHandlers.push(route);
		};

		/**
		 * Return all the available route objects
		 * @returns {array.<luga.router.iRouteHandler>}
		 */
		this.getAllHandlers = function(){
			return routeHandlers;
		};

		/**
		 * Return a registered route object associated with the given path
		 * Return undefined if none is fund
		 * @param {string} path
		 * @returns {luga.router.iRouteHandler|undefined}
		 */
		this.getHandlerByPath = function(path){
			return routeHandlers.find(function(element, index, array){
				return element.path === path;
			});
		};

		/**
		 * Return a registered route object matching the given fragment
		 * Return undefined if none is fund
		 * @param {string} fragment
		 * @returns {luga.router.iRouteHandler|undefined|array.<luga.router.iRouteHandler>}
		 */
		this.getMatchingHandler = function(fragment){
			if(config.greedy === false){
				return routeHandlers.find(function(element, index, array){
					return element.match(fragment) === true;
				});
			}
			else{
				return routeHandlers.filter(function(element, index, array){
					return element.match(fragment) === true;
				});
			}
		};

		/**
		 * Change current configuration
		 * @param {luga.router.options} options
		 * @returns {luga.router.options}
		 */
		this.setup = function(options){
			luga.merge(config, options);
			return config;
		};

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
 * @typedef {object} luga.router.iRouteHandler
 *
 * @property {string} path
 * @property {function} enter
 * @property {function} exit
 * @property {function} match
 */

/**
 * @typedef {object} luga.router.iRouteHandler.options
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
	 * @param options {luga.router.iRouteHandler.options}
	 * @constructor
	 * @extends luga.router.iRouteHandler
	 */
	luga.router.RouteHandler = function(options){

		/**
		 * @type {luga.router.iRouteHandler.options}
		 */
		var config = {
			path: "",
			enterCallBacks: [],
			exitCallBacks: [],
			payload: undefined
		};

		luga.merge(config, options);

		/** @type {luga.router.RouteHandler} */
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