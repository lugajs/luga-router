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

	describe(".getParamIds()", function(){

		describe("Given a path:", function(){

			it("Return an array of ids contained inside the path", function(){
				expect(luga.router.utils.getParamIds("{first}/:option::restoption*:/literal")).toEqual(["first", "option", "restoption*"]);
				expect(luga.router.utils.getParamIds("literal/{first*}/:option:")).toEqual(["first*", "option"]);
			});

			it("Return an empty array if no id is found", function(){
				expect(luga.router.utils.getParamIds("literal")).toEqual([]);
			});

		});

	});

	describe(".getParamValues()", function(){

		describe("Given a path and a RegExp:", function(){

			it("Return an array of values contained inside the path and captured by the RegExp", function(){
				const regExp = luga.router.utils.compilePath("/{first}/{second}");
				expect(luga.router.utils.getParamValues("/ciccio/pasticcio", regExp)).toEqual(["ciccio", "pasticcio"]);
			});

			it("Return an array containing undefined entries in case optional parameters are missing", function(){
				const regExp = luga.router.utils.compilePath("/{first}/:option:");
				expect(luga.router.utils.getParamValues("/ciccio/", regExp)).toEqual(["ciccio", undefined]);
			});

			it("Return an empty array if no value is captured", function(){
				const regExp = luga.router.utils.compilePath("literal");
				expect(luga.router.utils.getParamValues("literal", regExp)).toEqual([]);
			});

		});

	});

});