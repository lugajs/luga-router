/* istanbul ignore if */
if(typeof(luga) === "undefined"){
	throw("Unable to find Luga JS Core");
}

luga.namespace("luga.router");
luga.router.version = "0.1.0";

(function(){
	"use strict";

	var instance = null;

	/**
	 * Static accessor method
	 * @returns {Router}
	 */
	luga.router.getInstance = function(){
		if(instance === null){
			instance = new Router();
		}
		return instance;
	};

	/**
	 * Router class
	 * @constructor
	 * @extends luga.Notifier
	 * @fires routeChanged
	 */
	var Router = function(){

		luga.extend(luga.Notifier, this);

		/** @type {Router} */
		var self = this;
	};

}());