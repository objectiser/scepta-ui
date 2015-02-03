/// <reference path="sceptaDesignPlugin.ts"/>
module SceptaDesign {

  export var OrganizationsController = _module.controller("SceptaDesign.OrganizationsController", ['$scope', '$http', ($scope, $http) => {

    $http.get('http://localhost:8080/scepta-server/design').success(function(data) {
      $scope.organizations = data;
    });

  }]);

}
