/// <reference path="sceptaDesignPlugin.ts"/>
module SceptaDesign {

  export var OrganizationController = _module.controller("SceptaDesign.OrganizationController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;

    $http.get('http://localhost:8080/scepta-server/design/'+$scope.organizationName).success(function(data) {
      $scope.organization = data;
    });

    $http.get('http://localhost:8080/scepta-server/design/'+$scope.organizationName+'/group').success(function(data) {
      $scope.policygroups = data;
    });

    $scope.updateOrganization = function() {
      return $http.post('http://localhost:8080/scepta-server/design/'+$scope.organizationName, $scope.organization);
    };
  }]);

}
