describe("luga.router.RouteHandler", function(){

	"use strict";

	let path, baseHandler, callBacks;
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

		spyOn(callBacks, "enter").and.callThrough();
		spyOn(callBacks, "secondEnter").and.callThrough();
		spyOn(callBacks, "exit");
		spyOn(callBacks, "secondExit");

		baseHandler = new luga.router.RouteHandler({
			path: path,
			enterCallBacks: [callBacks.enter, callBacks.secondEnter],
			exitCallBacks: [callBacks.exit]
		});

	});

	it("Is the base routeHandler constructor", function(){
		expect(luga.router.RouteHandler).toBeDefined();
	});

	describe("Accepts an Options object as single argument", function(){

		describe("options.path:", function(){

			it("Is the path associated with the handler", function(){
				expect(baseHandler.match(path)).toEqual(true);
			});

			it("Throws an exception if a RegExp is passed", function(){
				expect(function(){
					new luga.router.RouteHandler({
						path: new RegExp("")
					});
				}).toThrow();
			});

		});

		describe("options.enterCallBacks:", function(){

			describe("Can be either:", function(){

				it("A function", function(){
					const testHandler = new luga.router.RouteHandler({
						path: path,
						enterCallBacks: callBacks.enter
					});
					testHandler.enter();
					expect(callBacks.enter).toHaveBeenCalled();
				});

				it("An empty array", function(){
					const testHandler = new luga.router.RouteHandler({
						path: path,
						enterCallBacks: []
					});
					testHandler.enter();
					expect(callBacks.enter).not.toHaveBeenCalled();
				});

				it("An array of functions", function(){
					const testHandler = new luga.router.RouteHandler({
						path: path,
						enterCallBacks: [callBacks.enter, callBacks.secondEnter]
					});
					testHandler.enter();
					expect(callBacks.enter).toHaveBeenCalled();
					expect(callBacks.secondEnter).toHaveBeenCalled();
				});

			});

		});

		describe("options.exitCallBacks:", function(){

			describe("Can be either:", function(){

				it("A function", function(){
					const testHandler = new luga.router.RouteHandler({
						path: path,
						exitCallBacks: callBacks.exit
					});
					testHandler.exit();
					expect(callBacks.exit).toHaveBeenCalled();
				});

				it("An empty array", function(){
					const testHandler = new luga.router.RouteHandler({
						path: path,
						exitCallBacks: []
					});
					testHandler.exit();
					expect(callBacks.exit).not.toHaveBeenCalled();
				});

				it("An array of functions", function(){
					const testHandler = new luga.router.RouteHandler({
						path: path,
						exitCallBacks: [callBacks.exit, callBacks.secondExit]
					});
					testHandler.exit();
					expect(callBacks.exit).toHaveBeenCalled();
					expect(callBacks.secondExit).toHaveBeenCalled();
				});

			});

		});

		describe("options.payload:", function(){

			it("Is an object that will be associated with the routeHandler", function(){
				const testHandler = new luga.router.RouteHandler({
					path: path,
					payload: {name: "test"}
				});
				expect(testHandler.getPayload()).toEqual({name: "test"});
			});

		});

	});


	describe(".enter()", function(){

		it("Execute enter callbacks. Passing the given context as argument", function(){
			const mockContext = {name: "test"};
			baseHandler.enter(mockContext);
			expect(callBacks.enter).toHaveBeenCalledWith(mockContext);
			expect(callBacks.secondEnter).toHaveBeenCalledWith(mockContext);
			expect(callBacks.exit).not.toHaveBeenCalled();
		});

	});

	describe(".exit()", function(){

		it("Execute exit callbacks", function(){
			baseHandler.exit();
			expect(callBacks.enter).not.toHaveBeenCalled();
			expect(callBacks.secondEnter).not.toHaveBeenCalled();
			expect(callBacks.exit).toHaveBeenCalled();
		});

	});

	describe(".getParams()", function(){

		describe("Given a fragment:", function(){

			it("Return an object containing an entry for each param and the relevant values extracted from the fragment", function(){
				const testHandler = new luga.router.RouteHandler({
					path: "{firstname}/{lastname}"
				});
				expect(testHandler.getParams("/ciccio/pasticcio")).toEqual({
					firstname: "ciccio",
					lastname: "pasticcio"
				});
			});

			it("Return an object without any key if the path contains no params", function(){
				const testHandler = new luga.router.RouteHandler({
					path: "literal"
				});
				expect(testHandler.getParams("/ciccio/pasticcio")).toEqual({});
			});

			it("If the param is optional and it's not contained inside the fragment, the relevant key will contain undefined as value", function(){
				const testHandler = new luga.router.RouteHandler({
					path: "{firstname}/:lastname:"
				});
				expect(testHandler.getParams("/ciccio")).toEqual({
					firstname: "ciccio",
					lastname: undefined
				});
			});

		});

	});

	describe(".getPayload()", function(){

		it("Return the handler payload", function(){
			const payloadObj = {name: "myPayload"};
			const payloadHandler = new luga.router.RouteHandler({
				path: "test/payload",
				payload: payloadObj
			});
			expect(payloadHandler.getPayload()).toEqual(payloadObj);
		});

		it("Return undefined if no payload is associated with the handler", function(){
			expect(baseHandler.getPayload()).toBeUndefined();
		});

	});

	describe(".match()", function(){

		describe("Return true if the given fragment matches:", function(){

			it("The literal path", function(){
				const handler = new luga.router.RouteHandler({
					path: "literal"
				});
				expect(handler.match("literal")).toEqual(true);
			});

			it("Path with named variables: literal/{first}/{second}", function(){
				const handler = new luga.router.RouteHandler({
					path: "literal/{first}/{second}"
				});
				expect(handler.match("literal/ciccio/pasticcio")).toEqual(true);
			});

			it("Path with optional segments: {first}/:firstoption:", function(){
				const handler = new luga.router.RouteHandler({
					path: "{first}/:firstoption:"
				});
				expect(handler.match("ciccio")).toEqual(true);
				expect(handler.match("ciccio/")).toEqual(true);
				expect(handler.match("ciccio/pastccio")).toEqual(true);
			});

			it("Path with rest segments: {first}/:restoption*:/literal", function(){
				const handler = new luga.router.RouteHandler({
					path: "{first}/:restoption*:/literal"
				});
				expect(handler.match("literal/pasticcio/literal")).toEqual(true);
				expect(handler.match("literal/literal")).toEqual(true);
			});

			it("Path with a mix of rest and optional segments: {first}/:option::restoption*:/literal", function(){
				const handler = new luga.router.RouteHandler({
					path: "{first}/:option::restoption*:/literal"
				});
				expect(handler.match("first/ciccio/pasticcio/literal")).toEqual(true);
				expect(handler.match("first/ciccio/literal")).toEqual(true);
				expect(handler.match("first/literal")).toEqual(true);
			});

		});

	});

});