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