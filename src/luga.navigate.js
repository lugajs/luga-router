(function(){
	"use strict";

	var config = {
		pushState: false,
		root: "/"
	};

	luga.navigateSetup = function(options){
		luga.merge(config, options);
		return config;
	};

	/* istanbul ignore next */
	luga.isPushStateSupported = function(){
		// Only IE9 should return false
		return (history.pushState !== undefined);
	};

	luga.usePushState = function(){
		return ((config.pushState === true) && (luga.isPushStateSupported() === true));
	};

	luga.navigate = function(fragment, options){
		var config = {
			replace: false,
			title: document.title
		};
		luga.merge(config, options);
	};

}());