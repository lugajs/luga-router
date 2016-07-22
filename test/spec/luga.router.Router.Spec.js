describe("luga.router.Router", function(){

	"use strict";

	var baseRouter;
	beforeEach(function(){
		baseRouter = new luga.router.Router();
	});

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

	describe(".stop()", function(){

		it("Remove the listener from window.hashchange and window.popstate", function(){
			spyOn(window, "removeEventListener");

			baseRouter.stop();
			expect(window.removeEventListener.calls.count()).toEqual(2);
			expect(window.removeEventListener).toHaveBeenCalledWith("hashchange", baseRouter.onHashChange, false);
			expect(window.removeEventListener).toHaveBeenCalledWith("popstate", baseRouter.onPopstate, false);
		});

	});

});