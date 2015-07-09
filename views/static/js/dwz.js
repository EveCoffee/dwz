/**
 * Created by Coffee on 15/7/4.
 */
var dwz = angular.module('Dwz', []);
dwz.controller('addUrl', function($scope, $http, $location){
    $scope.dwz = {
        _this: this,
        url: 'http://wangchaoyi.com/blog/14455',
        customUrl: 'angular',
        customDwz: '',
        domain: $location.absUrl(),
        submit: function(){
            $http.post('/addUrl',{
                url: this.url,
                customUrl: this.customUrl
            }).success(function(response){
                if(response.status==200){
                    $scope.dwz.customDwz = $scope.dwz.domain + response.customUrl;
                }else if(response.status==500){
                    alert(response.msg);
                }
            });
            return false;
        }
    };
    $scope.rdwz = {
        customUrl: 'http://'
    };
});