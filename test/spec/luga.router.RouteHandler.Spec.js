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
			}
		};

		spyOn(callBacks, "enter");
		spyOn(callBacks, "secondEnter");
		spyOn(callBacks, "exit");

		baseHandler = new luga.router.RouteHandler({
			path: path,
			enterCallBacks: [callBacks.enter, callBacks.secondEnter],
			exitCallBacks: [callBacks.exit]
		});

	});

	it("Is the base routeHandler constructor", function(){
		expect(luga.router.RouteHandler).toBeDefined();
	});

	it("Throws an exception if a RegExp is passed to the constructor as path", function(){
		expect(function(){
			new luga.router.RouteHandler({
				path: new RegExp("")
			});
		}).toThrow();
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