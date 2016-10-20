app.factory('newDayWatcher', function($firebaseObject, $firebaseArray, firebaseAuth, findKit, countingData){

    var db = firebase.database();

    var currentDay = false;


    firebaseAuth.waitForSignIn.then(function(){

        findKit.kitsId()
            .then(function(kitId){
                $firebaseObject(db.ref('/kits/'+kitId+'/day/list/'))
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
            })
            .catch(function(err){
                console.log(err)
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

            findKit.kitsId()
                .then(function(kitId){
                    $firebaseObject(db.ref('/kits/'+kitId+'/archive/'))
                        .$loaded(function (arch){
                            addNewArchiveItem(arch)
                        })
                        .catch(function(error){
                            console.log(error)
                        })
                })
                .catch(function(err){
                    console.log(err)
                });

            /*var uid = firebaseAuth.userUid();

            var archive = $firebaseObject(db.ref('/kits/'+uid+'/archive/'));

            archive.$loaded(function (res2){
                addNewArchiveItem(res2)
            });*/

            function addNewArchiveItem (archive){

                var id = new Date().toDateString();

                archive[id] = getNewArchiveItem();

                archive.$save()
                    .then(function(){

                        currentDay.lastDay = new Date().toDateString();

                        currentDay.$save()
                            .then(function (){
                                clearCurrentDay();
                            })
                            .catch(function(error){
                                console.log(error)
                            });

                    })
                    .catch(function(err){
                        console.log(err)
                    });

                function getNewArchiveItem () {

                    function getCompletedTask (list){

                        var newList = {};

                        for(var item in list){
                            if(list[item].completed === true){
                                newList[item] =  list[item]
                            }
                        }

                        return newList;
                    }

                    function getCompletedBuy (list){

                        var newList = {};

                        for(var item in list){
                            if(list[item].purchased === true){
                                newList[item] =  list[item]
                            }
                        }

                        return newList;
                    }

                    var result = {

                        delalist : getCompletedTask(currentDay.delalist),

                        pokupkilist : getCompletedBuy(currentDay.pokupkilist),

                        budget : {
                            dohod : currentDay.budget.dohod,

                            rashod : currentDay.budget.rashod,

                            dengi : {

                                startmoney : currentDay.budget.dengi.startmoney

                            }
                        }

                    };

                    if(!currentDay.delalist){
                        delete result.delalist
                    }

                    if(!currentDay.pokupkilist){
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

                    currentDay.budget.dengi.dayLimit = setDayLimitMode(currentDay.budget.dengi.dayLimit);

                    clearDelalist(currentDay.delalist);

                    clearPokupkilist(currentDay.pokupkilist);

                    currentDay.budget.dohod = {};

                    currentDay.budget.rashod = {};

                    currentDay.$save().then(function(){
                        console.log('Day cleared.')
                     });

                    function clearDelalist (list) {
                        for(var item in list){
                            if(list[item].completed === true){
                                delete list[item]
                            }
                        }

                        return list
                    };

                    function clearPokupkilist (list) {

                        for(var item in list){
                            if(list[item].purchased === true){
                                delete list[item]
                            }
                        }
                    };

                    function setDayLimitMode (dayLimit) {

                        var mode = dayLimit.actual;

                        var result = false;

                        mode == 'float' ? result = setFloat(dayLimit) : result = dayLimit;

                        return result;

                        function setFloat (floatLimit) {

                            floatLimit.float.daysLeft = setDaysLeft(floatLimit);

                            return floatLimit;

                            function setDaysLeft (){

                                var lastUpdated = new Date(currentDay.lastDay);

                                var today = new Date();

                                today.setHours(0, 0, 0, 0);

                                var dayPassed =  (Date.parse(today) - Date.parse(lastUpdated)) / 86400000;

                                var currentLeft = floatLimit.float.daysLeft;

                                return currentLeft - dayPassed
                            }

                        }
                    }

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

                            var allRashod = countingData.rashodSum(currentDay);

                            var allPokupki = countingData.pokupkiSum(currentDay);

                            /*var list = currentDay.budget.rashod;

                            for(var prop in list){
                                allRashod += Number(list[prop].value)
                            }*/

                            return allRashod + allPokupki
                        }


                        var currentStartMoney = countingData.startMoney(currentDay);

                        var currentAllDohod = countingData.dohodSum(currentDay);

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