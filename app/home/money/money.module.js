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
                    }],
                    mainDb : ['firebaseDatabase', function(firebaseDatabase){
                        return firebaseDatabase.main.getList()
                            .then(function(list){
                            return list
                        })
                            .catch(function(error){
                                console.log(error)
                                return error
                            })
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
                        controller : 'RashodContr'
                    }
                }
            })
    })

    .controller('MoneyCtrl',[
        '$scope', 'firebaseDatabase', '$mdDialog', 'mainDb',

        function($scope, firebaseDatabase, $mdDialog, mainDb){

            mainDb.$watch(function(){

                updateAvalaibleMoney ();

            });

            mainDb.$loaded(function(){
                updateAvalaibleMoney();
            });

            function updateAvalaibleMoney (){

                var oldAvaleiblMoney = mainDb.budget.dengi.startmoney.common;

                var allDohod = getAllDohod();

                var allRashod = getAllRashod();

                function getAllDohod () {
                    var dohodList = mainDb.budget.dohod;

                    var result = 0;

                    for(var item in dohodList){
                        result += dohodList[item].value
                    }

                    return result
                }

                function getAllRashod () {

                    var rashodList = mainDb.budget.rashod;

                    var result = 0;

                    for(var item in rashodList){
                        result += rashodList[item].value
                    }

                    function getAllPokupki(){

                        var pokupkiList = mainDb.pokupkilist.completed;

                        var result = 0;

                        for(var item in pokupkiList){
                            result += pokupkiList[item].price
                        }

                        return result

                    }

                    result += getAllPokupki();

                    return result

                }

                $scope.money = oldAvaleiblMoney + allDohod - allRashod

            }

            $scope.money = 0;

            $scope.setAvalableMoney = function() {

                $mdDialog.show({
                    controller : setAvalablemoneyContr,
                    templateUrl : 'app/home/money/dialogs/setAvalableMoney.html',
                    targetEvent : event,
                    parent : angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen: true
                });

                function setAvalablemoneyContr ($scope, $mdDialog, firebaseDatabase) {

                    $scope.avalableCommon = mainDb.budget.dengi.startmoney.common;

                    $scope.avalableBesnal = mainDb.budget.dengi.startmoney.besnal;

                    $scope.avalableNal = mainDb.budget.dengi.startmoney.nal;

                    $scope.cancel = function () {
                        $mdDialog.hide()
                    };

                    $scope.save = function () {

                        mainDb.budget.dengi.startmoney.common = $scope.avalableCommon;

                        mainDb.budget.dengi.startmoney.besnal = $scope.avalableBesnal;

                        mainDb.budget.dengi.startmoney.nal = $scope.avalableNal;

                        firebaseDatabase.main.saveList(mainDb)
                            .then($mdDialog.hide())
                            .catch(function(err){
                                console.log(err)
                            })

                    }

                }

            }

    }])

    .controller('DohodContr',[
        '$scope',
        '$mdDialog',
        'firebaseDatabase',
        'mainDb',

        function($scope, $mdDialog, firebaseDatabase, mainDb){

            mainDb.$watch(function(){
                updateValue()
            });

            function updateValue () {

                $scope.value = 0;

                var dohodList = mainDb.budget.dohod;

                for(var item in dohodList){
                    $scope.value += dohodList[item].value
                }

            }

            $scope.dohodDb = false;

            firebaseDatabase.money.dohod.getList().$loaded(function (res){

                $scope.dohodDb = res;

                updateValue()

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

                        firebaseDatabase.money.dohod.addNew(newItem).then(function(){
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

                        firebaseDatabase.money.dohod.edit(editedItem).then(function(){
                            $mdDialog.hide()
                        })

                    };

                    $scope.cancelDialog = function() {
                        $mdDialog.cancel();
                    };

                }

            };

            $scope.startDelet = function (event, item) {
                firebaseDatabase.money.dohod.remove(item)
                    .then(function(res){
                    })
                    .catch(function(err){
                        console.log(err)
                    })
            };

        }])

    .controller('RashodContr',[
        '$scope',
        '$mdDialog',
        'firebaseDatabase',

        /*function($scope, $mdDialog, firebaseDatabase){

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

    }]);*/

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