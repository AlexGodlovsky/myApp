var app = angular.module('BudgetApp', [
    'firebase',
    'ngMaterial',
    'ui.router',
    'login.module',
    'home.module',
    'registration.module',
    'dev.module',
    ])

    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('pink')
            .accentPalette('orange');
    })

    .config(function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('home/buy/actual');

        $stateProvider
            .state('404',{
                url: '/404',
                templateUrl: 'app/404/404.html'
        });
    })

    .config(['firebaseAuthProvider', function(firebaseAuth){
        firebaseAuth.getUser();
    }])



    .run(function(firebaseAuth, $firebaseAuth, $rootScope, $state, $urlRouter, $location, $browser){

        $firebaseAuth().$requireSignIn()
            .then(function(res){
                console.log('Is authorised');
                $state.go('home.buy');
            })
            .catch(function(err){
                console.log('Is NOT authorised');
                $state.go('login')
            });

        $firebaseAuth().$onAuthStateChanged(function(firebaseUser) {
            if (!firebaseUser) {
                $state.go('login')
            } else {

            }
        });

        $rootScope.$on("$locationChangeStart", function (event, newUrl, oldUrl){

            if($firebaseAuth().$waitForSignIn()){
                $browser.url(newUrl)
            }
            else{
                $state.go('login');
            }

        });

        /*$rootScope.$on("$locationChangeStart",
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

                console.log('go')

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



            });*/
    });