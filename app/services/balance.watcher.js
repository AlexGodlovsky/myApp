app.factory('balanceWatcher', [function(firebaseDatabase){

    var pokupList = firebaseDatabase.buy.completed.getList();

    return {
        balance : function (){

            var result = 0;

            return result;
        }
    }

}]);