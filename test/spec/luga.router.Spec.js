describe("luga.router", function(){

	"use strict";

	beforeEach(function(){

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