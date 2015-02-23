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

    $scope.nameOrderProp = 'name';

    $scope.readSingleFile = function(evt) {
      var f = evt.target.files[0]; 

      if (f) {
        var r = new FileReader();
        r.onload = function(e) { 
          $http.post('/scepta-server/design/'+$scope.organizationName+'/import', r.result).
            success(function(data, status, headers, config) {
              $http.get('/scepta-server/design/'+$scope.organizationName+'/group').success(function(data) {
                $scope.policygroups = data;
              });
            });
        }
        r.readAsText(f);
      } else { 
        alert("Failed to load file");
      }
    }

    // TODO: Check if ok to add listener on document element from here???
    document.getElementById('policyGroupImportFile').addEventListener('change', $scope.readSingleFile, false);

  }]);

}
