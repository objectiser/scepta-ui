/// <reference path="sceptaDesignPlugin.ts"/>
module SceptaDesign {

  export var PolicyController = _module.controller("SceptaDesign.EndpointController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;
    $scope.policyGroupName = $routeParams.policygroup;
    $scope.endpointName = $routeParams.endpoint;

    $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName).success(function(data) {
      $scope.policyGroup = data;
      $scope.policyGroup.endpoints.forEach(function(ep) {
        if (ep.name === $scope.endpointName) {
          $scope.endpoint = ep;
        }
      });
    });

    $scope.updatePolicyGroup = function() {
      return $http.put('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName, $scope.policygroup);
    };

    $scope.dependencyOrderProp = 'artifactId';

    $scope.addDependency = function() {
      $scope.endpoint.dependencies.push($scope.dependency);
      $scope.updatePolicyGroup();
      $scope.dependency = new Object();
    };

    $scope.removeDependency = function(event) {
      var c = confirm("Are you sure?");
      if (c == true) {
        var dependency = JSON.parse(event.currentTarget.attributes.getNamedItem('dependency').value);
        for (var i = $scope.endpoint.dependencies.length - 1; i >= 0; i--) { 
          var d=$scope.endpoint.dependencies[i];     
          if (d.groupId === dependency.groupId && d.artifactId === dependency.artifactId) {
            $scope.endpoint.dependencies.remove(d);
            $scope.updatePolicyGroup();
          }
        }
      }
    };

  }]);

}
