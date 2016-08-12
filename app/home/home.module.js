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
                    /*initList : ['firebaseDatabase', function(firebaseDatabase){
                        return firebaseDatabase.buy.initList()
                            .then(function(res){
                                return res
                            })
                    }]*/
                }
            })
    })

    .controller('HomeCtrl',
        ['$scope', 'firebaseAuth', 'uiConfig', 'firebaseDatabase', 'languageConfig', 'newDayWatcher',
            'countingData',
        function($scope, firebaseAuth, uiConfig, firebaseDatabase, languageConfig, newDayWatcher, countingData) {

            $scope.uiConfig = uiConfig.home;
            $scope.langConf = languageConfig.eng.home;

            firebaseDatabase.main.getList().then(function(res){

                console.log('lo')
                db = res;

                db.$watch(function(){
                    updateDayLimit();
                    console.log('n')
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

                    setBalance(limit)

                    function getAvalaibleMoney (){

                        var startMoney = getStartmoney();

                        var rashod = getAllRashod();

                        var dohod = getAllDohod();

                        return startMoney + dohod - rashod;

                        console.log(startMoney + dohod - rashod);

                        function getStartmoney () {

                            var common = db.budget.dengi.startmoney.common;

                            var nal = db.budget.dengi.startmoney.nal;

                            var besnal = db.budget.dengi.startmoney.besnal;

                            return common + nal + besnal
                        }

                        function getAllRashod () {

                            var result = 0;

                            for(var item in db.budget.rashod){

                                result += db.budget.rashod[item].value

                            }

                            return result;
                        }

                        function getAllDohod () {

                            var result = 0;

                            for(var item in db.budget.dohod){

                                result += db.budget.dohod[item].value

                            }

                            return result
                        }
                    }
                }

                function pokupkiCost () {
                    var pokupkiList = db.pokupkilist.completed ?
                        result = summCost(db.pokupkilist.completed)
                        : result =  0;

                    var result;

                    function summCost (list) {
                        var summ = 0;

                        for(var item in list){
                            summ += Number(list[item].price)
                        }

                        return summ
                    }

                    return result
                }

                function setBalance (limit){

                    var spent = pokupkiCost()

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

            $scope.test = function (){
                firebaseAuth.logout();
            };
    }]);