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
			BASE_INCLUDE_ID: "index"
		};

		/**
		 * @type {luga.router.Router}
		 */
		var router = new luga.router.Router();

		var init = function(){

			initRouter();

			var currentHash = location.hash.substring(1);
			// If the hash is a valid route, load it
			if(router.getByPath(currentHash) !== undefined){
				loadInclude(currentHash);
			}
			else{
				loadInclude(CONST.BASE_INCLUDE_ID);
			}

		};

		var initRouter = function(){
			router.add("index", routeResolver);
			router.add("api", routeResolver);
			router.add("client-side", routeResolver);
			router.add("server-side", routeResolver);
			router.start();
		};

		var routeResolver = function(){
			loadInclude(this.fragment);
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