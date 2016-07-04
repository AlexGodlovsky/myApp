angular.module('money.module',[
    'ui.router',
    'ngMaterial',
    'dohod.module',
    'rashod.module'
])

    .config(function($stateProvider){

        $stateProvider
            .state('home.money', {
                url : '/money',
                templateUrl : 'app/home/money/money.html',
                controller : 'MoneyCtrl'
            })
    })

    .controller('MoneyCtrl',[function(){



    }]);