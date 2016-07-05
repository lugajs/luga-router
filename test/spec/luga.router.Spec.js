describe("luga.router", function(){

	"use strict";

	var emptyRouter;
	beforeEach(function(){
		emptyRouter = luga.router.getInstance();
	});

	it("Lives inside its own namespace", function(){
		expect(luga.router).toBeDefined();
	});

	describe(".version", function(){
		it("Reports the current version number", function(){
			expect(luga.router.version).toBeDefined();
		});
	});

	describe(".getInstance()", function(){

		it("Return a reference to the router  singleton", function(){
			expect(emptyRouter).toBeDefined();
		});

		it("Return a reference to the same object if invoked multiple times", function(){
			expect(emptyRouter).toBe(luga.router.getInstance());
		});

		describe("The router:", function(){

			it("Implements the luga.Notifier interface", function(){
				var MockNotifier = function(){
					luga.extend(luga.Notifier, this);
				};
				expect(emptyRouter).toMatchDuckType(new MockNotifier());
			});

		});

	});

});