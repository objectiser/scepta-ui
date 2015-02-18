/// <reference path="sceptaDesignPlugin.ts"/>
module SceptaDesign {

  export var OrganizationsController = _module.controller("SceptaDesign.OrganizationsController", ['$scope', '$http', ($scope, $http) => {

    $http.get('/scepta-server/design').success(function(data) {
      $scope.organizations = data;
    });

    $scope.nameOrderProp = 'name';

  }]);

}
