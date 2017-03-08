domain = "http://localhost:8000/"
cv_service = "http://localhost:5000/"

angular.module('app', ['ngRoute'])

.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl : 'pages/home.htm',
    controller  : 'DashboardController'
  })
  .when("/probe",{
    templateUrl : 'pages/probe.htm',
    controller  : 'ProbeController'
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
    "log_header": "88eef853b26cddd65d14c96c2f02b9428f10e6b7cf5d59255df149ec2b2e5ff8",
    "nonce": 1,
    "hash": "4b6c053dc97a7a119c354444cf86a07897116f4d7a5e0b6977e00d3b54421176",
    "difficulty": 486604799,
    "state": {
      "fleet": "lol fleet public key of discoverer",
      "jumps": [
        {
          "origin": "54584824fc5a31d1a48482bc042acfa97e5fb20dff555675cfb7da8f2253d2f1",
          "count": 1,
          "destination": "54584824fc5a31d1a48482bc042acfa97e5fb20dff555675cfb7da8f2253d2f2",
          "key": "lol key",
          "signature": "39cde3ce5ce14cda69ea84787ea92570995caacf0ab0c576c0d415306c87780846c5cf63586919385404f0929ad453fa7c4234ef0d85fd33c3f99ec62a388d276cfaac83d3c07d82519564eee12bf3e410fe411fe4a3d870208d01cccc3312afab18809dec052e5b72900eb6a0152535ad5265f33a5e8bc7a0506469f3e0f94a",
          "fleet": "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGNLOiyn2JejPTMhhmknHl2LX0uFHUOaiUw5FQWnV8GAhRpDKgOiviCWNFzXRAroqtaF0WhDyZ5JNpy8pmRCAc4tzRRWfvOCkGVXpZWflBk/WDEL4iSDDjumcdP5gzt1VuR8LYizH5xVIzM+f/e04Uh+nQK7sctdYEyKCc1AvAf3AgMBAAE="
        }
      ],
      "star_systems": [
        {
          "hash": "lol hash of this star system",
          "deployments": [
            {
              "count": 0,
              "fleet": "lol public key of this deployment's fleet"
            }
          ]
        }
      ]
    },
    "version": 0,
    "time": 0,
    "previous_hash": "08dca6231b829072ecc8fd3df42bd9184ac0fbc764e1782e04e38a3941ccfc86",
    "state_hash": "83c0b667509f41a1b683a0f997f8c3edc9d9ffa7b767c74f5391a91a80195757"
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
