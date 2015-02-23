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
        }).when('/design/:organization/:policygroup/endpoint/:endpoint', {
            templateUrl: 'plugins/scepta-design/html/endpoint.html',
            controller: 'SceptaDesign.EndpointController'
        }).when('/design/:organization/:policygroup/policy/:policy', {
            templateUrl: 'plugins/scepta-design/html/policy.html',
            controller: 'SceptaDesign.PolicyController'
        }).when('/design/:organization/:policygroup/policy/:policy/:resource', {
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
    SceptaDesign.PolicyController = SceptaDesign._module.controller("SceptaDesign.EndpointController", ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
        $scope.organizationName = $routeParams.organization;
        $scope.policyGroupName = $routeParams.policygroup;
        $scope.endpointName = $routeParams.endpoint;
        $http.get('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName).success(function (data) {
            $scope.policyGroup = data;
            $scope.policyGroup.endpoints.forEach(function (ep) {
                if (ep.name === $scope.endpointName) {
                    $scope.endpoint = ep;
                    $scope.reset();
                }
            });
        });
        $scope.updatePolicyGroup = function () {
            return $http.put('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName, $scope.policyGroup);
        };
        $scope.dependencyOrderProp = 'artifactId';
        $scope.addDependency = function () {
            $scope.endpoint.dependencies.push($scope.dependency);
            $scope.updatePolicyGroup();
            $scope.dependency = new Object();
        };
        $scope.removeDependency = function (event) {
            var c = confirm("Are you sure?");
            if (c == true) {
                var dependency = JSON.parse(event.currentTarget.attributes.getNamedItem('dependency').value);
                for (var i = $scope.endpoint.dependencies.length - 1; i >= 0; i--) {
                    var d = $scope.endpoint.dependencies[i];
                    if (d.groupId === dependency.groupId && d.artifactId === dependency.artifactId) {
                        $scope.endpoint.dependencies.remove(d);
                        $scope.updatePolicyGroup();
                    }
                }
            }
        };
        $scope.update = function () {
            $scope.policyGroup.endpoints.remove($scope.endpoint);
            $scope.endpoint = angular.copy($scope.editable);
            $scope.policyGroup.endpoints.push($scope.endpoint);
            $scope.updatePolicyGroup();
        };
        $scope.reset = function () {
            $scope.editable = angular.copy($scope.endpoint);
        };
        $http.get('/scepta-server/design/config/characteristics').success(function (data) {
            $scope.characteristicTypes = data;
        });
        $scope.selectedCharacteristicProperty = function () {
            $scope.editCharacteristicProperty = {};
            $scope.editCharacteristicProperty.originalKey = this.key;
            $scope.editCharacteristicProperty.key = this.key;
            $scope.editCharacteristicProperty.value = this.value;
        };
        $scope.updateCharacteristicProperty = function () {
            if ($scope.editCharacteristicProperty.originalKey !== undefined) {
                delete $scope.selectedCharacteristic.properties[$scope.editCharacteristicProperty.originalKey];
            }
            $scope.selectedCharacteristic.properties[$scope.editCharacteristicProperty.key] = $scope.editCharacteristicProperty.value;
            $scope.editCharacteristicProperty = undefined;
        };
        $scope.deleteCharacteristicProperty = function () {
            delete $scope.selectedCharacteristic.properties[this.key];
        };
        $scope.addCharacteristic = function () {
            $scope.selectedCharacteristic = { "type": this.type.name, "properties": {} };
            for (var key in this.type.propertyDescriptors) {
                if (this.type.propertyDescriptors.hasOwnProperty(key)) {
                    if (this.type.propertyDescriptors[key].mandatory) {
                        $scope.selectedCharacteristic.properties[key] = this.type.propertyDescriptors[key].defaultValue;
                    }
                }
            }
            $scope.editable.characteristics.push($scope.selectedCharacteristic);
        };
        $scope.deleteCharacteristic = function () {
            if ($scope.selectedCharacteristic !== undefined) {
                $scope.editable.characteristics.remove($scope.selectedCharacteristic);
                $scope.selectedCharacteristic = undefined;
                $scope.editCharacteristicProperty = undefined;
            }
        };
        $scope.selectedConsumerOption = function () {
            $scope.editConsumerOption = {};
            $scope.editConsumerOption.originalKey = this.key;
            $scope.editConsumerOption.key = this.key;
            $scope.editConsumerOption.value = this.value;
        };
        $scope.updateConsumerOption = function () {
            if ($scope.editConsumerOption.originalKey !== undefined) {
                delete $scope.editable.consumerOptions[$scope.editConsumerOption.originalKey];
            }
            $scope.editable.consumerOptions[$scope.editConsumerOption.key] = $scope.editConsumerOption.value;
            $scope.editConsumerOption = undefined;
        };
        $scope.deleteConsumerOption = function () {
            delete $scope.editable.consumerOptions[this.key];
        };
        $scope.selectedProducerOption = function () {
            $scope.editProducerOption = {};
            $scope.editProducerOption.originalKey = this.key;
            $scope.editProducerOption.key = this.key;
            $scope.editProducerOption.value = this.value;
        };
        $scope.updateProducerOption = function () {
            if ($scope.editProducerOption.originalKey !== undefined) {
                delete $scope.editable.producerOptions[$scope.editProducerOption.originalKey];
            }
            $scope.editable.producerOptions[$scope.editProducerOption.key] = $scope.editProducerOption.value;
            $scope.editProducerOption = undefined;
        };
        $scope.deleteProducerOption = function () {
            delete $scope.editable.producerOptions[this.key];
        };
    }]);
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
        $scope.nameOrderProp = 'name';
        $scope.readSingleFile = function (evt) {
            var f = evt.target.files[0];
            if (f) {
                var r = new FileReader();
                r.onload = function (e) {
                    $http.post('/scepta-server/design/' + $scope.organizationName + '/import', r.result).success(function (data, status, headers, config) {
                        $http.get('/scepta-server/design/' + $scope.organizationName + '/group').success(function (data) {
                            $scope.policygroups = data;
                        });
                    });
                };
                r.readAsText(f);
            }
            else {
                alert("Failed to load file");
            }
        };
        // TODO: Check if ok to add listener on document element from here???
        document.getElementById('policyGroupImportFile').addEventListener('change', $scope.readSingleFile, false);
    }]);
})(SceptaDesign || (SceptaDesign = {}));

