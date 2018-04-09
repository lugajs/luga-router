/* istanbul ignore if */
if(typeof(luga) === "undefined"){
	throw("Unable to find Luga JS Common");
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