describe("luga.router.Router", function(){

	"use strict";

	var emptyRouter, baseRouter, greedyRouter, firstHandler, secondHandler, catchAllHandler;
	beforeEach(function(){

		emptyRouter = new luga.router.Router();
		baseRouter = new luga.router.Router();
		greedyRouter = new luga.router.Router({greedy: true});

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

		greedyRouter.add(firstHandler);
		greedyRouter.add(secondHandler);
		greedyRouter.add(catchAllHandler);

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

		var path, callBacks;
		beforeEach(function(){

			path = "test/path";

			callBacks = {
				enter: function(){
				},
				secondEnter: function(){
				},
				exit: function(){
				},
				secondExit: function(){
				}
			};

			spyOn(callBacks, "enter");
			spyOn(callBacks, "secondEnter");
			spyOn(callBacks, "exit");
			spyOn(callBacks, "secondExit");

		});

		describe("If invoked passing just a routeHandler object as first and only argument:", function(){

			it("Register the routeHandler", function(){
				emptyRouter.add(firstHandler);
				expect(emptyRouter.getAll().length).toEqual(1);
				expect(emptyRouter.getAll()[0]).toEqual(firstHandler);
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

		describe("If invoked passing multiple arguments:", function(){

			it("The first argument, path is a string:", function(){
				expect(emptyRouter.getByPath(path)).toBeUndefined();
				emptyRouter.add(path);
				expect(emptyRouter.getByPath(path)).not.toBeUndefined();
			});

			describe("The second argument, enterCallBack, can be either:", function(){

				it("A single function", function(){
					emptyRouter.add(path, callBacks.enter);
					var handler = emptyRouter.getByPath(path);
					handler.enter();
					expect(callBacks.enter).toHaveBeenCalled();
				});

				it("An array of functions", function(){
					emptyRouter.add(path, [callBacks.enter, callBacks.secondEnter]);
					var handler = emptyRouter.getByPath(path);
					handler.enter();
					expect(callBacks.enter).toHaveBeenCalled();
					expect(callBacks.secondEnter).toHaveBeenCalled();
				});

				it("An empty array", function(){
					emptyRouter.add(path, []);
					var handler = emptyRouter.getByPath(path);
					handler.enter();
					expect(callBacks.enter).not.toHaveBeenCalled();
					expect(callBacks.secondEnter).not.toHaveBeenCalled();
				});

				it("Undefined", function(){
					emptyRouter.add(path, undefined);
					var handler = emptyRouter.getByPath(path);
					handler.enter();
					expect(callBacks.enter).not.toHaveBeenCalled();
					expect(callBacks.secondEnter).not.toHaveBeenCalled();
				});

			});

			describe("The third argument, exitCallBacks, can be either:", function(){

				it("A single function", function(){
					emptyRouter.add(path, undefined, callBacks.exit);
					var handler = emptyRouter.getByPath(path);
					handler.exit();
					expect(callBacks.exit).toHaveBeenCalled();
				});

				it("An array of functions", function(){
					emptyRouter.add(path, callBacks.enter, [callBacks.exit, callBacks.secondExit]);
					var handler = emptyRouter.getByPath(path);
					handler.exit();
					expect(callBacks.exit).toHaveBeenCalled();
					expect(callBacks.secondExit).toHaveBeenCalled();
				});

				it("An empty array", function(){
					emptyRouter.add(path, callBacks.enter, []);
					var handler = emptyRouter.getByPath(path);
					handler.exit();
					expect(callBacks.exit).not.toHaveBeenCalled();
					expect(callBacks.secondExit).not.toHaveBeenCalled();
				});

				it("Undefined", function(){
					emptyRouter.add(path, callBacks.enter, undefined);
					var handler = emptyRouter.getByPath(path);
					handler.exit();
					expect(callBacks.exit).not.toHaveBeenCalled();
					expect(callBacks.secondExit).not.toHaveBeenCalled();
				});

			});

			describe("The fourth argument, payload, can be either:", function(){

				it("An arbitrary object", function(){
					emptyRouter.add(path, callBacks.enter, callBacks.exit, {name: "test"});
					var handler = emptyRouter.getByPath(path);
					expect(handler.getPayload()).toEqual({name: "test"});
				});

				it("Undefined", function(){
					emptyRouter.add(path, callBacks.enter, callBacks.exit, undefined);
					var handler = emptyRouter.getByPath(path);
					expect(handler.getPayload()).toBeUndefined();
				});

			});

		});

	});

	describe(".getAll()", function(){

		it("Return an array containing all the registered routeHandler objects", function(){
			expect(baseRouter.getAll().length).toEqual(2);
			expect(baseRouter.getAll()[0]).toEqual(firstHandler);
			expect(baseRouter.getAll()[1]).toEqual(secondHandler);
		});

		it("Return an empty array if no routeHandler is registered", function(){
			expect(emptyRouter.getAll().length).toEqual(0);
		});

	});

	describe(".getByPath()", function(){

		it("Return a registered routeHandler object associated with the given path", function(){
			expect(baseRouter.getByPath("test/first")).toEqual(firstHandler);
		});

		it("Return undefined if none is fund", function(){
			expect(baseRouter.getByPath("xx/xx")).toBeUndefined();
		});

	});

	describe(".getMatch()", function(){

		describe("If options.greedy = false", function(){

			it("Return a registered routeHandler object matching the given fragment", function(){
				expect(baseRouter.getMatch("test/first")).toEqual(firstHandler);
			});
			it("Return undefined if there is no match", function(){
				expect(baseRouter.getMatch("xx/xx")).toBeUndefined();
			});
			it("Return the first fund routeHandler object matching the given fragment, even if multiple routeHandlers match it", function(){
				baseRouter.add(catchAllHandler);
				expect(baseRouter.getMatch("test/first")).toEqual(firstHandler);
			});

		});

		describe("If options.greedy = true", function(){

			it("Return an array of registered routeHandler objects matching the given fragment", function(){
				baseRouter.setup({greedy: true});
				baseRouter.add(catchAllHandler);
				expect(baseRouter.getMatch("test/first")).toEqual([firstHandler, catchAllHandler]);
			});
			it("Return an empty array if there is no match", function(){
				baseRouter.setup({greedy: true});
				expect(baseRouter.getMatch("xx/xx")).toEqual([]);
			});

		});

	});

	describe(".normalizeFragment()", function(){

		it("Remove the basePath from the beginning of the given string", function(){
			baseRouter.setup({
				rootPath: "root/"
			});
			expect(baseRouter.normalizeFragment("root/test/path")).toEqual("test/path");
			expect(baseRouter.normalizeFragment("/root/test/path")).toEqual("test/path");
		});

	});

	describe(".normalizeHash()", function(){

		describe("Given a string:", function(){

			it("Remove any '#' and/or '!' in front of it", function(){
				expect(baseRouter.normalizeHash("test/path")).toEqual("test/path");
				expect(baseRouter.normalizeHash("#test/path")).toEqual("test/path");
				expect(baseRouter.normalizeHash("#!test/path")).toEqual("test/path");
			});

			it("Remove the basePath from the beginning of the string", function(){
				baseRouter.setup({
					rootPath: "root/"
				});
				expect(baseRouter.normalizeHash("#root/test/path")).toEqual("test/path");
			});

		});

	});

	describe(".onHashChange()", function(){

		it("When invoked, call .resolve() passing normalized location.hash", function(){
			spyOn(baseRouter, "resolve");
			baseRouter.onHashChange();
			expect(baseRouter.resolve).toHaveBeenCalledWith(baseRouter.normalizeHash(location.hash));
		});

	});

	describe(".onPopstate()", function(){

		describe("When invoked, call .resolve() passing:", function(){

			it("document.location.pathname minus options.rootPath", function(){
				spyOn(baseRouter, "resolve");
				baseRouter.setup({
					rootPath: "luga-router"
				});
				var fragment = document.location.pathname.replace(/^\/luga-router/, "");
				baseRouter.onPopstate({state: {name: "test"}});
				expect(baseRouter.resolve).toHaveBeenCalledWith(fragment, {historyState: {name: "test"}});

			});

			it("and an optional state object inside context.historyState", function(){
				spyOn(firstHandler, "enter");
				baseRouter.resolve("test/first", {historyState: {name: "test"}});
				expect(firstHandler.enter).toHaveBeenCalledWith({
					fragment: "test/first",
					historyState: {name: "test"}
				});
			});

		});

	});

	describe(".remove()", function(){

		it("Remove the routeHandler matching the given path", function(){
			expect(baseRouter.getAll().length).toEqual(2);
			baseRouter.remove("test/first");
			expect(baseRouter.getAll().length).toEqual(1);
		});

		it("Fails silently if the given path does not match any routeHandler", function(){
			expect(baseRouter.getAll().length).toEqual(2);
			baseRouter.remove("no/match");
			expect(baseRouter.getAll().length).toEqual(2);
		});

	});

	describe(".removeAll()", function(){

		it("Remove all routeHandlers", function(){
			expect(baseRouter.getAll().length).toEqual(2);
			baseRouter.removeAll();
			expect(baseRouter.getAll()).toEqual([]);
		});

	});

	describe(".resolve()", function(){


		describe("Return:", function(){

			it("True if at least one routeHandler was resolved", function(){
				spyOn(firstHandler, "enter");
				var ret = baseRouter.resolve("test/first");
				expect(firstHandler.enter).toHaveBeenCalled();
				expect(ret).toEqual(true);
			});

			it("False otherwise", function(){
				spyOn(firstHandler, "enter");
				var ret = baseRouter.resolve("no/match");
				expect(firstHandler.enter).not.toHaveBeenCalled();
				expect(ret).toEqual(false);
			});

		});

		describe("If options.greedy = false", function(){

			describe("If the Router just started:", function(){

				it("Call the enter() method of the first registered routeHandler matching the given fragment", function(){
					spyOn(firstHandler, "enter");
					baseRouter.resolve("test/first");
					expect(firstHandler.enter).toHaveBeenCalled();
				});

				describe("Passing the route's context. Containing the following keys:", function(){

					it("context.fragment", function(){
						spyOn(firstHandler, "enter");
						baseRouter.resolve("test/first");
						expect(firstHandler.enter).toHaveBeenCalledWith({
							fragment: "test/first"
						});
					});

					it("context.payload (if specified by the routeHandler)", function(){
						var payloadObj = {name: "myPayload"};
						var payloadHandler = new luga.router.RouteHandler({
							path: "test/payload",
							payload: payloadObj
						});
						spyOn(payloadHandler, "enter");
						emptyRouter.add(payloadHandler);

						emptyRouter.resolve("test/payload");
						expect(payloadHandler.enter).toHaveBeenCalledWith({
							fragment: "test/payload",
							payload: payloadObj
						});
					});

				});

			});

			describe("If the Router already matched at least one route:", function(){

				it("First: call the exit() method of the previously matched routeHandler", function(){
					baseRouter.resolve("test/second");
					spyOn(secondHandler, "exit");
					baseRouter.resolve("test/first");
					expect(secondHandler.exit).toHaveBeenCalled();
				});

				it("Then: call the enter() method of the first registered routeHandler matching the given fragment", function(){
					baseRouter.resolve("test/second");
					spyOn(firstHandler, "enter");
					baseRouter.resolve("test/first");
					expect(firstHandler.enter).toHaveBeenCalled();
				});

			});

		});

		describe("If options.greedy = true", function(){

			describe("If the Router just started:", function(){

				it("Call the enter() method of the all registered routeHandlers matching the given fragment", function(){
					spyOn(firstHandler, "enter");
					spyOn(catchAllHandler, "enter");
					greedyRouter.resolve("test/first");
					expect(firstHandler.enter).toHaveBeenCalled();
					expect(catchAllHandler.enter).toHaveBeenCalled();
				});

			});

			describe("If the Router already matched at least one route:", function(){

				it("First: call the exit() method of the previously matched routeHandlers", function(){
					greedyRouter.resolve("test/second");
					spyOn(secondHandler, "exit");
					spyOn(catchAllHandler, "exit");
					greedyRouter.resolve("test/first");
					expect(secondHandler.exit).toHaveBeenCalled();
					expect(catchAllHandler.exit).toHaveBeenCalled();
				});

				it("Then: call the enter() method of all the registered routeHandlers matching the given fragment", function(){
					greedyRouter.resolve("test/second");
					spyOn(firstHandler, "enter");
					spyOn(catchAllHandler, "enter");
					greedyRouter.resolve("test/first");
					expect(firstHandler.enter).toHaveBeenCalled();
					expect(catchAllHandler.enter).toHaveBeenCalled();
				});

			});

		});

	});

	describe(".setup()", function(){

		describe("If called with no arguments. Return an object containing name/value pairs:", function(){

			it("rootPath = empty string", function(){
				expect(baseRouter.setup().rootPath).toEqual("");
			});

			it("greedy = false", function(){
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

		it("Add .onHashChange() as listener to window.hashchange", function(){
			spyOn(window, "addEventListener");
			baseRouter.start();
			expect(window.addEventListener).toHaveBeenCalledWith("hashchange", baseRouter.onHashChange, false);
		});

		it("Add .onPopstate() as listener to window.popstate", function(){
			spyOn(window, "addEventListener");
			baseRouter.start();
			expect(window.addEventListener).toHaveBeenCalledWith("popstate", baseRouter.onPopstate, false);
		});

	});

	describe(".stop()", function(){

		it("Remove .onHashChange() as listener from window.hashchange", function(){
			spyOn(window, "removeEventListener");
			baseRouter.stop();
			expect(window.removeEventListener.calls.count()).toEqual(2);
			expect(window.removeEventListener).toHaveBeenCalledWith("hashchange", baseRouter.onHashChange, false);
		});

		it("Remove .onPopstate() as listener from window.popstate", function(){
			spyOn(window, "removeEventListener");
			baseRouter.stop();
			expect(window.removeEventListener.calls.count()).toEqual(2);
			expect(window.removeEventListener).toHaveBeenCalledWith("popstate", baseRouter.onPopstate, false);
		});

	});

});