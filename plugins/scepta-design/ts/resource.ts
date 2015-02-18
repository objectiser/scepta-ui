/// <reference path="sceptaDesignPlugin.ts"/>
module SceptaDesign {

  export var PolicyController = _module.controller("SceptaDesign.ResourceController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;
    $scope.policyGroupName = $routeParams.policygroup;
    $scope.policyName = $routeParams.policy;
    $scope.resourceName = $routeParams.resource;

    $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName).success(function(data) {
      $scope.policy = data;
      $scope.policy.resources.forEach(function(res) {
        if (res.name === $scope.resourceName) {
          $scope.resource = res;
        }
      });
    });

    $scope.updateResource = function() {
      return $http.put('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName, $scope.policy);
    };

    $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName+'/resource/'+$scope.resourceName).success(function(data) {
      $scope.resourceDefinition = data;

      $scope.$watch("resourceDefinition", function(newValue, oldValue) {
        return $http.put('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName+'/resource/'+$scope.resourceName, $scope.resourceDefinition, { "headers": { "Content-Type": "text/plain" } });
      });
    });

    $scope.resourceEditorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      mode: 'text'
    };

    $scope.addDependency = function(dependency) {
      $scope.resource.dependencies.push(dependency);
      $scope.updateResource();
    };

    $scope.removeDependency = function(event) {
      var c = confirm("Are you sure?");
      if (c == true) {
        var dependency = JSON.parse(event.currentTarget.attributes.getNamedItem('dependency').value);
        for (var i = $scope.policy.dependencies.length - 1; i >= 0; i--) { 
          var d=$scope.resource.dependencies[i];     
          if (d.groupId === dependency.groupId && d.artifactId === dependency.artifactId) {
            $scope.resource.dependencies.remove(d);
            $scope.updateResource();
          }
        }
      }
    };

  }]);

}
