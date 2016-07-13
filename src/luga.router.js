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

		this.onHashChange = function(){

		};

		this.onPopstate = function(){

		};

	};

}());