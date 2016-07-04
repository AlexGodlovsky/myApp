angular.module('registration.module',[
    'ui.router',
    'ngMaterial',
    'ngMessages'
    ])

    .config(function($stateProvider){

        $stateProvider
            .state('registration', {
                url : '/registration',
                templateUrl : 'app/registration/registration.html',
                controller : 'registrationCtrl'
            })
    })

    .controller('registrationCtrl',['$scope', '$state', 'firebaseAuth',
        function($scope, $state, firebaseAuth, ngMessages){

            $scope.registerEmail = 'test@mail.ru';
            $scope.confirmUserPassword = 'adminadmin';

            var password = $scope.confirmUserPassword;
            var email = $scope.registerEmail;

            $scope.registration = function () {

                firebaseAuth.registration(email, password)
                    .then(function(newUser){
                        $state.go('home')
                    })
                    .catch(function(error){
                        console.log(error)
                    });

                //console.log(firebaseAuth.registration().currentUser)
            }

    }]);