luga.namespace("luga.docs");

(function(){
	"use strict";


	var Controller = function(){

		var CONST = {
			SELECTORS: {
				CONTENT: "#content"
			},
			FRAGMENTS_PATH: "fragments/",
			FRAGMENTS_SUFFIX: ".inc",
			FRAGMENTS: {
				INDEX: "index",
				API: "/",
				CLIENT_SIDE: ".inc",
				SERVER_SIDE: ".inc"
			}
		};

		var init = function(){
			var currentHash = location.hash.substring(1);
			if((currentHash !== "") && (CONST.FRAGMENTS[currentHash] !== undefined)){
				loadFragment(currentHash);
			} else {
				loadFragment(CONST.FRAGMENTS.INDEX);
			}
			initRouter();
		};

		var initRouter = function(){

			var router = new luga.router.Router();

			var rootHandler = new luga.router.RouteHandler({
				path: "",
				enterCallBacks: [function(){
					loadFragment(CONST.FRAGMENTS.INDEX);
				}]
			});

			var apiHandler = new luga.router.RouteHandler({
				path: "api",
				enterCallBacks: [function(){
					loadFragment("api");
				}]
			});

			var clientSideHandler = new luga.router.RouteHandler({
				path: "client-side",
				enterCallBacks: [function(){
					loadFragment("client-side");
				}]
			});

			var serverSideHandler = new luga.router.RouteHandler({
				path: "server-side",
				enterCallBacks: [function(){
					loadFragment("server-side");
				}]
			});

			router.add(rootHandler);
			router.add(apiHandler);
			router.add(clientSideHandler);
			router.add(serverSideHandler);

			router.start();
		};

		var loadFragment = function(id){
			var fragmentUrl = CONST.FRAGMENTS_PATH + id + CONST.FRAGMENTS_SUFFIX;

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