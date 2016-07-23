(function(){
	"use strict";

	/**
	 * Router class
	 * @constructor
	 * @extends luga.Notifier
	 * @fires routeEnter
	 * @fires routeExit
	 */
	luga.router.Router = function(){

		var CONST = {
			ERROR_MESSAGES: {
				INVALID_ROUTE: "luga.router.Router: Invalid route passed to .add() method",
				DUPLICATE_ROUTE: "luga.router.Router: Duplicate route, path {0} already specified"
			}
		};

		luga.extend(luga.Notifier, this);

		/** @type {luga.router.Router} */
		var self = this;

		/** @type {array.<luga.router.iRouteHandler>} */
		var routeHandlers = [];

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
		 * @returns {luga.router.iRouteHandler|undefined}
		 */
		this.getMatchingHandler = function(fragment){
			return routeHandlers.find(function(element, index, array){
				return element.match(fragment) === true;
			});
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