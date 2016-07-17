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

	describe(".Router:", function(){

		it("Is the base router constructor", function(){
			expect(luga.router.Router).toBeDefined();
		});

		it("Implements the luga.Notifier interface", function(){
			var MockNotifier = function(){
				luga.extend(luga.Notifier, this);
			};
			expect(baseRouter).toMatchDuckType(new MockNotifier());
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

});