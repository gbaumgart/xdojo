## Purpose

1. unify dojo/has and requirejs-dplugins/has into xdojo/has
2. unify dojo/_base/declare and dcl/dcl into xdojo/declare
3. try to unify dcl && declare's oop into xdojo/declare
4. try to merge require.config and dojoConfig
 
## Status

### wrapper for dojo/_lang/declare and dcl/dcl

- simple Dojo classes (0 base classes) can be mixed with Dcl classes. Support for 
  Dojo classes with multiple base classes in progress. 

- By default xdojo/require uses dcl/dcl as composer

- By default your 'declaredClass' will be preserved in dcl, see examples  
   
#### Examples
  
  Usage, if you want use dlc over declare, just make sure you loaded dcl before xdojo/require: 
        
        require(['dcl/dcl', 'xdojo/require','dojo/_base/declare'],function(dcl,xRequire,declare){
    
            var fooBar = xRequire('foo.bar',null,{}); // works with dcl or dojo
    
            var myFooBarKid = xRequire('my.foo.bar',[fooBar],{}); // works with dcl or dojo
    
            //using a Dojo declared class together with a dcl declared class:
            
            var _myDojoClass = declare('dojoClass',null,{});
            
            var _classD2 = dDeclare('my mixed class',[myFooBarKid,_myDojoClass],{});
        
        });