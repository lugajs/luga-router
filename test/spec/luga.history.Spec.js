describe("luga.history", function(){

	"use strict";

	beforeEach(function(){

	});

	afterEach(function(){
		luga.history.setup({
			pushState: false
		});
	});

	it("Lives inside its own namespace", function(){
		expect(luga.history).toBeDefined();
	});

	describe(".setup()", function(){

		describe("If called with no arguments. Return an object containing name/value pairs:", function(){

			it("pushState = false", function(){
				expect(luga.history.setup().pushState).toEqual(false);
			});

		});

		describe("If a set of name/value pairs is passed as argument. Set the following configuration options:", function(){

			it("pushState", function(){
				expect(luga.history.setup({pushState: true}).pushState).toEqual(true);
			});

		});

	});


	describe(".usePushState()", function(){

		describe("Return false:", function(){

			it("By default", function(){
				spyOn(luga.history, "isPushStateSupported").and.returnValue(true);
				expect(luga.history.usePushState()).toEqual(false);
			});

			it("If pushState is not supported, not matter the value of config.pushState", function(){
				spyOn(luga.history, "isPushStateSupported").and.returnValue(false);
				luga.history.setup({pushState: true});
				expect(luga.history.usePushState()).toEqual(false);
			});

		});

		describe("Return true if:", function(){

			it("pushState is supported and config.pushState has been set to true", function(){
				spyOn(luga.history, "isPushStateSupported").and.returnValue(true);
				luga.history.setup({pushState: true});
				expect(luga.history.usePushState()).toEqual(true);
			});

		});

	});


});