describe("luga.router.utils", function(){

	"use strict";

	it("Lives inside its own namespace", function(){
		expect(luga.router.utils).toBeDefined();
	});

	describe(".compilePath()", function(){

		it("Compile a path into a RegExp", function(){
			expect(luga.type(luga.router.utils.compilePath("test"))).toEqual("regexp");
		});

		it("Handling leading and trailing slashes as optional", function(){

			expect(luga.router.utils.compilePath("literal")).toEqual(/^\/?literal\/?$/);
			expect(luga.router.utils.compilePath("/literal")).toEqual(/^\/?literal\/?$/);
			expect(luga.router.utils.compilePath("literal/")).toEqual(/^\/?literal\/?$/);
			expect(luga.router.utils.compilePath("/literal/")).toEqual(/^\/?literal\/?$/);

		});

		describe("Resulting in the following conversions:", function(){

			it("'literal' -> /^\/?literal\/?$/", function(){
				expect(luga.router.utils.compilePath("literal")).toEqual(/^\/?literal\/?$/);
			});

			it("'literal/{first}/{second}' -> /^\/?literal\/([^\/?]+)\/([^\/?]+)\/?$/", function(){
				expect(luga.router.utils.compilePath("literal/{first}/{second}")).toEqual(/^\/?literal\/([^\/?]+)\/([^\/?]+)\/?$/);
			});

			it("'{first}' -> /^\/?([^\/?]+)\/?$/", function(){
				expect(luga.router.utils.compilePath("{first}")).toEqual(/^\/?([^\/?]+)\/?$/);
			});

			it("'{first}/{second}' -> /^\/?([^\/?]+)\/([^\/?]+)\/?$/", function(){
				expect(luga.router.utils.compilePath("{first}/{second}")).toEqual(/^\/?([^\/?]+)\/([^\/?]+)\/?$/);
			});

			it("'{first}/:firstoption:' -> /^\/?([^\/?]+)\/?([^\/?]+)?\/?\/?$/", function(){
				expect(luga.router.utils.compilePath("{first}/:firstoption:")).toEqual(/^\/?([^\/?]+)\/?([^\/?]+)?\/?\/?$/);
			});

			it("'{first}/:firstoption::secondoption:' -> /^\/?([^\/?]+)\/?([^\/?]+)?\/?\/?$/", function(){
				expect(luga.router.utils.compilePath("{first}/:firstoption::secondoption:")).toEqual(/^\/?([^\/?]+)\/?([^\/?]+)?\/?\/?([^\/?]+)?\/?\/?$/);
			});

			it("'{first}/:firstoption::secondoption:/literal' -> /^\/?([^\/?]+)\/?([^\/?]+)?\/?\/?([^\/?]+)?\/?\/literal\/?$/", function(){
				expect(luga.router.utils.compilePath("{first}/:firstoption::secondoption:/literal")).toEqual(/^\/?([^\/?]+)\/?([^\/?]+)?\/?\/?([^\/?]+)?\/?\/literal\/?$/);
			});

			it("'literal/{first*}' -> /^\/?literal\/(.+)\/?$/", function(){
				expect(luga.router.utils.compilePath("literal/{first*}")).toEqual(/^\/?literal\/(.+)\/?$/);
			});

			it("'literal/{first*}/:option:' -> /^\/?literal\/(.+)\/?([^\/?]+)?\/?\/?$/", function(){
				expect(luga.router.utils.compilePath("literal/{first*}/:option:")).toEqual(/^\/?literal\/(.+)\/?([^\/?]+)?\/?\/?$/);
			});

			it("'{first}/:option::restoption*:/literal' -> /^\/?([^\/?]+)\/?([^\/?]+)?\/?\/?(.*)?\/literal\/?$/", function(){
				expect(luga.router.utils.compilePath("{first}/:option::restoption*:/literal")).toEqual(/^\/?([^\/?]+)\/?([^\/?]+)?\/?\/?(.*)?\/literal\/?$/);
			});

		});

	});

});