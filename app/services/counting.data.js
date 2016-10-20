app.factory('countingData', function(){

    return {

        pokupkiSum : function(db){
            var pokupkilist = db.pokupkilist;

            if(pokupkilist){
                var result = 0;
                for(var field in pokupkilist){
                    if(pokupkilist[field].purchased === true){
                        result += pokupkilist[field].price;
                    }
                }
                return result
            }
            else{
                return 0
            }
         },

        dohodSum : function(db){
            var dohod = db.budget.dohod;

            if(dohod){
                var result = 0;
                for(var field in dohod){
                    result += dohod[field].value;
                }
                return result
            }
            else{
                return 0
            }
        },

        rashodSum : function(db){
            var rashod = db.budget.rashod;

            if(rashod){
                var result = 0;
                for(var field in rashod){
                    result += rashod[field].value;
                }
                return result
            }
            else{
                return 0
            }
        },

        startMoney : function(db){

            var common = db.budget.dengi.startmoney.common;

            var nal = db.budget.dengi.startmoney.nal;

            var besnal = db.budget.dengi.startmoney.besnal;

            return common + nal + besnal
        },

        test: 'test'
    }

});