/// <reference path="sceptaDesignPlugin.ts"/>
var SceptaDesign;
(function (SceptaDesign) {
    SceptaDesign.OrganizationsController = SceptaDesign._module.controller("SceptaDesign.OrganizationsController", ['$scope', '$http', function ($scope, $http) {
        $http.get('/scepta-server/design').success(function (data) {
            $scope.organizations = data;
        });
        $scope.nameOrderProp = 'name';
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
        $scope.resourceOrderProp = 'name';
        $scope.dependencyOrderProp = 'artifactId';
        $scope.addResource = function () {
            $scope.policy.resources.push($scope.resource);
            $scope.updatePolicy();
            $scope.resource = new Object();
        };
        $scope.removeResource = function (event) {
            var c = confirm("Are you sure?");
            if (c == true) {
                var resourceName = event.currentTarget.attributes.getNamedItem('resource').value;
                for (var i = $scope.policy.resources.length - 1; i >= 0; i--) {
                    var r = $scope.policy.resources[i];
                    if (r.name === resourceName) {
                        $scope.policy.resources.remove(r);
                        $scope.updatePolicy();
                    }
                }
            }
        };
        $scope.addDependency = function () {
            $scope.policy.dependencies.push($scope.dependency);
            $scope.updatePolicy();
            $scope.dependency = new Object();
        };
        $scope.removeDependency = function (event) {
            var c = confirm("Are you sure?");
            if (c == true) {
                var dependency = JSON.parse(event.currentTarget.attributes.getNamedItem('dependency').value);
                for (var i = $scope.policy.dependencies.length - 1; i >= 0; i--) {
                    var d = $scope.policy.dependencies[i];
                    if (d.groupId === dependency.groupId && d.artifactId === dependency.artifactId) {
                        $scope.policy.dependencies.remove(d);
                        $scope.updatePolicy();
                    }
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
        $http.get('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/tag').success(function (data) {
            $scope.tags = data;
        });
        $scope.updatePolicyGroup = function () {
            return $http.put('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName, $scope.policygroup);
        };
        $scope.exportPolicyGroup = function () {
            window.open('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/export', 'export');
        };
        $scope.downloadDeployment = function () {
            window.open('/scepta-server/deployment/' + $scope.organizationName + '/' + $scope.policyGroupName + '/' + this.tag.name, 'download');
        };
        $scope.buildPolicyGroup = function () {
            return $http.post('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/tag', "Tag description tbd", { "headers": { "Content-Type": "text/plain" } });
        };
        $scope.addPolicy = function () {
            $http.post('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/policy', $scope.newPolicy).success(function (data, status, headers, config) {
                $http.get('/scepta-server/design/' + $scope.organizationName + '/group/' + $scope.policyGroupName + '/policy').success(function (data) {
                    $scope.policies = data;
                    $scope.newPolicy = new Object();
                });
            });
        };
        $scope.nameOrderProp = 'name';
        $scope.addEndpoint = function () {
            $scope.policygroup.endpoints.push($scope.endpoint);
            $scope.updatePolicyGroup();
            $scope.endpoint = new Object();
        };
        $scope.removeEndpoint = function (event) {
            var c = confirm("Are you sure?");
            if (c == true) {
                var endpointName = event.currentTarget.attributes.getNamedItem('endpoint').value;
                for (var i = $scope.policygroup.endpoints.length - 1; i >= 0; i--) {
                    var ep = $scope.policygroup.endpoints[i];
                    if (ep.name === endpointName) {
                        $scope.policygroup.endpoints.remove(ep);
                        $scope.updatePolicyGroup();
                    }
                }
            }
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
        $scope.dependencyOrderProp = 'artifactId';
        $scope.addDependency = function () {
            $scope.resource.dependencies.push($scope.dependency);
            $scope.updateResource();
            $scope.dependency = new Object();
        };
        $scope.removeDependency = function (event) {
            var c = confirm("Are you sure?");
            if (c == true) {
                var dependency = JSON.parse(event.currentTarget.attributes.getNamedItem('dependency').value);
                for (var i = $scope.resource.dependencies.length - 1; i >= 0; i--) {
                    var d = $scope.resource.dependencies[i];
                    if (d.groupId === dependency.groupId && d.artifactId === dependency.artifactId) {
                        $scope.resource.dependencies.remove(d);
                        $scope.updateResource();
                    }
                }
            }
        };
    }]);
})(SceptaDesign || (SceptaDesign = {}));

angular.module("scepta-templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("plugins/scepta-admin/html/sceptaAdmin.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"SceptaAdmin.SceptaAdminController\">\n\n    <ul class=\"nav nav-tabs\">\n        <li ng-repeat=\"org in organizations\"><h1>{{org.name}}</h1>\n            <p><i>{{org.description}}</i></p>\n        </li>\n    </ui>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/scepta-design/html/endpoint.html","<div class=\"row\">\n\n  <div class=\"col-md-12\" ng-controller=\"SceptaDesign.EndpointController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/design\">Organizations</a></li>\n      <li><a href=\"/design/{{organizationName}}\">{{organizationName}}</a></li>\n      <li><a href=\"/design/{{organizationName}}/{{policyGroupName}}\">{{policyGroupName}}</a></li>\n      <li class=\"active\">{{endpointName}}</li>\n    </ol>\n\n    <h1><b>{{endpointName}}</b> <span style=\"color:grey\">Endpoint</span></h1>\n    <a href=\"#\" editable-textarea=\"endpoint.description\" e-rows=\"7\" e-cols=\"120\" onaftersave=\"updateEndpoint()\">\n        <pre><i>{{ endpoint.description || \'No description\' }}</i></pre>\n    </a>\n\n      <div class=\"row\">\n        <div class=\"col-sm-8 col-md-9\">\n\n          <form class=\"form-horizontal\">\n            <div class=\"form-group\">\n              <label class=\"col-md-2 control-label\" for=\"endpoint-uri\">URI</label>\n              <div class=\"col-md-6\">\n                <input type=\"text\" id=\"endpoint-uri\" class=\"form-control\" ng-model=\"editable.uri\" >\n              </div>\n            </div>\n            <div class=\"form-group\">\n              <label class=\"col-md-2 control-label\">Characteristics</label>\n              <div class=\"col-md-6\">\n                <select ng-model=\"selectedCharacteristic\"\n                         ng-options=\"opt as opt.type for opt in editable.characteristics\">\n                </select>\n\n                <div class=\"dropdown\">\n                  <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\"><span class=\"pficon pficon-add\"></span></button>\n                  <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">\n                    <li ng-repeat=\"type in characteristicTypes\" role=\"presentation\" ng-click=\"addCharacteristic()\" ><a role=\"menuitem\" tabindex=\"-1\" href=\"#\">{{type.name}}</a></li>\n                  </ul>\n\n                  <button type=\"button\" class=\"btn btn-default \"ng-click=\"deleteCharacteristic()\" ><span class=\"pficon pficon-delete\"></span></button>\n                </div>\n                <br/>\n\n                <table class=\"table table-hover\">\n                  <thead>\n                    <tr>\n                      <th width=\"40%\">Name</th>\n                      <th width=\"40%\">Value</th>\n                      <th width=\"20%\"></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    <tr ng-repeat=\"(key, value) in selectedCharacteristic.properties\">\n                      <td>{{key}}</td>\n                      <td>{{value}}</td>\n                      <td><button ng-click=\"selectedCharacteristicProperty()\" value=\"Edit\"><span class=\"pficon pficon-edit\"></span></button><button ng-click=\"deleteCharacteristicProperty()\" value=\"Delete\"><span class=\"pficon pficon-delete\"></span></button></td>\n                    </tr>\n                  </tbody>\n                </table>\n              </div>\n              <div class=\"col-md-3\"><br/><br/>\n                <br/>\n                Name: <input type=\"text\" ng-model=\"editCharacteristicProperty.key\" /><br />\n                Value: <input type=\"text\" ng-model=\"editCharacteristicProperty.value\" /><br />\n                <button ng-click=\"updateCharacteristicProperty()\" value=\"Update\" ng-disabled=\"editCharacteristicProperty == undefined\"><span class=\"pficon pficon-refresh\"></span></button>\n              </div>\n           </div>\n            <div class=\"form-group\">\n              <label class=\"col-md-2 control-label\">Consumer Options</label>\n              <div class=\"col-md-6\">\n                <table class=\"table table-hover\">\n                  <thead>\n                    <tr>\n                      <th width=\"40%\">Name</th>\n                      <th width=\"40%\">Value</th>\n                      <th width=\"20%\"></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    <tr ng-repeat=\"(key, value) in editable.consumerOptions\">\n                      <td>{{key}}</td>\n                      <td>{{value}}</td>\n                      <td><button ng-click=\"selectedConsumerOption()\" value=\"Edit\"><span class=\"pficon pficon-edit\"></span></button><button ng-click=\"deleteConsumerOption()\" value=\"Delete\"><span class=\"pficon pficon-delete\"></span></button></td>\n                    </tr>\n                  </tbody>\n                </table>\n              </div>\n              <div class=\"col-md-3\">\n                Name: <input type=\"text\" ng-model=\"editConsumerOption.key\" /><br />\n                Value: <input type=\"text\" ng-model=\"editConsumerOption.value\" /><br />\n                <button ng-click=\"updateConsumerOption()\" value=\"Update\" ng-disabled=\"editConsumerOption == undefined\"><span class=\"pficon pficon-refresh\"></span></button>\n              </div>\n            </div>\n            <div class=\"form-group\">\n              <label class=\"col-md-2 control-label\">Producer Options</label>\n              <div class=\"col-md-6\">\n                <table class=\"table table-hover\">\n                  <thead>\n                    <tr>\n                      <th width=\"40%\">Name</th>\n                      <th width=\"40%\">Value</th>\n                      <th width=\"20%\"></th>\n                    </tr>\n                  </thead>\n                  <tbody>\n                    <tr ng-repeat=\"(key, value) in editable.producerOptions\">\n                      <td>{{key}}</td>\n                      <td>{{value}}</td>\n                      <td><button ng-click=\"selectedProducerOption()\" value=\"Edit\"><span class=\"pficon pficon-edit\"></span></button><button ng-click=\"deleteProducerOption()\" value=\"Delete\"><span class=\"pficon pficon-delete\"></span></button></td>\n                    </tr>\n                  </tbody>\n                </table>\n              </div>\n              <div class=\"col-md-3\">\n                Name: <input type=\"text\" ng-model=\"editProducerOption.key\" /><br />\n                Value: <input type=\"text\" ng-model=\"editProducerOption.value\" /><br />\n                <button ng-click=\"updateProducerOption()\" value=\"Update\" ng-disabled=\"editProducerOption == undefined\"><span class=\"pficon pficon-refresh\"></span></button>\n              </div>\n            </div>\n            <div class=\"form-group\">\n              <div class=\"col-md-10 col-md-offset-2\">\n                <button type=\"button\" class=\"btn btn-primary\" ng-click=\"update()\" >Save</button>\n                <button type=\"button\" class=\"btn btn-default \"ng-click=\"reset()\" >Cancel</button>\n              </div>\n            </div>\n          </form>\n\n\n\n\n\n        </div>\n        <div class=\"col-sm-4 col-md-3 sidebar-pf sidebar-pf-right\">\n          <div class=\"sidebar-header sidebar-header-bleed-left sidebar-header-bleed-right\">\n            <div class=\"actions pull-right\">\n              <button type=\"button\" class=\"btn btn-default\" data-toggle=\"collapse\" href=\"#addEndpointDependencyForm\" aria-expanded=\"false\" aria-controls=\"addEndpointDependencyForm\"><span class=\"pficon pficon-add\"></span></button>\n            </div>\n            <h2 class=\"h5\">Dependencies</h2>\n            <div class=\"collapse\" id=\"addEndpointDependencyForm\">\n              <div class=\"well\">\n                 <form novalidate class=\"simple-form\">\n                   Group ID: <input type=\"text\" ng-model=\"dependency.groupId\" /><br />\n                   Artifact ID: <input type=\"text\" ng-model=\"dependency.artifactId\" /><br />\n                   Version: <input type=\"text\" ng-model=\"dependency.version\" /><br />\n                   <input type=\"button\" value=\"Cancel\" data-toggle=\"collapse\" href=\"#addEndpointDependencyForm\" aria-expanded=\"false\" aria-controls=\"addEndpointDependencyForm\"/>\n                   <input type=\"submit\" ng-click=\"addDependency()\" value=\"Add\" data-toggle=\"collapse\" href=\"#addEndpointDependencyForm\" aria-expanded=\"false\" aria-controls=\"addEndpointDependencyForm\"/>\n                 </form>\n              </div>\n            </div>\n          </div>\n          <ul class=\"list-group\">\n            <li ng-repeat=\"dep in endpoint.dependencies | orderBy:dependencyOrderProp\">\n              <h3>{{dep.artifactId}} <button type=\"button\" class=\"btn btn-default\" dependency=\"{{dep}}\" ng-click=\"removeDependency($event)\"><span class=\"pficon pficon-delete\"></span></button></h3>\n              <p><i>{{dep.groupId}}</i> [{{dep.version}}]</p>\n            </li>\n          </ul>\n        </div>\n      </div>\n  </div>\n</div>\n");
$templateCache.put("plugins/scepta-design/html/organization.html","<div class=\"row\">\n\n  <div class=\"col-md-12\" ng-controller=\"SceptaDesign.OrganizationController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/design\">Organizations</a></li>\n      <li class=\"active\">{{organizationName}}</li>\n    </ol>\n\n    <h1><b>{{organizationName}}</b> <span style=\"color:grey\">Organization</span></h1>\n\n    <a href=\"#\" editable-textarea=\"organization.description\" e-rows=\"7\" e-cols=\"120\" onaftersave=\"updateOrganization()\">\n        <pre><i>{{ organization.description || \'No description\' }}</i></pre>\n    </a>\n\n    <div class=\"fileUpload btn btn-primary\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"Import a Policy Group\">\n      <span class=\"pficon pficon-import\"></span>\n      <input type=\"file\" class=\"upload\" id=\"policyGroupImportFile\" />\n    </div>\n\n    <p></p>\n    <h3>Policy Groups</h3>\n    <ul>\n      <li ng-repeat=\"pg in policygroups | orderBy:nameOrderProp\">\n        <a href=\"/design/{{organizationName}}/{{pg.name}}\">{{pg.name}}</a>\n        <p><i>{{pg.description}}</i></p>\n      </li>\n    </ul>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/scepta-design/html/organizations.html","<div class=\"row\">\n  <div class=\"col-md-12\" ng-controller=\"SceptaDesign.OrganizationsController\">\n    <h1><span style=\"color:grey\">Organizations</span></h1>\n\n    <ul>\n      <li ng-repeat=\"org in organizations | orderBy:nameOrderProp\">\n        <a href=\"/design/{{org.name}}\">{{org.name}}</a>\n        <p>{{org.description}}</p>\n      </li>\n    </ul>\n  </div>\n</div>\n");
$templateCache.put("plugins/scepta-design/html/policy.html","<div class=\"row\">\n\n  <div class=\"col-md-12\" ng-controller=\"SceptaDesign.PolicyController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/design\">Organizations</a></li>\n      <li><a href=\"/design/{{organizationName}}\">{{organizationName}}</a></li>\n      <li><a href=\"/design/{{organizationName}}/{{policyGroupName}}\">{{policyGroupName}}</a></li>\n      <li class=\"active\">{{policyName}}</li>\n    </ol>\n\n    <h1><b>{{policyName}}</b> <span style=\"color:grey\">Policy</span></h1>\n    <a href=\"#\" editable-textarea=\"policy.description\" e-rows=\"7\" e-cols=\"120\" onaftersave=\"updatePolicy()\">\n        <pre><i>{{ policy.description || \'No description\' }}</i></pre>\n    </a>\n\n      <div class=\"row\">\n        <div class=\"col-sm-8 col-md-9\">\n          <ui-codemirror ui-codemirror-opts=\"editorOptions\" ng-model=\"policyDefinition\" ></ui-codemirror>\n        </div>\n        <div class=\"col-sm-4 col-md-3 sidebar-pf sidebar-pf-right\">\n          <div class=\"sidebar-header sidebar-header-bleed-left sidebar-header-bleed-right\">\n            <div class=\"actions pull-right\">\n              <button type=\"button\" class=\"btn btn-default\" data-toggle=\"collapse\" href=\"#addResourceForm\" aria-expanded=\"false\" aria-controls=\"addResourceForm\"><span class=\"pficon pficon-add\"></span></button>\n            </div>\n            <h2 class=\"h5\">Resources</h2>\n            <div class=\"collapse\" id=\"addResourceForm\">\n              <div class=\"well\">\n                 <form novalidate class=\"simple-form\">\n                   Name: <input type=\"text\" ng-model=\"resource.name\" /><br />\n                   Description: <input type=\"description\" ng-model=\"resource.description\" /><br />\n                   <input type=\"button\" value=\"Cancel\" data-toggle=\"collapse\" href=\"#addResourceForm\" aria-expanded=\"false\" aria-controls=\"addResourceForm\"/>\n                   <input type=\"submit\" ng-click=\"addResource(resource)\" value=\"Add\" data-toggle=\"collapse\" href=\"#addResourceForm\" aria-expanded=\"false\" aria-controls=\"addResourceForm\"/>\n                 </form>\n              </div>\n            </div>\n          </div>\n          <ul class=\"list-group\">\n            <li ng-repeat=\"res in policy.resources | orderBy:resourceOrderProp\">\n              <h3><a href=\"/design/{{organizationName}}/{{policyGroupName}}/policy/{{policyName}}/{{res.name}}\">{{res.name}}</a> <button type=\"button\" class=\"btn btn-default\" resource=\"{{res.name}}\" ng-click=\"removeResource($event)\"><span class=\"pficon pficon-delete\"></span></button></h3>\n              <p><i>{{res.description}}</i></p>\n            </li>\n          </ul>\n          <div class=\"sidebar-header sidebar-header-bleed-left sidebar-header-bleed-right\">\n            <div class=\"actions pull-right\">\n              <button type=\"button\" class=\"btn btn-default\" data-toggle=\"collapse\" href=\"#addDependencyForm\" aria-expanded=\"false\" aria-controls=\"addDependencyForm\"><span class=\"pficon pficon-add\"></span></button>\n            </div>\n            <h2 class=\"h5\">Dependencies</h2>\n            <div class=\"collapse\" id=\"addDependencyForm\">\n              <div class=\"well\">\n                 <form novalidate class=\"simple-form\">\n                   Group ID: <input type=\"text\" ng-model=\"dependency.groupId\" /><br />\n                   Artifact ID: <input type=\"text\" ng-model=\"dependency.artifactId\" /><br />\n                   Version: <input type=\"text\" ng-model=\"dependency.version\" /><br />\n                   <input type=\"button\" value=\"Cancel\" data-toggle=\"collapse\" href=\"#addDependencyForm\" aria-expanded=\"false\" aria-controls=\"addDependencyForm\"/>\n                   <input type=\"submit\" ng-click=\"addDependency()\" value=\"Add\" data-toggle=\"collapse\" href=\"#addDependencyForm\" aria-expanded=\"false\" aria-controls=\"addDependencyForm\"/>\n                 </form>\n              </div>\n            </div>\n          </div>\n          <ul class=\"list-group\">\n            <li ng-repeat=\"dep in policy.dependencies | orderBy:dependencyOrderProp\">\n              <h3>{{dep.artifactId}} <button type=\"button\" class=\"btn btn-default\" dependency=\"{{dep}}\" ng-click=\"removeDependency($event)\"><span class=\"pficon pficon-delete\"></span></button></h3>\n              <p><i>{{dep.groupId}}</i> [{{dep.version}}]</p>\n            </li>\n          </ul>\n        </div>\n      </div>\n  </div>\n\n</div>\n");
$templateCache.put("plugins/scepta-design/html/policygroup.html","<div class=\"row\">\n\n  <div class=\"col-md-12\" ng-controller=\"SceptaDesign.PolicyGroupController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/design\">Organizations</a></li>\n      <li><a href=\"/design/{{organizationName}}\">{{organizationName}}</a></li>\n      <li class=\"active\">{{policyGroupName}}</li>\n    </ol>\n\n    <h1><b>{{policyGroupName}}</b> <span style=\"color:grey\">Policy Group</span></h1>\n    <a href=\"#\" editable-textarea=\"policygroup.description\" e-rows=\"7\" e-cols=\"120\" onaftersave=\"updatePolicyGroup()\">\n        <pre><i>{{ policygroup.description || \'No description\' }}</i></pre>\n    </a>\n\n    <div class=\"btn btn-primary\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"Export Policy Group\" ng-click=\"exportPolicyGroup()\" >\n      <span class=\"pficon pficon-export\"></span>\n    </div>\n\n    <div class=\"btn btn-primary\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"Build Policy Group\" ng-click=\"buildPolicyGroup()\" >\n      <span class=\"pficon pficon-save\"></span>\n    </div>\n\n      <div class=\"row\">\n        <div class=\"col-sm-8 col-md-9\">\n          <p></p>\n          <h3>Policies\n            <button type=\"button\" class=\"btn btn-default\" data-toggle=\"collapse\" href=\"#addPolicyForm\" aria-expanded=\"false\" aria-controls=\"addPolicyForm\"><span class=\"pficon pficon-add\"></span></button></h3>\n          <div class=\"collapse\" id=\"addPolicyForm\">\n            <div class=\"well\">\n               <form novalidate class=\"simple-form\">\n                 Name: <input type=\"text\" ng-model=\"newPolicy.name\" /><br />\n                 Description: <input type=\"description\" ng-model=\"newPolicy.description\" /><br />\n                 <input type=\"button\" value=\"Cancel\" data-toggle=\"collapse\" href=\"#addPolicyForm\" aria-expanded=\"false\" aria-controls=\"addPolicyForm\"/>\n                 <input type=\"submit\" ng-click=\"addPolicy()\" value=\"Add\" data-toggle=\"collapse\" href=\"#addPolicyForm\" aria-expanded=\"false\" aria-controls=\"addPolicyForm\"/>\n               </form>\n            </div>\n          </div>\n          <ul>\n            <li ng-repeat=\"pol in policies | orderBy:nameOrderProp\">\n              <a href=\"/design/{{organizationName}}/{{policyGroupName}}/policy/{{pol.name}}\">{{pol.name}}</a>\n              <p><i>{{pol.description}}</i></p>\n            </li>\n          </ul>\n          <p></p>\n          <p></p>\n          <p></p>\n          <br/>\n          <h3>Tags</h3>\n          <ul>\n            <li ng-repeat=\"tag in tags\">\n              <a ng-click=\"downloadDeployment()\" ng-if=\"tag.buildStatus == \'Successful\'\" >{{tag.name}}  <span class=\"pficon pficon-ok\"></span></a>\n              <span ng-if=\"tag.buildStatus != \'Successful\'\" >{{tag.name}} <span ng-if=\"tag.buildStatus == \'Failed\'\" class=\"pficon-layered > pficon pficon-error-octagon + pficon pficon-error-exclamation\"></span><span ng-if=\"tag.buildStatus != \'Successful\' && tag.buildStatus != \'Failed\'\" class=\"pficon-layered > pficon pficon-help\"></span></span>\n              <p><i>{{tag.description}}</i></p>\n              <h5>Created by {{tag.createdBy}} on {{tag.createdTimestamp | date:\'medium\'}}</h5>\n            </li>\n          </ul>\n        </div>\n        <div class=\"col-sm-4 col-md-3 sidebar-pf sidebar-pf-right\">\n          <div class=\"sidebar-header sidebar-header-bleed-left sidebar-header-bleed-right\">\n            <div class=\"actions pull-right\">\n              <button type=\"button\" class=\"btn btn-default\" data-toggle=\"collapse\" href=\"#addEndpointForm\" aria-expanded=\"false\" aria-controls=\"addEndpointForm\"><span class=\"pficon pficon-add\"></span></button>\n            </div>\n            <h2 class=\"h5\">Endpoints</h2>\n            <div class=\"collapse\" id=\"addEndpointForm\">\n              <div class=\"well\">\n                 <form novalidate class=\"simple-form\">\n                   Name: <input type=\"text\" ng-model=\"endpoint.name\" /><br />\n                   Description: <input type=\"description\" ng-model=\"endpoint.description\" /><br />\n                   <input type=\"button\" value=\"Cancel\" data-toggle=\"collapse\" href=\"#addEndpointForm\" aria-expanded=\"false\" aria-controls=\"addEndpointForm\"/>\n                   <input type=\"submit\" ng-click=\"addEndpoint()\" value=\"Add\" data-toggle=\"collapse\" href=\"#addEndpointForm\" aria-expanded=\"false\" aria-controls=\"addEndpointForm\"/>\n                 </form>\n              </div>\n            </div>\n          </div>\n          <ul class=\"list-group\">\n            <li ng-repeat=\"ep in policygroup.endpoints | orderBy:nameOrderProp\">\n              <h3><a href=\"/design/{{organizationName}}/{{policyGroupName}}/endpoint/{{ep.name}}\">{{ep.name}}</a> <button type=\"button\" class=\"btn btn-default\" endpoint=\"{{ep.name}}\" ng-click=\"removeEndpoint($event)\"><span class=\"pficon pficon-delete\"></span></button></h3>\n              <p><i>{{ep.description}}</i></p>\n            </li>\n          </ul>\n        </div>\n      </div>\n\n  </div>\n</div>\n");
$templateCache.put("plugins/scepta-design/html/resource.html","<div class=\"row\">\n\n  <div class=\"col-md-12\" ng-controller=\"SceptaDesign.ResourceController\">\n    <ol class=\"breadcrumb\">\n      <li><a href=\"/design\">Organizations</a></li>\n      <li><a href=\"/design/{{organizationName}}\">{{organizationName}}</a></li>\n      <li><a href=\"/design/{{organizationName}}/{{policyGroupName}}\">{{policyGroupName}}</a></li>\n      <li><a href=\"/design/{{organizationName}}/{{policyGroupName}}/policy/{{policyName}}\">{{policyName}}</a></li>\n      <li class=\"active\">{{resourceName}}</li>\n    </ol>\n\n    <h1><b>{{resourceName}}</b> <span style=\"color:grey\">Resource</span></h1>\n    <a href=\"#\" editable-textarea=\"resource.description\" e-rows=\"7\" e-cols=\"120\" onaftersave=\"updateResource()\">\n        <pre><i>{{ resource.description || \'No description\' }}</i></pre>\n    </a>\n\n      <div class=\"row\">\n        <div class=\"col-sm-8 col-md-9\">\n          <ui-codemirror ui-codemirror-opts=\"resourceEditorOptions\" ng-model=\"resourceDefinition\" ></ui-codemirror>\n        </div>\n        <div class=\"col-sm-4 col-md-3 sidebar-pf sidebar-pf-right\">\n          <div class=\"sidebar-header sidebar-header-bleed-left sidebar-header-bleed-right\">\n            <div class=\"actions pull-right\">\n              <button type=\"button\" class=\"btn btn-default\" data-toggle=\"collapse\" href=\"#addResourceDependencyForm\" aria-expanded=\"false\" aria-controls=\"addResourceDependencyForm\"><span class=\"pficon pficon-add\"></span></button>\n            </div>\n            <h2 class=\"h5\">Dependencies</h2>\n            <div class=\"collapse\" id=\"addResourceDependencyForm\">\n              <div class=\"well\">\n                 <form novalidate class=\"simple-form\">\n                   Group ID: <input type=\"text\" ng-model=\"dependency.groupId\" /><br />\n                   Artifact ID: <input type=\"text\" ng-model=\"dependency.artifactId\" /><br />\n                   Version: <input type=\"text\" ng-model=\"dependency.version\" /><br />\n                   <input type=\"button\" value=\"Cancel\" data-toggle=\"collapse\" href=\"#addResourceDependencyForm\" aria-expanded=\"false\" aria-controls=\"addResourceDependencyForm\"/>\n                   <input type=\"submit\" ng-click=\"addDependency()\" value=\"Add\" data-toggle=\"collapse\" href=\"#addResourceDependencyForm\" aria-expanded=\"false\" aria-controls=\"addResourceDependencyForm\"/>\n                 </form>\n              </div>\n            </div>\n          </div>\n          <ul class=\"list-group\">\n            <li ng-repeat=\"dep in resource.dependencies | orderBy:dependencyOrderProp\">\n              <h3>{{dep.artifactId}} <button type=\"button\" class=\"btn btn-default\" dependency=\"{{dep}}\" ng-click=\"removeDependency($event)\"><span class=\"pficon pficon-delete\"></span></button></h3>\n              <p><i>{{dep.groupId}}</i> [{{dep.version}}]</p>\n            </li>\n          </ul>\n        </div>\n      </div>\n  </div>\n</div>\n");}]); hawtioPluginLoader.addModule("scepta-templates");