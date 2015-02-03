/// <reference path="sceptaAdminPlugin.ts"/>
module SceptaAdmin {

  export var SceptaAdminController = _module.controller("SceptaAdmin.SceptaAdminController", ['$scope', '$http', ($scope, $http) => {

    $http.get('http://localhost:8080/scepta-server/design').success(function(data) {
      $scope.organizations = data;
    });

  }]);

}
