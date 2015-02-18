/// <reference path="../libs/hawtio-utilities/defs.d.ts"/>

/// <reference path="../../includes.ts"/>
var SceptaAdmin;
(function (SceptaAdmin) {
    SceptaAdmin.pluginName = "scepta-admin";
    SceptaAdmin.log = Logger.get(SceptaAdmin.pluginName);
    SceptaAdmin.templatePath = "plugins/scepta-admin/html";
})(SceptaAdmin || (SceptaAdmin = {}));

/// <reference path="../../includes.ts"/>
/// <reference path="sceptaAdminGlobals.ts"/>
var SceptaAdmin;
(function (SceptaAdmin) {
    SceptaAdmin._module = angular.module(SceptaAdmin.pluginName, ['xeditable']);
    var tab = undefined;
    SceptaAdmin._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($locationProvider, $routeProvider, builder) {
        tab = builder.create().id(SceptaAdmin.pluginName).title(function () { return "Policy Administration"; }).href(function () { return "/admin"; }).build();
        builder.configureRouting($routeProvider, tab);
        $locationProvider.html5Mode(true);
        $routeProvider.when('/admin', {
            templateUrl: 'plugins/scepta-admin/html/sceptaAdmin.html',
            controller: 'SceptaAdmin.SceptaAdminController'
        });
    }]);
    SceptaAdmin._module.run(function (editableOptions) {
        editableOptions.theme = 'bs3';
    });
    SceptaAdmin._module.run(['HawtioNav', function (HawtioNav) {
        HawtioNav.add(tab);
        SceptaAdmin.log.debug("loaded");
    }]);
    hawtioPluginLoader.addModule(SceptaAdmin.pluginName);
})(SceptaAdmin || (SceptaAdmin = {}));

/// <reference path="sceptaAdminPlugin.ts"/>
var SceptaAdmin;
(function (SceptaAdmin) {
    SceptaAdmin.SceptaAdminController = SceptaAdmin._module.controller("SceptaAdmin.SceptaAdminController", ['$scope', '$http', function ($scope, $http) {
        $http.get('/scepta-server/design').success(function (data) {
            $scope.organizations = data;
        });
    }]);
})(SceptaAdmin || (SceptaAdmin = {}));

/// <reference path="../../includes.ts"/>
var SceptaDesign;
(function (SceptaDesign) {
    SceptaDesign.pluginName = "scepta-design";
    SceptaDesign.log = Logger.get(SceptaDesign.pluginName);
    SceptaDesign.templatePath = "plugins/scepta-design/html";
})(SceptaDesign || (SceptaDesign = {}));

/// <reference path="../../includes.ts"/>
/// <reference path="sceptaDesignGlobals.ts"/>
var SceptaDesign;
(function (SceptaDesign) {
    SceptaDesign._module = angular.module(SceptaDesign.pluginName, ["xeditable", "ui.codemirror"]);
    var tab = undefined;
    SceptaDesign._module.config(['$locationProvider', '$routeProvider', 'HawtioNavBuilderProvider', function ($locationProvider, $routeProvider, builder) {
        tab = builder.create().id(SceptaDesign.pluginName).title(function () { return "Policy Design"; }).href(function () { return "/design"; }).build();
        builder.configureRouting($routeProvider, tab);
        $locationProvider.html5Mode(true);
        $routeProvider.when('/design', {
            templateUrl: 'plugins/scepta-design/html/organizations.html',
            controller: 'SceptaDesign.OrganizationsController'
        }).when('/design/:organization', {
            templateUrl: 'plugins/scepta-design/html/organization.html',
            controller: 'SceptaDesign.OrganizationController'
        }).when('/design/:organization/:policygroup', {
            templateUrl: 'plugins/scepta-design/html/policygroup.html',
            controller: 'SceptaDesign.PolicyGroupController'
        }).when('/design/:organization/:policygroup/:policy', {
            templateUrl: 'plugins/scepta-design/html/policy.html',
            controller: 'SceptaDesign.PolicyController'
        }).when('/design/:organization/:policygroup/:policy/:resource', {
            templateUrl: 'plugins/scepta-design/html/resource.html',
            controller: 'SceptaDesign.ResourceController'
        });
    }]);
    SceptaDesign._module.run(function (editableOptions) {
        editableOptions.theme = 'bs3';
    });
    SceptaDesign._module.run(['HawtioNav', function (HawtioNav) {
        HawtioNav.add(tab);
        SceptaDesign.log.debug("loaded");
    }]);
    hawtioPluginLoader.addModule(SceptaDesign.pluginName);
})(SceptaDesign || (SceptaDesign = {}));

