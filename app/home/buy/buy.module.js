angular.module('buy.module',[
    'ui.router',
    'firebase',
    'ngMaterial',
    'buy.actual.module',
    'buy.completed.module'
])

    .config(function($stateProvider){

        $stateProvider
            .state('home.buy', {
                url : '/buy',
                templateUrl : 'app/home/buy/buy.html',
                controller : 'BuyCtrl',
                resolve : {
                    initList : ['firebaseDatabase', function(firebaseDatabase){
                        return firebaseDatabase.buy.initBuyList()
                            .then(function(res){
                                return res
                            })
                    }]
                }
            })
    })

    .controller('BuyCtrl',[
        '$scope',
        '$state',
        '$mdDialog',
        'firebaseDatabase',

        function($scope, $state, $mdDialog, firebaseDatabase){

            var db = firebaseDatabase.buy;

            $scope.addNew = function(event){

                $mdDialog.show({
                    controller: AddNewItemContr,
                    templateUrl : 'app/home/buy/dialogs/add.new.dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true
                });

                function AddNewItemContr($scope, $mdDialog, firebaseDatabase) {

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
                            edited : new Date().toString(),
                            purchased : false,
                            place : '',
                            price : '',
                            purchasedDate : false
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

            $scope.startPurchasing = function(event, item){

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
                        item.purchasedDate = new Date().toString();
                        item.purchased = true;

                        db.purchasing(item)
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

                if(item.purchased == true){

                    $mdDialog.show({
                        controller: EditPurchasedItemContr,
                        templateUrl : 'app/home/buy/dialogs/purchased.dialog.html',
                        parent: angular.element(document.body),
                        targetEvent: event,
                        clickOutsideToClose:true,
                        fullscreen: true,
                        locals : {
                            item : item
                        }
                    });

                    function EditPurchasedItemContr($scope, $mdDialog, firebaseDatabase, item) {

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

                            db.editPurchasedItem(item, editedItem)
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

                }
                else{

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

                    function EditItemContr($scope, $mdDialog, item) {

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
                                createdate : item.createdate,
                                purchased : false,
                                place : '',
                                price : 0,
                                purchasedDate : false
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

                }

            };

            $scope.startDelet = function(event, item){

                db.removeItem(item)
                    .then(function(res){

                    })

            };

            $scope.cancelPurchased = function (event, item) {
                db.cancelPurchase(item)
            };

            $scope.list = db.getList();

    }]);