describe("luga.router", function(){

	"use strict";

	var baseRouter;
	beforeEach(function(){
		baseRouter = luga.router.getInstance();
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
			expect(baseRouter).toBeDefined();
		});

		it("Return a reference to the same object if invoked multiple times", function(){
			expect(baseRouter).toBe(luga.router.getInstance());
		});

		describe("The router:", function(){

			it("Implements the luga.Notifier interface", function(){
				var MockNotifier = function(){
					luga.extend(luga.Notifier, this);
				};
				expect(baseRouter).toMatchDuckType(new MockNotifier());
			});

		});

	});

	describe(".start()", function(){

		it("Add a listener to window.hashchange and window.popstate", function(){
			spyOn(window, "addEventListener");

			baseRouter.start();
			expect(window.addEventListener.calls.count()).toEqual(2);
			expect(window.addEventListener).toHaveBeenCalledWith("hashchange", baseRouter.onHashChange, false);
			expect(window.addEventListener).toHaveBeenCalledWith("popstate", baseRouter.onPopstate, false);
		});

	});

});