/// <reference path="sceptaDesignPlugin.ts"/>
var SceptaDesign;
(function (SceptaDesign) {
    SceptaDesign.OrganizationController = SceptaDesign._module.controller("SceptaDesign.OrganizationController", ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
        $scope.organizationName = $routeParams.organization;
        $http.get('/scepta-server/design/' + $scope.organizationName).success(function (data) {
            $scope.organization = data;
        });
        $http.get('/scepta-server/design/' + $scope.organizationName + '/group').success(function (data) {
            $scope.policygroups = data;
        });
        $scope.updateOrganization = function () {
            return $http.put('/scepta-server/design/' + $scope.organizationName, $scope.organization);
        };
        $scope.importPolicyGroup = function () {
        };
    }]);
})(SceptaDesign || (SceptaDesign = {}));

/// <reference path="sceptaDesignPlugin.ts"/>
var SceptaDesign;
(function (SceptaDesign) {
    SceptaDesign.OrganizationsController = SceptaDesign._module.controller("SceptaDesign.OrganizationsController", ['$scope', '$http', function ($scope, $http) {
        $http.get('/scepta-server/design').success(function (data) {
            $scope.organizations = data;
        });
    }]);
})(SceptaDesign || (SceptaDesign = {}));

/// <reference path="sceptaDesignPlugin.ts"/>
var SceptaDesign;
(function (SceptaDesign) {
    SceptaDesign.PolicyController = SceptaDesign._module.controller("SceptaDesign.PolicyController", ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
        $scope.organizationName = $routeParams.organization;
        $scope.policyGroupName = $routeParams.policygroup;
        $scope.policyName = $routeParams.policy;
        $http.get('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/policy/' + $scope.policyName).success(function (data) {
            $scope.policy = data;
        });
        $http.get('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/policy/' + $scope.policyName + '/definition').success(function (data) {
            $scope.policyDefinition = data;
            $scope.$watch("policyDefinition", function (newValue, oldValue) {
                return $http.put('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/policy/' + $scope.policyName + '/definition', $scope.policyDefinition, { "headers": { "Content-Type": "text/plain" } });
            });
        });
        $scope.updatePolicy = function () {
            return $http.put('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/policy/' + $scope.policyName, $scope.policy);
        };
        $scope.editorOptions = {
            lineWrapping: true,
            lineNumbers: true,
            mode: 'xml'
        };
        $scope.addResource = function (resource) {
            console.log("New resource=" + resource.name);
            $scope.policy.resources.push(resource);
            $scope.updatePolicy();
        };
        $scope.addDependency = function (dependency) {
            console.log("New dependency=" + dependency.artifactId);
            $scope.policy.dependencies.push(dependency);
            $scope.updatePolicy();
        };
        $scope.removeDependency = function (event) {
            var dependency = JSON.parse(event.currentTarget.attributes.getNamedItem('dependency').value);
            for (var i = $scope.policy.dependencies.length - 1; i >= 0; i--) {
                var d = $scope.policy.dependencies[i];
                if (d.groupId === dependency.groupId && d.artifactId === dependency.artifactId) {
                    $scope.policy.dependencies.remove(d);
                    $scope.updatePolicy();
                }
            }
        };
    }]);
})(SceptaDesign || (SceptaDesign = {}));

