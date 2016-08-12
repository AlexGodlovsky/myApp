app.factory('findKit', function(firebaseAuth, $firebaseObject, $q){

    var db = firebase.database();

    return {
        /*kitsId : function(){
            return firebaseAuth.waitForSignIn.then(function (user){
                return $firebaseObject(db.ref('/users/'+user.uid)).$loaded(function(currentUser){
                    return currentUser.userInfo.kits.first
                })
            });
        }*/

        kitsId : function(){

            var deferred = $q.defer();

            $firebaseObject(db.ref('/users/'+firebaseAuth.userUid()))
                .$loaded(function(currentUser){

                    deferred.resolve(currentUser.userInfo.kits.first);
                })
                .catch(function(err){
                    deferred.reject(err);
                    console.log(err);
                });

            return deferred.promise;
        }
    }
});