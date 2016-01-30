$(document).ready(function () {

    var googleUrl = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyB20e2VDjrUebicIJkA4MFH4WO4b8cEzQY&cx=013676722247143124300:dazj-lelyfy&num=3&q=';

    $('html').click(function () {
        $('#queryInputTb').focus()
    });

    $('body').on("keydown", '#queryInputTb', function (e) {
        if (e.which == 13 && $(this).val() !== "") {
            switch ($(this).val()) {
                case 'c':
                case 'clear':
                    var me = $(this).parent().parent();
                    $('body').html(me);
                    break;
                default:
                    callGoogle($(this));
                    break;
            }
        }
    });


    function callGoogle(q) {
        $.get(googleUrl + q.val(), function () {

            })
            .done(function (data) {
                if (typeof data['items'] !== 'undefined') {
                    data['items'].forEach(function (item) {
                        $('body').append('' +
                            '<div class="result"><div class="title"><a href="'+ item.link +'">' + item.title + '</a></div><div class="snippet">' + item.snippet + '</div><div class="link">' + item.link + '</div></div><hr>');
                    });
                } else {
                    addResult('No results');
                }

                var needRetaining = q.val();
                $('body').append(q.val('').parent().parent().clone());
                q.parent().html(needRetaining);
                $('input').focus();
            })
            .fail(function () {
                alert("error");
            })
    }

    function addResult(r) {
        return $('body').append('<div class="result">' + r + '</div>');
    }
});
