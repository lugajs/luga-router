/* istanbul ignore if */
if(typeof(luga) === "undefined"){
	throw("Unable to find Luga JS Core");
}

/**
 * @interface luga.router.IRouteHandler
 *
 * @property {string} path
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
 * @returns {luga.router.routeContext|undefined}
 *
 * Return an object containing an entry for each param and the relevant values extracted from the fragment
 * @function
 * @name luga.router.IRouteHandler#getParams
 * @param {string} fragment
 * @returns {object}
 *
 * Return true if the given fragment matches the Route. False otherwise
 * @function
 * @name luga.router.IRouteHandler#match
 * @param {string}  fragment
 * @returns {boolean}
 */

/**
 * @typedef {object} luga.router.IRouteHandler.options
 *
 * @property {string}           path              Path. Required
 * @property {array.<function>} enterCallBacks    An array of functions that will be called on entering the route
 * @property {array.<function>} exitCallBacks     An array of functions that will be called on exiting the route
 * @property {object} payload
 */

/**
 * @typedef {object} luga.router.routeContext
 *
 * @property {string} fragment                Route fragment. Required
 * @property {string} path                    Route path. Required
 * @property {object} params                  Object containing an entry for each param and the relevant values extracted from the fragment
 * @property {object|undefined} payload       Payload associated with the current IRouteHandler. Optional
 * @property {object|undefined} historyState  Object associated with a popstate event. Optional
 *                                            https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
 */

(function(){
	"use strict";

	luga.namespace("luga.router");
	luga.router.version = "0.1.0";

	/**
	 * Return true if the given object implements the luga.router.IRouteHandler interface. False otherwise
	 * @param {*} obj
	 * @returns {boolean}
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