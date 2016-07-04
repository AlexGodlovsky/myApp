app.factory('newDayWatcher', function(firebaseDatabase, firebaseAuth){

    var mainDb = false;

    firebaseAuth.waitForSignIn.then(function(){
        firebaseDatabase.main().$loaded(function(){})
    })

    $scope.$watchCollection(mainDb, function(){
        console.log('watch works')
    });

    return {

    }

});