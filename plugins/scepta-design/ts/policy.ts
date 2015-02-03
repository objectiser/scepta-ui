/// <reference path="sceptaDesignPlugin.ts"/>
module SceptaDesign {

  export var PolicyController = _module.controller("SceptaDesign.PolicyController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;
    $scope.policyGroupName = $routeParams.policygroup;
    $scope.policyName = $routeParams.policy;

    $http.get('http://localhost:8080/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName).success(function(data) {
      $scope.policy = data;
    });

    $scope.updatePolicy = function() {
      return $http.post('http://localhost:8080/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy/'+$scope.policyName, $scope.policy);
    };
  }]);

}
