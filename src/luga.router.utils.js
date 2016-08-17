(function(){
	"use strict";

	luga.namespace("luga.router.utils");

	/*
	 Lovingly adapted from Crossroads.js
	 https://millermedeiros.github.io/crossroads.js/
	 */

	// Leading and trailing slashes
	var SLASHES_REGEXP = /^\/|\/$/g;

	// Params:  everything between "{ }" or ": :"
	var PARAMS_REGEXP = /(?:\{|:)([^}:]+)(?:\}|:)/g;

	// Save params during compile (avoid escaping things that shouldn't be escaped)
	var TOKENS = {
		OS: {
			// Optional slashes
			// Slash between "::" or "}:" or "\w:" or ":{?" or "}{?" or "\w{?"
			rgx: /([:}]|\w(?=\/))\/?(:|(?:\{\?))/g,
			save: "$1{{id}}$2",
			res: "\\/?"
		},
		RS: {
			// Required slashes
			// Used to insert slash between ":{" and "}{"
			rgx: /([:}])\/?(\{)/g,
			save: "$1{{id}}$2",
			res: "\\/"
		},
		RQ: {
			// Required query string: everything in between "{? }"
			rgx: /\{\?([^}]+)\}/g,
			// Everything from "?" till "#" or end of string
			res: "\\?([^#]+)"
		},
		OQ: {
			// Optional query string: everything in between ":? :"
			rgx: /:\?([^:]+):/g,
			// Everything from "?" till "#" or end of string
			res: "(?:\\?([^#]*))?"
		},
		OR: {
			// Optional rest: everything in between ": *:"
			rgx: /:([^:]+)\*:/g,
			res: "(.*)?" // Optional group to avoid passing empty string as captured
		},
		RR: {
			// Rest param: everything in between "{ *}"
			rgx: /\{([^}]+)\*\}/g,
			res: "(.+)"
		},
		// Required/optional params should come after rest segments
		RP: {
			// Required params: everything between "{ }"
			rgx: /\{([^}]+)\}/g,
			res: "([^\\/?]+)"
		},
		OP: {
			// Optional params: everything between ": :"
			rgx: /:([^:]+):/g,
			res: "([^\\/?]+)?\/?"
		}
	};

	for(var key in TOKENS){
		/* istanbul ignore else */
		if(TOKENS.hasOwnProperty(key) === true){
			var current = TOKENS[key];
			current.id = "__CR_" + key + "__";
			current.save = ("save" in current) ? current.save.replace("{{id}}", current.id) : current.id;
			current.rRestore = new RegExp(current.id, "g");
		}
	}

	function replaceTokens(pattern, regexpName, replaceName){
		for(var key in TOKENS){
			/* istanbul ignore else */
			if(TOKENS.hasOwnProperty(key) === true){
				var current = TOKENS[key];
				pattern = pattern.replace(current[regexpName], current[replaceName]);
			}
		}
		return pattern;
	}

	/**
	 * Turn a path into a regular expression
	 * @param {String} path
	 * @returns {RegExp}
	 */
	luga.router.utils.compilePath = function(path){

		// Remove leading and trailing slashes, if any
		var pattern = path.replace(SLASHES_REGEXP, "");

		// Save tokens
		pattern = replaceTokens(pattern, "rgx", "save");
		// Restore tokens
		pattern = replaceTokens(pattern, "rRestore", "res");

		// Add optional leading and trailing slashes
		pattern = "\\/?" + pattern + "\\/?";

		return new RegExp("^" + pattern + "$");
	};

}());