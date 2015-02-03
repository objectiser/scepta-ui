/// <reference path="policydesignPlugin.ts"/>
module PolicyDesign {

  export var PolicyGroupController = _module.controller("PolicyDesign.PolicyGroupController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;
    $scope.policyGroupName = $routeParams.policygroup;

    $http.get('http://localhost:8080/scepta-server/'+$scope.organizationName+'/group/'+$scope.policyGroupName).success(function(data) {
      $scope.policygroup = data;
    });

    $http.get('http://localhost:8080/scepta-server/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy').success(function(data) {
      $scope.policies = data;
    });

    $scope.updatePolicyGroup = function() {
      return $http.post('http://localhost:8080/scepta-server/'+$scope.organizationName+'/group/'+$scope.policyGroupName, $scope.policygroup);
    };
  }]);

}
