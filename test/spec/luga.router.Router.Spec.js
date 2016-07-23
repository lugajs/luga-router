describe("luga.router.Router", function(){

	"use strict";

	var emptyRouter, baseRouter, firstRoute, secondRoute;
	beforeEach(function(){

		emptyRouter = new luga.router.Router();
		baseRouter = new luga.router.Router();

		firstRoute = new luga.router.RouteHandler({
			path: "test/first",
			enterCallBacks: [],
			exitCallBacks: []
		});

		secondRoute = new luga.router.RouteHandler({
			path: "test/second",
			enterCallBacks: [],
			exitCallBacks: []
		});

		baseRouter.add(firstRoute);
		baseRouter.add(secondRoute);

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

	describe(".add()", function(){

		describe("If invoked passing just a single route object:", function(){

			it("Register the route", function(){
				emptyRouter.add(firstRoute);
				expect(emptyRouter.getAllHandlers().length).toEqual(1);
				expect(emptyRouter.getAllHandlers()[0]).toEqual(firstRoute);
			});

			it("Throws an exception if the given object is not a valid route", function(){
				expect(function(){
					emptyRouter.add({});
				}).toThrow();
			});

			it("Throws an exception if the given object path is associated with an already registered route ", function(){
				emptyRouter.add(firstRoute);
				expect(function(){
					emptyRouter.add(firstRoute);
				}).toThrow();
			});

		});

	});

	describe(".getAllHandlers()", function(){

		it("Return an array containing all the registered route objects", function(){
			expect(baseRouter.getAllHandlers().length).toEqual(2);
			expect(baseRouter.getAllHandlers()[0]).toEqual(firstRoute);
			expect(baseRouter.getAllHandlers()[1]).toEqual(secondRoute);
		});

		it("Return an empty array on a freshly create Router", function(){
			expect(emptyRouter.getAllHandlers().length).toEqual(0);
		});

	});

	describe(".findMatch()", function(){

		it("Return a registered route object matching the given fragment", function(){
			expect(baseRouter.getHandlerByPath("test/first")).toEqual(firstRoute);
		});

		it("Return undefined if there is no match", function(){
			expect(baseRouter.getHandlerByPath("xx/xx")).toBeUndefined();
		});

	});

	describe(".getHandlerByPath()", function(){

		it("Return a registered route object associated the given path", function(){
			expect(baseRouter.getHandlerByPath("test/first")).toEqual(firstRoute);
		});

		it("Return undefined if none is fund", function(){
			expect(baseRouter.getHandlerByPath("xx/xx")).toBeUndefined();
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