describe("luga.router.Router", function(){

	"use strict";

	var emptyRouter, baseRouter, firstHandler, secondHandler, catchAllHandler;
	beforeEach(function(){

		emptyRouter = new luga.router.Router();
		baseRouter = new luga.router.Router();

		firstHandler = new luga.router.RouteHandler({
			path: "test/first",
			enterCallBacks: [],
			exitCallBacks: []
		});

		secondHandler = new luga.router.RouteHandler({
			path: "test/second",
			enterCallBacks: [],
			exitCallBacks: []
		});

		catchAllHandler = new luga.router.RouteHandler({
			path: "xx",
			enterCallBacks: [],
			exitCallBacks: []
		});
		// Mock the match method, make it match all the times
		catchAllHandler.match = function(){
			return true;
		};

		baseRouter.add(firstHandler);
		baseRouter.add(secondHandler);

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

	describe("Accepts an Options object as single argument", function(){

		describe("options.rootPath:", function(){

			it("Default to an empty string", function(){
				expect(baseRouter.setup().rootPath).toEqual("");
			});

		});

		describe("options.greedy:", function(){

			it("Default to false", function(){
				expect(baseRouter.setup().greedy).toEqual(false);
			});

		});

	});

	describe(".add()", function(){

		describe("If invoked passing just a single routeHandler object:", function(){

			it("Register the routeHandler", function(){
				emptyRouter.add(firstHandler);
				expect(emptyRouter.getAllHandlers().length).toEqual(1);
				expect(emptyRouter.getAllHandlers()[0]).toEqual(firstHandler);
			});

			it("Throws an exception if the given object is not a valid routeHandler", function(){
				expect(function(){
					emptyRouter.add({});
				}).toThrow();
			});

			it("Throws an exception if the given object path is associated with an already registered routeHandler", function(){
				emptyRouter.add(firstHandler);
				expect(function(){
					emptyRouter.add(firstHandler);
				}).toThrow();
			});

		});

	});

	describe(".getAllHandlers()", function(){

		it("Return an array containing all the registered routeHandler objects", function(){
			expect(baseRouter.getAllHandlers().length).toEqual(2);
			expect(baseRouter.getAllHandlers()[0]).toEqual(firstHandler);
			expect(baseRouter.getAllHandlers()[1]).toEqual(secondHandler);
		});

		it("Return an empty array on a freshly create Router", function(){
			expect(emptyRouter.getAllHandlers().length).toEqual(0);
		});

	});

	describe(".getMatchingHandler()", function(){

		describe("If options.greedy = false", function(){

			it("Return a registered routeHandler object matching the given fragment", function(){
				expect(baseRouter.getMatchingHandler("test/first")).toEqual(firstHandler);
			});
			it("Return undefined if there is no match", function(){
				expect(baseRouter.getMatchingHandler("xx/xx")).toBeUndefined();
			});
			it("Return the first fund routeHandler object matching the given fragment, even if multiple routeHandlers match it", function(){
				baseRouter.add(catchAllHandler);
				expect(baseRouter.getMatchingHandler("test/first")).toEqual(firstHandler);
			});

		});

		describe("If options.greedy = true", function(){

			it("Return an array of registered routeHandler objects matching the given fragment if greedy is true", function(){
				baseRouter.setup({greedy: true});
				baseRouter.add(catchAllHandler);
				expect(baseRouter.getMatchingHandler("test/first")).toEqual([firstHandler, catchAllHandler]);
			});
			it("Return an empty array if there is no match", function(){
				baseRouter.setup({greedy: true});
				expect(baseRouter.getMatchingHandler("xx/xx")).toEqual([]);
			});

		});

	});

	describe(".getHandlerByPath()", function(){

		it("Return a registered routeHandler object associated the given path", function(){
			expect(baseRouter.getHandlerByPath("test/first")).toEqual(firstHandler);
		});

		it("Return undefined if none is fund", function(){
			expect(baseRouter.getHandlerByPath("xx/xx")).toBeUndefined();
		});

	});

	describe(".setup()", function(){

		describe("If called with no arguments. Return an object containing name/value pairs:", function(){

			it("rootPath = empty string", function(){
				expect(baseRouter.setup().rootPath).toEqual("");
			});

			it("greedy = greedy", function(){
				expect(baseRouter.setup().greedy).toEqual(false);
			});

		});

		describe("If a set of name/value pairs is passed as argument. Set the following configuration options:", function(){

			it("rootPath", function(){
				expect(baseRouter.setup({rootPath: "xxx"}).rootPath).toEqual("xxx");
			});

			it("greedy", function(){
				expect(baseRouter.setup({greedy: true}).greedy).toEqual(true);
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