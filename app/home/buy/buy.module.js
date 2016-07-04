angular.module('buy.module',[
    'ui.router',
    'firebase',
    'ngMaterial',
    'buy.actual.module',
    'buy.completed.module'
])

    .config(function($stateProvider){

        $stateProvider
            .state('home.buy', {
                url : '/buy',
                templateUrl : 'app/home/buy/buy.html',
                controller : 'BuyCtrl',
                resolve : {
                    testAuth :  ['$firebaseAuth', function($firebaseAuth){
                        return $firebaseAuth().$waitForSignIn();
                    }]
                }
            })
    })

    .controller('BuyCtrl',[
        '$scope', '$state',

        function($scope, $state){

            $scope.cangeState = function(){
                if($state.current.name !== 'home.buy.actual'){
                    $state.go('home.buy.actual')
                }
                else{
                    $state.go('home.buy.completed')
                }
            }

    }]);