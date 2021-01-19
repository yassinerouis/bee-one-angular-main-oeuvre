!function(){function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function o(t,o,n){return o&&e(t.prototype,o),n&&e(t,n),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{bN4V:function(e,n,i){"use strict";i.r(n),i.d(n,"UserPagesModule",(function(){return s}));var b,r,c,a=i("ofXK"),l=i("fXoL"),p=i("tyNb"),m=[{path:"login",component:(r=function(){function e(){t(this,e)}return o(e,[{key:"ngOnInit",value:function(){}}]),e}(),r.\u0275fac=function(t){return new(t||r)},r.\u0275cmp=l.Fb({type:r,selectors:[["app-login"]],decls:34,vars:0,consts:[[1,"d-flex","align-items-center","auth","px-0"],[1,"row","w-100","mx-0"],[1,"col-lg-4","mx-auto"],[1,"auth-form-light","text-left","py-5","px-4","px-sm-5"],[1,"brand-logo"],["src","assets/images/logo.svg","alt","logo"],[1,"font-weight-light"],[1,"pt-3"],[1,"form-group"],["type","email","id","exampleInputEmail1","placeholder","Username",1,"form-control","form-control-lg"],["type","password","id","exampleInputPassword1","placeholder","Password",1,"form-control","form-control-lg"],[1,"mt-3"],["routerLink","/dashboard",1,"btn","btn-block","btn-primary","btn-lg","font-weight-medium","auth-form-btn"],[1,"my-2","d-flex","justify-content-between","align-items-center"],[1,"form-check"],[1,"form-check-label","text-muted"],["type","checkbox",1,"form-check-input"],[1,"input-helper"],["href","javascript:(void)",1,"auth-link","text-black"],[1,"mb-2"],["type","button",1,"btn","btn-block","btn-facebook","auth-form-btn"],[1,"mdi","mdi-facebook","mr-2"],[1,"text-center","mt-4","font-weight-light"],["routerLink","/register",1,"text-primary"]],template:function(t,e){1&t&&(l.Rb(0,"div",0),l.Rb(1,"div",1),l.Rb(2,"div",2),l.Rb(3,"div",3),l.Rb(4,"div",4),l.Mb(5,"img",5),l.Qb(),l.Rb(6,"h4"),l.Kc(7,"Hello! let's get started"),l.Qb(),l.Rb(8,"h6",6),l.Kc(9,"Sign in to continue."),l.Qb(),l.Rb(10,"form",7),l.Rb(11,"div",8),l.Mb(12,"input",9),l.Qb(),l.Rb(13,"div",8),l.Mb(14,"input",10),l.Qb(),l.Rb(15,"div",11),l.Rb(16,"a",12),l.Kc(17,"SIGN IN"),l.Qb(),l.Qb(),l.Rb(18,"div",13),l.Rb(19,"div",14),l.Rb(20,"label",15),l.Mb(21,"input",16),l.Mb(22,"i",17),l.Kc(23," Keep me signed in "),l.Qb(),l.Qb(),l.Rb(24,"a",18),l.Kc(25,"Forgot password?"),l.Qb(),l.Qb(),l.Rb(26,"div",19),l.Rb(27,"button",20),l.Mb(28,"i",21),l.Kc(29,"Connect using facebook "),l.Qb(),l.Qb(),l.Rb(30,"div",22),l.Kc(31," Don't have an account? "),l.Rb(32,"a",23),l.Kc(33,"Create"),l.Qb(),l.Qb(),l.Qb(),l.Qb(),l.Qb(),l.Qb(),l.Qb())},directives:[p.h],styles:[""]}),r)},{path:"register",component:(b=function(){function e(){t(this,e)}return o(e,[{key:"ngOnInit",value:function(){}}]),e}(),b.\u0275fac=function(t){return new(t||b)},b.\u0275cmp=l.Fb({type:b,selectors:[["app-register"]],decls:44,vars:0,consts:[[1,"d-flex","align-items-center","auth","px-0"],[1,"row","w-100","mx-0"],[1,"col-lg-4","mx-auto"],[1,"auth-form-light","text-left","py-5","px-4","px-sm-5"],[1,"brand-logo"],["src","assets/images/logo.svg","alt","logo"],[1,"font-weight-light"],[1,"pt-3"],[1,"form-group"],["type","text","id","exampleInputUsername1","placeholder","Username",1,"form-control","form-control-lg"],["type","email","id","exampleInputEmail1","placeholder","Email",1,"form-control","form-control-lg"],["id","exampleFormControlSelect2",1,"form-control","form-control-lg"],["type","password","id","exampleInputPassword1","placeholder","Password",1,"form-control","form-control-lg"],[1,"mb-4"],[1,"form-check"],[1,"form-check-label","text-muted"],["type","checkbox",1,"form-check-input"],[1,"input-helper"],[1,"mt-3"],["routerLink","/dashboard",1,"btn","btn-block","btn-primary","btn-lg","font-weight-medium","auth-form-btn"],[1,"text-center","mt-4","font-weight-light"],["routerLink","/login",1,"text-primary"]],template:function(t,e){1&t&&(l.Rb(0,"div",0),l.Rb(1,"div",1),l.Rb(2,"div",2),l.Rb(3,"div",3),l.Rb(4,"div",4),l.Mb(5,"img",5),l.Qb(),l.Rb(6,"h4"),l.Kc(7,"New here?"),l.Qb(),l.Rb(8,"h6",6),l.Kc(9,"Signing up is easy. It only takes a few steps"),l.Qb(),l.Rb(10,"form",7),l.Rb(11,"div",8),l.Mb(12,"input",9),l.Qb(),l.Rb(13,"div",8),l.Mb(14,"input",10),l.Qb(),l.Rb(15,"div",8),l.Rb(16,"select",11),l.Rb(17,"option"),l.Kc(18,"Country"),l.Qb(),l.Rb(19,"option"),l.Kc(20,"United States of America"),l.Qb(),l.Rb(21,"option"),l.Kc(22,"United Kingdom"),l.Qb(),l.Rb(23,"option"),l.Kc(24,"India"),l.Qb(),l.Rb(25,"option"),l.Kc(26,"Germany"),l.Qb(),l.Rb(27,"option"),l.Kc(28,"Argentina"),l.Qb(),l.Qb(),l.Qb(),l.Rb(29,"div",8),l.Mb(30,"input",12),l.Qb(),l.Rb(31,"div",13),l.Rb(32,"div",14),l.Rb(33,"label",15),l.Mb(34,"input",16),l.Mb(35,"i",17),l.Kc(36," I agree to all Terms & Conditions "),l.Qb(),l.Qb(),l.Qb(),l.Rb(37,"div",18),l.Rb(38,"a",19),l.Kc(39,"SIGN UP"),l.Qb(),l.Qb(),l.Rb(40,"div",20),l.Kc(41," Already have an account? "),l.Rb(42,"a",21),l.Kc(43,"Login"),l.Qb(),l.Qb(),l.Qb(),l.Qb(),l.Qb(),l.Qb(),l.Qb())},directives:[p.h],styles:[""]}),b)}],s=((c=function e(){t(this,e)}).\u0275mod=l.Jb({type:c}),c.\u0275inj=l.Ib({factory:function(t){return new(t||c)},imports:[[a.b,p.i.forChild(m)]]}),c)}}])}();