/// <reference path="policydesignPlugin.ts"/>
module PolicyDesign {

  export var OrganizationsController = _module.controller("PolicyDesign.OrganizationsController", ['$scope', '$http', ($scope, $http) => {

    $http.get('http://localhost:8080/scepta-server').success(function(data) {
      $scope.organizations = data;
    });

  }]);

}
