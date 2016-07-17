/* istanbul ignore if */
if(typeof(luga) === "undefined"){
	throw("Unable to find Luga JS Core");
}

luga.namespace("luga.router");
luga.router.version = "0.1.0";

(function(){
	"use strict";

	/**
	 * Router class
	 * @constructor
	 * @extends luga.Notifier
	 * @fires routeChanged
	 */
	luga.router.Router = function(){

		luga.extend(luga.Notifier, this);

		/** @type {luga.router.Router} */
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