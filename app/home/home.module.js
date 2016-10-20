angular.module('home.module',[
    'ui.router',
    'ngMaterial',
    'buy.module',
    'money.module',
    'tasks.module',
    'firebase'
])

    .config(function($stateProvider){

        $stateProvider
            .state('home', {
                url : '/home',
                templateUrl: 'app/home/home.html',
                controller : 'HomeCtrl',
                resolve : {
                    initList : ['firebaseDatabase', function(firebaseDatabase){
                        return firebaseDatabase.main.initMainDb()
                            .then(function(res){
                                return res
                            })
                    }]
                }
            })
    })

    .controller('HomeCtrl',
        ['$scope', 'firebaseAuth', 'uiConfig', 'firebaseDatabase', 'languageConfig', 'newDayWatcher',
            'countingData', '$mdDialog',
        function($scope, firebaseAuth, uiConfig, firebaseDatabase, languageConfig, newDayWatcher,
                 countingData, $mdDialog) {

            $scope.uiConfig = uiConfig.home;
            $scope.langConf = languageConfig.eng.home;

            firebaseDatabase.main.getList().then(function(res){

                db = res;

                db.$watch(function(){
                    updateDayLimit();
                });

                updateDayLimit()

            })
                .catch(function(err){
                    console.log(err)
                });

            var db = false;

            function updateDayLimit () {

                var actualMode = getActualLimit();

                actualMode == 'fixed' ? useFixed() : useFloat();

                function getActualLimit () {
                    return db.budget.dengi.dayLimit.actual
                }

                function useFixed () {

                    var limit = db.budget.dengi.dayLimit.fixed;

                    setBalance(limit)

                }

                function useFloat () {
                    var avalaibleMoney = getAvalaibleMoney();

                    var daysLeft = db.budget.dengi.dayLimit.float.daysLeft;

                    var limit = avalaibleMoney / daysLeft;

                    setBalance(limit);

                    function getAvalaibleMoney (){

                        var startMoney = countingData.startMoney(db);

                        var rashod = countingData.rashodSum(db);

                        var dohod = countingData.dohodSum(db);

                        return startMoney + dohod - rashod;
                    }
                }

                function setBalance (limit){

                    var spent = countingData.pokupkiSum(db);

                    limit - spent > 0 ?
                        $scope.balance = {
                            icon : '+',
                            value : limit - spent,
                            overrun : false
                        }
                        :
                        $scope.balance = {
                            icon : '-',
                            value : Math.abs(limit - spent),
                            overrun : true
                        };
                }
            };

            $scope.balance = {
                icon : '+',
                value : 0,
                overrun : false
            };

            $scope.openSettings = function () {
                $mdDialog.show({
                    controller: MoneySettingsContr,
                    templateUrl : 'app/home/money/dialogs/settings.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose:true,
                    fullscreen: true,
                    locals : {
                        currentMode : db.budget.dengi.dayLimit.actual
                    }
                });

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

                }
            };
    }]);