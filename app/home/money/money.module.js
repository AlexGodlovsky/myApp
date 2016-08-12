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

            $scope.openSettings = function () {
                $mdDialog.show({
                    controller: MoneySettingsContr,
                    templateUrl : 'app/home/money/dialogs/settings.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true,
                    locals : {
                        currentMode : mainDb.budget.dengi.dayLimit.actual
                    }
                });

                /*function MoneySettingsContr($scope, $mdDialog, firebaseDatabase, currentMode) {

                    $scope.budgetMode = {
                        float : true,
                        fixed : false
                    };

                    function setCurrentMode () {
                        switch (currentMode){
                            case 'float' :
                                $scope.budgetMode = {
                                    float : true,
                                    fixed : false
                                };
                                break;

                            case 'fixed' :
                                $scope.budgetMode = {
                                    float : false,
                                    fixed : true
                                };
                                break;
                        }
                    }

                    setCurrentMode();

                    $scope.changeMode = function (modeName){
                        var mode = $scope.budgetMode;

                        switch (modeName){
                            case 'float':
                                mode.fixed = !mode.float;
                                break;

                            case 'fixed' :
                                mode.float = !mode.fixed;
                                break;
                        }
                    };

                    $scope.numOfDays = db.budget.dengi.dayLimit.float.daysLeft;

                    $scope.numDate = new Date();

                    $scope.minDate = new Date();

                    $scope.$watch('numOfDays', function(){
                        $scope.numDate = dateOfDays($scope.numOfDays)
                    });

                    $scope.$watch('numDate', function(){
                        $scope.numOfDays = dayBetween($scope.numDate)
                    });

                    $scope.limitPerDay = db.budget.dengi.dayLimit.fixed;

                    function dayBetween (date){

                        var now = new Date();

                        date.setHours(0, 0, 0, 0);

                        now.setHours(0, 0, 0, 0);

                        var days = (Date.parse(date) - Date.parse(now)) / 1000 / 60 / 60 /24;

                        return days + 1;
                    }

                    function dateOfDays (days){
                        var now = new Date().setHours(0, 0, 0, 0);

                        var plusDays = 86400000 * (days - 1);

                        return new Date(now + plusDays)
                    };

                    $scope.save = function () {

                        /!*var devList = false;

                        firebaseDatabase.main.getList()
                            .then(function(res){
                                devList = res
                                firebaseDatabase.main.saveList(devList)
                                    .then(function(res2){
                                        console.log(res2)
                                    })
                                    .catch(function(err){
                                        console.log(err)
                                    })
                            })
                            .catch(function(err){
                                console.log(err)
                            });*!/





                        $scope.budgetMode.float == true ? saveFloat() : false;

                        $scope.budgetMode.fixed == true ? saveFixed() : false;

                        function saveFloat () {
                            var result = dayBetween($scope.numDate);

                            db.budget.dengi.dayLimit.actual = 'float';

                            db.budget.dengi.dayLimit.float.daysLeft = result;

                            firebaseDatabase.main.saveList(db)
                                .then(function(res){
                                    $mdDialog.hide()
                                })
                                .catch(function(error){
                                    console.log(error)
                                })
                        }

                        function saveFixed () {
                            db.budget.dengi.dayLimit.actual = 'fixed';

                            db.budget.dengi.dayLimit.fixed = $scope.limitPerDay;

                            db.$save()
                                .then(function(res){
                                $mdDialog.hide()
                            })
                                .catch(function(error){
                                    console.log(error)
                                })

                            firebaseDatabase.main.saveList(db)
                                .then(function(res){
                                    $mdDialog.hide()
                                })
                                .catch(function(error){
                                    console.log(error)
                                })
                        }
                    };

                    $scope.cancelDialog = function(){
                        $mdDialog.hide();
                    }

                }*/

                function MoneySettingsContr($scope, $mdDialog, firebaseDatabase, currentMode) {

                    $scope.budgetMode = {
                        float : true,
                        fixed : false
                    };

                    function setCurrentMode () {
                        switch (currentMode){
                            case 'float' :
                                $scope.budgetMode = {
                                    float : true,
                                    fixed : false
                                };
                                break;

                            case 'fixed' :
                                $scope.budgetMode = {
                                    float : false,
                                    fixed : true
                                };
                                break;
                        }
                    }

                    setCurrentMode();

                    $scope.changeMode = function (modeName){
                        var mode = $scope.budgetMode;

                        switch (modeName){
                            case 'float':
                                mode.fixed = !mode.float;
                                break;

                            case 'fixed' :
                                mode.float = !mode.fixed;
                                break;
                        }
                    };

                    $scope.numOfDays = mainDb.budget.dengi.dayLimit.float.daysLeft;

                    $scope.numDate = new Date();

                    $scope.minDate = new Date();

                    $scope.$watch('numOfDays', function(){
                        $scope.numDate = dateOfDays($scope.numOfDays)
                    });

                    $scope.$watch('numDate', function(){
                        $scope.numOfDays = dayBetween($scope.numDate)
                    });

                    $scope.limitPerDay = mainDb.budget.dengi.dayLimit.fixed;

                    function dayBetween (date){

                        var now = new Date();

                        date.setHours(0, 0, 0, 0);

                        now.setHours(0, 0, 0, 0);

                        var days = (Date.parse(date) - Date.parse(now)) / 1000 / 60 / 60 /24;

                        return days + 1;
                    }

                    function dateOfDays (days){
                        var now = new Date().setHours(0, 0, 0, 0);

                        var plusDays = 86400000 * (days - 1);

                        return new Date(now + plusDays)
                    };

                    $scope.save = function () {

                        $scope.budgetMode.float == true ? saveFloat() : false;

                        $scope.budgetMode.fixed == true ? saveFixed() : false;

                        function saveFloat () {
                            var result = dayBetween($scope.numDate);

                            mainDb.budget.dengi.dayLimit.actual = 'float';

                            mainDb.budget.dengi.dayLimit.float.daysLeft = result;

                            firebaseDatabase.main.saveList(mainDb)
                                .then(function(res){
                                    $mdDialog.hide()
                                })
                                .catch(function(error){
                                    console.log(error)
                                })
                        }

                        function saveFixed () {
                            mainDb.budget.dengi.dayLimit.actual = 'fixed';

                            mainDb.budget.dengi.dayLimit.fixed = $scope.limitPerDay;

                            firebaseDatabase.main.saveList(mainDb)
                                .then(function(res){
                                    $mdDialog.hide()
                                })
                                .catch(function(error){
                                    console.log(error)
                                })
                        }
                    };

                    $scope.cancelDialog = function(){
                        $mdDialog.hide();
                    }

                }
            };

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

        /*function($scope, $mdDialog, firebaseDatabase, db){

            var listDb =  firebaseDatabase.money.dohod;

            db.$watch(updateValue());

            function updateValue () {

                console.log('watch')

                $scope.value = 0;

                var dohodList = db.budget.dohod;

                for(var item in dohodList){
                    $scope.value += dohodList[item].value
                }

            }


            $scope.db = listDb.getList().$loaded(function (res){

                $scope.db = res;

                updateValue();

                $scope.db.$watch(updateValue())

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

                        listDb.addNew(newItem).then(function(){
                            $mdDialog.hide()
                        })

                    };

                    $scope.cancelDialog = function() {
                        $mdDialog.cancel();
                    };

                }

            };

            $scope.startEdit = function (event, item) {

                console.log(db);

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

                        listDb.edit(editedItem).then(function(){
                            $mdDialog.hide()
                        })

                    };

                    $scope.cancelDialog = function() {
                        $mdDialog.cancel();
                    };

                }

            };

            $scope.startDelet = function (event, item) {
                listDb.remove(item)
                    .then(function(res){
                    })
                    .catch(function(err){
                        console.log(err)
                    })
            };

        }])*/

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