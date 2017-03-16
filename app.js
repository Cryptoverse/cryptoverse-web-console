domain = "http://localhost:8000/"
cv_service = "http://localhost:5000/"

angular.module('app', ['ngRoute'])

.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl : 'pages/home.htm',
		controller	: 'DashboardController'
	})
	.when("/probe",{
		templateUrl : 'pages/probe.htm',
		controller	: 'ProbeController'
	})
})

.controller('DashboardController', function($scope,$http){
	$scope.loading = true;
	$scope.blockChainInfo = {};

	$scope.init = function(){
		$scope.loading = true;
		$http.get(cv_service+"debug/blockchain-info").then(
			function(resp){
				$scope.blockChainInfo = resp.data;
				$scope.loading = false;
				console.log(resp)
			}, function(error){
				$scope.loading = false;
			}
		)
	}

	$scope.init();

})

.controller('ProbeController', function($scope, $http, $timeout){
	$scope.jobData = {}
	$scope.starting = false;
	$scope.jobInfo = {}
	$scope.performanceData = {}
	$scope.processing = false;
	$scope.testObj = {
		"log_header": "",
		"nonce": 0,
		"hash": "",
		"difficulty": 486604799,
		"state": {
			"fleet": null,
			"jumps": [],
			"star_systems": []
		},
		"version": 0,
		"time": 0,
		"previous_hash": "0000000000000000000000000000000000000000000000000000000000000000",
		"state_hash": ""
	}

	$scope.startProbing = function(){
		$http.post(cv_service+"debug/probe-star-log", $scope.testObj).then(
			function(resp){
				$scope.processing = true;
				$scope.jobData = resp.data;
				$scope.refreshProbing()
			}, function(error){

			}
		)
	}

	$scope.refreshProbing = function(){
		$http.get(cv_service+"jobprogress?job="+$scope.jobData.task_id).then(
			function(resp){
				$scope.jobInfo = resp.data;
				$scope.starting = $scope.jobInfo=="PENDING"
				if(!($scope.jobInfo.constructor === Array)){
					$timeout($scope.refreshProbing, 500);
					$scope.performanceData = resp.data;
				}
				else{
					$scope.processing = false;
					$scope.finalData = resp.data[1];
				}
			},function(error){

			}
		)
	}
	

})

.directive('navbar', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/nav.htm'
	};
})
