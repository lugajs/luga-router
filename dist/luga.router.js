/*! 
luga-router 0.6.0 2018-04-06T13:29:05.954Z
https://github.com/lugajs/luga-router
Copyright 2015-2018 Massimo Foti (massimo@massimocorner.com)
Licensed under the Apache License, Version 2.0 | http://www.apache.org/licenses/LICENSE-2.0
 */
/* istanbul ignore if */
if(typeof(luga) === "undefined"){
	throw("Unable to find Luga JS Core");
}

/**
 * @interface luga.router.IRouteHandler
 *
 * @property {String} path
 *
 * Execute registered enter callbacks, if any
 * @function
 * @name luga.router.IRouteHandler#enter
 * @param {luga.router.routeContext} context
 *
 * Execute registered exit callbacks, if any
 * @function
 * @name luga.router.IRouteHandler#exit
 *
 * Return the handler payload, if any
 * Return undefined if no payload is associated with the handler
 * @function
 * @name luga.router.IRouteHandler#getPayload
 * @return {luga.router.routeContext|undefined}
 *
 * Return an object containing an entry for each param and the relevant values extracted from the fragment
 * @function
 * @name luga.router.IRouteHandler#getParams
 * @param {String} fragment
 * @return {Object}
 *
 * Return true if the given fragment matches the Route. False otherwise
 * @function
 * @name luga.router.IRouteHandler#match
 * @param {String}  fragment
 * @return {Boolean}
 */

/**
 * @typedef {Object} luga.router.IRouteHandler.options
 *
 * @property {String}           path              Path. Required
 * @property {Array.<function>} enterCallBacks    An array of functions that will be called on entering the route. Default to an empty array
 * @property {Array.<function>} exitCallBacks     An array of functions that will be called on exiting the route. Default to an empty array
 * @property {Object} payload                     An arbitrary object to be passed to callBacks every time they are invoked. Optional
 */

/**
 * @typedef {Object} luga.router.routeContext
 *
 * @property {String} fragment                Route fragment. Required
 * @property {String} path                    Route path. Required
 * @property {Object} params                  Object containing an entry for each param and the relevant values extracted from the fragment
 * @property {0bject|undefined} payload       Payload associated with the current IRouteHandler. Optional
 * @property {0bject|undefined} historyState  Object associated with a popstate event. Optional
 *                                            https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
 */

