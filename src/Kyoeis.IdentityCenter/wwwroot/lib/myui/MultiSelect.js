function MultiSelect(domIds, apiUrl, values) {
    var source = [];

    var doms;
    if (!domIds) {
        doms = [];
    } else if ($.isArray(domIds)) {
        doms = $.map(domIds, function() {
                return $('#' + domIds);
            });
    } else {
        doms = [$('#' + domIds)];
    }

    var domCount = doms.length;
    var api = apiUrl || null;
    var vals = values || [];

    function init() {
        if (api) {
            $.get(api, function(data) {
                source = data;
            });
        }

        doms.each(function (idx, dom) {
            dom.on('change', function() {
                (function (i) {
                    if (i < domCount - 1) {
                        reset(i, doms[i + 1], dom.val());
                        doms[i + 1].triggler('click');
                    }
                })(idx);
            });
        });
    }

    function reset(i, dom, parent) {
        var data = $.filter(function() {
            return this['parent'] === parent;
        });

        var defaultValue = dom.data('default-value');
        var optionValue = '';
        if (defaultValue !== undefined) {
            optionValue = defaultValue;
        }

        var defaultText = dom.data('data-text');
        var optionText = '请选择';
        if (defaultText != undefined) {
            optionText = defaultText;
        }

        var val = vals[i];

        var options = $.map(data, function (item) {
            if (val !== undefined && val === item.value) {
                return '<option value="' + item.value + '" selected="selected">' + item.text + '</option>';
            } else {
                return '<option value="' + item.value + '">' + item.text + '</option>';
            }
        });
        var html = '<option value="' + optionValue + '">' + optionText + '</option>';
        html += options.join('');
        dom.html(html);
    }

    this.setData = function (data) {
        source = data;
        init();
    }
}