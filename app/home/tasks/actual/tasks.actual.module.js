angular.module('actual.module',[
    'ui.router',
    'firebase',
    'ngMaterial'
])

.config(function($stateProvider){

    $stateProvider
        .state('home.tasks.actual', {
            url : '/actual',
            templateUrl : 'app/home/tasks/actual/tasks.actual.html',
            controller : 'TasksActualCtrl',
            resolve : {
                testAuth :  ['$firebaseAuth', function($firebaseAuth){
                    return $firebaseAuth().$waitForSignIn();
                }]
            }
        })
})

    .controller('TasksActualCtrl',[
        '$scope',
        'firebaseDatabase',
        'firebaseAuth',
        '$mdDialog',

        function($scope, firebaseDatabase, firebaseAuth, $mdDialog){

            var db = firebaseDatabase.tasks.actual;

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

                    var db = firebaseDatabase.tasks.actual;

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

                function CompleteContr($scope, $mdDialog, firebaseDatabase, item) {

                    var db = firebaseDatabase.tasks.actual;

                    $scope.dialogDescription = item.description;

                    $scope.dialogExpiryDate = new Date(item.expiredate);

                    $scope.save = function() {

                        item.description = $scope.dialogDescription;
                        item.donedate = new Date().toString();

                        db.done(item)
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

        }])