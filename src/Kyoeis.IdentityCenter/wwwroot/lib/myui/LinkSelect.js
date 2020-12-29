; (function($, w) {
    function LinkSelect(config) {
        var opt = {
            doms: config.doms || [],
            url: config.url || '',
            type: config.type || 'get',
            data: config.data || []
        };

        if (opt.doms.length < 2) {
            return console.log('必须两个或两个以上下拉框');
        }

        function initial() {
            for (var i = 0; i < opt.doms.length; i++) {
                (function(idx) {
                    opt.doms[idx].on('change',
                        function () {
                            var val = $(this).val();
                            var temp = getDataByValue(idx);
                            var nextDom = opt.doms[idx + 1];
                            if (nextDom && nextDom.length > 0) {
                                setDomData(nextDom, temp);
                            }
                        });
                })(i);
            }


            if (opt.data && opt.data.length > 0) {
                initialUi();
            } else {
                if (!opt.url || opt.url === '') {
                    return console.log('配置无效，必须指定url或data');
                } else {
                    $.ajax({
                        url: opt.url,
                        type: opt.type,
                        success: function(response) {
                            opt.data = response;
                            initialUi();
                        }
                    });
                }
            }
        }

        function initialUi() {
            var dom = opt.doms[0];
            setDomData(dom, opt.data);
        }

        function getDataByValue(idx) {
            var source = opt.data;
            for (var i = 0; i <= idx; i++) {
                (function(idx) {
                    var temp = source.find(function(item) {
                        return item.value.toString() === opt.doms[idx].val();
                    });
                    if (temp && temp.children) {
                        source = temp.children;
                    } else {
                        source = [];
                    }
                })(i);
            }
            return source;
        }

        function getDomDefaultSets(dom) {
            var defaultText = "请选择";
            var defaultValue = "";
            if (dom.data('default-text')) {
                defaultText = dom.data('default-text');
            }
            if (dom.data('default-value')) {
                defaultValue = dom.data('default-value');
            }
            return [defaultText, defaultValue];
        }

        function resetDom(dom) {
            var sets = getDomDefaultSets(dom);
            dom.html('<option value="' + sets[1] + '">' + sets[0] + '</option>');
        }

        function setDomData(dom, data) {
            if (!data || data.length === 0) {
                resetDom(dom);
            } else {
                var sets = getDomDefaultSets(dom);
                var html = '<option value="' + sets[1] + '">' + sets[0] + '</option>';
                $.each(data,
                    function(idx, item) {
                        html += '<option value="' + item.value + '">' + item.text + '</option>';
                    });
                dom.html(html);
            }
            dom.trigger('change');
        }

        initial();
    };
    w.LinkSelect = LinkSelect;
})(jQuery, window);