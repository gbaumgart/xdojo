(function () {

    var __isAMD = !!(typeof define === 'function' && define.amd),
        __isNode = (typeof exports === 'object'),
        __isWeb = !__isNode,
        //is that enough at some point?
        __isDojoRequire = !!(typeof require === 'function' && require.packs),
        __isRequireJS = !__isDojoRequire,
        __deliteHas = !!(typeof has === 'function' && has.addModule),
        __hasDcl = !!(typeof dcl === 'function'),
        __preferDcl = true; //case when dcl/dcl is not present yet, serves as fallback

    define([
        //needed?
        'require',
        'exports',
        //should be extended for the missing .config() method when in delite
        'module',
        __isDojoRequire ? __preferDcl ? 'dcl/dcl' :  'dojo/_base/declare' : 'dcl/dcl'

    ], function (require, exports, module, dDeclare) {

        if (dDeclare) {

            var resultingDeclare = dDeclare;

            //node.js
            if (typeof exports !== "undefined") {
                exports.declare = dDeclare;
            }

            if (__isNode) {
                return module.exports;
            } else if (__isWeb && __isAMD) {

                //todo: where to place this?
                var _patchDCL = true,   //patch DCL for Dojo declare signature
                    handler = dDeclare;

                //now make Dcl working like declare, supporting declaredClass.
                //This could be done via define('module') and then module.id but i don't trust it.
                if (handler && __preferDcl) {


                    if(_patchDCL) {

                        var _declareFunction = function () {

                            var _declaredClass = null,
                                args = arguments,
                                context = arguments.callee;

                            //eat string arg
                            if (typeof arguments[0] == 'string') {
                                _declaredClass = arguments[0];
                                args = Array.prototype.slice.call(arguments, 1);
                            }

                            //patch props for declaredClass
                            if(_declaredClass) {
                                args[args.length-1]['declaredClass'] = _declaredClass;
                            }
                            switch (args.length) {
                                // fast cases
                                case 1:
                                    return handler.call(context,args[0]);
                                case 2:{
                                    return handler.call(context, args[0], args[1]);
                                }
                                // fall through
                                default:
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
            //we shouldn't be here anyways, dcl or dojo/declare has not been loaded yet!
            return resultingDeclare;
        }
    });
}).call(this);