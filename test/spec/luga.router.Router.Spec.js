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

			});

		});

	});

	describe(".getAll()", function(){

		it("Return an array containing all the registered routeHandler objects", function(){
			expect(baseRouter.getAll().length).toEqual(2);
			expect(baseRouter.getAll()[0]).toEqual(firstHandler);
			expect(baseRouter.getAll()[1]).toEqual(secondHandler);
		});

		it("Return an empty array on a freshly create Router", function(){
			expect(emptyRouter.getAll().length).toEqual(0);
		});

	});

	describe(".getByPath()", function(){

		it("Return a registered routeHandler object associated the given path", function(){
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

			it("Return an array of registered routeHandler objects matching the given fragment if greedy is true", function(){
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

	describe(".onHashChange()", function(){

		it("When invoked, call .resolve() passing location.hash minus #", function(){
			spyOn(baseRouter, "resolve");
			baseRouter.onHashChange();
			expect(baseRouter.resolve).toHaveBeenCalledWith(location.hash.substring(1));
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

		it("Fails silently if the given fragment does not match any routeHandler", function(){
			spyOn(firstHandler, "enter");
			baseRouter.resolve("no/match");
			expect(firstHandler.enter).not.toHaveBeenCalled();
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