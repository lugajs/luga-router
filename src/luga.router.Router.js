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
			if(self.getByPath(route.path) !== undefined){
				throw(luga.string.format(CONST.ERROR_MESSAGES.DUPLICATE_ROUTE, [route.path]));
			}
			routeHandlers.push(route);
		};

		/**
		 * Return all the available route objects
		 * @returns {array.<luga.router.iRouteHandler>}
		 */
		this.getAll = function(){
			return routeHandlers;
		};

		/**
		 * Return a registered route object associated with the given path
		 * Return undefined if none is fund
		 * @param {string} path
		 * @returns {luga.router.iRouteHandler|undefined}
		 */
		this.getByPath = function(path){
			return routeHandlers.find(function(element, index, array){
				return element.path === path;
			});
		};

		/**
		 * If options.greedy is false either:
		 * 1) Return a registered routeHandler object matching the given fragment
		 * 2) Return undefined if none is fund
		 *
		 * If options.greedy is true either:
		 * 1) Return an array of matching routeHandler objects if options.greedy is true
		 * 2) Return an empty array if none is fund
		 *
		 * @param {string} fragment
		 * @returns {luga.router.iRouteHandler|undefined|array.<luga.router.iRouteHandler>}
		 */
		this.getMatch = function(fragment){
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
		 * Remove all routeHandlers
		 */
		this.removeAll = function(options){
			routeHandlers = [];
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