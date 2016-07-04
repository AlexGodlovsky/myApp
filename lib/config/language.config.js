app.factory('languageConfig', function(){

    return {
        eng: {
            home:{
                menu:{
                    day: 'Day',
                    week: 'Week',
                    month: 'Month'
                },
                balance: {
                    balance : 'Balance'
                },
                tabs:{
                    buy: 'Buy',
                    tasks: 'Tasks',
                    money: 'Money'
                }
            }
        },
        rus: {
            home:{
                day: 'День',
                week: 'Неделя',
                month: 'Месяц'
            }
        }
    }
});