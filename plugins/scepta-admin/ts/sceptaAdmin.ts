/// <reference path="sceptaAdminPlugin.ts"/>
module SceptaAdmin {

  export var SceptaAdminController = _module.controller("SceptaAdmin.SceptaAdminController", ['$scope', '$http', ($scope, $http) => {

    $http.get('/scepta-server/design').success(function(data) {
      $scope.organizations = data;
    });

  }]);

}
