angular.module('dev.module',[
    'ui.router'
])

    .config(function($stateProvider){

        $stateProvider
            .state('dev', {
                url : '/dev',
                templateUrl : 'app/dev/dev.html',
                controller : 'DevContr',
                resolve : {
                    dev :  ['firebaseDatabase', function(firebaseDatabase){
                        return firebaseDatabase.dev.first()
                            .then(function(dev){
                                console.log('go');
                            return dev
                            })
                            .catch(function(error){
                                console.log(error)
                            });
                    }]
                }
            })
    })

.controller('DevContr',[
        '$scope',
        '$log',
        'firebaseDatabase',
        'dev',
        'findKit',

        function(
            $scope,
            $log,
            firebaseDatabase,
            dev,
            findKit
        ){

            var l = $log;

            var db = firebaseDatabase.dev.second();

            db.then(function(res){
                console.log(res)
            })
                .catch(function(error){
                    l.error(error)
                });



            $scope.click1 = function(){

                l.log(dev)

            };

            $scope.click2 = function(){

                console.log(db)

            }

        }
    ]);