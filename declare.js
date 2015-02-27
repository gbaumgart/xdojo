(function () {

    //bloody boiler code
    var __isAMD = !!(typeof define === 'function' && define.amd),
        __isNode = (typeof exports === 'object'),
        __isWeb = !__isNode,
        //is that enough at some point?
        __isDojoRequire = !!(typeof require === 'function' && require.packs),
        __isRequireJS = !__isDojoRequire,
        __deliteHas = !!(typeof has === 'function' && has.addModule),
        __hasDcl = !!(typeof dcl === 'function'),//false if dcl has not been required yet
        __preferDcl = !__isDojoRequire; //case when dcl/dcl is not present yet, serves as fallback


    /**
     * @TODO
     *
     * - convert dojo base classes recursive, currently it only accepts simple dojo classes, not with multiple
     * base classes but you can use as many dcl base classes as you want.
     * - deal with un-tested cases: nodejs, cjs
     *
     * @example  tested cases:

     1. var fooBar = dDeclare('foo.bar',null,{}); // works with dcl or dojo

     2. var myFooBarKid = dDeclare('my.foo.bar',[fooBar],{}); // works with dcl or dojo

     3. using a Dojo declared class together with a dcl declared class:

     var _myDojoClass = declare('dojoClass',null,{});
     var _classD2 = dDeclare('my mixed class',[myFooBarKid,_myDojoClass],{});

     *
     */

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
                var _patchDCL = true,     //patch DCL for Dojo declare signature
                    _convertToDCL = true, //if a dojo/declared class is passed, convert it to DCL
                    handler = dDeclare;

                //now make Dcl working like declare, supporting declaredClass.
                //This could be done via define('module') and then module.id but i don't trust it.
                if (handler && __preferDcl) {

                    if(_patchDCL) {

                        //the Dojo to Dcl converter, see TODO's
                        function makeClass(name,_class,_declare){
                            return _declare(null,_class,_class.prototype);
                        }

                        //in-place base class check & convert from dojo declared base class to dcl base class
                        //@TODO: recursive and cache !! There is probably more..
                        function checkClasses(classes,_declare){

                            for (var i = 0, j = classes.length; i < j ; i++) {

                                var o = classes[i];

                                //convert dojo base class
                                if(o.createSubclass){
                                    classes[i] = o = makeClass(o.declaredClass,o,handler);
                                }
                            }
                        }

                        var _declareFunction = function () {

                            var _declaredClass = null,
                                args = arguments,
                                context = arguments.callee;//no need actually



                            //eat declared string arg
                            if (typeof arguments[0] == 'string') {
                                _declaredClass = arguments[0];
                                args = Array.prototype.slice.call(arguments, 1);
                            }

                            //patch props for declaredClass, @TODO: not sure dcl() has really only 2 args
                            if(_declaredClass) {
                                args[args.length-1]['declaredClass'] = _declaredClass;
                            }

                            switch (args.length) {
                                case 1:
                                    //fast and legit dcl case, no base classes given
                                    return handler.call(context,null,args[0]);
                                case 2:{

                                    //base classes given and prototype given, convert to Dojo if desired

                                    //straight forward
                                    if(!_convertToDCL) {
                                        return handler.call(context, args[0], args[1]);
                                    }
                                    //convert base classes if given
                                    return handler.call(context, args[0]!=null ? checkClasses(args[0]) : args[0] , args[1]);
                                }
                                // fall through
                                default:
                                    return handler.call(context,args);
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