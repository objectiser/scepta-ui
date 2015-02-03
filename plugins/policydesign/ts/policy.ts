/// <reference path="policydesignPlugin.ts"/>
module PolicyDesign {

  export var PolicyController = _module.controller("PolicyDesign.PolicyController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;
    $scope.policyGroupName = $routeParams.policygroup;
    $scope.policyName = $routeParams.policy;

    $http.get('http://localhost:8080/scepta-server/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName).success(function(data) {
      $scope.policy = data;
    });

    $scope.updatePolicy = function() {
      return $http.post('http://localhost:8080/scepta-server/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName, $scope.policy);
    };
  }]);

}
