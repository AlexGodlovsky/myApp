app.factory('firebaseDatabase', function(firebaseAuth, $firebaseObject, $firebaseArray){

    var db = firebase.database();

    var pokupkiActual = firebaseAuth.waitForSignIn
        .then(function(res){
            return $firebaseArray(db.ref('/kits/' +res.uid + '/currentDay/pokupkilist/actual'))
                .$loaded(function(load){
                    pokupkiActual =  load
                })
        });

    var pokupkiCompleted = firebaseAuth.waitForSignIn
        .then(function(res){
            return $firebaseArray(db.ref('/kits/' +res.uid + '/currentDay/pokupkilist/completed'))
                .$loaded(function(load){
                    pokupkiCompleted =  load
                })
        });

    var tasksActual = firebaseAuth.waitForSignIn
        .then(function(res){
            return $firebaseArray(db.ref('/kits/' +res.uid + '/currentDay/delalist/actual'))
                .$loaded(function(load){
                    tasksActual =  load
                })
        });

    var tasksCompleted = firebaseAuth.waitForSignIn
        .then(function(res){
            return $firebaseArray(db.ref('/kits/' +res.uid + '/currentDay/delalist/completed'))
                .$loaded(function(load){
                    tasksCompleted =  load
                })
        });


    return {

        buy : {
            actual : {

                getList : function (){
                    var uid = firebaseAuth.userUid();

                    return $firebaseArray(db.ref('/kits/' +uid + '/currentDay/pokupkilist/actual'));
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

                    return $firebaseArray(db.ref('/kits/' +uid + '/currentDay/pokupkilist/completed'));
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

            }
        },
        tasks : {

            actual : {

                getList : function (){
                    var uid = firebaseAuth.userUid();

                    return $firebaseArray(db.ref('/kits/' +uid + '/currentDay/delalist/actual'));
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

                    return $firebaseArray(db.ref('/kits/' +uid + '/currentDay/delalist/completed'));
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

            }

        },

        test : 'test'
    }
});