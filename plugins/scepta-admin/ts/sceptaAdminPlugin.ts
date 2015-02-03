/// <reference path="../../includes.ts"/>
/// <reference path="sceptaAdminGlobals.ts"/>
module SceptaAdmin {

  export var _module = angular.module(SceptaAdmin.pluginName, ['xeditable']);

  var tab = undefined;

  _module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', ($locationProvider, $routeProvider:ng.route.IRouteProvider, builder:HawtioMainNav.BuilderFactory) => {
    tab = builder.create()
      .id(SceptaAdmin.pluginName)
      .title(() => "Policy Administration")
      .href(() => "/admin")
      .build();
    builder.configureRouting($routeProvider, tab);
    $locationProvider.html5Mode(true);
    $routeProvider.
      when('/admin', {
        templateUrl: 'plugins/scepta-admin/html/sceptaAdmin.html',
        controller: 'SceptaAdmin.SceptaAdminController'
      });

  }]);

  _module.run(function(editableOptions) {
      editableOptions.theme = 'bs3';
  });

  _module.run(['HawtioNav', (HawtioNav:HawtioMainNav.Registry) => {
    HawtioNav.add(tab);
    log.debug("loaded");
  }]);

  hawtioPluginLoader.addModule(SceptaAdmin.pluginName);
}
