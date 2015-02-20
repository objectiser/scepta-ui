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

    $http.get('/scepta-server/design/config/characteristics').success(function(data) {
      $scope.characteristicTypes = data;
    });

    $scope.selectedCharacteristicProperty = function() {
      $scope.editCharacteristicProperty = {};
      $scope.editCharacteristicProperty.originalKey = this.key;
      $scope.editCharacteristicProperty.key = this.key;
      $scope.editCharacteristicProperty.value = this.value;
    };

    $scope.updateCharacteristicProperty = function() {
      if ($scope.editCharacteristicProperty.originalKey !== undefined) {
       delete $scope.selectedCharacteristic.properties[$scope.editCharacteristicProperty.originalKey];
      }
      $scope.selectedCharacteristic.properties[$scope.editCharacteristicProperty.key] = $scope.editCharacteristicProperty.value;
      $scope.editCharacteristicProperty = undefined;
    };

    $scope.deleteCharacteristicProperty = function() {
      delete $scope.selectedCharacteristic.properties[this.key];
    };

    $scope.addCharacteristic = function() {
      $scope.selectedCharacteristic = { "type": this.type.name, "properties": {} };
      for (var key in this.type.propertyDescriptors) {
        if (this.type.propertyDescriptors.hasOwnProperty(key)) {
          if (this.type.propertyDescriptors[key].mandatory) {
            $scope.selectedCharacteristic.properties[key] = this.type.propertyDescriptors[key].defaultValue;
          }
        }
      }
      $scope.editable.characteristics.push($scope.selectedCharacteristic);
    }

    $scope.deleteCharacteristic = function() {
      if ($scope.selectedCharacteristic !== undefined) {
        $scope.editable.characteristics.remove($scope.selectedCharacteristic);
        $scope.selectedCharacteristic = undefined;
        $scope.editCharacteristicProperty = undefined;
      }
    }

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

    $scope.deleteConsumerOption = function() {
      delete $scope.editable.consumerOptions[this.key];
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

    $scope.deleteProducerOption = function() {
      delete $scope.editable.producerOptions[this.key];
    };

  }]);

}
