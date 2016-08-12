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
                controller : 'TasksCtrl',
                resolve : {
                    initList : ['firebaseDatabase', function(firebaseDatabase){
                        return firebaseDatabase.task.initTaskList()
                            .then(function(res){
                                return res
                            })
                    }]
                }
            })
    })

    .controller('TasksCtrl',[
        '$scope',
        '$state',
        '$mdDialog',
        'firebaseDatabase',

        function($scope, $state, $mdDialog, firebaseDatabase){

            var db = firebaseDatabase.task;

            $scope.list = db.getList();

            $scope.addNew = function(event){

                $mdDialog.show({
                    controller: AddNewItemContr,
                    templateUrl : 'app/home/tasks/dialogs/add.new.dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true
                });

                function AddNewItemContr($scope, $mdDialog, firebaseDatabase) {

                    $scope.dialogDescription = 'DESCRIPTION';

                    $scope.isDaily = false;

                    $scope.dialogExpiryDate = new Date();

                    $scope.saveNew = function() {

                        var newItem = {
                            description : $scope.dialogDescription,
                            expiredate : $scope.dialogExpiryDate.toString(),
                            createdate : new Date().toString(),
                            updatedate : new Date().toString(),
                            daily : $scope.isDaily,
                            completed : false
                        };

                        db.addNew(newItem)
                            .then(function(res){
                                $mdDialog.hide()
                            })
                            .catch(function(err){
                                console.log(err)
                            })
                    };

                    $scope.cancelDialog = function() {
                        $mdDialog.cancel();
                    };

                }

            };

            $scope.startComplete = function(event, item){

                $mdDialog.show({
                    controller: CompleteContr,
                    templateUrl : 'app/home/tasks/dialogs/complete.dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true,
                    locals : {
                        item : item
                    }
                });

                function CompleteContr($scope, $mdDialog, item) {

                    $scope.dialogDescription = item.description;

                    $scope.dialogExpiryDate = new Date(item.expiredate);

                    $scope.save = function() {

                        item.description = $scope.dialogDescription;
                        item.completedate = new Date().toString();
                        item.completed = true;

                        db.completeTask(item)
                            .then(function(res){
                                $mdDialog.hide()
                            })
                            .catch(function(err){
                                console.log(err)
                            })
                    };

                    $scope.cancelDialog = function() {
                        $mdDialog.cancel();
                    };

                }

            };

            $scope.startEdit = function(event, item){

                $mdDialog.show({
                    controller: EditItemContr,
                    templateUrl : 'app/home/tasks/dialogs/add.new.dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true,
                    locals : {
                        item : item
                    }
                });

                function EditItemContr($scope, $mdDialog, firebaseDatabase, item) {

                    $scope.dialogDescription = item.description;

                    $scope.dialogExpiryDate = new Date(item.expiredate);

                    $scope.isDaily = item.daily;

                    $scope.saveNew = function() {

                        var editedItem = {
                            description : $scope.dialogDescription,
                            expiredate : $scope.dialogExpiryDate.toString(),
                            updatedate : new Date().toString(),
                            daily : $scope.isDaily
                        };

                        db.editItem(item, editedItem)
                            .then(function(res){
                                $mdDialog.hide()
                            })
                            .catch(function (err){
                                console.log(err)
                            })
                    };

                    $scope.cancelDialog = function() {
                        $mdDialog.cancel();
                    };

                }

            };

            $scope.startDelet = function(event, item){

                db.removeItem(item)
                    .then(function(res){

                    })

            };

        }]);