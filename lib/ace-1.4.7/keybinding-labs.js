ace.define("ace/keyboard/labs",["require","exports","module","ace/lib/keys","ace/lib/oop","ace/lib/useragent","ace/keyboard/hash_handler"], function(require, exports, module) {
"use strict";

var keyUtil = require("../lib/keys");
var oop = require("../lib/oop");
var useragent = require("../lib/useragent");
var HashHandler = require("../keyboard/hash_handler").HashHandler;

exports.handler = new HashHandler();
 
[{
    bindKey: { mac: "cmd-d", win: "ctrl-d" },
    name: "duplicateSelection"
} , {
    bindKey: { mac: "ctrl-cmd-g", win: "alt-f3" },
    name: "find_all_under"
}, {
    bindKey: { mac: "cmd-g", win: "f3|ctrl-f3" },
    name: "findnext"
}, {
    bindKey: { mac: "shift-cmd-g", win: "shift-f3|ctrl-shift-f3" },
    name: "findprevious"
}, {
    bindKey: { mac: "cmd-shift-v", win: "ctrl-shift-v" },
    name: "paste_and_indent"
}].forEach(function(binding) {
    var command = exports.handler.commands[binding.name];
    if (command)
        command.bindKey = binding.bindKey;
    exports.handler.bindKey(binding.bindKey, command || binding.name);
});

});
(function() {
	ace.require(["ace/keyboard/labs"], function(m) {
		if (typeof module == "object" && typeof exports == "object" && module) {
			module.exports = m;
		}
	});
})();
