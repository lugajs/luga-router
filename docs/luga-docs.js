luga.namespace("luga.docs");

(function(){
	"use strict";

	var Controller = function(){

		var CONST = {
			SELECTORS: {
				CONTENT: "#content"
			},
			INCLUDES_PATH: "fragments/",
			INCLUDES_SUFFIX: ".inc",
			DEFAULT_INCLUDE_ID: "index"
		};

		/**
		 * @type {luga.router.Router}
		 */
		var router = new luga.router.Router();

		var init = function(){
			initRouter();
			if(router.resolve(router.normalizeHash(location.hash)) === false){
				// Current hash is not resolved, load default content
				loadInclude(CONST.DEFAULT_INCLUDE_ID);
			}
		};

		var initRouter = function(){
			router.add("index", routeResolver);
			router.add("api", routeResolver);
			router.add("client-side", routeResolver);
			router.add("server-side", routeResolver);
			router.start();
		};

		/**
		 * Execute registered enter callbacks, if any
		 * @param {luga.router.routeContext} context
		 */
		var routeResolver = function(context){
			loadInclude(context.fragment);
		};

		var loadInclude = function(id){
			var fragmentUrl = CONST.INCLUDES_PATH + id + CONST.INCLUDES_SUFFIX;

			jQuery.ajax(fragmentUrl)
				.done(function(response, textStatus, jqXHR){
					// Read include and inject content
					jQuery(CONST.SELECTORS.CONTENT).empty();
					jQuery(CONST.SELECTORS.CONTENT).html(jqXHR.responseText);
				})
				.fail(function(){
					// TODO: implement error handling
					alert("error loading fragment");
				});

		};

		init();

	};

	jQuery(document).ready(function(){
		luga.docs.controller = new Controller();
	});

}());