/// <reference path="sceptaDesignPlugin.ts"/>
var SceptaDesign;
(function (SceptaDesign) {
    SceptaDesign.PolicyGroupController = SceptaDesign._module.controller("SceptaDesign.PolicyGroupController", ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
        $scope.organizationName = $routeParams.organization;
        $scope.policyGroupName = $routeParams.policygroup;
        $http.get('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName).success(function (data) {
            $scope.policygroup = data;
        });
        $http.get('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/policy').success(function (data) {
            $scope.policies = data;
        });
        $scope.updatePolicyGroup = function () {
            return $http.put('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName, $scope.policygroup);
        };
        $scope.exportPolicyGroup = function () {
            window.open('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/export', 'export');
        };
    }]);
})(SceptaDesign || (SceptaDesign = {}));

/// <reference path="sceptaDesignPlugin.ts"/>
var SceptaDesign;
(function (SceptaDesign) {
    SceptaDesign.PolicyController = SceptaDesign._module.controller("SceptaDesign.ResourceController", ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
        $scope.organizationName = $routeParams.organization;
        $scope.policyGroupName = $routeParams.policygroup;
        $scope.policyName = $routeParams.policy;
        $scope.resourceName = $routeParams.resource;
        $http.get('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/policy/' + $scope.policyName).success(function (data) {
            $scope.policy = data;
            $scope.policy.resources.forEach(function (res) {
                if (res.name === $scope.resourceName) {
                    $scope.resource = res;
                }
            });
        });
        $scope.updateResource = function () {
            return $http.put('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/policy/' + $scope.policyName, $scope.policy);
        };
        $http.get('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/policy/' + $scope.policyName + '/resource/' + $scope.resourceName).success(function (data) {
            $scope.resourceDefinition = data;
            $scope.$watch("resourceDefinition", function (newValue, oldValue) {
                return $http.put('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/policy/' + $scope.policyName + '/resource/' + $scope.resourceName, $scope.resourceDefinition, { "headers": { "Content-Type": "text/plain" } });
            });
        });
        $scope.resourceEditorOptions = {
            lineWrapping: true,
            lineNumbers: true,
            mode: 'text'
        };
    }]);
})(SceptaDesign || (SceptaDesign = {}));

