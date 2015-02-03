/// <reference path="sceptaDesignPlugin.ts"/>
module SceptaDesign {

  export var PolicyGroupController = _module.controller("SceptaDesign.PolicyGroupController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;
    $scope.policyGroupName = $routeParams.policygroup;

    $http.get('http://localhost:8080/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName).success(function(data) {
      $scope.policygroup = data;
    });

    $http.get('http://localhost:8080/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy').success(function(data) {
      $scope.policies = data;
    });

    $scope.updatePolicyGroup = function() {
      return $http.post('http://localhost:8080/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName, $scope.policygroup);
    };
  }]);

}
