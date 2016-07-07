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
                    testAuth :  ['$firebaseAuth', function($firebaseAuth){
                        return $firebaseAuth().$waitForSignIn();
                    }]
                }
            })
    })

    .controller('HomeCtrl',
        ['$scope', 'firebaseAuth', 'uiConfig', 'firebaseDatabase', 'languageConfig', 'newDayWatcher',
        function($scope, firebaseAuth, uiConfig, firebaseDatabase, languageConfig, newDayWatcher) {

            $scope.uiConfig = uiConfig.home;
            $scope.langConf = languageConfig.eng.home;

            var pokupkiList = firebaseDatabase.buy.completed.getList();

            pokupkiList.$loaded(function(res){

                balanceWatcher()

                pokupkiList.$watch(function (){
                    balanceWatcher()
                })
            });

            var dayLimit = firebaseDatabase.dayLimit();

            function balanceWatcher () {

                var spent = getSumm();

                var limit = dayLimit.$value;

                $scope.balance = {
                    icon : getSymbol(),
                    value : getValue(),
                    overrun : getOverrun()
                };

                function getSumm () {
                    var result = 0;

                    pokupkiList.forEach(function(item){
                        result += Number(item.price)
                    });

                    return result
                }

                function getValue () {
                    return Math.abs(limit - spent)
                }

                function getSymbol () {
                    return limit>spent ? '+' : '-'
                }

                function getOverrun () {
                    return limit>spent ? false : true
                }

            }

            $scope.balance = {
                icon : '+',
                value : 0,
                overrun : false
            }

    }]);