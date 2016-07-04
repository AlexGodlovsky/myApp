angular.module('login.module',[
    'ui.router',
    'ngMaterial'
])

    .config(function($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('login', {
                url : '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginCtrl'
            })

    })

    .controller('LoginCtrl', ['$scope', '$state', 'firebaseAuth',
        function($scope, $state, firebaseAuth) {

            $scope.userTitle = 'mamudar@mail.ru';
            $scope.userPassword = 'sania4552';

            $scope.testFu = function(){

                console.log(firebaseAuth.user().uid);

            };

            $scope.logout = function(){
                firebaseAuth.logout();

            };

            $scope.login = function(){
                firebaseAuth.login($scope.userTitle, $scope.userPassword)
                    .then(function(arg){
                        $state.go('home')
                    })
                    .catch(function(error){

                    })
            };

            $scope.goRegister = function(){
                $state.go('registration')
            };

            $scope.goHome = function (){
                $state.go('home')
            };

        }]);