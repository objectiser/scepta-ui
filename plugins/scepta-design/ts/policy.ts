/// <reference path="sceptaDesignPlugin.ts"/>
module SceptaDesign {

  export var PolicyController = _module.controller("SceptaDesign.PolicyController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;
    $scope.policyGroupName = $routeParams.policygroup;
    $scope.policyName = $routeParams.policy;

    $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName).success(function(data) {
      $scope.policy = data;
    });

    $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName+'/definition').success(function(data) {
      $scope.policyDefinition = data;

      $scope.$watch("policyDefinition", function(newValue, oldValue) {
        return $http.put('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName+'/definition', $scope.policyDefinition, { "headers": { "Content-Type": "text/plain" } });
      });
    });

    $scope.updatePolicy = function() {
      return $http.put('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName, $scope.policy);
    };

    $scope.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      mode: 'xml'
    };

    $scope.addResource = function(resource) {
      console.log("New resource="+resource.name);
      $scope.policy.resources.push(resource);
      $scope.updatePolicy();
    };

    $scope.addDependency = function(dependency) {
      console.log("New dependency="+dependency.artifactId);
      $scope.policy.dependencies.push(dependency);
      $scope.updatePolicy();
    };

    $scope.removeDependency = function(event) {
      var dependency = JSON.parse(event.currentTarget.attributes.getNamedItem('dependency').value);
      for (var i = $scope.policy.dependencies.length - 1; i >= 0; i--) { 
        var d=$scope.policy.dependencies[i];     
        if (d.groupId === dependency.groupId && d.artifactId === dependency.artifactId) {
          $scope.policy.dependencies.remove(d);
          $scope.updatePolicy();
        }
      }
    };

  }]);

}
