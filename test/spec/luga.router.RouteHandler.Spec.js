describe("luga.router.RouteHandler", function(){

	"use strict";

	var path, baseHandler, callBacks;
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
					var testHandler = new luga.router.RouteHandler({
						path: path,
						enterCallBacks: callBacks.enter
					});
					testHandler.enter();
					expect(callBacks.enter).toHaveBeenCalled();
				});

				it("An empty array", function(){
					var testHandler = new luga.router.RouteHandler({
						path: path,
						enterCallBacks: []
					});
					testHandler.enter();
					expect(callBacks.enter).not.toHaveBeenCalled();
				});

				it("An array of functions", function(){
					var testHandler = new luga.router.RouteHandler({
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
					var testHandler = new luga.router.RouteHandler({
						path: path,
						exitCallBacks: callBacks.exit
					});
					testHandler.exit();
					expect(callBacks.exit).toHaveBeenCalled();
				});

				it("An empty array", function(){
					var testHandler = new luga.router.RouteHandler({
						path: path,
						exitCallBacks: []
					});
					testHandler.exit();
					expect(callBacks.exit).not.toHaveBeenCalled();
				});

				it("An array of functions", function(){
					var testHandler = new luga.router.RouteHandler({
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
				var testHandler = new luga.router.RouteHandler({
					path: path,
					payload: {name: "test"}
				});
				expect(testHandler.getPayload()).toEqual({name: "test"});
			});

		});

	});


	describe(".enter()", function(){

		it("Execute enter callbacks", function(){
			baseHandler.enter();
			expect(callBacks.enter).toHaveBeenCalled();
			expect(callBacks.secondEnter).toHaveBeenCalled();
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

	describe(".getPayload()", function(){

		it("Return the handler payload", function(){
			var payloadObj = {name: "myPayload"};
			var payloadHandler = new luga.router.RouteHandler({
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

		describe("Return true if the given fragment:", function(){

			it("Literally matches the path", function(){
				expect(baseHandler.match(path)).toEqual(true);
			});

		});

	});

});