$(document).ready(function () {
    var responseObj = [];
    var Qhistory = [];
    var historyCounter = 0;
    var startIndex = 0;
    var googleUrl = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyB20e2VDjrUebicIJkA4MFH4WO4b8cEzQY&cx=013676722247143124300:dazj-lelyfy&num=3';
    var wramalphaUrl = 'https://2ylflv45i7.execute-api.us-west-2.amazonaws.com/prod/WolframalphaQuery?input=';
    var prevQuery = '';
    var theme = 'w';
    if (localStorage.getItem("theme")) {
        theme = localStorage.getItem("theme");
        changeTheme(theme);
    }

    $('html').click(function () {
        $('#queryInputTb').focus()
    });

    $('body').on("keydown", '#queryInputTb', function (e) {
        if (e.which == 13 && $(this).val() !== "") {
            Qhistory.push($(this).val());

            historyCounter = 0;
            var Qvalue = $(this).val();
            if (parseInt(Qvalue) && responseObj[Qvalue-1]) {
                var win = window.open(responseObj[Qvalue - 1], '_blank', "");
                win.focus();

                addResult('open ' + responseObj[Qvalue - 1]);
                clearField($(this));
            } else if (Qvalue.indexOf('w ') === 0) {
                callWRamAlpha($(this));
            } else if (Qvalue.indexOf('theme ') === 0) {
                theme = Qvalue.split(" ")[1];
                changeTheme(theme);
                localStorage.setItem('theme',theme);
                addResult('Changed theme to' + theme);
                clearField($(this));
            }else {
                switch (Qvalue) {
                    case 'c':
                    case 'clear':
                        var me = $(this).parent().parent();
                        $('.gsh').html(me);
                        $(this).val('');
                        $(this).focus();
                        break;
                    case 'ls':
                        addResult('var <br>   dev  <br> 🍕 <br> lib  <br>  boot <br> run <br> sbin <br> etc <br> sys <br> root <br> mnt <br> lol <br> usr <br> opt');
                        clearField($(this));
                        break;
                    case 'h':
                    case 'help':
                        addResult($('.helpMenu').html());
                        clearField($(this));
                        break;
                    case 'rm -rf /':
                        addResult('no.');
                        clearField($(this));
                        break;
                    default:
                        callGoogle($(this));
                        break;
                }
            }
        }
        if (e.which == 38) {
            if (Qhistory[historyCounter]) {
                $(this).val(Qhistory[Qhistory.length - historyCounter - 1]);
                historyCounter++;
            } else {
                $(this).val(Qhistory[Qhistory.length - historyCounter]);
            }
        }
        if (e.which == 40) {
            if (Qhistory[historyCounter - 1]) {
                historyCounter--;
                $(this).val(Qhistory[Qhistory.length - historyCounter - 1]);
            } else {
                $(this).val('');
            }
        }
    });

    function callGoogle(q) {
        var loader = new Loader();
        if ((q.val() == 'more' || q.val() == 'm') && prevQuery.length !== 0) {
            startIndex += 3;
            googleQUrl = googleUrl + '&start=' + startIndex + 1;
            q.val(prevQuery);
        } else {
            startIndex = 0;
            googleQUrl = googleUrl;
            responseObj = [];
            prevQuery = q.val();
        }
        $.get(googleQUrl + '&q='+q.val(), function () {

            })
            .done(function (data) {
                if (typeof data['items'] !== 'undefined') {
                    data['items'].forEach(function (item, index) {
                        index = startIndex + index + 1;
                        responseObj.push(item.link);

                        $('.gsh').append('' +
                            '<div class="result"><div class="index">' + index + '</div><div class="main"><div class="title"><a href="' + item.link + '">' + item.title + '</a></div><div class="snippet">' + item.snippet + '</div><div class="link">' + item.link + '</div></div></div><hr>');
                    });
                } else {
                    addResult('No results');
                }

                clearField(q);
                $('.gsh').children().remove('.loader');
                changeTheme(theme);
            })
            .fail(function () {
                addResult('Error - Perhaps too many searches? (max 100/person/day)');
                clearField(q);
                $('.gsh').children().remove('.loader');
            });
    }

    function addResult(r) {
        return $('.gsh').append('<div class="result">' + r + '</div>');
    }

    function callWRamAlpha(q) {
        var loader = new Loader();
        query = q.val().replace("w ", "");
        $.get(wramalphaUrl + query, function () {

            })
            .done(function (data) {

                if (typeof data !== 'undefined' && data !== "error") {
                    data.forEach(function (item) {
                        $('.gsh').append('<img src="' + item + '"><br>');
                    });
                } else {
                    addResult('No results');
                }

                clearField(q);
                $('.gsh').children().remove('.loader');
            })
            .fail(function () {
                addResult('Error - Perhaps too many searches? (max 100/person/day)');
                clearField(q);
                $('.gsh').children().remove('.loader');
            });
    }

    function clearField(input) {
        var needRetaining = input.val();
        $('.gsh').append(input.val('').parent().parent().clone());
        input.parent().html(needRetaining);
        $('input').focus();
    }


    // Thanks to this dude on stack overflow: http://stackoverflow.com/a/3219113 !!
    function Loader() {
        $('.gsh').append('<div class="result loader"></div>');
        var chars = "|/-\\".split("");
        var i = 0;
        var timer = setInterval(function(){
            $('.loader').html(chars[ i++ % chars.length ]);
        }, 100);
        // public method to stop the animation
        this.stop = function() {
            clearInterval(timer);
        }
    }
    function changeTheme(theme) {
        switch (theme) {
            case 'l':
                $('html').css({"background-color": "#FCF6E2"});
                $('a').css({"color":"#3988D5"});
                $('.result .link').css({"color":"#C75004"});
                $('body').css({"color":"#667B84"});
                $('input').css({"background-color":"#FCF6E2"});
                //addResult('color scheme changed: light');
                break;
            case 'w':
                $('html').css({"background-color": ""});
                $('a').css({"color":""});
                $('.result .link').css({"color":""});
                $('body').css({"color":""});
                $('.label').css({"color":""});
                $('input').css({"background-color":"", "color":""});
                //addResult('color scheme changed: white');
                break;
            case 'd':
                $('html').css({"background-color": "#043643"});
                $('a').css({"color":"#1C8AD5"});
                $('.result .link').css({"color":"#B68A00"});
                $('body').css({"color":"#93A1A1"});
                $('.label').css({"color":"#93A1A1"});
                $('input').css({"background-color":"#043643", "color":"#93A1A1"});
                //addResult('color scheme changed: dark');
                break;
        }
    }

});
