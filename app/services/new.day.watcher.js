app.factory('newDayWatcher', function($firebaseObject, $firebaseArray, firebaseAuth, $timeout){

    var db = firebase.database();

    var currentDay = firebaseAuth.waitForSignIn.then(function(){
        var uid = firebaseAuth.userUid();

        $firebaseObject(db.ref('/kits/'+uid+'/day/list/'))
            .$loaded(function(list){

                currentDay = list;

                setInterval(function(){
                    checkNewDay()
                },60000);

                checkNewDay();

                currentDay.$watch(function(){
                    checkNewDay()
                })
            })
            .catch(function(error){
                console.log(error)
            })

    });

    function checkNewDay () {

        var now = new Date();

        var old = new Date(currentDay.lastDay);

        if(old.getFullYear() < now.getFullYear()){
            initNewDay()
        }
        else{
            if(old.getMonth() < now.getMonth()){
                initNewDay()
            }
            else{
                if(old.getDate() < now.getDate()){
                    initNewDay()
                }
            }
        }


        function initNewDay () {

            var uid = firebaseAuth.userUid();

            var archive = $firebaseObject(db.ref('/kits/'+uid+'/archive/'));

            archive.$loaded(function (res2){
                addNewArchiveItem(res2)
            });

            function addNewArchiveItem (archive){

                var id = new Date().toDateString();

                archive[id] = getNewArchiveItem();

                archive.$save()
                    .then(function(){

                        currentDay.lastDay = new Date().toDateString();

                        currentDay.$save().then(function (){
                            clearCurrentDay();
                        });

                    })
                    .catch(function(err){
                        console.log(err)
                    });

                function getNewArchiveItem () {

                    var result = {

                        delalist : {
                            completed : currentDay.delalist.completed
                        },

                        pokupkilist : {
                            completed : currentDay.pokupkilist.completed
                        },

                        daylimit : currentDay.daylimit,

                        budget : {
                            dohod : currentDay.budget.dohod,

                            rashod : currentDay.budget.rashod,

                            dengi : {

                                startmoney : currentDay.budget.dengi.startmoney

                            }
                        }

                    };

                    if(!currentDay.delalist.completed){
                        delete result.delalist
                    }

                    if(!currentDay.pokupkilist.completed){
                        delete result.pokupkilist
                    }

                    if(!currentDay.budget.dohod){
                        delete result.budget.dohod
                    }

                    if(!currentDay.budget.rashod){
                        delete result.budget.rashod
                    }

                    return result;

                }

                function clearCurrentDay () {

                    currentDay.budget.dengi.startmoney.common = setNewStartMoney();

                    currentDay.delalist.completed = {};

                    currentDay.pokupkilist.completed = {};

                    currentDay.budget.dohod = {};

                    currentDay.budget.rashod = {};

                    currentDay.$save().then(function(){
                     });

                    function setNewStartMoney () {

                        function getOldStartMoney () {

                            var start = currentDay.budget.dengi.startmoney;

                            return start.common + start.nal + start.besnal;

                        }

                        function getOldAllDohod () {

                           var list = currentDay.budget.dohod;

                            var res = 0;

                            for(var prop in list){
                                res += Number(list[prop].value)
                            }

                            return res
                        }

                        function getOldAllRashod () {

                            function getOldAllPokupki (){
                                var list = currentDay.pokupkilist.completed;
                                var res = 0;

                                for(var prop in list){
                                    res += Number(list[prop].price);
                                }

                                return res;
                            }

                            var list = currentDay.budget.rashod;

                            var allRashod = 0;

                            var allPokupki = getOldAllPokupki();

                            for(var prop in list){
                                allRashod += Number(list[prop].value)
                            }

                            return allRashod + allPokupki
                        }


                        var currentStartMoney = getOldStartMoney();

                        var currentAllDohod = getOldAllDohod();

                        var currentAllRashod = getOldAllRashod();

                        return currentStartMoney + currentAllDohod - currentAllRashod
                    }
                }
            }

        }
    }

    return {

    }

});