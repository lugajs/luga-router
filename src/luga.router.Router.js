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

		/** @type {array.<luga.router.iRoute>} */
		var routes = [];

		/**
		 * Add a Route. It can be invoked with two different sets of arguments:
		 * 1) Only one single Route object:
		 * ex: Router.add({luga.router.iRoute})
		 *
		 *
		 * @param {string|luga.router.iRoute} path
		 * @param {function|array.<function>} enterCallBack
		 * @param {function|array.<function>} exitCallBack
		 * @param {object} options
		 */
		this.add = function(path, enterCallBack, exitCallBack, options){
			if(arguments.length === 1){
				if(luga.router.isValidRoute(arguments[0]) !== true){
					throw(CONST.ERROR_MESSAGES.INVALID_ROUTE);
				}
				addRoute(arguments[0]);
			}
		};

		/**
		 *
		 * @param {luga.router.iRoute} route
		 */
		var addRoute = function(route){
			if(self.getRoute(route.path) !== undefined){
				throw(luga.string.format(CONST.ERROR_MESSAGES.DUPLICATE_ROUTE, [route.path]));
			}
			routes.push(route);
		};

		/**
		 * Return all the available route objects
		 * @returns {array.<luga.router.iRoute>}
		 */
		this.getAllRoutes = function(){
			return routes;
		};

		/**
		 * Return a registered route object matching the given path
		 * Return undefined if there is no match
		 * @param {string} path
		 * @returns {luga.router.iRoute|undefined}
		 */
		this.getRoute = function(path){
			var matchingRoute = routes.find(function(element, index, array){
				return element.path === path;
			});
			return matchingRoute;
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