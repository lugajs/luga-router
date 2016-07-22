describe("luga.router", function(){

	"use strict";

	var baseRouter;
	beforeEach(function(){
		baseRouter = new luga.router.Router();
	});

	it("Lives inside its own namespace", function(){
		expect(luga.router).toBeDefined();
	});

	describe(".version", function(){
		it("Reports the current version number", function(){
			expect(luga.router.version).toBeDefined();
		});
	});

});