(function(){
	"use strict";

	luga.namespace("luga.router");
	luga.router.version = "0.6.0";

	/**
	 * Return true if the given object implements the luga.router.IRouteHandler interface. False otherwise
	 * @param {*} obj
	 * @return {Boolean}
	 */
	luga.router.isValidRouteHandler = function(obj){
		if(luga.type(obj) === "object"){
			if((luga.type(obj.path) === "string") &&
				(luga.type(obj.enter) === "function") &&
				(luga.type(obj.exit) === "function") &&
				(luga.type(obj.getPayload) === "function") &&
				(luga.type(obj.getParams) === "function") &&
				(luga.type(obj.match) === "function")){
				return true;
			}
		}
		return false;
	};

}());
(function(){
	"use strict";

	luga.namespace("luga.router.utils");

	/*
	 Lovingly adapted from Crossroads.js
	 https://millermedeiros.github.io/crossroads.js/
	 */

	// Leading and trailing slashes
	const SLASHES_REGEXP = /^\/|\/$/g;

	// Params:  everything between "{ }" or ": :"
	const PARAMS_REGEXP = /(?:\{|:)([^}:]+)(?:\}|:)/g;

	// Save params during compile (avoid escaping things that shouldn't be escaped)
	const TOKENS = {
		OS: {
			// Optional slashes
			// Slash between "::" or "}:" or "\w:" or ":{?" or "}{?" or "\w{?"
			rgx: /([:}]|\w(?=\/))\/?(:|(?:\{\?))/g,
			save: "$1{{id}}$2",
			res: "\\/?"
		},
		RS: {
			// Required slashes
			// Used to insert slash between ":{" and "}{"
			rgx: /([:}])\/?(\{)/g,
			save: "$1{{id}}$2",
			res: "\\/"
		},
		RQ: {
			// Required query string: everything in between "{? }"
			rgx: /\{\?([^}]+)\}/g,
			// Everything from "?" till "#" or end of string
			res: "\\?([^#]+)"
		},
		OQ: {
			// Optional query string: everything in between ":? :"
			rgx: /:\?([^:]+):/g,
			// Everything from "?" till "#" or end of string
			res: "(?:\\?([^#]*))?"
		},
		OR: {
			// Optional rest: everything in between ": *:"
			rgx: /:([^:]+)\*:/g,
			res: "(.*)?" // Optional group to avoid passing empty string as captured
		},
		RR: {
			// Rest param: everything in between "{ *}"
			rgx: /\{([^}]+)\*\}/g,
			res: "(.+)"
		},
		// Required/optional params should come after rest segments
		RP: {
			// Required params: everything between "{ }"
			rgx: /\{([^}]+)\}/g,
			res: "([^\\/?]+)"
		},
		OP: {
			// Optional params: everything between ": :"
			rgx: /:([^:]+):/g,
			res: "([^\\/?]+)?\/?"
		}
	};

	for(let key in TOKENS){
		/* istanbul ignore else */
		if(TOKENS.hasOwnProperty(key) === true){
			const current = TOKENS[key];
			current.id = "__LUGA_" + key + "__";
			current.save = ("save" in current) ? current.save.replace("{{id}}", current.id) : current.id;
			current.rRestore = new RegExp(current.id, "g");
		}
	}

	const replaceTokens = function(pattern, regexpName, replaceName){
		for(let key in TOKENS){
			/* istanbul ignore else */
			if(TOKENS.hasOwnProperty(key) === true){
				const current = TOKENS[key];
				pattern = pattern.replace(current[regexpName], current[replaceName]);
			}
		}
		return pattern;
	};

	/**
	 * Turn a path into a regular expression
	 * @param {String} path
	 * @return {RegExp}
	 */
	luga.router.utils.compilePath = function(path){

		// Remove leading and trailing slashes, if any
		let pattern = path.replace(SLASHES_REGEXP, "");

		// Save tokens
		pattern = replaceTokens(pattern, "rgx", "save");
		// Restore tokens
		pattern = replaceTokens(pattern, "rRestore", "res");

		// Add optional leading and trailing slashes
		pattern = "\\/?" + pattern + "\\/?";

		return new RegExp("^" + pattern + "$");
	};

	/**
	 * Extract matching values out of a given path using a specified RegExp
	 * @param {RegExp} regex
	 * @param  {String} path
	 * @return {Array}
	 */
	const extractValues = function(regex, path){
		const values = [];
		let match;
		// Reset lastIndex since RegExp can have "g" flag thus multiple runs might affect the result
		regex.lastIndex = 0;
		while((match = regex.exec(path)) !== null){
			values.push(match[1]);
		}
		return values;
	};

	/**
	 * Extract an array of id out of a given path
	 * @param {String} path
	 * @return {Array}
	 */
	luga.router.utils.getParamIds = function(path){
		return extractValues(PARAMS_REGEXP, path);
	};

	/**
	 * Extract an array of values out of a given path using a RegExp
	 * @param {String} fragment
	 * @param {RegExp} regex
	 * @return {Array}
	 */
	luga.router.utils.getParamValues = function(fragment, regex){
		const values = regex.exec(fragment);
		/* istanbul ignore else */
		if(values !== null){
			// We want a plain vanilla array, normalize the result object
			values.shift();
			delete values.index;
			delete values.input;
			delete values.groups;
		}
		return values;
	};

}());
/**
 * @typedef {Object} luga.router.options
 *
 * @property {String} rootPath                 Default to empty string
 * @property {function} handlerConstructor     Constructor of routeHandler class. Must implement IRouteHandler. Default to luga.router.RouteHandler
 * @property {Boolean} greedy                  Set it to true to allow multiple routes matching. Default to false
 * @property {Boolean} pushState               Set it to true if you want to list to window.popstate. Default to false and listen to window.hashchange instead
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

		/** @type {String|undefined} */
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
		 * @param {String|luga.router.IRouteHandler} path        Either a routeHandler object or a path expressed as string. Required
		 * @param {Function|array.<function>} [enterCallBack]   Either a single callBack function or an array of functions to be invoked before entering the route. Optional
		 * @param {Function|array.<function>} [exitCallBack]     Either a single callBack function or an array of functions to be invoked before leaving the route. Optional
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
		 * @param {String} path
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
		 * @param {String} fragment
		 * @return {luga.router.IRouteHandler|undefined|array.<luga.router.IRouteHandler>}
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
		 * @param {String} inputString
		 * @return {String}
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
		 * @param {String} inputString
		 * @return {String}
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
		 * @param {String} path
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
		 * @param {String} fragment
		 * @param {Object|undefined} resOptions
		 * @return {Boolean} True if at least one routeHandler was resolved, false otherwise
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
		 * @param {String} fragment
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
				self.notifyObservers(CONST.EVENTS.EXIT, {});
			});
		};

		/**
		 * Assemble a route context
		 * @param {luga.router.IRouteHandler} handler
		 * @param {String} fragment
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
		 * If inside a browser, start listening to the "hashchange" and "popstate" events
		 */
		this.start = function(){
			/* istanbul ignore else */
			if(window !== undefined){
				if(config.pushState === false){
					window.addEventListener("hashchange", self.onHashChange, false);
				}
				else{
					window.addEventListener("popstate", self.onPopstate, false);
				}
			}
		};

		/**
		 * Stop the Router
		 * If inside a browser, stop listening to the "hashchange" and "popstate" events
		 */
		this.stop = function(){
			/* istanbul ignore else */
			if(window !== undefined){
				if(config.pushState === false){
					window.removeEventListener("hashchange", self.onHashChange, false);
				}
				else{
					window.removeEventListener("popstate", self.onPopstate, false);
				}
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
(function(){
	"use strict";

	/**
	 * Route class
	 * @param options {luga.router.IRouteHandler.options}
	 * @constructor
	 * @implements luga.router.IRouteHandler
	 */
	luga.router.RouteHandler = function(options){

		const CONST = {
			ERROR_MESSAGES: {
				INVALID_PATH_REGEXP: "luga.router.RouteHandler: Invalid path. You must use strings, RegExp are not allowed"
			}
		};

		/**
		 * @type {luga.router.IRouteHandler.options}
		 */
		const config = {
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

		this.path = config.path;

		/** @type {RegExp} */
		const compiledPath = luga.router.utils.compilePath(this.path);

		/** @type {Array} */
		const paramsId = luga.router.utils.getParamIds(this.path);

		/**
		 * Execute registered enter callbacks, if any
		 * @param {luga.router.routeContext} context
		 */
		this.enter = function(context){
			config.enterCallBacks.forEach(function(element){
				element.apply(null, [context]);
			});
		};

		/**
		 * Execute registered exit callbacks, if any
		 */
		this.exit = function(){
			config.exitCallBacks.forEach(function(element){
				element.apply(null, []);
			});
		};

		/**
		 * Return an object containing an entry for each param and the relevant values extracted from the fragment
		 * @param {String} fragment
		 * @return {Object}
		 */
		this.getParams = function(fragment){
			const ret = {};
			const values = luga.router.utils.getParamValues(fragment, compiledPath);
			// Merge the two parallel arrays
			paramsId.forEach(function(element, i){
				ret[element] = values[i];
			});
			return ret;
		};

		/**
		 * Return the handler payload, if any
		 * Return undefined if no payload is associated with the handler
		 * @return {luga.router.routeContext|undefined}
		 */
		this.getPayload = function(){
			return config.payload;
		};

		/**
		 * Return true if the given fragment matches the Route. False otherwise
		 * @param {String}  fragment
		 * @return {Boolean}
		 */
		this.match = function(fragment){
			return compiledPath.test(fragment);
		};

	};

}());
(function(){
	"use strict";

	/**
	 * @typedef {Object} luga.history.options
	 *
	 * @property {Boolean} pushState  Determine if we use pushState or the location hash. Default to false. If pushState is not available (like in IE9) the location hash will be used anyway
	 */

	luga.namespace("luga.history");

	/**
	 * @type {luga.history.options}
	 */
	const settings = {
		pushState: false
	};

	/**
	 * Change current configuration
	 * @param {luga.history.options} options
	 * @return {luga.history.options}
	 */
	luga.history.setup = function(options){
		luga.merge(settings, options);
		return settings;
	};

	/**
	 * Return true if are using pushState, false otherwise
	 * The result depend on a combination of browser capabilities and current configuration
	 * @return {Boolean}
	 */
	luga.history.usePushState = function(){
		return settings.pushState === true;
	};

	/**
	 * @typedef {Object} luga.history.navigate.options
	 *
	 * @property {Boolean} replace  Determine if we add a new history entry or replace the current one
	 * @property {String}  title    Title to be passed to pushState. Default to empty string. Some browser don't support this yet
	 * @property {Object}  state    A JavaScript object which is associated with the new history entry. Default to an empty object. See:
	 *                              https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method
	 */

	/**
	 * Add an entry to the browser's history or modify the current entry
	 * https://developer.mozilla.org/en-US/docs/Web/API/History_API
	 * @param {String} fragment
	 * @param {luga.history.navigate.options} options
	 */
	luga.history.navigate = function(fragment, options){
		const config = {
			replace: false,
			title: "",
			state: {}
		};
		luga.merge(config, options);

		// pushState
		if(luga.history.usePushState() === true){
			let historyMethod = "pushState";
			if(config.replace === true){
				historyMethod = "replaceState";
			}
			history[historyMethod](config.state, config.title, fragment);
		}
		// location hash
		else{
			if(config.replace === true){
				const newLocation = location.href.replace(/(javascript:|#).*$/, "");
				location.replace(newLocation  + "#" + fragment);
			}
			else{
				// Some browsers require that location hash contains a leading #
				location.hash = "#" + fragment;
			}
		}
	};

}());