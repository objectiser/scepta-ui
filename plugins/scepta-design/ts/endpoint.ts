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
          $scope.reset();
        }
      });
    });

    $scope.updatePolicyGroup = function() {
      return $http.put('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName, $scope.policyGroup);
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

    $scope.update = function() {
      $scope.policyGroup.endpoints.remove($scope.endpoint);
      $scope.endpoint = angular.copy($scope.editable);
      $scope.policyGroup.endpoints.push($scope.endpoint);
      $scope.updatePolicyGroup();
    };

    $scope.reset = function() {
      $scope.editable = angular.copy($scope.endpoint);
    };

    $scope.selectedConsumerOption = function() {
      $scope.editConsumerOption = {};
      $scope.editConsumerOption.originalKey = this.key;
      $scope.editConsumerOption.key = this.key;
      $scope.editConsumerOption.value = this.value;
    };

    $scope.updateConsumerOption = function() {
      if ($scope.editConsumerOption.originalKey !== undefined) {
       delete $scope.editable.consumerOptions[$scope.editConsumerOption.originalKey];
      }
      $scope.editable.consumerOptions[$scope.editConsumerOption.key] = $scope.editConsumerOption.value;
      $scope.editConsumerOption = undefined;
    };

    $scope.selectedProducerOption = function() {
      $scope.editProducerOption = {};
      $scope.editProducerOption.originalKey = this.key;
      $scope.editProducerOption.key = this.key;
      $scope.editProducerOption.value = this.value;
    };

    $scope.updateProducerOption = function() {
      if ($scope.editProducerOption.originalKey !== undefined) {
       delete $scope.editable.producerOptions[$scope.editProducerOption.originalKey];
      }
      $scope.editable.producerOptions[$scope.editProducerOption.key] = $scope.editProducerOption.value;
      $scope.editProducerOption = undefined;
    };

  }]);

}
