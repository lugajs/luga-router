/*! 
luga-router 0.1.0 2016-02-26T14:48:31.418Z
Copyright 2015-2016 Massimo Foti (massimo@massimocorner.com)
Licensed under the Apache License, Version 2.0 | http://www.apache.org/licenses/LICENSE-2.0
 */
/* istanbul ignore if */
if(typeof(luga) === "undefined"){
	throw("Unable to find Luga JS Core");
}

(function(){
	"use strict";

	luga.namespace("luga.router");

	luga.router.version = "0.1.0";


}());
(function(){
	"use strict";

	luga.namespace("luga.history");

	var config = {
		pushState: false
	};

	luga.history.setup = function(options){
		luga.merge(config, options);
		return config;
	};

	/* istanbul ignore next */
	luga.history.isPushStateSupported = function(){
		// Only IE9 should return false
		return (history.pushState !== undefined);
	};

	luga.history.usePushState = function(){
		return ((config.pushState === true) && (luga.history.isPushStateSupported() === true));
	};

	luga.history.navigate = function(fragment, options){
		var config = {
			replace: false,
			title: document.title
		};
		luga.merge(config, options);
	};

}());