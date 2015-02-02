/// <reference path="../../includes.ts"/>
/// <reference path="policyadminGlobals.ts"/>
module PolicyAdmin {

  export var _module = angular.module(PolicyAdmin.pluginName, ['xeditable']);

  var tab = undefined;

  _module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($locationProvider, $routeProvider:ng.route.IRouteProvider, builder:HawtioMainNav.BuilderFactory) => {
    tab = builder.create()
      .id(PolicyAdmin.pluginName)
      .title(() => "Policy Administration")
      .href(() => "/policyadmin")
      .build();
    builder.configureRouting($routeProvider, tab);
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/policyadmin', {
        templateUrl: 'plugins/policyadmin/html/policyadmin.html',
        controller: 'PolicyAdmin.PolicyAdminController'
      //}).
      //otherwise({
      //  redirectTo: '/policyadmin'
      });

  }]);

  _module.run(function(editableOptions) {
      editableOptions.theme = 'bs3';
  });

  _module.run(['HawtioNav', (HawtioNav:HawtioMainNav.Registry) => {
    HawtioNav.add(tab);
    log.debug("loaded");
  }]);

  hawtioPluginLoader.addModule(PolicyAdmin.pluginName);
}
