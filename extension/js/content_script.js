$(function () {
    console.log('Hello World');
    $('#Service_calendar1_Calendar_bubble1_txtCheckCode')[0].value = document.cookie.split('=')[1];
    $('.bubble-table').find('tbody').append('<tr colspan=\'2\'><td><input style=\'width:100px;height:40px;\' type=\'button\' value=\'register\' id=\'mytest\'  /><td></tr>')
    $('#mytest').click(function () {
        var i = 0;
        while (i < 8) {
            $('#Service_calendar1_Calendar_bubble1_txtCheckCode')[0].value = document.cookie.split('=')[1];
            $("#Service_calendar1_Calendar_bubble1_btnReserve").trigger("click");
            ++i;
            console.log('Hello World' + i);
        }

    })
});
