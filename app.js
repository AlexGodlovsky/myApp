var app = angular.module('BudgetApp', [
    'firebase',
    'ngMaterial',
    'ui.router',
    'login.module',
    'home.module',
    'registration.module'
    ])

    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('pink')
            .accentPalette('orange');
    })

    .config(function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('home');

        $stateProvider
            .state('404',{
                url: '/404',
                templateUrl: 'app/404/404.html'
        });
    })

    .config(['firebaseAuthProvider', function(firebaseAuth){
        firebaseAuth.getUser();
    }])



    .run(function(firebaseAuth, $rootScope, $state, $urlRouter, $location, $browser){

        $rootScope.$on("$locationChangeStart",
            function(event, newUrl, oldUrl) {

                firebaseAuth.waitForSignIn.then(function(res){
                    if(firebaseAuth.user()){
                        //console.log('Is authorised');
                        $browser.url(newUrl)
                    }
                    else{
                        //console.log('Is NOT authorised');
                        $state.go('login');
                    }
                })

            });

        $rootScope.$on("$locationChangeStart",
            function(event, newUrl, oldUrl) {

                var stateName = $state.current.name;

                if(stateName == 'home.buy'){
                    $state.go('home.buy.actual')
                }

                if(stateName == 'home.tasks'){
                    $state.go('home.tasks.actual')
                }



            });
    });