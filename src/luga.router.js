/* istanbul ignore if */
if(typeof(luga) === "undefined"){
	throw("Unable to find Luga JS Core");
}

/**
 * @typedef {object} luga.router.iRouteHandler
 *
 * @property {string} path
 * @property {function} enter
 * @property {function} exit
 * @property {function} getPayload
 * @property {function} match
 */

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
				(luga.type(obj.getPayload) === "function") &&
				(luga.type(obj.match) === "function")){
				return true;
			}
		}
		return false;
	};

}());