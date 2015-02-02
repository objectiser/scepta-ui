/// <reference path="../../includes.ts"/>
/// <reference path="policydesignGlobals.ts"/>
module PolicyDesign {

  export var _module = angular.module(PolicyDesign.pluginName, ["xeditable"]);

  var tab = undefined;

  _module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($locationProvider, $routeProvider:ng.route.IRouteProvider, builder:HawtioMainNav.BuilderFactory) => {
    tab = builder.create()
      .id(PolicyDesign.pluginName)
      .title(() => "Policy Design")
      .href(() => "/policydesign")
      .build();
    builder.configureRouting($routeProvider, tab);
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/policydesign', {
        templateUrl: 'plugins/policydesign/html/organizations.html',
        controller: 'PolicyDesign.OrganizationsController'
      }).
      when('/policydesign/:organization', {
        templateUrl: 'plugins/policydesign/html/organization.html',
        controller: 'PolicyDesign.OrganizationController'
      }).
      when('/policydesign/:organization/:policygroup', {
        templateUrl: 'plugins/policydesign/html/policygroup.html',
        controller: 'PolicyDesign.PolicyGroupController'
      }).
      when('/policydesign/:organization/:policygroup/:policy', {
        templateUrl: 'plugins/policydesign/html/policy.html',
        controller: 'PolicyDesign.PolicyController'
      });

  }]);

  _module.run(function(editableOptions) {
      editableOptions.theme = 'bs3';
  });

  _module.run(['HawtioNav', (HawtioNav:HawtioMainNav.Registry) => {
    HawtioNav.add(tab);
    log.debug("loaded");
  }]);

  hawtioPluginLoader.addModule(PolicyDesign.pluginName);
}
