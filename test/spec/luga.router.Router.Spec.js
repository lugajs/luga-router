describe("luga.router.Router", function(){

	"use strict";

	let emptyRouter, baseRouter, greedyRouter, pushStateRouter, firstHandler, secondHandler, paramHandler, optionHandler, catchAllHandler, testObserver;
	beforeEach(function(){

		emptyRouter = new luga.router.Router();
		baseRouter = new luga.router.Router();
		greedyRouter = new luga.router.Router({greedy: true});
		pushStateRouter = new luga.router.Router({pushState: true});

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

		paramHandler = new luga.router.RouteHandler({
			path: "{firstname}/{lastname}",
			enterCallBacks: [],
			exitCallBacks: []
		});

		optionHandler = new luga.router.RouteHandler({
			path: "{first}/:option:",
			enterCallBacks: [],
			exitCallBacks: []
		});

		// A weird handler that matches everything
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

		testObserver = {
			onRouteEnteredHandler: function(){
			},
			onRouteExitedHandler: function(){
			}
		};
		baseRouter.addObserver(testObserver);
		spyOn(testObserver, "onRouteEnteredHandler");
		spyOn(testObserver, "onRouteExitedHandler");

	});

	it("Is the base router constructor", function(){
		expect(luga.router.Router).toBeDefined();
	});

	it("Implements the luga.Notifier interface", function(){
		const MockNotifier = function(){
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

		describe("options.handlerConstructor:", function(){

			it("Default to luga.router.RouteHandler", function(){
				expect(baseRouter.setup().handlerConstructor).toEqual(luga.router.RouteHandler);
			});

			it("Set the routeHandler constructor class invoked by the .add() method", function(){

				const mockHandler = function(options){
					this.path = options.path;
					this.enter = function(){
					};
					this.exit = function(){
					};
					this.getPayload = function(){
					};
					this.match = function(){
					};
				};

				emptyRouter.setup({
					handlerConstructor: mockHandler
				});
				expect(emptyRouter.setup().handlerConstructor).toEqual(mockHandler);
				emptyRouter.add("test/path");
				const mockInstance = emptyRouter.getByPath("test/path");
				expect(mockInstance instanceof mockHandler).toEqual(true);
			});

		});

		describe("options.greedy:", function(){

			it("Default to false", function(){
				expect(baseRouter.setup().greedy).toEqual(false);
			});

		});

		describe("options.pushState:", function(){

			it("Default to false", function(){
				expect(baseRouter.setup().pushState).toEqual(false);
			});

		});

	});

	describe(".add()", function(){

		let path, callBacks;
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

		describe("Throws an exception if invoked with just an argument and the argument is neither:", function(){

			it("A string", function(){
				expect(function(){
					emptyRouter.add(true);
				}).toThrow();
			});

			it("A valid routeHandler", function(){
				expect(function(){
					emptyRouter.add({});
				}).toThrow();
			});

		});

		describe("If invoked passing just a routeHandler object as first and only argument:", function(){

			it("Register the routeHandler", function(){
				emptyRouter.add(firstHandler);
				expect(emptyRouter.getAll().length).toEqual(1);
				expect(emptyRouter.getAll()[0]).toEqual(firstHandler);
			});

			it("Throws an exception if the given object path is associated with an already registered routeHandler", function(){
				emptyRouter.add(firstHandler);
				expect(function(){
					emptyRouter.add(firstHandler);
				}).toThrow();
			});

		});

		describe("If invoked passing multiple arguments:", function(){

			it("Throws an exception if the first argument is a routeHandler object, but it's not the only argument", function(){
				expect(function(){
					emptyRouter.add(firstHandler, "more");
				}).toThrow();
			});

			it("The first argument, path must be a string:", function(){
				expect(emptyRouter.getByPath(path)).toBeUndefined();
				emptyRouter.add(path);
				expect(emptyRouter.getByPath(path)).not.toBeUndefined();
			});

			describe("The second argument, enterCallBack, can be either:", function(){

				it("A single function", function(){
					emptyRouter.add(path, callBacks.enter);
					const handler = emptyRouter.getByPath(path);
					handler.enter();
					expect(callBacks.enter).toHaveBeenCalled();
				});

				it("An array of functions", function(){
					emptyRouter.add(path, [callBacks.enter, callBacks.secondEnter]);
					const handler = emptyRouter.getByPath(path);
					handler.enter();
					expect(callBacks.enter).toHaveBeenCalled();
					expect(callBacks.secondEnter).toHaveBeenCalled();
				});

				it("An empty array", function(){
					emptyRouter.add(path, []);
					const handler = emptyRouter.getByPath(path);
					handler.enter();
					expect(callBacks.enter).not.toHaveBeenCalled();
					expect(callBacks.secondEnter).not.toHaveBeenCalled();
				});

				it("Undefined", function(){
					emptyRouter.add(path, undefined);
					const handler = emptyRouter.getByPath(path);
					handler.enter();
					expect(callBacks.enter).not.toHaveBeenCalled();
					expect(callBacks.secondEnter).not.toHaveBeenCalled();
				});

			});

			describe("The third argument, exitCallBacks, can be either:", function(){

				it("A single function", function(){
					emptyRouter.add(path, undefined, callBacks.exit);
					const handler = emptyRouter.getByPath(path);
					handler.exit();
					expect(callBacks.exit).toHaveBeenCalled();
				});

				it("An array of functions", function(){
					emptyRouter.add(path, callBacks.enter, [callBacks.exit, callBacks.secondExit]);
					const handler = emptyRouter.getByPath(path);
					handler.exit();
					expect(callBacks.exit).toHaveBeenCalled();
					expect(callBacks.secondExit).toHaveBeenCalled();
				});

				it("An empty array", function(){
					emptyRouter.add(path, callBacks.enter, []);
					const handler = emptyRouter.getByPath(path);
					handler.exit();
					expect(callBacks.exit).not.toHaveBeenCalled();
					expect(callBacks.secondExit).not.toHaveBeenCalled();
				});

				it("Undefined", function(){
					emptyRouter.add(path, callBacks.enter, undefined);
					const handler = emptyRouter.getByPath(path);
					handler.exit();
					expect(callBacks.exit).not.toHaveBeenCalled();
					expect(callBacks.secondExit).not.toHaveBeenCalled();
				});

			});

			describe("The fourth argument, payload, can be either:", function(){

				it("An arbitrary object", function(){
					emptyRouter.add(path, callBacks.enter, callBacks.exit, {name: "test"});
					const handler = emptyRouter.getByPath(path);
					expect(handler.getPayload()).toEqual({name: "test"});
				});

				it("Undefined", function(){
					emptyRouter.add(path, callBacks.enter, callBacks.exit, undefined);
					const handler = emptyRouter.getByPath(path);
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

		it("Remove the basePath from the beginning of the given string and remove the querystring, if any", function(){
			baseRouter.setup({
				rootPath: "root/"
			});
			expect(baseRouter.normalizeFragment("root/test/path")).toEqual("test/path");
			expect(baseRouter.normalizeFragment("root/test/path?id=1")).toEqual("test/path");
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

		describe("When invoked, call .resolve() passing the following arguments:", function(){

			it("document.location.pathname minus options.rootPath", function(){
				spyOn(baseRouter, "resolve");
				baseRouter.setup({
					rootPath: "luga-router"
				});
				const fragment = document.location.pathname.replace(/^\/luga-router/, "");
				baseRouter.onPopstate({state: {name: "test"}});
				expect(baseRouter.resolve).toHaveBeenCalledWith(fragment, {historyState: {name: "test"}});

			});

			it("An optional state object inside context.historyState", function(){
				spyOn(firstHandler, "enter");
				baseRouter.resolve("test/first", {historyState: {name: "test"}});
				expect(firstHandler.enter).toHaveBeenCalledWith({
					fragment: "test/first",
					path: "test/first",
					historyState: {name: "test"},
					payload: undefined,
					params: {}
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
				const ret = baseRouter.resolve("test/first");
				expect(firstHandler.enter).toHaveBeenCalled();
				expect(ret).toEqual(true);
			});

			it("False otherwise", function(){
				spyOn(firstHandler, "enter");
				const ret = baseRouter.resolve("no/match");
				expect(firstHandler.enter).not.toHaveBeenCalled();
				expect(ret).toEqual(false);
			});

		});

		describe("If options.greedy = false", function(){

			describe("If the Router just started:", function(){

				describe("First:", function(){

					it("Call the enter() method of the first registered routeHandler matching the given fragment", function(){
						spyOn(firstHandler, "enter").and.callThrough();
						baseRouter.resolve("test/first");
						expect(firstHandler.enter).toHaveBeenCalledWith({
							fragment: "test/first",
							path: "test/first",
							payload: undefined,
							historyState: undefined,
							params: {}
						});
					});

					describe("Passing the route's context as argument. The context contains the following keys: fragment, path, payload, historyState and params", function(){

						it("context.fragment", function(){
							spyOn(paramHandler, "enter");
							emptyRouter.add(paramHandler);
							emptyRouter.resolve("ciccio/pasticcio");
							expect(paramHandler.enter).toHaveBeenCalledWith({
								fragment: "ciccio/pasticcio",
								path: "{firstname}/{lastname}",
								payload: undefined,
								historyState: undefined,
								params: {
									firstname: "ciccio",
									lastname: "pasticcio"
								}
							});
						});

						it("context.params contains a set of name/value pairs for each param", function(){
							spyOn(paramHandler, "enter").and.callThrough();
							emptyRouter.add(paramHandler);
							emptyRouter.resolve("ciccio/pasticcio");
							expect(paramHandler.enter).toHaveBeenCalledWith({
								fragment: "ciccio/pasticcio",
								path: "{firstname}/{lastname}",
								payload: undefined,
								historyState: undefined,
								params: {
									firstname: "ciccio",
									lastname: "pasticcio"
								}
							});
						});


						it("context.params will contain 'undefined' as value for missing optional params", function(){
							spyOn(optionHandler, "enter").and.callThrough();
							emptyRouter.add(optionHandler);
							emptyRouter.resolve("ciccio");
							expect(optionHandler.enter).toHaveBeenCalledWith({
								fragment: "ciccio",
								path: "{first}/:option:",
								payload: undefined,
								historyState: undefined,
								params: {
									first: "ciccio",
									option: undefined
								}
							});
						});

						it("context.params is an empty object if no param has been captured", function(){
							spyOn(firstHandler, "enter").and.callThrough();
							baseRouter.resolve("test/first");
							expect(firstHandler.enter).toHaveBeenCalledWith({
								fragment: "test/first",
								path: "test/first",
								payload: undefined,
								historyState: undefined,
								params: {}
							});
						});

						it("context.payload is undefined if not specified by the routeHandler", function(){
							const payloadObj = {name: "myPayload"};
							const payloadHandler = new luga.router.RouteHandler({
								path: "test/payload",
								payload: payloadObj,
								historyState: undefined,
								params: {}
							});
							spyOn(payloadHandler, "enter");
							emptyRouter.add(payloadHandler);

							emptyRouter.resolve("test/payload");
							expect(payloadHandler.enter).toHaveBeenCalledWith({
								fragment: "test/payload",
								path: "test/payload",
								payload: payloadObj,
								historyState: undefined,
								params: {}
							});
						});

						it("context.historyState is populated only if .resolve() has been called from .onPopstate()", function(){
							// We have to mock what will happen onpostate
							let contextHistory;
							spyOn(catchAllHandler, "enter").and.callFake(function(context){
								contextHistory = context.historyState;
							});
							emptyRouter.add(catchAllHandler);
							emptyRouter.onPopstate({
								state: {name: "ciccio"}
							});
							expect(contextHistory).toEqual({name: "ciccio"});
						});

					});

				});

				describe("Then:", function(){

					it("Trigger a 'routeEntered' notification. Sending the whole context along the way", function(){
						baseRouter.resolve("test/first");
						expect(testObserver.onRouteEnteredHandler).toHaveBeenCalledWith({
							fragment: "test/first",
							path: "test/first",
							payload: undefined,
							historyState: undefined,
							params: {}
						});
					});

				});

			});

			describe("If the Router already matched at least one route:", function(){

				it("First: call the exit() method of the previously matched routeHandler. Passing the previous route's context", function(){
					baseRouter.resolve("test/first");
					spyOn(firstHandler, "exit");
					baseRouter.resolve("test/second");
					expect(firstHandler.exit).toHaveBeenCalledWith({
						fragment: "test/first",
						path: "test/first",
						payload: undefined,
						historyState: undefined,
						params: {}
					});
				});

				it("Then: call the enter() method of the first registered routeHandler matching the given fragment", function(){
					baseRouter.resolve("test/second");
					spyOn(firstHandler, "enter");
					baseRouter.resolve("test/first");
					expect(firstHandler.enter).toHaveBeenCalled();
				});

				it("Finally: triggers a 'routeExited' notification. Sending the whole context along the way", function(){
					baseRouter.resolve("test/first");
					baseRouter.resolve("test/second");
					expect(testObserver.onRouteExitedHandler).toHaveBeenCalled();
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

			it("pushState = false", function(){
				expect(baseRouter.setup().pushState).toEqual(false);
			});

		});

		describe("If a set of name/value pairs is passed as argument. Set the following configuration options:", function(){

			it("rootPath", function(){
				expect(baseRouter.setup({rootPath: "xxx"}).rootPath).toEqual("xxx");
			});

			it("greedy", function(){
				expect(baseRouter.setup({greedy: true}).greedy).toEqual(true);
			});

			it("pushState", function(){
				expect(baseRouter.setup({pushState: true}).pushState).toEqual(true);
			});

		});

	});

	describe(".start()", function(){

		describe("If options.pushState is false", function(){

			it("Add .onHashChange() as listener to window.hashchange", function(){
				spyOn(window, "addEventListener");
				baseRouter.start();
				expect(window.addEventListener.calls.count()).toEqual(1);
				expect(window.addEventListener).toHaveBeenCalledWith("hashchange", baseRouter.onHashChange, false);
			});

		});

		describe("If options.pushState is true", function(){

			it("Add .onPopstate() as listener to window.popstate", function(){
				spyOn(window, "addEventListener");
				pushStateRouter.start();
				expect(window.addEventListener.calls.count()).toEqual(1);
				expect(window.addEventListener).toHaveBeenCalledWith("popstate", pushStateRouter.onPopstate, false);
			});

		});

	});

	describe(".stop()", function(){

		describe("If options.pushState is false", function(){
			it("Remove .onHashChange() as listener from window.hashchange", function(){
				spyOn(window, "removeEventListener");
				baseRouter.stop();
				expect(window.removeEventListener.calls.count()).toEqual(1);
				expect(window.removeEventListener).toHaveBeenCalledWith("hashchange", baseRouter.onHashChange, false);
			});
		});

		describe("If options.pushState is true", function(){
			it("Remove .onPopstate() as listener from window.popstate", function(){
				spyOn(window, "removeEventListener");
				pushStateRouter.stop();
				expect(window.removeEventListener.calls.count()).toEqual(1);
				expect(window.removeEventListener).toHaveBeenCalledWith("popstate", pushStateRouter.onPopstate, false);
			});
		});

	});

});