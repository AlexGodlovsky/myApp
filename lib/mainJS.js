$(document).ready(function(){
    $(window).resize(function(){
        responsive.buy();
    })
});

$('#buy').ready(function(){
    responsive.buy()
});

var responsive = {

    buy : function () {
        var header = $('#headerToolbar').height(),
            balance = $('#headerBalance').height(),
            buttons = $('#homeButtons').height(),
            buy = $('#buy').height(),
            buyIndicator = $('#buyIndicator').height();
            screen = $(window).height();
    },
    mainCont : function () {

        var screen = $(window).height();

    }

};