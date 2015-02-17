/// <reference path="sceptaDesignPlugin.ts"/>
module SceptaDesign {

  export var OrganizationController = _module.controller("SceptaDesign.OrganizationController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;

    $http.get('/scepta-server/design/'+$scope.organizationName).success(function(data) {
      $scope.organization = data;
    });

    $http.get('/scepta-server/design/'+$scope.organizationName+'/group').success(function(data) {
      $scope.policygroups = data;
    });

    $scope.updateOrganization = function() {
      return $http.put('/scepta-server/design/'+$scope.organizationName, $scope.organization);
    };

    $scope.importPolicyGroup = function() {
    };
  }]);

}
