describe("luga.router", function(){

	"use strict";

	it("Lives inside its own namespace", function(){
		expect(luga.router).toBeDefined();
	});

	describe(".version", function(){
		it("Report the current version number", function(){
			expect(luga.router.version).toBeDefined();
		});
	});

	describe(".isValidRoute()", function(){

		it("Return true if the given object implements the luga.router.iRoute interface", function(){

			var goodRute = new luga.router.Route({
				path: "ciccio",
				enterCallBacks: [],
				exitCallBacks: []
			});

			expect(luga.router.isValidRoute(goodRute)).toEqual(true);
		});

		it("Return false otherwise", function(){
			expect(luga.router.isValidRoute(new luga.router.Router())).toEqual(false);
			expect(luga.router.isValidRoute({})).toEqual(false);
			expect(luga.router.isValidRoute("test")).toEqual(false);
		});

	});

});