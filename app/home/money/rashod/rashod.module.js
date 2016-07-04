angular.module('rashod.module',[
    'ui.router',
    'ngMaterial'
])

    .config(function($stateProvider){

        $stateProvider
            .state('rashod', {
                url : '/rashod',
                templateUrl : 'app/home/money/rashod/rashod.html',
                controller : 'RashodCtrl'
            })
    })

    .controller('RashodCtrl',[function(){



    }]);