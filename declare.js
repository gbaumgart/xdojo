(function () {

    var __isAMD = !!(typeof define === 'function' && define.amd),
        __isNode = (typeof exports === 'object'),
        __isWeb = !__isNode,
    //is that enough at some point?
        __isDojoRequire = !!(typeof require === 'function' && require.packs),
        __isRequireJS = !__isDojoRequire,
        __deliteHas = !!(typeof has === 'function' && has.addModule),
        __hasDcl = !!(typeof dcl === 'function');

    define([
        //needed?
        'require',
        'exports',
        //should be extended for the missing .config() method when in delite
        'module',
        __isDojoRequire ? 'dojo/_base/declare' : __hasDcl ? 'dcl/dcl' : null

    ], function (require, exports, module, dDeclare) {

        if (dDeclare) {

            var resultingDeclare = null;

            //node.js
            if (typeof exports !== "undefined") {
                exports.declare = dDeclare;
            }


            if (__isNode) {
                return module.exports;
            } else if (__isWeb && __isAMD) {

                //todo: where to place this?
                var _preferDCL = true,
                    _patchDCL = true,   //patch DCL for Dojo declare signature
                    handler = dDeclare;

                //now make Dcl working like declare, supporting declaredClass.
                //This could be done via define('module') and then module.id but i don't trust it.
                if (__hasDcl && _preferDCL) {


                    if(_patchDCL) {
                        var _declareFunction = function () {

                            switch (arguments.length) {
                                // fast cases
                                case 1:
                                    return handler.call(arguments[0]);
                                case 2:
                                    return handler.call(arguments[0], arguments[1]);

                                // dojo declare signature
                                case 3:
                                {
                                    if (typeof arguments[0] == 'string') {

                                        //patch props
                                        arguments[2]['declaredClass'] = arguments[0];
                                        return handler.call(arguments[1], arguments[2]);
                                    }

                                }
                                // fall through
                                default:
                                    var args = Array.prototype.slice.call(arguments, 1);
                                    return handler.apply(args);
                            }
                        };

                        return _declareFunction;
                    }

                }
                return dDeclare;
            }

            return dDeclare;
        } else {
            //@TODO, add fallback version?
            debugger;//
        }
    });
}).call(this);