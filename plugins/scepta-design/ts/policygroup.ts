/// <reference path="sceptaDesignPlugin.ts"/>
module SceptaDesign {

  export var PolicyGroupController = _module.controller("SceptaDesign.PolicyGroupController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;
    $scope.policyGroupName = $routeParams.policygroup;

    $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName).success(function(data) {
      $scope.policygroup = data;
    });

    $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy').success(function(data) {
      $scope.policies = data;
    });

    $scope.updatePolicyGroup = function() {
      return $http.put('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName, $scope.policygroup);
    };

    $scope.exportPolicyGroup = function() {
      $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/export').success(function(data) {
      });
    };
  }]);

}
