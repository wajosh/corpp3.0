(function() {
    "use strict";

    var module = angular.module('app', []);
    
     module.component("mainHeader", {
        templateUrl: '../resources/navigation-templates/main-header.html',
       
    });
    
     module.component("mainNavTp", {
        templateUrl: '../resources/navigation-templates/main-nav-tp.html',
       
    });
    
	/*  Online-Password-Change  */
	    module.component("mainNavLogin", {
        templateUrl: '../resources/navigation-templates/main-nav-login.html',
       
    });
    
     module.component("mainFooter", {
        templateUrl: '../resources/navigation-templates/main-footer.html',
       
   
	 });
} ());