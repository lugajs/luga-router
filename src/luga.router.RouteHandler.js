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
		 * Return an object containing an entry for each param and the relevant values extracted from the fragment
		 * @param {String} fragment
		 * @return {Object}
		 */
		this.getParams = function(fragment){
			const ret = {};
			const values = luga.router.utils.getParamValues(fragment, compiledPath);
			// Merge the two parallel arrays
			paramsId.forEach(function(element, i, collection){
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