/// <reference path="policydesignPlugin.ts"/>
module PolicyDesign {

  export var OrganizationController = _module.controller("PolicyDesign.OrganizationController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;

    $http.get('http://localhost:8080/policy-dev-server/'+$scope.organizationName).success(function(data) {
      $scope.organization = data;
    });

    $http.get('http://localhost:8080/policy-dev-server/'+$scope.organizationName+'/group').success(function(data) {
      $scope.policygroups = data;
    });

    $scope.updateOrganization = function() {
      return $http.post('http://localhost:8080/policy-dev-server/'+$scope.organizationName, $scope.organization);
    };
  }]);

}
