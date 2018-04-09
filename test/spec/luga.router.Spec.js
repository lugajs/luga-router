describe("luga.router", function(){

	"use strict";

	it("Requires Luga Common in order to work", function(){
		expect(luga).toBeDefined();
	});

	it("Lives inside its own namespace", function(){
		expect(luga.router).toBeDefined();
	});

	describe(".version", function(){
		it("Report the current version number", function(){
			expect(luga.router.version).toBeDefined();
		});
	});

	describe(".isValidRoute()", function(){

		it("Return true if the given object implements the luga.router.IRouteHandler interface", function(){

			const goodRute = new luga.router.RouteHandler({
				path: "ciccio",
				enterCallBacks: [],
				exitCallBacks: []
			});

			expect(luga.router.isValidRouteHandler(goodRute)).toEqual(true);
		});

		it("Return false otherwise", function(){
			expect(luga.router.isValidRouteHandler(new luga.router.Router())).toEqual(false);
			expect(luga.router.isValidRouteHandler({})).toEqual(false);
			expect(luga.router.isValidRouteHandler("test")).toEqual(false);
		});

	});

});