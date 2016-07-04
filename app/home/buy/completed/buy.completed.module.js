angular.module('buy.completed.module',[
    'ui.router',
    'firebase',
    'ngMaterial'
])

.config(function($stateProvider){

    $stateProvider
        .state('home.buy.completed', {
            url : '/completed',
            templateUrl : 'app/home/buy/completed/buy.completed.html',
            controller : 'BuyCompletedCtrl',
            resolve : {
                testAuth :  ['$firebaseAuth', function($firebaseAuth){
                    return $firebaseAuth().$waitForSignIn();
                }]
            }
        })
})

.controller('BuyCompletedCtrl', [
        '$scope',
        'firebaseDatabase',
        'firebaseAuth',
        '$mdDialog',

        function($scope, firebaseDatabase, firebaseAuth, $mdDialog){

            var db = firebaseDatabase.buy.completed;

            $scope.list = db.getList();

            $scope.startNew = function(event){

                $mdDialog.show({
                    controller: AddNewItemContr,
                    templateUrl : 'app/home/buy/dialogs/purchased.dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true
                });

                function AddNewItemContr($scope, $mdDialog, firebaseDatabase) {

                    $scope.dialogName = 'DESCRIPTION';

                    $scope.dialogAmount = 3;

                    $scope.dialogMeasure = 'KG.';

                    $scope.dialogExpiryDate = new Date();

                    $scope.dialogPlace = 'Place';

                    $scope.dialogPrice = 12;

                    $scope.save = function() {

                        var newItem = {
                            name : $scope.dialogName,
                            amount : $scope.dialogAmount,
                            measure : $scope.dialogMeasure,
                            createdate : new Date().toString(),
                            edited : new Date().toString(),
                            place : $scope.dialogPlace,
                            price : Number($scope.dialogPrice)
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
                    templateUrl : 'app/home/buy/dialogs/purchased.dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true,
                    locals : {
                        item : item
                    }
                });

                function EditItemContr($scope, $mdDialog, firebaseDatabase, item) {

                    $scope.dialogName = item.name;

                    $scope.dialogAmount = Number(item.amount);

                    $scope.dialogMeasure = item.measure;

                    $scope.dialogPlace = item.place;

                    $scope.dialogPrice = Number(item.price);

                    $scope.save = function() {

                        var editedItem = {
                            name : $scope.dialogName,
                            amount : $scope.dialogAmount,
                            measure : $scope.dialogMeasure,
                            edited : new Date().toString(),
                            place : $scope.dialogPlace,
                            price : Number($scope.dialogPrice)
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