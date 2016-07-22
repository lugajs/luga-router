describe("luga.router.Route", function(){

	"use strict";

	var path, baseRoute, callBacks;
	beforeEach(function(){

		path = "test/path";

		callBacks = {
			enter: function(){},
			secondEnter: function(){},
			exit: function(){}
		};

		spyOn(callBacks, "enter");
		spyOn(callBacks, "secondEnter");
		spyOn(callBacks, "exit");

		baseRoute = new luga.router.Route({
			path: path,
			enterCallBacks: [callBacks.enter, callBacks.secondEnter],
			exitCallBacks: [callBacks.exit]
		});

	});

	it("Is the base route constructor", function(){
		expect(luga.router.Route).toBeDefined();
	});

	describe(".enter()", function(){

		it("Execute enter callbacks", function(){
			baseRoute.enter();
			expect(callBacks.enter).toHaveBeenCalled();
			expect(callBacks.secondEnter).toHaveBeenCalled();
			expect(callBacks.exit).not.toHaveBeenCalled();
		});

	});

	describe(".exit()", function(){

		it("Execute exit callbacks", function(){
			baseRoute.exit();
			expect(callBacks.enter).not.toHaveBeenCalled();
			expect(callBacks.secondEnter).not.toHaveBeenCalled();
			expect(callBacks.exit).toHaveBeenCalled();
		});

	});

	describe(".match()", function(){

		describe("Return true if the given fragment:", function(){

			it("Literally matches the path", function(){
				expect(baseRoute.match(path)).toEqual(true);
			});

		});

	});

});