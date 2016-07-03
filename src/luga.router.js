/* istanbul ignore if */
if(typeof(luga) === "undefined"){
	throw("Unable to find Luga JS Core");
}

(function(){
	"use strict";

	/**
	 * @typedef {object} luga.Router.options
	 *
	 */

	/**
	 * Router class
	 *
	 * @param {luga.Router.options} options
	 * @constructor
	 * @extends luga.Notifier
	 * @fires routeChanged
	 */
	luga.Router = function(options){

		var CONST = {
			ERROR_MESSAGES: {}
		};

		var config = {};
		luga.merge(config, options);
		luga.extend(luga.Notifier, this);

		/** @type {luga.Router} */
		var self = this;
	};

	luga.Router.version = "0.1.0";

}());