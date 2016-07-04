angular.module('tasks.completed.module',[
    'ui.router',
    'firebase',
    'ngMaterial'
])

.config(function($stateProvider){

    $stateProvider
        .state('home.tasks.completed', {
            url : '/completed',
            templateUrl : 'app/home/tasks/completed/tasks.completed.html',
            controller : 'TasksCompletedCtrl',
            resolve : {
                testAuth :  ['$firebaseAuth', function($firebaseAuth){
                    return $firebaseAuth().$waitForSignIn();
                }]
            }
        })
})

.controller('TasksCompletedCtrl', [
        '$scope',
        'firebaseDatabase',
        'firebaseAuth',
        '$mdDialog',

        function($scope, firebaseDatabase, firebaseAuth, $mdDialog){

            var db = firebaseDatabase.tasks.completed;

            $scope.list = db.getList();

            $scope.startNew = function(event){

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
                            daily : $scope.isDaily
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

            $scope.startCancel = function(event, item){
                db.cancel(item)
                    .then(function(res){
                        console.log(res)
                    });
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