angular.module("scepta-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/scepta-design/html/organization.html","<div class=\"row\">\n\n  <div class=\"col-md-12\" ng-controller=\"SceptaDesign.OrganizationController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/design\">Organizations</a></li>\n      <li class=\"active\">{{organizationName}}</li>\n    </ol>\n\n    <h1>{{organizationName}}</h1>\n\n    <a href=\"#\" editable-textarea=\"organization.description\" e-rows=\"7\" e-cols=\"120\" onaftersave=\"updateOrganization()\">\n        <pre><i>{{ organization.description || \'No description\' }}</i></pre>\n    </a>\n\n    <button type=\"button\" class=\"btn btn-default\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\"Import policy group\"><span class=\"pficon pficon-import\"></span></button>\n\n    <p></p>\n    <p>List of policy groups for organization {{organizationName}}</p>\n    <ul>\n      <li ng-repeat=\"pg in policygroups\">\n        <a href=\"/design/{{organizationName}}/{{pg.name}}\">{{pg.name}}</a>\n        <p><i>{{pg.description}}</i></p>\n      </li>\n    </ul>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/scepta-design/html/organizations.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"SceptaDesign.OrganizationsController\">\n    <h1>Organizations</h1>\n\n    <ul>\n      <li ng-repeat=\"org in organizations\">\n        <a href=\"/design/{{org.name}}\">{{org.name}}</a>\n        <p>{{org.description}}</p>\n      </li>\n    </ul>\n  </div>\n</div>\n");
$templateCache.put("plugins/scepta-design/html/policy.html","<div class=\"row\">\n\n  <div class=\"col-md-12\" ng-controller=\"SceptaDesign.PolicyController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/design\">Organizations</a></li>\n      <li><a href=\"/design/{{organizationName}}\">{{organizationName}}</a></li>\n      <li><a href=\"/design/{{organizationName}}/{{policyGroupName}}\">{{policyGroupName}}</a></li>\n      <li class=\"active\">{{policyName}}</li>\n    </ol>\n\n    <h1>{{policyName}}</h1>\n    <a href=\"#\" editable-textarea=\"policy.description\" e-rows=\"7\" e-cols=\"120\" onaftersave=\"updatePolicy()\">\n        <pre><i>{{ policy.description || \'No description\' }}</i></pre>\n    </a>\n\n      <div class=\"row\">\n        <div class=\"col-sm-8 col-md-9\">\n          <ui-codemirror ui-codemirror-opts=\"editorOptions\" ng-model=\"policyDefinition\" ></ui-codemirror>\n        </div>\n        <div class=\"col-sm-4 col-md-3 sidebar-pf sidebar-pf-right\">\n          <div class=\"sidebar-header sidebar-header-bleed-left sidebar-header-bleed-right\">\n            <div class=\"actions pull-right\">\n              <button type=\"button\" class=\"btn btn-default\" data-toggle=\"collapse\" href=\"#addResourceForm\" aria-expanded=\"false\" aria-controls=\"addResourceForm\"><span class=\"pficon pficon-add\"></span></button>\n            </div>\n            <h2 class=\"h5\">Resources</h2>\n            <div class=\"collapse\" id=\"addResourceForm\">\n              <div class=\"well\">\n                 <form novalidate class=\"simple-form\">\n                   Name: <input type=\"text\" ng-model=\"resource.name\" /><br />\n                   Description: <input type=\"description\" ng-model=\"resource.description\" /><br />\n                   <input type=\"button\" value=\"Cancel\" data-toggle=\"collapse\" href=\"#addResourceForm\" aria-expanded=\"false\" aria-controls=\"addResourceForm\"/>\n                   <input type=\"submit\" ng-click=\"addResource(resource)\" value=\"Add\" data-toggle=\"collapse\" href=\"#addResourceForm\" aria-expanded=\"false\" aria-controls=\"addResourceForm\"/>\n                 </form>\n              </div>\n            </div>\n          </div>\n          <ul class=\"list-group\">\n            <li ng-repeat=\"res in policy.resources\">\n              <h3><a href=\"/design/{{organizationName}}/{{policyGroupName}}/{{policyName}}/{{res.name}}\">{{res.name}}</a></h3>\n              <p><i>{{res.description}}</i></p>\n            </li>\n          </ul>\n          <div class=\"sidebar-header sidebar-header-bleed-left sidebar-header-bleed-right\">\n            <div class=\"actions pull-right\">\n              <button type=\"button\" class=\"btn btn-default\" data-toggle=\"collapse\" href=\"#addDependencyForm\" aria-expanded=\"false\" aria-controls=\"addDependencyForm\"><span class=\"pficon pficon-add\"></span></button>\n            </div>\n            <h2 class=\"h5\">Dependencies</h2>\n            <div class=\"collapse\" id=\"addDependencyForm\">\n              <div class=\"well\">\n                 <form novalidate class=\"simple-form\">\n                   Group ID: <input type=\"text\" ng-model=\"dependency.groupId\" /><br />\n                   Artifact ID: <input type=\"text\" ng-model=\"dependency.artifactId\" /><br />\n                   Version: <input type=\"text\" ng-model=\"dependency.version\" /><br />\n                   <input type=\"button\" value=\"Cancel\" data-toggle=\"collapse\" href=\"#addDependencyForm\" aria-expanded=\"false\" aria-controls=\"addDependencyForm\"/>\n                   <input type=\"submit\" ng-click=\"addDependency(dependency)\" value=\"Add\" data-toggle=\"collapse\" href=\"#addDependencyForm\" aria-expanded=\"false\" aria-controls=\"addDependencyForm\"/>\n                 </form>\n              </div>\n            </div>\n          </div>\n          <ul class=\"list-group\">\n            <li ng-repeat=\"dep in policy.dependencies\">\n              <h3>{{dep.artifactId}} <button type=\"button\" class=\"btn btn-default\" dependency=\"{{dep}}\" ng-click=\"removeDependency($event)\"><span class=\"pficon pficon-remove\"></span></button></h3>\n              <p><i>{{dep.groupId}}</i> [{{dep.version}}]</p>\n            </li>\n          </ul>\n        </div>\n      </div>\n  </div>\n\n</div>\n");
$templateCache.put("plugins/scepta-design/html/policygroup.html","<div class=\"row\">\n\n  <div class=\"col-md-12\" ng-controller=\"SceptaDesign.PolicyGroupController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/design\">Organizations</a></li>\n      <li><a href=\"/design/{{organizationName}}\">{{organizationName}}</a></li>\n      <li class=\"active\">{{policyGroupName}}</li>\n    </ol>\n\n    <h1>{{policyGroupName}}</h1>\n    <a href=\"#\" editable-textarea=\"policygroup.description\" e-rows=\"7\" e-cols=\"120\" onaftersave=\"updatePolicyGroup()\">\n        <pre><i>{{ policygroup.description || \'No description\' }}</i></pre>\n    </a>\n\n    <button type=\"button\" class=\"btn btn-default\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\"Export policy group\" ng-click=\"exportPolicyGroup()\"><span class=\"pficon pficon-export\"></span></button>\n\n    <p></p>\n    <p>List of policies for policy group {{policyGroupName}}</p>\n    <ul>\n      <li ng-repeat=\"pol in policies\">\n        <a href=\"/design/{{organizationName}}/{{policyGroupName}}/{{pol.name}}\">{{pol.name}}</a>\n        <p><i>{{pol.description}}</i></p>\n      </li>\n    </ul>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/scepta-design/html/resource.html","<div class=\"row\">\n\n  <div class=\"col-md-12\" ng-controller=\"SceptaDesign.ResourceController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/design\">Organizations</a></li>\n      <li><a href=\"/design/{{organizationName}}\">{{organizationName}}</a></li>\n      <li><a href=\"/design/{{organizationName}}/{{policyGroupName}}\">{{policyGroupName}}</a></li>\n      <li><a href=\"/design/{{organizationName}}/{{policyGroupName}}/{{policyName}}\">{{policyName}}</a></li>\n      <li class=\"active\">{{resourceName}}</li>\n    </ol>\n\n    <h1>{{resourceName}}</h1>\n    <a href=\"#\" editable-textarea=\"resource.description\" e-rows=\"7\" e-cols=\"120\" onaftersave=\"updateResource()\">\n        <pre><i>{{ resource.description || \'No description\' }}</i></pre>\n    </a>\n\n      <div class=\"row\">\n        <div class=\"col-sm-8 col-md-9\">\n\n    <ui-codemirror ui-codemirror-opts=\"resourceEditorOptions\" ng-model=\"resourceDefinition\" ></ui-codemirror>\n\n        </div>\n        <div class=\"col-sm-4 col-md-3 sidebar-pf sidebar-pf-right\">\n          <div class=\"sidebar-header sidebar-header-bleed-left sidebar-header-bleed-right\">\n            <div class=\"actions pull-right\">\n              <button type=\"button\" class=\"btn btn-default\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"\" data-original-title=\"Add resource\"><span class=\"pficon pficon-add\"></span></button>\n            </div>\n            <h2 class=\"h5\">Dependencies</h2>\n          </div>\n          <ul class=\"list-group\">\n            <li ng-repeat=\"dep in resource.dependencies\">\n              <h3>{{dep.artifactId}}</h3>\n              <p><i>Group: {{dep.groupId}}</i></p>\n              <p><i>Version: {{dep.version}}</i></p>\n            </li>\n          </ul>\n        </div>\n      </div>\n  </div>\n</div>\n");
$templateCache.put("plugins/scepta-admin/html/sceptaAdmin.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"SceptaAdmin.SceptaAdminController\">\n\n    <ul class=\"nav nav-tabs\">\n        <li ng-repeat=\"org in organizations\"><h1>{{org.name}}</h1>\n            <p><i>{{org.description}}</i></p>\n        </li>\n    </ui>\n\n  </div>\n</div>\n");}]); hawtioPluginLoader.addModule("scepta-templates");