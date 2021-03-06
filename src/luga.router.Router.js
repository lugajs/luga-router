/**
 * @typedef {Object} luga.router.options
 *
 * @property {string} rootPath                 Default to empty string
 * @property {function} handlerConstructor     Constructor of routeHandler class. Must implement IRouteHandler. Default to luga.router.RouteHandler
 * @property {boolean} greedy                  Set it to true to allow multiple routes matching. Default to false
 * @property {boolean} pushState               Set it to true if you want to list to window.popstate. Default to false and listen to window.hashchange instead
 */
(function(){
	"use strict";

	/**
	 * Router class
	 * @param {luga.router.options|undefined} options
	 * @constructor
	 * @extends luga.Notifier
	 * @fires routeEntered
	 * @fires routeExited
	 */
	luga.router.Router = function(options){

		const CONST = {
			ERROR_MESSAGES: {
				INVALID_ROUTE: "luga.router.Router: Invalid route passed to .add() method",
				INVALID_ADD_ARGUMENTS: "luga.router.Router: Invalid arguments passed to .add() method",
				DUPLICATE_ROUTE: "luga.router.Router: Duplicate route, path {0} already specified"
			},
			EVENTS: {
				ENTER: "routeEntered",
				EXIT: "routeExited"
			}
		};

		luga.extend(luga.Notifier, this);

		/**
		 * @type {luga.router.options}
		 */
		const config = {
			rootPath: "",
			handlerConstructor: luga.router.RouteHandler,
			greedy: false,
			pushState: false
		};

		luga.merge(config, options);

		/** @type {luga.router.Router} */
		const self = this;

		/** @type {Array.<luga.router.IRouteHandler>} */
		let routeHandlers = [];

		/** @type {string|undefined} */
		let currentFragment;

		/** @type {Array.<luga.router.IRouteHandler>} */
		let currentHandlers = [];

		/**
		 * Add a route. It can be invoked with two different sets of arguments:
		 * 1) A path expressed as a string, plus additional optional arguments
		 *
		 * 2) One routeHandler object:
		 * ex: Router.add({luga.router.IRouteHandler})
		 *
		 *
		 * @param {string|luga.router.IRouteHandler} path        Either a routeHandler object or a path expressed as string. Required
		 * @param {Function|Array.<Function>} [enterCallBack]   Either a single callBack function or an array of functions to be invoked before entering the route. Optional
		 * @param {Function|Array.<Function>} [exitCallBack]     Either a single callBack function or an array of functions to be invoked before leaving the route. Optional
		 * @param {Object} [payload]                             A payload object to be passed to the callBacks. Optional
		 */
		this.add = function(path, enterCallBack, exitCallBack, payload){
			if(arguments.length === 1){
				/* istanbul ignore else */
				if((luga.type(arguments[0]) !== "string") && (luga.type(arguments[0]) !== "object")){
					throw(CONST.ERROR_MESSAGES.INVALID_ADD_ARGUMENTS);
				}
				/* istanbul ignore else */
				if(luga.type(arguments[0]) === "object"){
					if(luga.router.isValidRouteHandler(arguments[0]) !== true){
						throw(CONST.ERROR_MESSAGES.INVALID_ROUTE);
					}
					addHandler(arguments[0]);
				}
			}
			if((arguments.length > 1) && (luga.router.isValidRouteHandler(arguments[0]) === true)){
				throw(CONST.ERROR_MESSAGES.INVALID_ADD_ARGUMENTS);
			}
			if((arguments.length > 0) && (luga.type(arguments[0]) === "string")){
				const handlerOptions = {
					path: path,
					enterCallBacks: [],
					exitCallBacks: [],
					payload: payload
				};
				if(luga.type(enterCallBack) === "array"){
					handlerOptions.enterCallBacks = enterCallBack;
				}
				if(luga.type(enterCallBack) === "function"){
					handlerOptions.enterCallBacks = [enterCallBack];
				}
				if(luga.type(exitCallBack) === "array"){
					handlerOptions.exitCallBacks = exitCallBack;
				}
				if(luga.type(exitCallBack) === "function"){
					handlerOptions.exitCallBacks = [exitCallBack];
				}
				const handler = new config.handlerConstructor(handlerOptions);
				addHandler(handler);
			}
		};

		/**
		 *
		 * @param {luga.router.IRouteHandler} route
		 */
		const addHandler = function(route){
			if(self.getByPath(route.path) !== undefined){
				throw(luga.string.format(CONST.ERROR_MESSAGES.DUPLICATE_ROUTE, [route.path]));
			}
			routeHandlers.push(route);
		};

		/**
		 * Return all the available route objects
		 * @return {Array.<luga.router.IRouteHandler>}
		 */
		this.getAll = function(){
			return routeHandlers;
		};

		/**
		 * Return a registered route object associated with the given path
		 * Return undefined if none is fund
		 * @param {string} path
		 * @return {luga.router.IRouteHandler|undefined}
		 */
		this.getByPath = function(path){
			for(let i = 0; i < routeHandlers.length; i++){
				if(routeHandlers[i].path === path){
					return routeHandlers[i];
				}
			}
		};

		/**
		 * If options.greedy is false either:
		 * 1) Return a registered routeHandler object matching the given fragment
		 * 2) Return undefined if none is fund
		 *
		 * If options.greedy is true either:
		 * 1) Return an array of matching routeHandler objects
		 * 2) Return an empty array if none is fund
		 *
		 * @param {string} fragment
		 * @return {luga.router.IRouteHandler|undefined|Array.<luga.router.IRouteHandler>}
		 */
		this.getMatch = function(fragment){
			if(config.greedy === false){
				for(let i = 0; i < routeHandlers.length; i++){
					if(routeHandlers[i].match(fragment) === true){
						return routeHandlers[i];
					}
				}
			}
			else{
				return routeHandlers.filter(function(element, index, array){
					return element.match(fragment) === true;
				});
			}
		};

		/**
		 * Remove the rootPath in front of the given string
		 * Also remove the querystring, if any
		 * @param {string} inputString
		 * @return {string}
		 */
		this.normalizeFragment = function(inputString){
			if(inputString.indexOf("?") !== -1){
				inputString = inputString.substring(0, inputString.indexOf("?"));
			}
			const pattern = new RegExp("^\/?" + config.rootPath);
			return inputString.replace(pattern, "");
		};

		/**
		 * Remove any '#' and/or '!' in front of the given string
		 * Then remove the rootPath too
		 * @param {string} inputString
		 * @return {string}
		 */
		this.normalizeHash = function(inputString){
			if(inputString[0] === "#"){
				inputString = inputString.substring(1);
			}
			if(inputString[0] === "!"){
				inputString = inputString.substring(1);
			}
			return self.normalizeFragment(inputString);
		};

		/**
		 * Remove the routeHandler matching the given path
		 * Fails silently if the given path does not match any routeHandler
		 * @param {string} path
		 */
		this.remove = function(path){
			const index = routeHandlers.indexOf(self.getByPath(path));
			if(index !== -1){
				routeHandlers.splice(index, 1);
			}
		};

		/**
		 * Remove all routeHandlers
		 */
		this.removeAll = function(){
			routeHandlers = [];
		};

		/**
		 * If options.greedy is false either fails silently if no match is fund or:
		 * 1) Call the exit() method of the previously matched routeHandler
		 * 2) Call the enter() method of the first registered routeHandler matching the given fragment
		 *
		 * If options.greedy is true either fails silently if no match is fund or:
		 * 1) Call the exit() method of the previously matched routeHandlers
		 * 2) Call the enter() method of all the registered routeHandlers matching the given fragment
		 *
		 * @param {string} fragment
		 * @param {Object|undefined} resOptions
		 * @return {boolean} True if at least one routeHandler was resolved, false otherwise
		 */
		this.resolve = function(fragment, resOptions){
			let matches = self.getMatch(fragment);
			if(matches === undefined){
				return false;
			}
			// Single match
			if(luga.type(matches) !== "array"){
				matches = [matches];
			}
			exit(resOptions);
			enter(matches, fragment, resOptions);
			return matches.length > 0;
		};

		/**
		 * Overwrite the current handlers with the given ones
		 * Then execute the enter() method on each of them
		 * Finally: triggers a 'routeEntered' notification
		 * @param {Array.<luga.router.IRouteHandler>} handlers
		 * @param {string} fragment
		 * @param {Object} enterOptions
		 */
		const enter = function(handlers, fragment, enterOptions){
			currentHandlers = handlers;
			currentFragment = fragment;
			currentHandlers.forEach(function(element){
				const context = assembleContext(element, fragment, enterOptions);
				element.enter(context);
				self.notifyObservers(CONST.EVENTS.ENTER, context);
			});
		};

		/**
		 * Execute the exit() method on all the current handlers
		 */
		const exit = function(){
			currentHandlers.forEach(function(element){
				const context = assembleContext(element, currentFragment, options);
				element.exit(context);
				self.notifyObservers(CONST.EVENTS.EXIT, context);
			});
		};

		/**
		 * Assemble a route context
		 * @param {luga.router.IRouteHandler} handler
		 * @param {string} fragment
		 * @param {Object} contextOptions
		 * @return {luga.router.routeContext}
		 */
		const assembleContext = function(handler, fragment, contextOptions){
			/** @type {luga.router.routeContext} */
			const context = {
				fragment: fragment,
				path: handler.path,
				payload: handler.getPayload(),
				params: handler.getParams(fragment),
				historyState: undefined
			};

			luga.merge(context, contextOptions);
			return context;
		};

		/**
		 * Change current configuration
		 * @param {luga.router.options} setupOptions
		 * @return {luga.router.options}
		 */
		this.setup = function(setupOptions){
			luga.merge(config, setupOptions);
			return config;
		};

		/**
		 * Bootstrap the Router
		 * Start listening to the "hashchange" and "popstate" events
		 */
		this.start = function(){
			if(config.pushState === false){
				window.addEventListener("hashchange", self.onHashChange, false);
			}
			else{
				window.addEventListener("popstate", self.onPopstate, false);
			}
		};

		/**
		 * Stop the Router
		 * Stop listening to the "hashchange" and "popstate" events
		 */
		this.stop = function(){
			if(config.pushState === false){
				window.removeEventListener("hashchange", self.onHashChange, false);
			}
			else{
				window.removeEventListener("popstate", self.onPopstate, false);
			}
		};

		/**
		 * Handle a hashchange event
		 * https://developer.mozilla.org/en-US/docs/Web/API/HashChangeEvent
		 */
		this.onHashChange = function(){
			self.resolve(self.normalizeHash(location.hash));
		};

		/**
		 * Handle a popstate event
		 * https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
		 * @param {event} event
		 */
		this.onPopstate = function(event){
			const fragment = self.normalizeFragment(document.location.pathname);
			self.resolve(fragment, {historyState: event.state});
		};

	};

}());