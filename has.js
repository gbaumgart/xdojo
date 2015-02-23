(function () {

    var __isAMD = !!(typeof define === 'function' && define.amd),
        __isNode = (typeof exports === 'object'),
        __isWeb = !__isNode,
        __isDojoRequire = !!(typeof require === 'function' && require.packs),   //is that enough at some point?
        __isRequireJS = !__isDojoRequire,
        __deliteHas = !!(typeof has === 'function' && has.addModule);

    define([
            'require',
            'exports',
            'module',
            __isDojoRequire ? 'dojo/has' : __deliteHas ? 'requirejs-dplugins/has' : null
        ],
        function (require, exports, module, dHas) {

            //node.js
            if (typeof exports !== "undefined") {
                exports.has = has;
            }
            if (__isNode) {
                return module.exports;
            } else if (__isWeb && __isAMD) {
                return dHas;
            }

        });

}).call(this);