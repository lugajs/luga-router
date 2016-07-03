describe("luga.Router", function(){

	"use strict";

	var emptyRouter;
	beforeEach(function(){
		emptyRouter = new luga.Router();
	});

	it("Is the Router constructor", function(){
		expect(luga.Router).toBeDefined();
	});

	describe(".version", function(){
		it("Reports the current version number", function(){
			expect(luga.Router.version).toBeDefined();
		});
	});

	it("Implements the luga.Notifier interface", function(){
		var MockNotifier = function(){
			luga.extend(luga.Notifier, this);
		};
		expect(emptyRouter).toMatchDuckType(new MockNotifier());
	});

});