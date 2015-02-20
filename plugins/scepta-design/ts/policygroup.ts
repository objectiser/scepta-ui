/// <reference path="sceptaDesignPlugin.ts"/>
module SceptaDesign {

  export var PolicyGroupController = _module.controller("SceptaDesign.PolicyGroupController", ['$scope', '$routeParams', '$http', ($scope, $routeParams, $http) => {
    $scope.organizationName = $routeParams.organization;
    $scope.policyGroupName = $routeParams.policygroup;

    $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName).success(function(data) {
      $scope.policygroup = data;
    });

    $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy').success(function(data) {
      $scope.policies = data;
    });

    $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/tag').success(function(data) {
      $scope.tags = data;
    });

    $scope.updatePolicyGroup = function() {
      return $http.put('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName, $scope.policygroup);
    };

    $scope.exportPolicyGroup = function() {
      window.open('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/export', 'export');
    };

    $scope.downloadDeployment = function() {
      window.open('/scepta-server/deployment/'+$scope.organizationName+'/'+$scope.policyGroupName+'/'+this.tag.name, 'download');
    };

    $scope.buildPolicyGroup = function() {
      return $http.post('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/tag', "Tag description tbd", { "headers": { "Content-Type": "text/plain" } });
    };

    $scope.addPolicy = function() {
      $http.post('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy', $scope.newPolicy)
        .success(function(data, status, headers, config) {
        $http.get('/scepta-server/design/'+$scope.organizationName+'/group/'+$scope.policyGroupName+'/policy').success(function(data) {
          $scope.policies = data;
          $scope.newPolicy = new Object();
        });
      });
    };

    $scope.nameOrderProp = 'name';

    $scope.addEndpoint = function() {
      $scope.policygroup.endpoints.push($scope.endpoint);
      $scope.updatePolicyGroup();
      $scope.endpoint = new Object();
    };

    $scope.removeEndpoint = function(event) {
      var c = confirm("Are you sure?");
      if (c == true) {
        var endpointName = event.currentTarget.attributes.getNamedItem('endpoint').value;
        for (var i = $scope.policygroup.endpoints.length - 1; i >= 0; i--) { 
          var ep=$scope.policygroup.endpoints[i];     
          if (ep.name === endpointName) {
            $scope.policygroup.endpoints.remove(ep);
            $scope.updatePolicyGroup();
          }
        }
      } 
    };

  }]);

}
