angular.module('dohod.module',[
    'ui.router',
    'ngMaterial'
])

    .config(function($stateProvider){

        $stateProvider
            .state('dohod', {
                url : '/dohod',
                templateUrl : 'app/home/money/dohod/dohod.html',
                controller : 'DohogCtrl'
            })
    })

    .controller('DohogCtrl',[function(){



    }]);