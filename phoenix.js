"use strict";
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    args = args.map(function (arg) { return stringify(arg); });
    Phoenix.log.apply(Phoenix, args);
    // tslint:disable-next-line:no-console
    console.trace.apply(console, args);
}
// tslint:disable-next-line:prefer-object-spread
Object.assign(log, {
    notify: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args = args.map(function (arg) { return stringify(arg); });
        Phoenix.log.apply(Phoenix, args);
        var message = args.join(' ');
        Phoenix.notify(message);
        // tslint:disable-next-line:no-console
        console.trace.apply(console, args);
    },
    noTrace: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args = args.map(function (arg) { return stringify(arg); });
        Phoenix.log.apply(Phoenix, args);
        // tslint:disable-next-line:no-console
        console.log.apply(console, args);
    },
});
function stringify(value) {
    if (value instanceof Error) {
        var stack = '';
        if (value.stack) {
            var s = value.stack.trim().split('\n');
            s[0] += " (:".concat(value.line, ":").concat(value.column, ")");
            var indented = s.map(function (line) { return '\t at ' + line; }).join('\n');
            stack = "\n".concat(indented);
        }
        return "\n".concat(value.toString()).concat(stack);
    }
    switch (typeof value) {
        case 'object':
            return '\n' + JSON.stringify(value, null, 2);
        case 'function':
            return value.toString();
        default:
            return value;
    }
}
require('./logger');
require('./workspace');
log();
if ('launchAtLogin' in Phoenix) {
    Phoenix.set({
        daemon: true,
        openAtLogin: true,
    });
}
console.log('dejkl');
