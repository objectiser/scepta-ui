/// <reference path="policyadminPlugin.ts"/>
module PolicyAdmin {

  export var PolicyAdminController = _module.controller("PolicyAdmin.PolicyAdminController", ['$scope', '$http', ($scope, $http) => {

    $http.get('http://localhost:8080/policy-dev-server').success(function(data) {
      $scope.organizations = data;
    });

  }]);

}
