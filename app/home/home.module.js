angular.module('home.module',[
    'ui.router',
    'ngMaterial',
    'buy.module',
    'money.module',
    'tasks.module',
    'firebase'
])

    .config(function($stateProvider){

        $stateProvider
            .state('home', {
                url : '/home',
                templateUrl: 'app/home/home.html',
                controller : 'HomeCtrl',
                resolve : {
                    testAuth :  ['$firebaseAuth', function($firebaseAuth){
                        return $firebaseAuth().$waitForSignIn();
                    }]
                }
            })
    })

    .controller('HomeCtrl',
        ['$scope', 'firebaseAuth', 'uiConfig', 'firebaseDatabase', 'languageConfig', '$firebaseAuth', 'testAuth',
        function($scope, firebaseAuth, uiConfig, firebaseDatabase, languageConfig, $firebaseAuth, testAuth) {

            $scope.uiConfig = uiConfig.home;
            $scope.langConf = languageConfig.eng.home;

            var db = firebaseDatabase;



            $scope.test = function(){

                console.log(firebaseAuth.waitForSignIn)

                //console.log($firebaseAuth().$getAuth())
            }



    }])