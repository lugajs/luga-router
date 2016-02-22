describe("luga", function(){

	"use strict";

	beforeEach(function(){

	});

	afterEach(function(){
		luga.navigateSetup({
			pushState: false,
			root: "/"
		});
	});

	describe(".navigateSetup()", function(){

		describe("If called with no arguments. Return an object containing name/value pairs:", function(){

			it("pushState = false", function(){
				expect(luga.navigateSetup().pushState).toEqual(false);
			});
			it("root = '/'", function(){
				expect(luga.navigateSetup().root).toEqual("/");
			});

		});

		describe("If a set of name/value pairs is passed as argument. Set the following configuration options:", function(){

			it("pushState", function(){
				expect(luga.navigateSetup({pushState: true}).pushState).toEqual(true);
			});
			it("root", function(){
				expect(luga.navigateSetup({root: "/app/subappa/"}).root).toEqual("/app/subappa/");
			});

		});

	});


	describe(".usePushState()", function(){

		describe("Return false:", function(){

			it("By default", function(){
				spyOn(luga, "isPushStateSupported").and.returnValue(true);
				expect(luga.usePushState()).toEqual(false);
			});

			it("If pushState is not supported, not matter the value of config.pushState", function(){
				spyOn(luga, "isPushStateSupported").and.returnValue(false);
				luga.navigateSetup({pushState: true});
				expect(luga.usePushState()).toEqual(false);
			});

		});

		describe("Return true if:", function(){

			it("pushState is supported and config.pushState has been set to true", function(){
				spyOn(luga, "isPushStateSupported").and.returnValue(true);
				luga.navigateSetup({pushState: true});
				expect(luga.usePushState()).toEqual(true);
			});

		});

	});


});