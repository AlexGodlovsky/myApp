angular.module('money.module',[
    'ui.router',
    'ngMaterial'
])

    .config(function($stateProvider){

        $stateProvider
            .state('home.money', {
                url : '/money',
                resolve : {
                    testAuth :  ['$firebaseAuth', function($firebaseAuth){
                        return $firebaseAuth().$waitForSignIn();
                    }]
                },
                abstract : false,
                views : {
                    '' : {
                        templateUrl : 'app/home/money/money.html',
                        controller : 'MoneyCtrl'
                    },

                    'dohod@home.money' : {
                        templateUrl : 'app/home/money/dohod/dohod.html',
                        controller : 'DohodContr'
                    },
                    'rashod@home.money' : {
                        templateUrl : 'app/home/money/rashod/rashod.html',
                        controller : 'RashorContr'
                    }
                }
            })
    })

    .controller('MoneyCtrl',['$scope',function($scope){

        $scope.money = 30;

    }])

    .controller('DohodContr',[
        '$scope',
        '$mdDialog',
        'firebaseDatabase',

        function($scope, $mdDialog, firebaseDatabase){

            var db =  firebaseDatabase.money.dohod;

            function updateValue (){

                $scope.value = 0;

                $scope.db.forEach(function(item, index){

                    $scope.value += Number(item.value);

                })

            }

            $scope.db = db.getList().$loaded(function (res){

                $scope.db = res;

                updateValue();

                $scope.db.$watch(updateValue)

                });



            $scope.value = 0;

            $scope.addNew = function(){

                $mdDialog.show({
                    controller: AddNewMoneyItemContr,
                    templateUrl : 'app/home/money/dialogs/add.new.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true
                });

                function AddNewMoneyItemContr($scope, $mdDialog, firebaseDatabase) {

                    $scope.dialogName = 'DESCRIPTION';

                    $scope.dialogAmount = 20;

                    $scope.saveNew = function() {

                        var newItem = {

                            name : $scope.dialogName,
                            value : $scope.dialogAmount,
                            createdate : new Date().toString()


                        };

                        db.addNew(newItem).then(function(){
                            $mdDialog.hide()
                        })

                    };

                    $scope.cancelDialog = function() {
                        $mdDialog.cancel();
                    };

                }

            };

            $scope.startEdit = function (event, item) {

                $mdDialog.show({
                    controller: EditMoneyItemContr,
                    templateUrl : 'app/home/money/dialogs/add.new.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true,
                    locals : {
                        item : item
                    }
                });

                function EditMoneyItemContr($scope, $mdDialog, firebaseDatabase, item) {

                    $scope.dialogName = item.name;

                    $scope.dialogAmount = item.value;

                    $scope.saveNew = function() {

                        var editedItem = {

                            name : $scope.dialogName,
                            value : $scope.dialogAmount,
                            $id : item.$id

                        };

                        db.edit(editedItem).then(function(){
                            $mdDialog.hide()
                        })

                    };

                    $scope.cancelDialog = function() {
                        $mdDialog.cancel();
                    };

                }

            };

            $scope.startDelet = function (event, item) {
                db.remove(item)
                    .then(function(res){
                    })
                    .catch(function(err){
                        console.log(err)
                    })
            };

    }])

    .controller('RashorContr',[
        '$scope',
        '$mdDialog',
        'firebaseDatabase',

        function($scope, $mdDialog, firebaseDatabase){

            var db =  firebaseDatabase.money.rashod;

            var pokupkiList = firebaseDatabase.buy.completed.getList();

            pokupkiList.$loaded(function(){
                updPokupkiCost()
            });

            function updPokupkiCost () {
                $scope.allPokupki = 0;

                pokupkiList.forEach(function(item){
                    $scope.allPokupki += Number(item.price)
                })



            }

            function updateValue (){

                $scope.value = 0;

                $scope.db.forEach(function(item, index){

                    $scope.value += Number(item.value);

                });

                updPokupkiCost();

                $scope.value += $scope.allPokupki
            }

            $scope.db = db.getList().$loaded(function (res){
                $scope.db = res;
                updateValue();
                $scope.db.$watch(updateValue)
                });

            $scope.value = 0;

            $scope.allPokupki = 0;

            $scope.addNew = function(){

                $mdDialog.show({
                    controller: AddNewMoneyItemContr,
                    templateUrl : 'app/home/money/dialogs/add.new.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true
                });

                function AddNewMoneyItemContr($scope, $mdDialog, firebaseDatabase) {

                    $scope.dialogName = 'DESCRIPTION';

                    $scope.dialogAmount = 20;

                    $scope.saveNew = function() {

                        var newItem = {

                            name : $scope.dialogName,
                            value : $scope.dialogAmount,
                            createdate : new Date().toString()


                        };

                        db.addNew(newItem).then(function(){
                            $mdDialog.hide()
                        })

                    };

                    $scope.cancelDialog = function() {
                        $mdDialog.cancel();
                    };

                }

            };

            $scope.startEdit = function (event, item) {

                $mdDialog.show({
                    controller: EditMoneyItemContr,
                    templateUrl : 'app/home/money/dialogs/add.new.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true,
                    locals : {
                        item : item
                    }
                });

                function EditMoneyItemContr($scope, $mdDialog, firebaseDatabase, item) {

                    $scope.dialogName = item.name;

                    $scope.dialogAmount = item.value;

                    $scope.saveNew = function() {

                        var editedItem = {

                            name : $scope.dialogName,
                            value : $scope.dialogAmount,
                            $id : item.$id

                        };

                        db.edit(editedItem).then(function(){
                            $mdDialog.hide()
                        })

                    };

                    $scope.cancelDialog = function() {
                        $mdDialog.cancel();
                    };

                }

            };

            $scope.startDelet = function (event, item) {
                db.remove(item)
                    .then(function(res){
                })
                    .catch(function(err){
                        console.log(err)
                    })
            };

    }]);