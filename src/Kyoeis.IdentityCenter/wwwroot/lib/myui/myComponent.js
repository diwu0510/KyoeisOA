var basePath = '/Manage/Component/Load/';
var regx = /^<!--Component(\d)-->$/;

$(function() {
    var components = $('myComponent');
    if (components.length === 0) return;

    $.each(components, function (idx, item) {
        var id = Number($(item).html());
        if (id) {
            $.get(basePath + id, {}, function(response) {
                $(item).replaceWith(response);
            });
        }
    });
});