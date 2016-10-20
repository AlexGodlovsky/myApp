app.factory('firebaseDatabase', function(firebaseAuth, $firebaseObject, $firebaseArray, findKit, $q){

    var db = firebase.database();

    var pokupkiActual = firebaseAuth.waitForSignIn
        .then(function(res){
            return $firebaseArray(db.ref('/kits/' +res.uid + '/day/list/pokupkilist/actual'))
                .$loaded(function(load){
                    pokupkiActual =  load
                })
        });

    var pokupkiCompleted = firebaseAuth.waitForSignIn
        .then(function(res){
            return $firebaseArray(db.ref('/kits/' +res.uid + '/day/list/pokupkilist/completed'))
                .$loaded(function(load){
                    pokupkiCompleted =  load
                })
        });

    var tasksActual = firebaseAuth.waitForSignIn
        .then(function(res){
            return $firebaseArray(db.ref('/kits/' +res.uid + '/day/list/delalist/actual'))
                .$loaded(function(load){
                    tasksActual =  load
                })
        });

    var tasksCompleted = firebaseAuth.waitForSignIn
        .then(function(res){
            return $firebaseArray(db.ref('/kits/' +res.uid + '/day/list/delalist/completed'))
                .$loaded(function(load){
                    tasksCompleted =  load
                })
        });

    var dohod = firebaseAuth.waitForSignIn
        .then(function(res){
            return $firebaseArray(db.ref('/kits/' +res.uid + '/day/list/budget/dohod'))
                .$loaded(function(load){
                    dohod =  load
                })
        });

    var rashod = firebaseAuth.waitForSignIn
        .then(function(res){
            return $firebaseArray(db.ref('/kits/' +res.uid + '/day/list/budget/rashod'))
                .$loaded(function(load){
                    rashod =  load
                })
        });

    var devDb = firebaseAuth.waitForSignIn.then(function(user){
        return findKit.kitsId().then(function(kitId){
            return $firebaseArray(db.ref('/kits/'+kitId+'/dev'))
        })
    });

    var mainDb = false;

    var pokupki = false;

    var tasks = false;

    return {

        dev : {
            first : function(){
                return firebaseAuth.waitForSignIn.then(function (){
                    return findKit.kitsId().then(function(kitId){
                        return $firebaseObject(db.ref('/kits/'+kitId+'/dev'))
                    })
                })
            },

            second : function () {
                var deferred = $q.defer();

                firebaseAuth.waitForSignIn.then(function () {
                    findKit.kitsId().then(function (kitId) {
                        var list = $firebaseObject(db.ref('/kits/' + kitId + '/day/list')).
                            $loaded(function(res){
                                deferred.resolve(res)
                            })
                            .catch(function(err){
                                console.log(err)
                            })
                    })
                });

                return deferred.promise
            },

            third : function (){
                var deferred = $q.defer();

                firebaseAuth.waitForSignIn.then(function () {
                    findKit.kitsId().then(function (kitId) {
                        var list = $firebaseObject(db.ref('/kits/' + kitId + '/dev')).
                            $loaded(function(res){
                                deferred.resolve(res)
                            })
                            .catch(function(err){
                                console.log(err)
                            })
                    })
                })

                return deferred.promise
            }
        },

        main : {

            initMainDb : function (){

                var deferred = $q.defer();

                if(mainDb){
                    deferred.resolve(mainDb);
                }
                else{

                    findKit.kitsId()
                        .then(function(kitId){
                            $firebaseObject(db.ref('/kits/' + kitId + '/day/list'))
                                .$loaded(function(obj){
                                    mainDb = obj;
                                    deferred.resolve(mainDb)
                                })
                                .catch(function(err){
                                    console.log(err);
                                    deferred.reject(err)
                                })
                        })
                        .catch(function(err){
                            console.log(err);
                            deferred.reject(err)
                        });
                }

                return deferred.promise

            },

            getList : function () {
                var deferred = $q.defer();

                firebaseAuth.waitForSignIn.then(function () {
                    findKit.kitsId().then(function (kitId) {
                        var list = $firebaseObject(db.ref('/kits/' + kitId + '/day/list')).
                            $loaded(function(res){
                                deferred.resolve(res)
                            })
                            .catch(function(err){
                                console.log(err)
                            })
                    })
                });

                return deferred.promise
            },

            saveList : function (obj){

                var def = $q.defer();

                obj.$save()
                    .then(function(res){
                        def.resolve(res)
                    })
                    .catch(function(error){
                        def.reject(error)
                    });

                return def.promise;
            }
        },

        buy : {
            actual : {

                getList : function (){
                    var uid = firebaseAuth.userUid();

                    var list = $firebaseArray(db.ref('/kits/' +uid + '/day/list/pokupkilist/actual'));

                    return list
                },

                addNew : function(newItem) {

                    return pokupkiActual.$add(newItem);
                },

                done : function(item) {

                    var it = pokupkiActual.$getRecord(item.$id);

                    return pokupkiCompleted.$add(item).then(function(){
                        return pokupkiActual.$remove(it).then(function(res){
                            return res
                        })
                    });
                },

                removeItem : function (item){

                    var it = pokupkiActual.$getRecord(item.$id);

                    return pokupkiActual.$remove(it)
                },

                editItem : function (item, editedItem) {

                    var it = pokupkiActual.$getRecord(item.$id);

                    var index = pokupkiActual.$indexFor(it.$id);

                    pokupkiActual[index].name = editedItem.name;

                    pokupkiActual[index].amount = editedItem.amount;

                    pokupkiActual[index].measure = editedItem.measure;

                    pokupkiActual[index].expiredate = editedItem.expiredate;

                    pokupkiActual[index].updatedate = new Date().toString();

                    return pokupkiActual.$save(index);
                }
            },

            completed : {

                getList : function (){
                    var uid = firebaseAuth.userUid();

                    var list = $firebaseArray(db.ref('/kits/' +uid + '/day/list/pokupkilist/completed'));

                    return list
                },

                addNew : function(newItem) {

                    return pokupkiCompleted.$add(newItem);
                },

                cancel : function (item){
                    var it = pokupkiCompleted.$getRecord(item.$id);

                    delete item.purchased;

                    item.updatedate = new Date().toString();

                    return pokupkiActual.$add(item).then(function(){
                        return pokupkiCompleted.$remove(it)
                    });
                },

                removeItem : function (item){

                    var it = pokupkiCompleted.$getRecord(item.$id);

                    return pokupkiCompleted.$remove(it)
                },

                editItem : function (item, editedItem) {

                    var it = pokupkiCompleted.$getRecord(item.$id);

                    var index = pokupkiCompleted.$indexFor(it.$id);

                    pokupkiCompleted[index].name = editedItem.name;

                    pokupkiCompleted[index].amount = editedItem.amount;

                    pokupkiCompleted[index].measure = editedItem.measure;

                    pokupkiCompleted[index].place = editedItem.place;

                    pokupkiCompleted[index].price = editedItem.price;

                    pokupkiCompleted[index].edited = new Date().toString();

                    return pokupkiCompleted.$save(index);
                }

            },

            addNew : function(newItem) {

                return pokupki.$add(newItem);
            },

            editItem : function (item, editedItem) {

                var it = pokupki.$getRecord(item.$id);

                var index = pokupki.$indexFor(it.$id);

                for(var field in editedItem){
                    pokupki[index][field] = editedItem[field];
                }

                return pokupki.$save(index);
            },

            editPurchasedItem : function (item, editedItem) {

                var it = pokupki.$getRecord(item.$id);

                var index = pokupki.$indexFor(it.$id);

                for(var field in editedItem){
                    pokupki[index][field] = editedItem[field];
                }

                return pokupki.$save(index);
            },

            purchasing : function(editedItem) {

                var it = pokupki.$getRecord(editedItem.$id);

                var index = pokupki.$indexFor(it.$id);

                for(var field in editedItem){
                    pokupki[index][field] = editedItem[field];
                }

                return pokupki.$save(index);
            },

            cancelPurchase : function (item) {

                var it = pokupki.$getRecord(item.$id);

                var index = pokupki.$indexFor(it.$id);

                pokupki[index].purchased = false;

                return pokupki.$save(index);
            },

            removeItem : function (item){

                var it = pokupki.$getRecord(item.$id);

                return pokupki.$remove(it)
            },

            getList : function(){
                return pokupki;
            },

            initBuyList : function () {

                var deferred = $q.defer();

                if(pokupki){
                    deferred.resolve(pokupki)
                }
                else{

                    findKit.kitsId()
                        .then(function(kitId){
                            $firebaseArray(db.ref('/kits/' + kitId + '/day/list/pokupkilist'))
                                .$loaded(function(arr){
                                    pokupki = arr;
                                    deferred.resolve(arr)
                                })
                                .catch(function(err){
                                    console.log(err);
                                    deferred.reject(err)
                                })
                        })
                        .catch(function(err){
                            console.log(err);
                            deferred.reject(err)
                        });

                }

                return deferred.promise
            }
        },

        task : {

            actual : {

                getList : function (){
                    var uid = firebaseAuth.userUid();

                    return $firebaseArray(db.ref('/kits/' +uid + '/day/list/delalist/actual'));
                },

                addNew : function(newItem) {

                    return tasksActual.$add(newItem);
                },

                done : function(item) {

                    var it = tasksActual.$getRecord(item.$id);

                    return tasksCompleted.$add(item).then(function(){
                        return tasksActual.$remove(it).then(function(res){
                            return res
                        })
                    });
                },

                removeItem : function (item){

                    var it = tasksActual.$getRecord(item.$id);

                    return tasksActual.$remove(it)
                },

                editItem : function (item, editedItem) {

                    var it = tasksActual.$getRecord(item.$id);

                    var index = tasksActual.$indexFor(it.$id);

                    tasksActual[index].description = editedItem.description;

                    tasksActual[index].daily = editedItem.daily;

                    tasksActual[index].expiredate = editedItem.expiredate;

                    tasksActual[index].updatedate = editedItem.updatedate;

                    return tasksActual.$save(index);
                }
            },

            completed : {

                getList : function (){
                    var uid = firebaseAuth.userUid();

                    return $firebaseArray(db.ref('/kits/' +uid + '/day/list/delalist/completed'));
                },

                addNew : function(newItem) {

                    return tasksCompleted.$add(newItem);
                },

                cancel : function (item){

                    var it = tasksCompleted.$getRecord(item.$id);

                    delete item.donedate;

                    item.updatedate = new Date().toString();

                    return tasksActual.$add(item).then(function(){
                        return tasksCompleted.$remove(it)
                    });
                },

                removeItem : function (item){

                    var it = tasksCompleted.$getRecord(item.$id);

                    return tasksCompleted.$remove(it)
                },

                editItem : function (item, editedItem) {

                    var it = tasksCompleted.$getRecord(item.$id);

                    var index = tasksCompleted.$indexFor(it.$id);

                    tasksCompleted[index].description = editedItem.description;

                    tasksCompleted[index].daily = editedItem.daily;

                    tasksCompleted[index].expiredate = editedItem.expiredate;

                    tasksCompleted[index].updatedate = editedItem.updatedate;

                    return tasksCompleted.$save(index);
                }

            },

            addNew : function(newItem) {

                return tasks.$add(newItem);
            },

            editItem : function (item, editedItem) {

                var it = tasks.$getRecord(item.$id);

                var index = tasks.$indexFor(it.$id);

                for(var field in editedItem){
                    tasks[index][field] = editedItem[field];
                }

                return tasks.$save(index);
            },

            completeTask : function(editedItem) {

                var it = tasks.$getRecord(editedItem.$id);

                var index = tasks.$indexFor(it.$id);

                for(var field in editedItem){
                    tasks[index][field] = editedItem[field];
                }

                return tasks.$save(index);
            },

            cancelComplete : function (item){

                var it = tasks.$getRecord(item.$id);

                var index = tasks.$indexFor(it.$id);

                tasks[index].completed = false;

                return tasks.$save(index);
            },

            removeItem : function (item){

                var it = tasks.$getRecord(item.$id);

                return tasks.$remove(it)
            },

            getList : function(){
                return tasks;
            },

            initTaskList : function () {

                var deferred = $q.defer();

                if(tasks){
                    deferred.resolve(tasks)
                }
                else{

                    findKit.kitsId()
                        .then(function(kitId){
                            $firebaseArray(db.ref('/kits/' + kitId + '/day/list/delalist'))
                                .$loaded(function(arr){
                                    tasks = arr;
                                    deferred.resolve(arr);
                                })
                                .catch(function(err){
                                    console.log(err);
                                    deferred.reject(err)
                                })
                        })
                        .catch(function(err){
                            console.log(err);
                            deferred.reject(err)
                        });

                }

                return deferred.promise
            }

        },

        money : {

            dengi2 : function () {

                var uid = firebaseAuth.userUid();

                return $firebaseObject(db.ref('/kits/' +uid + '/day/list/budget/dengi'))

            },

            dohod : {

                getList : function () {

                    var uid = firebaseAuth.userUid();

                    return $firebaseArray(db.ref('/kits/' +uid + '/day/list/budget/dohod'))

                },

                addNew : function (newItem){
                    return dohod.$add(newItem)
                },

                edit : function (editedItem){

                    var index = dohod.$indexFor(editedItem.$id);

                    dohod[index].name = editedItem.name;
                    dohod[index].value = editedItem.value;

                    return dohod.$save(index);
                },

                remove : function(item){
                    var record = dohod.$getRecord(item.$id);

                    return dohod.$remove(record)
                },

                getAllDohod : function(){

                    var result = 0;

                    for(var item in dohod){
                        result += dohod[item].value
                    }

                    return result;

                }

            },

            rashod : {

                getList : function(){

                    var uid = firebaseAuth.userUid();

                    return $firebaseArray(db.ref('/kits/' +uid + '/day/list/budget/rashod'))

                },

                addNew : function (newItem){
                    return rashod.$add(newItem)
                },

                edit : function (editedItem){

                    var index = rashod.$indexFor(editedItem.$id);

                    rashod[index].name = editedItem.name;
                    rashod[index].value = editedItem.value;

                    return rashod.$save(index);
                },

                remove : function(item){
                    var record = rashod.$getRecord(item.$id);

                    return rashod.$remove(record)
                },

                getAllRashod : function(){

                    var result = 0;

                    for(var item in rashod){
                        console.log(rashod[item]).value
                        result += rashod[item].value
                    }

                    return result;

                }

            }
        }
    }
});