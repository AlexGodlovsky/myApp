angular.module('buy.actual.module',[
    'ui.router',
    'firebase',
    'ngMaterial'
])

.config(function($stateProvider){

    $stateProvider
        .state('home.buy.actual', {
            url : '/actual',
            templateUrl : 'app/home/buy/actual/buy.actual.html',
            controller : 'BuyActualCtrl',
            resolve : {
                testAuth :  ['$firebaseAuth', function($firebaseAuth){
                    return $firebaseAuth().$waitForSignIn();
                }]
            }
        })
})

    .controller('BuyActualCtrl',[
        '$scope',
        'firebaseDatabase',
        'firebaseAuth',
        '$mdDialog',

        function($scope, firebaseDatabase, firebaseAuth, $mdDialog){

            var db = firebaseDatabase.buy.actual;

            $scope.list = db.getList();

            $scope.startNew = function(event){

                $mdDialog.show({
                    controller: AddNewItemContr,
                    templateUrl : 'app/home/buy/dialogs/add.new.dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true
                });

                function AddNewItemContr($scope, $mdDialog, firebaseDatabase) {

                    var db = firebaseDatabase.buy.actual;

                    $scope.dialogName = 'DESCRIPTION';

                    $scope.dialogAmount = 20;

                    $scope.dialogMeasure = 'KG.';

                    $scope.dialogExpiryDate = new Date();

                    $scope.saveNew = function() {

                        var newItem = {
                            name : $scope.dialogName,
                            amount : $scope.dialogAmount,
                            measure : $scope.dialogMeasure,
                            expiredate : $scope.dialogExpiryDate.toString(),
                            createdate : new Date().toString(),
                            edited : new Date().toString()
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
                    controller: PurchasedContr,
                    templateUrl : 'app/home/buy/dialogs/purchased.dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true,
                    locals : {
                        item : item
                    }
                });

                function PurchasedContr($scope, $mdDialog, firebaseDatabase, item) {

                    var db = firebaseDatabase.buy.actual;

                    $scope.dialogName = item.name;

                    $scope.dialogAmount = item.amount;

                    $scope.dialogMeasure = item.measure;

                    $scope.dialogPlace = item.place;

                    $scope.dialogPrice = item.price;

                    $scope.save = function() {

                        item.name = $scope.dialogName;
                        item.amount = $scope.dialogAmount;
                        item.measure = $scope.dialogMeasure;
                        item.edited = new Date().toString();
                        item.place = $scope.dialogPlace;
                        item.price = $scope.dialogPrice;
                        item.purchased = new Date().toString();

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
                    templateUrl : 'app/home/buy/dialogs/add.new.dialog.html',
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

                    $scope.dialogExpiryDate = new Date(item.expiredate);

                    $scope.saveNew = function() {

                        var editedItem = {
                            name : $scope.dialogName,
                            amount : $scope.dialogAmount,
                            measure : $scope.dialogMeasure,
                            expiredate : $scope.dialogExpiryDate.toString(),
                            createdate : item.createdate
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