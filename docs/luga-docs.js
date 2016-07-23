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

			loadRouter();

			var currentHash = location.hash.substring(1);
			// If the hash is a valid route, load it
			if(router.getByPath(currentHash) !== undefined){
				loadInclude(currentHash);
			}
			else{
				loadInclude(CONST.BASE_INCLUDE_ID);
			}

			router.start();
		};

		var loadRouter = function(){


			var rootHandler = new luga.router.RouteHandler({
				path: "index",
				enterCallBacks: [routeResolver]
			});

			var apiHandler = new luga.router.RouteHandler({
				path: "api",
				enterCallBacks: [routeResolver]
			});

			var clientSideHandler = new luga.router.RouteHandler({
				path: "client-side",
				enterCallBacks: [routeResolver]
			});

			var serverSideHandler = new luga.router.RouteHandler({
				path: "server-side",
				enterCallBacks: [routeResolver]
			});

			router.add(rootHandler);
			router.add(apiHandler);
			router.add(clientSideHandler);
			router.add(serverSideHandler);

		};

		var routeResolver = function(){
			loadInclude(this.fragment);
		};

		var loadInclude = function(id){
			var fragmentUrl = CONST.INCLUDES_PATH + id + CONST.INCLUDES_SUFFIX;

			jQuery.ajax(fragmentUrl)
				.done(function(response, textStatus, jqXHR){

					jQuery(CONST.SELECTORS.CONTENT).empty();
					jQuery(CONST.SELECTORS.CONTENT).html(jqXHR.responseText);
				})
				.fail(function(){
					alert("error loading fragment");
				});

		};

		init();

	};

	jQuery(document).ready(function(){
		luga.docs.controller = new Controller();
	});

}());