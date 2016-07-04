angular.module('tasks.module',[
    'ui.router',
    'firebase',
    'ngMaterial',
    'actual.module',
    'tasks.completed.module'

])

    .config(function($stateProvider){

        $stateProvider
            .state('home.tasks', {
                url : '/tasks',
                templateUrl : 'app/home/tasks/tasks.html',
                controller : 'TasksCtrl'
            })
    })

    .controller('TasksCtrl',[
        '$scope', '$state',

        function($scope, $state){

            $scope.cangeState = function(){
                if($state.current.name !== 'home.tasks.actual'){
                    $state.go('home.tasks.actual')
                }
                else{
                    $state.go('home.tasks.completed')
                }
            }

        }]);