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

    .controller('LoginCtrl', ['$scope', '$state', 'firebaseAuth', 'firebaseDatabase',
        function($scope, $state, firebaseAuth, firebaseDatabase) {

            $scope.userTitle = 'mamudar@mail.ru';
            $scope.userPassword = 'sania4552';

            $scope.logout = function(){
                firebaseAuth.logout();

            };

            $scope.login = function(){
                firebaseAuth.login($scope.userTitle, $scope.userPassword)
                    .then(function(arg){
                        $state.go('home.buy')
                    })
                    .catch(function(error){

                    })
            };

            $scope.goRegister = function(){
                $state.go('registration')
            };


        }]);