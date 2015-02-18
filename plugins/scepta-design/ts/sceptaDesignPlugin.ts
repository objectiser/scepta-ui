/// <reference path="../../includes.ts"/>
/// <reference path="sceptaDesignGlobals.ts"/>
module SceptaDesign {

  export var _module = angular.module(SceptaDesign.pluginName, ["xeditable","ui.codemirror"]);

  var tab = undefined;

  _module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($locationProvider, $routeProvider:ng.route.IRouteProvider, builder:HawtioMainNav.BuilderFactory) => {
    tab = builder.create()
      .id(SceptaDesign.pluginName)
      .title(() => "Policy Design")
      .href(() => "/design")
      .build();
    builder.configureRouting($routeProvider, tab);
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/design', {
        templateUrl: 'plugins/scepta-design/html/organizations.html',
        controller: 'SceptaDesign.OrganizationsController'
      }).
      when('/design/:organization', {
        templateUrl: 'plugins/scepta-design/html/organization.html',
        controller: 'SceptaDesign.OrganizationController'
      }).
      when('/design/:organization/:policygroup', {
        templateUrl: 'plugins/scepta-design/html/policygroup.html',
        controller: 'SceptaDesign.PolicyGroupController'
      }).
      when('/design/:organization/:policygroup/endpoint/:endpoint', {
        templateUrl: 'plugins/scepta-design/html/endpoint.html',
        controller: 'SceptaDesign.EndpointController'
      }).
      when('/design/:organization/:policygroup/policy/:policy', {
        templateUrl: 'plugins/scepta-design/html/policy.html',
        controller: 'SceptaDesign.PolicyController'
      }).
      when('/design/:organization/:policygroup/policy/:policy/:resource', {
        templateUrl: 'plugins/scepta-design/html/resource.html',
        controller: 'SceptaDesign.ResourceController'
      });

  }]);

  _module.run(function(editableOptions) {
      editableOptions.theme = 'bs3';
  });

  _module.run(['HawtioNav', (HawtioNav:HawtioMainNav.Registry) => {
    HawtioNav.add(tab);
    log.debug("loaded");
  }]);

  hawtioPluginLoader.addModule(SceptaDesign.pluginName);
}
