// 通用ajax操作，返回和初始化提交表单
; (function ($, w, layer) {
  w.myUI = {
    ajaxFailHandler: function (response) {
      switch (response.code) {
        case 401:
          // 未登录
          layer.confirm('您尚未登录或登录信息已过期，请重新登录', {
            btn: ['重新登录', '忽略']
          }, function () {
            top.location.href = '~/login';
          });
          break;
        case 403:
          // 无权限
          layer.confirm('您已登录，但无权访问此接口，请使用其他账号登录或联系管理员', {
            btn: ['重新登录', '忽略']
          }, function () {
            top.location.href = '~/login';
          });
          break;
        case 400:
          // 提交的数据验证失败
          layer.alert('操作失败<br>' + response.message, {
            icon: 2
          });
          break;
        default:
          // 其他错误
          layer.alert('未知异常<br>' + response.message, {
            icon: 2
          });
          break;
      }
    },
    ajaxErrorHandler: function () {
      layer.alert('网络异常，请稍候再试！若此问题出现多次，请联系管理员', {
        icon: 2
      });
    },
    initEditForm: function (opts) {
      var set = {
        formDom: $('form').first(), // 要提交的表单
        submitButton: $('input[type="submit"]'), // 提交按钮
        closeSelfButton: $('#btn-closeSelf'), // 关闭弹窗按钮
        pageType: 'pop', // 默认
        beforeSubmit: null,
        beforeSendFn: null,
        successFn: null,
        errorFn: null
      };

      $.extend(set, opts);

      set.submitButton.on('click', function (e) {
        // 阻止form的submit动作
        e.preventDefault();
        // 执行前置函数
        if (set.beforeSubmit && $.isFunction(set.beforeSubmit)) {
          set.beforeSubmit();
        }
        // 验证form
        if (!set.formDom.validate()) {
          return $(this).removeAttr('disabled');
        }
        if (set.msg) {
          if (!confirm(set.msg)) {
            return false;
          }
        }
        // 设置按钮为disabled
        $(this).attr('disabled', 'disabled');
        // 执行ajax请求
        var url = set.formDom.attr('action');
        var self = $(this);
        $.ajax({
          url: url,
          data: set.formDom.serialize(),
          type: 'post',
          beforeSend: function () {
            if (set.beforeSendFn && $.isFunction(set.beforeSendFn)) {
              set.beforeSendFn();
            }
          },
          success: function (response) {
            if (response.code === 200) {
              // 操作成功
              if (set.successFn && $.isFunction(set.successFn)) {
                var val = set.successFn(response);
                if (!val) {
                  return;
                }
              } else if (set.pageType === 'pop') {
                parent.layer.closeAll();
                parent.grid.reload();
              } else if (set.pageType === 'blank') {
                window.opener.grid.reload();
                window.close();
              } else if (set.pageType === 'tab') {
                if (window._winCaller && window._winCaller.grid) {
                  window._winCaller.grid.reload();
                }
                top.tabs.close(Number(window.name.substring(6)));
              } else {
                layer.alert('操作成功');
              }
            } else {
              myUI.ajaxFailHandler(response);
              if (set.errorFn && $.isFunction(set.errorFn)) {
                set.errorFn();
              }
            }
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            myUI.ajaxErrorHandler(XMLHttpRequest, textStatus, errorThrown);
          },
          complete: function () {
            self.removeAttr('disabled');
          }
        });
      });

      set.closeSelfButton.on('click', function () {
        if (set.pageType == 'pop') {
          parent.layer.closeAll();
        } else if (set.pageType == 'tab') {
          top.tabs.close(Number(window.name.substring(6)));
        }
      });
    },
    closeSelf: function (type) {
      if (type === 'tab') {
        top.tabs.close(Number(window.name.substring(6)));
      } else if (type === 'blank') {
        window.close();
      } else {
        window.parent.layer.closeAll();
      }
    },
    popDiv: function (title, domId, width, height) {
      var w = width || 720;
      var h = height || 400;
      var t = title || '';

      layer.open({
        type: 1,
        title: t,
        area: [w + 'px', h + 'px'],
        content: $('#' + domId)
      });
    },
    popIframe: function (url, title, width, height, needValue) {
      var w = width || 720;
      var h = height || 400;
      var t = title;

      if (needValue) {
        var id = $('#grid').getSelectedValue();
        if (!id) {
          return layer.msg('请选择要处理的数据');
        } else {
          url += '/' + id;
        }
      }

      layer.open({
        type: 2,
        title: t,
        area: [w + 'px', h + 'px'],
        content: url
      });
    }
  };
})(jQuery, window, layer);

// 配置客户按钮的动作
; (function ($, w, layer) {

  $.fn.customButton = function () {
    var _this = this;

    var opts = _this.data('options') || {};
    var action = opts.action || _this.data('action') || null;

    if (!action) {
      return console.log('必须为按钮指定action属性');
    }

    var type = opts.type || _this.data('type') || 'pop';
    var grid = opts.grid || _this.data('grid') || null;
    var title = opts.title;
    var msg = opts.msg;
    var multi = opts.multi || false;
    var before = opts.before || null;
    var ajaxType = opts.ajaxType || 'post';
    var width = opts.width || 720;
    var height = opts.height || 420;
    var callback = opts.callback || null;
    var data = null;

    // 接口|页面地址url
    function getUrl() {
      var url = '';
      if (!grid) {
        url = action;
      } else {
        var val = w[grid].getSelectedValue();
        if (!val) {
          layer.msg('请选择要处理的数据');
          return false;
        } else {
          url = action + '/' + val;
        }
      }
      var newurl = doBefore(url);
      return newurl;
    }

    // 执行默认动作之前执行指定的方法
    function doBefore(url) {
      if (before && w[before]) {
        return w[before](url);
      }
      return url;
    }

    // 弹窗
    function pop() {
      var url = getUrl();
      if (!url) return false;

      layer.open({
        type: 2,
        content: url,
        title: title,
        area: [width + 'px', height + 'px']
      });
    }

    // 跳转
    function jump() {
      var url = getUrl();
      if (!url) return false;

      w.location.href = url;
    }

    // ajax
    function doAjax() {
      var url = getUrl();
      if (!url) return false;
      console.log(w.rvtToken)
      $.ajax({
        url: url,
        type: ajaxType,
        data: { __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val() },
        success: function (response) {
          if (response.code == 200) {
            layer.msg('操作成功');
            if (grid) {
              w[grid].reload();
            }
          } else {
            w.myUI.ajaxFailHandler(response);
          }
        },
        error: function () {
          w.myUI.ajaxErrorHandler();
        }
      });
    }

    // 弹窗确认并执行ajax
    function confirmAndDoAjax() {
      var url = getUrl();
      if (!url) return false;

      layer.confirm(msg, {
        button: ['确认', '取消']
      }, function () {
        $.ajax({
          url: url,
          type: ajaxType,
          data: w.rvtToken,
          success: function (response) {
            if (response.code == 200) {
              layer.msg('操作成功');
              if (grid) {
                w[grid].reload();
              }
            } else {
              w.myUI.ajaxFailHandler(response);
            }
          },
          error: function () {
            w.myUI.ajaxErrorHandler();
          }
        });
      });
    }

    // 弹窗
    function openWindow() {
      var url = getUrl();
      if (!url) return false;

      //var a = $("<a href='" + url + "' target='_blank'>").get(0);
      //var ev = document.createEvent("MouseEvents");
      //ev.initEvent("click", true, true);
      //a.dispatchEvent(ev);
      var left = (window.screen.availWidth - 1020) / 2;
      var top = (window.screen.availHeight - 620) / 2;
      window.open(url, '', 'toolbar=yes,scrollbars=yes,location=yes,width=1020,height=600,left=' + left + ',top=' + top);
    }

    // 弹层
    function openDom() {
      layer.open({
        type: 1,
        title: title,
        area: [width + 'px', height + 'px'],
        content: $('#' + url)
      });
    }

    // 打开新标签
    function openTab() {
      var url = getUrl();
      if (!url) return false;
      top.tabs.open(title, url, w);
    }

    _this.on('click', function (e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      } else {
        window.event.returnValue = false;
        return false;
      }

      switch (type) {
        case 'pop':
          pop();
          break;
        case 'jump':
          jump();
          break;
        case 'blank':
          openWindow();
          break;
        case 'ajax':
          if (msg) {
            confirmAndDoAjax();
          } else {
            doAjax();
          }
          break;
        case 'dom':
          openDom();
          break;
        case 'tab':
          openTab();
          break;
        default:
          break;
      }
    });

    return _this;
  }

})(jQuery, window, layer);

// 有固定列数据表格
; (function ($, w, layer) {
  $.fn.MyGrid = function (opts) {
    var _this = this;

    // 要现实的列配置
    var cols = opts.columns;
    // 是否分页
    var isPager = opts.pager == undefined ? false : opts.pager;
    // 是否多选
    var isMulti = opts.multi == undefined ? false : opts.multi;
    // 是否树形
    var isTree = opts.tree == undefined ? false : opts.tree;
    // 值所在的列
    var keyColumn = opts.keyColumn || 'Id';
    // 层级所在的列
    var levelColumn = opts.levelColumn || 'Level';
    // 是否自动加载数据
    var isAuto = opts.auto == undefined ? false : opts.auto;
    // 数据内按钮调用的方法集
    var handlers = opts.handlers;
    // 控件总高度，可以是数值或方法
    var height = opts.height;
    // 单击行事件
    var clickFn = opts.click;
    // 双击行事件
    var dblClickFn = opts.dblClick;
    // 每页显示的数量
    var pageSize = opts.pageSize;
    // ajax获取数据的路径或网址
    var api = opts.api;
    // ajax请求方式
    var type = opts.type || 'get';
    // ajax请求前运行
    var ajaxBeforeSendFn = opts.ajaxBefore || null;
    // ajax请求成功后，开始生成html之前运行
    var dataConvertFn = opts.ajaxSuccess || null;
    // ajax请求成功并渲染html结束后运行
    var renderCompleteFn = opts.renderComplete || null;
    // ajax请求失败
    var ajaxErrorFn = opts.ajaxError || null;
    // ajax请求完成
    var ajaxCompleteFn = opts.ajaxComplete || null;
    // 请求参数
    var filterFn = opts.filterFn || null;

    var data = [];
    var selectedItem = null;
    var selectedItems = [];

    var pager = isPager ? new Pager(_this, pageSize) : null;

    var doms = {
      header: $('<div class="grid-header"></div>'),
      headerTable: $('<table class="table table-striped"></table>'),
      body: $('<div class="grid-body scroll-y"></div>'),
      bodyTable: $('<table class="table table-striped"></table>'),
      left: $('<div class="grid-fixed-left"></div>'),
      right: $('<div class="grid-fixed-right"></div>'),
      leftHeader: $('<div class="fixed-left-header"></div>'),
      rightHeader: $('<div class="fixed-right-header"></div>'),
      leftBody: $('<div class="fixed-left-body scroll-y"></div>'),
      rightBody: $('<div class="fixed-right-body scroll-y"></div>'),
      leftBodyTable: $('<table class="table table-striped left-fixed-body-table"></table>'),
      rightBodyTable: $('<table class="table table-striped right-fixed-body-table"></table>'),
      leftHeaderTable: $('<table class="table table-striped left-fixed-header-table"></table>'),
      rightHeaderTable: $('<table class="table table-striped right-fixed-header-table"></table>'),
      lastCols: null,
      bodyTbody: null,
      leftTbody: null,
      rightTbody: null,
      scrollY: null,
      checkAll: undefined
    };

    var widths = {
      left: 0,
      right: 0,
      bodyTable: 0,
      headerTable: 0,
      lastAutoWidthCol: 0,
      fixedWidthCol: 0
    };

    var heights = {
      total: 0,
      body: 0
    };

    var leftCols = [];
    var rightCols = [];
    var centerCols = [];
    var lastAutoWidthCol = null;
    var hasHScrollBar = false;

    var hasLeft = false;
    var hasRight = false;

    if (isMulti) {
      cols.splice(0, 0, {
        title: '',
        type: 'checkbox',
        width: 40,
        fixed: 'left'
      });
    }

    $.each(cols, function (idx, col) {
      if (!col.width) {
        col.width = 120;
        col.autoWidth = true;
      }
      if (col.fixed == 'left') {
        widths.left += col.width;
        leftCols.push(col);
        hasLeft = true;
      } else if (col.fixed == 'right') {
        widths.right += col.width;
        rightCols.push(col);
        hasRight = true;
      } else {
        lastAutoWidthCol = col;
        centerCols.push(col);
      }
      widths.bodyTable += col.width;
    });

    if (lastAutoWidthCol == null) {
      lastAutoWidthCol = centerCols[centerCols.length - 1];
    }

    lastAutoWidthCol.isLast = true;
    lastAutoWidthCol.origWidth = lastAutoWidthCol.width;

    widths.fixedWidthCol = widths.bodyTable - lastAutoWidthCol.width;

    calcWidth();
    initDom();
    setWidth(true);
    calcHeight();
    setHeight();
    listen();


    // 1. 操作dom
    //    1.1 初始化dom
    function initDom() {
      var leftColGroup = '<colgroup>';
      var rightColGroup = '<colgroup>';
      var centerColGroup = '<colgroup>';
      var leftTHead = '<thead><tr>';
      var rightTHead = '<thead><tr>';
      var centerTHead = '<thead><tr>';

      $.each(leftCols, function (index, col) {
        leftColGroup += '<col width="' + col.width + '" />';
        if (col.type == 'checkbox') {
          leftTHead += '<th class="content-center"><div class="cell"><input type="checkbox" class="checkall"></div></th>';
        } else {
          leftTHead += '<th><div class="cell">' + col.title + '</div></th>';
        }
      });

      $.each(rightCols, function (index, col) {
        rightColGroup += '<col width="' + col.width + '" />';
        rightTHead += '<th><div class="cell">' + col.title + '</div></th>';
      });

      $.each(cols, function (index, col) {
        if (col.isLast) {
          centerColGroup += '<col width="' + col.width + '" class="last-col" />';
        } else {
          centerColGroup += '<col width="' + col.width + '" />';
        }
        centerTHead += '<th><div class="cell">' + col.title + '</div></th>';
      });

      var centerHeaderColGroup = centerColGroup;
      var centerHeaderTHead = centerTHead;

      centerHeaderColGroup += '<col width="17" />';
      centerHeaderTHead += '<th><div class="cell"></div></th>';

      leftColGroup += '</colgroup>';
      rightColGroup += '</colgroup>';
      centerColGroup += '</colgroup>';
      leftTHead += '</tr></thead>';
      rightTHead += '</tr></thead>';
      centerTHead += '</tr></thead>';
      centerHeaderColGroup += '</colgroup>';
      centerHeaderTHead += '</tr></thead>';

      doms.headerTable.append($(centerHeaderColGroup));
      doms.headerTable.append($(centerHeaderTHead));
      doms.bodyTable.append($(centerColGroup));
      doms.bodyTbody = $('<tbody class="center-tbody"></tbody>');
      doms.bodyTable.append(doms.bodyTbody);

      doms.header.append(doms.headerTable);
      doms.body.append(doms.bodyTable);

      _this.append(doms.header);
      _this.append(doms.body);
      _this.append($('<div class="grid-top-right-mask"></div>'));

      if (hasLeft) {
        doms.leftHeaderTable.append($(leftColGroup));
        doms.leftHeaderTable.append($(leftTHead));
        doms.leftBodyTable.append($(leftColGroup));
        doms.leftTbody = $('<tbody class="left-tbody"></tbody>');
        doms.leftBodyTable.append(doms.leftTbody);

        doms.leftHeader.append(doms.leftHeaderTable);
        doms.leftBody.append(doms.leftBodyTable);

        doms.left.append(doms.leftHeader);
        doms.left.append(doms.leftBody);

        _this.append(doms.left);
      }

      if (hasRight) {
        doms.rightHeaderTable.append($(rightColGroup));
        doms.rightHeaderTable.append($(rightTHead));
        doms.rightBodyTable.append($(rightColGroup));
        doms.rightTbody = $('<tbody class="right-tbody"></tbody>');
        doms.rightBodyTable.append(doms.rightTbody);

        doms.rightHeader.append(doms.rightHeaderTable);
        doms.rightBody.append(doms.rightBodyTable);

        doms.right.append(doms.rightHeader);
        doms.right.append(doms.rightBody);

        _this.append(doms.right);
      }
    }

    //    1.2 控制显示dom
    function dataShow() {
      if (!data || data.length == 0) {
        if (left) doms.left.hide();
        if (right) doms.right.hide();

        doms.bodyTbody.html('<tr class="empty"><td colspan="' + cols.length + '">暂无数据</td></tr>');
      } else {
        if (left) doms.left.show();
        if (right) doms.right.show();
      }
    }

    // 2. 处理宽度
    //    2.1 计算宽度
    function calcWidth() {
      var total = _this.width();
      var temp = total - widths.fixedWidthCol - 18;

      if (temp > lastAutoWidthCol.origWidth) {
        lastAutoWidthCol.width = temp;
        hasHScrollBar = false;
      } else {
        lastAutoWidthCol.width = lastAutoWidthCol.origWidth;
        hasHScrollBar = true;
      }
      widths.lastAutoWidthCol = lastAutoWidthCol.width;
      widths.bodyTable = widths.fixedWidthCol + widths.lastAutoWidthCol;

    }

    //    2.2 设置dom宽度
    function setWidth(isInit) {
      doms.headerTable.css('width', widths.bodyTable + 17 + 'px');
      doms.bodyTable.css('width', widths.bodyTable + 'px');

      doms.left.css('width', widths.left + 1 + 'px');
      doms.right.css('width', widths.right + 1 + 'px');

      if (hasLeft) {
        if (hasHScrollBar) {
          doms.left.css('bottom', '17px');
        } else {
          doms.left.css('bottom', '0');
        }
      }

      if (hasRight) {
        if (hasHScrollBar) {
          doms.right.css('bottom', '17px');
        } else {
          doms.right.css('bottom', '0');
        }
      }

      if (!isInit) {
        getLastCols().prop('width', lastAutoWidthCol.width);
      }
    }

    // 3. 处理高度
    //    3.1 计算高度
    function calcHeight() {
      if (height) {
        if ($.isNumeric(height)) {
          if (height > 0) {
            if (isPager) {
              heights.body = height - 40 - 2 - 39;
            } else {
              heights.body = height - 2 - 39;
            }
          } else {
            heights.body = $(w).height() + height - 2 - 39;
          }
        } else if ($.isFunction(height)) {
          if (isPager) {
            heights.body = height() - 40 - 2 - 39;
          } else {
            heights.body = height() - 2 - 39;
          }
        }
      }

      if (heights.body < 200) {
        heights.body = 200;
      }
    }

    //    3.2 设置dom高度
    function setHeight() {
      doms.body.css('height', heights.body + 'px');
      if (leftCols.length > 0) {
        if (!hasHScrollBar) {
          doms.leftBody.css('height', heights.body + 'px');
        } else {
          doms.leftBody.css('height', heights.body - 17 + 'px');
        }
      }
      if (rightCols.length > 0) {
        if (!hasHScrollBar) {
          doms.rightBody.css('height', heights.body + 'px');
        } else {
          doms.rightBody.css('height', heights.body - 17 + 'px');
        }
      }
    }

    // 4. 获取dom
    //    4.1 获取.auto-width的<col>元素
    function getLastCols() {
      if (!doms.lastCols) {
        doms.lastCols = _this.find('.last-col');
      }
      return doms.lastCols;
    }

    //    4.2 获取数据表格的tbody
    function getBodyTbody() {
      if (!doms.bodyTbody) {
        doms.bodyTbody = _this.find('.grid-body tbody');
      }
      return doms.bodyTbody;
    }

    //    4.3 获取左侧数据表格的tbody
    function getLeftTbody() {
      if (!doms.leftTbody) {
        doms.leftTbody = _this.find('.grid-fixed-left-table tbody');
      }
      return doms.leftTbody;
    }

    //    4.4 获取右侧数据表格tbody
    function getRightTbody() {
      if (!doms.rightTbody) {
        doms.rightTbody = _this.find('.grid-fixed-right-table tbody');
      }
      return doms.rightTbody;
    }

    //    4.5 获取可以y轴滚动的元素，左中右的body
    function getScrollY() {
      if (!doms.scrollY) {
        doms.scrollY = _this.find('.scroll-y');
      }
      return doms.scrollY;
    }

    //    4.6 获取全选的checkbox
    function getCheckAll() {
      if (doms.checkAll == null) {
        doms.checkAll = _this.find('.checkall');
      }
      return doms.checkAll;
    }

    // 5. 渲染数据
    //    5.1 渲染中间的表格
    function renderRow(rowData, index) {
      var h = '<tr class="tr-' + index + '" data-idx="' + index + '"' + (isTree ? ' data-level="' + rowData['Level'] + '"' : '') + '>';
      $.each(cols, function (idx, col) {
        if (col.fixed == 'left' || col.fixed == 'right') {
          h += '<td><div class="cell"></div></td>';
        } else {
          h += renderColumn(col, rowData[col.field], index, rowData['Level'], rowData);
        }
      });
      h += '</tr>';
      return h;
    };

    //    5.2 渲染左侧表格
    function renderLeftRow(rowData, index) {
      var h = '<tr class="tr-' + index + '" data-idx="' + index + '"' + (isTree ? ' data-level="' + rowData[levelColumn] + '"' : '') + '>';
      $.each(leftCols, function (idx, col) {
        h += renderColumn(col, rowData[col.field], index, rowData['Level'], rowData);
      });
      h += '</tr>';
      return h;
    };

    //    5.3 渲染右侧表格
    function renderRightRow(rowData, index) {
      var h = '<tr class="tr-' + index + '" data-idx="' + index + '"' + (isTree ? ' data-level="' + rowData[levelColumn] + '"' : '') + '>';
      $.each(rightCols, function (idx, col) {
        h += renderColumn(col, rowData[col.field], index, rowData['Level'], rowData);
      });
      h += '</tr>';
      return h;
    };

    //    5.4 渲染单元格
    function renderColumn(col, colData, index, level, rowData) {
      var val = '';
      if ($.isNumeric(colData)) {
        val = colData;
      } else {
        val = colData || '';
      }
      var cssName = 'cell';
      var tdClass = col.className ? ' class="' + col.className + '"' : '';
      //if (col.className) {
      //    cssName += ' ' + col.className;
      //}

      if (col.do != undefined) {
        var v = col.do(rowData);
        return '<td' + tdClass + '><div class="' + cssName + '">' + v + '</div></td>';
      }
      switch (col.type) {
        case 'checkbox':
          cssName += ' content-center';
          val = '<input type="checkbox" value="' + index + '" class="cb-' + index + '" />';
          break;
        case 'indexNum':
          val = ++index;
          break;
        case 'tree':
          val = treeText(val, level);
          break;
        case 'bool':
          val = boolText(val);
          break;
        default:
          break;
      }
      return '<td' + tdClass + '><div class="' + cssName + '">' + val + '</div></td>';
    };

    //    5.5 树形列表的显示
    function treeText(txt, level) {
      if (level && level > 1) {
        var blank = '<span class="inline-blank" style="width: ' + ((level - 1) * 18) + 'px"></span> |- ';
        //blank += '<span class="btn-toggle">+</span>'
        return blank + txt;
      } else {
        return txt;
      }
    }

    //    5.6 布尔值的显示
    function boolText(val) {
      switch (val) {
        case undefined:
          return '';
        case true:
          return '<i class="fa fa-check-square"></i>';
        case false:
          return '<i class="fa fa-square-o"></i>';
        default:
          return val;
      }
    }

    // 6. 事件监听
    function listen() {
      // 6.1 监听数据区域的滚动条事件
      doms.body.on('scroll', function () {
        var scrollTop = $(this).scrollTop();
        getScrollY().scrollTop(scrollTop);

        var scrollLeft = $(this).scrollLeft();
        doms.header.scrollLeft(scrollLeft);
      });

      // 6.2 监听数据行点击、hover、双击事件
      _this.on('click', 'tbody tr:not(.empty)', function () {
        var idx = $(this).data('idx');
        var d = data[idx];
        selectedItem = d;

        if (!isMulti) {
          if (!$(this).hasClass('selected')) {
            _this.find('.tr-' + idx).addClass('selected').siblings().removeClass('selected');
          }
        } else {
          var cb = _this.find('.cb-' + idx);
          cb.trigger('click');
        }

        if (clickFn && $.isFunction(clickFn)) {
          clickFn(selectedItem);
        }
      }).on('mouseover', 'tbody tr', function () {
        var idx = $(this).data('idx');
        _this.find('.tr-' + idx).addClass('hover').siblings().removeClass('hover');
      }).on('dblclick', 'tbody tr:not(.empty)', function () {
        if (isMulti) {
          return console.log('多选表格不支持双击事件');
        }
        if (dblClickFn && $.isFunction(dblClickFn)) {
          dblClickFn(selectedItem);
        }
      });

      if (isMulti) {
        // 6.3 监听checkbox的点击事件
        doms.leftTbody.on('click', ':checkbox', function (e) {
          e.stopPropagation();

          if (!$(this).prop('checked')) {
            getCheckAll().prop('checked', false);
          } else {
            if (data.length == _this.find(':checked').length) {
              getCheckAll().prop('checked', true);
            }
          }
        });

        // 6.4 监听全选checkbox的点击事件
        getCheckAll().on('click', function () {
          _this.find('tbody :checkbox').prop('checked', $(this).prop('checked'));
        });
      }

      // 6.5 监听窗口resize事件
      $(w).on('resize', function () {
        calcWidth();
        setWidth(false);
        calcHeight();
        setHeight();
      });

      // 6.6 监听数据内点击事件
      _this.on('click', '.grid-button', function (e) {
        e.stopPropagation();
        var tr = $(this).parents('tr');
        if (!tr) return;
        tr.trigger('click');

        var func = $(this).data('func');
        if (!func || !handlers[func]) return;
        handlers[func](selectedItem);
      });

      // 6.7 监听分页事件
      if (isPager) {
        pager.addEventListener(function () {
          _this.pull()
        });
      }
    }

    // 7. 分页
    function Pager(domTBody, pagesize, cssClass) {
      this.pageSize = pagesize || 20;
      this.pageCount = 0;
      this.recordCount = 0;
      this.pageIndex = 1;
      var pagerClass = opts.pagerClass || 'grid-pager pager';

      var pagerDom = $('<div class="' + pagerClass + '"></div>');
      domTBody.after(pagerDom);
      var buttondomTBody = $('<div class="buttons"></div>');
      var info = $('<div class="info"></div>');
      pagerDom.append(buttondomTBody);
      pagerDom.append(info);
      var firstBtn = $('<a class="disabled"><i class="fa fa-fast-backward"></i></a>');
      buttondomTBody.append(firstBtn);
      var prevBtn = $('<a class="disabled"><i class="fa fa-backward"></i></a>');
      buttondomTBody.append(prevBtn);
      var nextBtn = $('<a class="disabled"><i class="fa fa-forward"></i></a>');
      buttondomTBody.append('<b>第</b>');
      var currentInput = $('<input value="1" type="text" maxlength="4" />');
      buttondomTBody.append(currentInput);
      buttondomTBody.append('<b>页</b>');
      buttondomTBody.append(nextBtn);
      var lastBtn = $('<a class="disabled"><i class="fa fa-fast-forward"></i></a>');
      buttondomTBody.append(lastBtn);
      var pageSize = $('<select name="pageSize"><option value="20">每页20条</option><option value="30">每页30条</option><option value="50">每页50条</option></select>');
      buttondomTBody.append(pageSize);

      this.addEventListener = function (fn) {
        var that = this;
        firstBtn.on('click', function () {
          if ($(this).hasClass('disabled')) return;
          that.pageIndex = 1;
          currentInput.val(that.pageIndex);
          fn(that);
        });
        prevBtn.on('click', function () {
          if ($(this).hasClass('disabled')) return;
          if (that.pageIndex > 1) {
            that.pageIndex--;
          } else {
            that.pageIndex = 1;
          }
          currentInput.val(that.pageIndex);
          fn(that);
        });
        nextBtn.on('click', function () {
          if ($(this).hasClass('disabled')) return;
          that.pageIndex++;
          if (that.pageIndex > that.pageCount) {
            that.pageIndex = that.pageCount;
          }
          currentInput.val(that.pageIndex);
          fn(that);
        });
        lastBtn.on('click', function () {
          if ($(this).hasClass('disabled')) return;
          that.pageIndex = that.pageCount;
          currentInput.val(that.pageIndex);
          fn(that);
        });
        currentInput.on('change', function () {
          var v = Number($(this).val());
          if (!v || v < 0 || v > that.pageCount) return $(this).val(that.pageIndex);
          that.pageIndex = v;
          currentInput.val(that.pageIndex);
          fn(that);
        });
        pageSize.on('change', function () {
          var s = Number($(this).val());
          if (!s || s < 0) return $(this).val(that.pageSize);
          that.pageSize = s;
          pageSize.val(that.pageSize);
          currentInput.val('1');
          that.pageIndex = 1;
          fn(that);
        });
      };

      this.setPager = function (total, start) {
        var that = this;
        this.recordCount = total;
        this.pageCount = Math.ceil(this.recordCount / this.pageSize);
        firstBtn.removeClass('disabled');
        prevBtn.removeClass('disabled');
        nextBtn.removeClass('disabled');
        lastBtn.removeClass('disabled');
        currentInput.val(that.pageIndex);
        if (this.pageIndex === 1) {
          firstBtn.addClass('disabled');
          prevBtn.addClass('disabled');
        }
        if (this.pageIndex >= this.pageCount) {
          nextBtn.addClass('disabled');
          lastBtn.addClass('disabled');
        }
        var msg = '共计' + this.recordCount + '条记录，每页显示' + this.pageSize + '条，共' + this.pageCount + '页，用时' + (new Date().getTime() - start) + '毫秒';
        info.html(msg);
      };
    }

    // 8. 获取查询参数
    function getFilter() {
      var param;
      if (filterFn && $.isFunction(filterFn)) {
        param = filterFn();
      }

      if ($.isArray(param)) {
        if (isPager) {
          param.push({
            'name': 'pageSize',
            'value': pager.pageSize
          });
          param.push({
            'name': 'pageIndex',
            'value': pager.pageIndex
          });
        }
        param.push({
          'r': Math.random()
        });
      } else if ($.isPlainObject(param)) {
        if (isPager) {
          $.extend(true, param, {
            'pageSize': pager.pageSize,
            'pageIndex': pager.pageIndex,
            'r': Math.random()
          });
        } else {
          $.extend(true, param, {
            'r': Math.random()
          });
        }
      } else {
        param = (param ? param + '&r=' : 'r=') + Math.random();
        if (isPager) {
          param += '&pageSize=' + pager.pageSize + '&pageIndex=' + pager.pageIndex;
        }
      }
      return param || {};
    }

    // 9. 网络请求异常的通用处理
    //    9.1 请求成功，但返回数据异常
    function codeError(response) {
      switch (response.Code) {
        case 1001:
          // 未登录
          layer.confirm('您尚未登录或登录信息已过期，请重新登录', {
            btn: ['重新登录', '忽略']
          }, function () {
            top.location.href = '~/login';
          });
          break;
        case 1002:
          // 无权限
          layer.confirm('您已登录，但无权访问此接口，请使用其他账号登录或联系管理员', {
            btn: ['重新登录', '忽略']
          }, function () {
            top.location.href = '~/login';
          });
          break;
        case 1003:
          // 无数据权限
          layer.alert('您无权查看此数据', {
            icon: 2
          });
          break;
        case 2001:
          // 没找到页面，应该不会出现在这里
          layer.alert('您请求的接口不存在', {
            icon: 2
          });
          break;
        case 2002:
          // 请求数据不存在
          layer.alert('您请求的数据不存在或已删除', {
            icon: 2
          });
          break;
        case 3001:
          // 请求参数不符
          layer.alert('您提交的数据不合法，请检查后重试', {
            icon: 2
          });
          break;
        case 4001:
          // 提交的数据验证失败
          layer.alert('您提交的数据模型验证失败，请检查后重试', {
            icon: 2
          });
          break;
        default:
          // 其他错误
          layer.alert('异常：' + response.Message, {
            icon: 2
          });
          break;
      }
    }

    //    9.2 请求失败，网络异常
    function requestError() {
      layer.alert('网络异常，请稍候再试！若此问题出现多次，请联系管理员', {
        icon: 2
      });
    }

    //    9.3 服务器返回数据异常
    function serverError() {
      layer.alert('系统异常，请联系管理员', {
        icon: 2
      });
    }

    // 10. 公共方法
    //    10.1 解析json，并生成数据
    _this.render = function (d) {
      var html = '';
      var leftHtml = '';
      var rightHtml = '';
      if (d && d.length > 0) {
        data = d;
      }

      if (!data || data.length == 0) {
        if (hasLeft) {
          doms.left.hide();
          doms.leftTbody.html('');
        };
        if (hasRight) {
          doms.right.hide();
          doms.rightTbody.html('');
        }
        doms.bodyTbody.html('<tr class="empty"><td colspan="' + cols.length + '">暂无数据</td></tr>');
      } else {
        if (hasLeft) doms.left.show();
        if (hasRight) doms.right.show();

        $.each(data, function (idx, item) {
          html += renderRow(item, idx);
          leftHtml += renderLeftRow(item, idx);
          rightHtml += renderRightRow(item, idx);
        });
        getBodyTbody().html(html);
        if (leftCols.length > 0) {
          getLeftTbody().html(leftHtml);
        }
        if (rightCols.length > 0) {
          getRightTbody().html(rightHtml);
        }
      }
    };

    //   10.2 获取选中数据
    _this.getSelectedItem = function () {
      return selectedItem;
    };

    //   10.3 获取选中数据数组
    _this.getSelectedItems = function () {
      var items = [];
      if (!isMulti && selectedItem) {
        items.push(selectedItem);
      } else {
        $.each(doms.left.find(':checked'), function (idx, item) {
          var index = $(item).val();
          items.push(data[index]);
        });
      }
      return items;
    };

    //   10.6 获取选中数据的值
    _this.getSelectedValue = function () {
      var item = _this.getSelectedItem();
      if (item) {
        return item[keyColumn];
      } else {
        return null;
      }
    };

    //   10.7 获取选中数据的值数组
    _this.getSelectedValues = function () {
      var items = _this.getSelectedItems();
      var temp = [];
      $.each(items, function (idx, item) {
        if (item[keyColumn]) {
          temp.push(item[keyColumn]);
        }
      });
      return temp;
    };

    //   10.4 拉取数据
    _this.pull = function () {
      if (type == 'get' || type == 'GET') {
        _this.get();
      } else if (type == 'post' || type == 'POST') {
        _this.post();
      } else {
        console.log('不受支持的type参数。可选值[get, GET, post, POST]');
      }

      var start = new Date().getTime();
      data = [];
      $.ajax({
        url: api,
        data: getFilter(),
        type: type,
        contentType: 'JSON',
        beforeSend: function () {
          layer.load(2);
          if (ajaxBeforeSendFn && $.isFunction(ajaxBeforeSendFn)) {
            ajaxBeforeSendFn();
          }
        },
        success: function (response) {
          if (response.code === 200) {
            if (dataConvertFn && $.isFunction(dataConvertFn)) {
              data = dataConvertFn(response.body);
            } else {
              data = response.body;
            }
            _this.render(data);
            if (isPager) pager.setPager(response.recordCount, start);
            if (renderCompleteFn && $.isFunction(renderCompleteFn)) renderCompleteFn();
          } else if (data.code === 401) {
            layer.alert('您的登录信息已过期，请重新登录！', {
              icon: 6,
              yes: function () {
                top.location.href = '/Account/Login';
              }
            });
          } else {
            layer.msg(data.message);
          }
        },
        error: function (event, xhr, options, exc) {
          if (ajaxErrorFn && $.isFunction(ajaxErrorFn)) {
            ajaxErrorFn(event, xhr, options, exc);
          } else {
            layer.msg('系统异常，请联系管理员');
          }
        },
        complete: function () {
          layer.closeAll('loading');
          if (ajaxCompleteFn && $.isFunction(ajaxCompleteFn)) {
            ajaxCompleteFn();
          }
        }
      });
    };

    //   10.5 手动设置高度
    _this.resetHeight = function (h) {
      if (h) {
        height = h;
      }
      calcHeight();
      setHeight();
    };

    //   10.8 重新拉取数据
    _this.reload = function () {
      if (api) {
        _this.pull();
      } else {
        _this.render();
      }
    };

    //   10.9 搜索
    _this.search = function () {
      if (isPager && pager) {
        pager.pageIndex = 1;
      }
      if (api) {
        _this.pull();
      } else {
        _this.render();
      }
    };


    if (isAuto) {
      _this.pull();
    } else {
      _this.render();
    }
    return _this;
  };
})(jQuery, window, layer);

// 无固定列数据表格
; (function ($, w, layer) {
  $.fn.MyGrid = function (opts) {
    var _this = this;

    // 要现实的列配置
    var cols = opts.columns;
    // 是否分页
    var isPager = opts.pager === undefined ? false : opts.pager;
    // 是否多选
    var isMulti = opts.multi === undefined ? false : opts.multi;
    // 是否树形
    var isTree = opts.tree === undefined ? false : opts.tree;
    // 是否自动加载数据
    var isAuto = opts.auto === undefined ? false : opts.auto;
    // 值所在的列
    var keyColumn = opts.keyColumn || 'id';
    // 层级所在的列
    var levelColumn = opts.levelColumn || 'level';
    // 数据内按钮调用的方法集
    var handlers = opts.handlers;
    // 控件总高度，可以是数值或方法
    var height = opts.height;
    // 单击行事件
    var clickFn = opts.click;
    // 双击行事件
    var dblClickFn = opts.dblClick;
    // 每页显示的数量
    var pageSize = opts.pageSize;
    // ajax获取数据的路径或网址
    var api = opts.api;
    // ajax请求方式
    var type = opts.type || 'get';
    // ajax请求前运行
    var ajaxBeforeSendFn = opts.ajaxBefore || null;
    // ajax请求成功后，开始生成html之前运行
    var dataConvertFn = opts.ajaxSuccess || null;
    // ajax请求成功并渲染html结束后运行
    var renderCompleteFn = opts.renderComplete || null;
    // ajax请求失败
    var ajaxErrorFn = opts.ajaxError || null;
    // ajax请求完成
    var ajaxCompleteFn = opts.ajaxComplete || null;
    // 请求参数
    var filterFn = opts.filterFn || null;

    var data = [];
    var selectedItem = null;
    var selectedItems = [];

    var pager = isPager ? new Pager(_this, pageSize) : null;

    var doms = {
      header: $('<div class="grid-header"></div>'),
      headerTable: $('<table class="table table-striped"></table>'),
      body: $('<div class="grid-body scroll-y"></div>'),
      bodyTable: $('<table class="table table-striped"></table>'),
      lastCols: null,
      bodyTbody: null,
      scrollY: null,
      checkAll: undefined
    };

    var widths = {
      bodyTable: 0,
      headerTable: 0,
      lastAutoWidthCol: 0
    };

    var heights = {
      total: 0,
      body: 0
    };

    var centerCols = [];
    var lastAutoWidthCol = null;
    var hasHScrollBar = false;

    if (isMulti) {
      cols.splice(0, 0, {
        title: '',
        type: 'checkbox',
        width: 40,
        fixed: 'left'
      });
    }

    $.each(cols, function (idx, col) {
      if (!col.width) {
        col.width = 120;
        col.autoWidth = true;
        lastAutoWidthCol = col;
      }
      centerCols.push(col);
      widths.bodyTable += col.width;
    });

    if (lastAutoWidthCol === null) {
      lastAutoWidthCol = centerCols[centerCols.length - 1];
    }

    lastAutoWidthCol.isLast = true;
    lastAutoWidthCol.origWidth = lastAutoWidthCol.width;

    widths.fixedWidthCol = widths.bodyTable - lastAutoWidthCol.width;

    calcWidth();
    initDom();
    setWidth(true);
    calcHeight();
    setHeight();
    listen();


    // 1. 操作dom
    //    1.1 初始化dom
    function initDom() {
      var centerColGroup = '<colgroup>';
      var centerTHead = '<thead><tr>';

      $.each(cols, function (index, col) {
        if (col.isLast) {
          centerColGroup += '<col width="' + col.width + '" class="last-col" />';
        } else {
          centerColGroup += '<col width="' + col.width + '" />';
        }
        if (col.type === 'checkbox') {
          centerTHead += '<th class="content-center"><div class="cell"><input type="checkbox" class="checkall"></div></th>';
        } else {
          centerTHead += '<th><div class="cell">' + col.title + '</div></th>';
        }
      });

      var centerHeaderColGroup = centerColGroup;
      var centerHeaderTHead = centerTHead;

      centerHeaderColGroup += '<col width="17" />';
      centerHeaderTHead += '<th><div class="cell"></div></th>';

      centerTHead += '</tr></thead>';
      centerHeaderColGroup += '</colgroup>';
      centerHeaderTHead += '</tr></thead>';

      doms.headerTable.append($(centerHeaderColGroup));
      doms.headerTable.append($(centerHeaderTHead));
      doms.bodyTable.append($(centerColGroup));
      doms.bodyTbody = $('<tbody class="center-tbody"></tbody>');
      doms.bodyTable.append(doms.bodyTbody);

      doms.header.append(doms.headerTable);
      doms.body.append(doms.bodyTable);

      _this.append(doms.header);
      _this.append(doms.body);
      _this.append($('<div class="grid-top-right-mask"></div>'));
    }

    //    1.2 控制显示dom
    function dataShow() {
      if (!data || data.length === 0) {
        doms.bodyTbody.html('<tr class="empty"><td colspan="' + cols.length + '">暂无数据</td></tr>');
      }
    }

    // 2. 处理宽度
    //    2.1 计算宽度
    function calcWidth() {
      var total = _this.width();
      var temp = total - widths.fixedWidthCol - 18;

      if (temp > lastAutoWidthCol.origWidth) {
        lastAutoWidthCol.width = temp;
        hasHScrollBar = false;
      } else {
        lastAutoWidthCol.width = lastAutoWidthCol.origWidth;
        hasHScrollBar = true;
      }
      widths.lastAutoWidthCol = lastAutoWidthCol.width;
      widths.bodyTable = widths.fixedWidthCol + widths.lastAutoWidthCol;

    }

    //    2.2 设置dom宽度
    function setWidth(isInit) {
      doms.headerTable.css('width', widths.bodyTable + 17 + 'px');
      doms.bodyTable.css('width', widths.bodyTable + 'px');

      if (!isInit) {
        getLastCols().prop('width', lastAutoWidthCol.width);
      }
    }

    // 3. 处理高度
    //    3.1 计算高度
    function calcHeight() {
      if (height) {
        if ($.isNumeric(height)) {
          if (height > 0) {
            if (isPager) {
              heights.body = height - 40 - 2 - 39;
            } else {
              heights.body = height - 2 - 39;
            }
          } else {
            heights.body = $(w).height() + height - 2 - 39;
          }
        } else if ($.isFunction(height)) {
          if (isPager) {
            heights.body = height() - 40 - 2 - 39;
          } else {
            heights.body = height() - 2 - 39;
          }
        }
      }

      if (heights.body < 200) {
        heights.body = 200;
      }
    }

    //    3.2 设置dom高度
    function setHeight() {
      doms.body.css('height', heights.body + 'px');
    }

    // 4. 获取dom
    //    4.1 获取.auto-width的<col>元素
    function getLastCols() {
      if (!doms.lastCols) {
        doms.lastCols = _this.find('.last-col');
      }
      return doms.lastCols;
    }

    //    4.2 获取数据表格的tbody
    function getBodyTbody() {
      if (!doms.bodyTbody) {
        doms.bodyTbody = _this.find('.grid-body tbody');
      }
      return doms.bodyTbody;
    }

    //    4.5 获取可以y轴滚动的元素，左中右的body
    function getScrollY() {
      if (!doms.scrollY) {
        doms.scrollY = _this.find('.scroll-y');
      }
      return doms.scrollY;
    }

    //    4.6 获取全选的checkbox
    function getCheckAll() {
      if (doms.checkAll === null) {
        doms.checkAll = _this.find('.checkall');
      }
      return doms.checkAll;
    }

    // 5. 渲染数据
    //    5.1 渲染中间的表格
    function renderRow(rowData, index) {
      var h = '<tr class="tr-' + index + '" data-idx="' + index + '"' + (isTree ? ' data-level="' + rowData[levelColumn] + '"' : '') + '>';
      $.each(cols, function (idx, col) {
        if (col.do && $.isFunction(col.do)) {
          h += renderColumn(col, col.do(rowData), index, rowData[levelColumn]);
        } else {
          h += renderColumn(col, rowData[col.field], index, rowData[levelColumn]);
        }
      });
      h += '</tr>';
      return h;
    };

    //    5.4 渲染单元格
    function renderColumn(col, colData, index, level) {
      var val = '';
      if ($.isNumeric(colData)) {
        val = colData;
      } else if (colData) {
        val = colData;
      }
      var cssName = 'cell';
      if (col.className) {
        cssName += ' ' + col.className;
      }

      var tdClassName = col.className ? ' class="' + col.className + '"' : '';

      //if (col.do != undefined) {
      //    var v = col.do(colData);
      //    return '<td><div class="' + cssName + '">' + v + '</div></td>';
      //}
      switch (col.type) {
        case 'checkbox':
          cssName += ' content-center';
          val = '<input type="checkbox" value="' + index + '" class="cb-' + index + '" />';
          break;
        case 'indexNum':
          val = ++index;
          break;
        case 'tree':
          val = treeText(val, level);
          break;
        case 'bool':
          val = boolText(val);
          break;
        default:
          break;
      }
      return '<td' + tdClassName + '><div class="cell">' + val + '</div></td>';
    };

    //    5.5 树形列表的显示
    function treeText(txt, level) {
      if (level && level > 1) {
        var blank = '<span class="inline-blank" style="width: ' + ((level - 1) * 18) + 'px"></span> |- ';
        //blank += '<span class="btn-toggle">+</span>'
        return blank + txt;
      } else {
        return txt;
      }
    }

    //    5.6 布尔值的显示
    function boolText(val) {
      switch (val) {
        case undefined:
          return '';
        case true:
          return '<i class="fa fa-check-square"></i>';
        case false:
          return '<i class="fa fa-square-o"></i>';
        default:
          return val;
      }
    }

    // 6. 事件监听
    function listen() {
      // 6.1 监听数据区域的滚动条事件
      doms.body.on('scroll', function () {
        var scrollTop = $(this).scrollTop();
        getScrollY().scrollTop(scrollTop);

        var scrollLeft = $(this).scrollLeft();
        doms.header.scrollLeft(scrollLeft);
      });

      // 6.2 监听数据行点击、hover、双击事件
      _this.on('click', 'tbody tr:not(.empty)', function () {
        var idx = $(this).data('idx');
        var d = data[idx];
        selectedItem = d;

        if (!isMulti) {
          if (!$(this).hasClass('selected')) {
            $(this).addClass('selected').siblings().removeClass('selected');
          }
        } else {
          var cb = $(this).find(':checkbox');
          cb.trigger('click');
        }

        if (clickFn && $.isFunction(clickFn)) {
          clickFn(selectedItem);
        }
      }).on('mouseover', 'tbody tr', function () {
        $(this).addClass('hover').siblings().removeClass('hover');
      }).on('dblclick', 'tbody tr:not(.empty)', function () {
        if (isMulti) {
          return console.log('多选表格不支持双击事件');
        }
        if (dblClickFn && $.isFunction(dblClickFn)) {
          dblClickFn(selectedItem);
        }
      });

      if (isMulti) {
        // 6.3 监听checkbox的点击事件
        _this.on('click', ':checkbox', function (e) {
          e.stopPropagation();

          if (!$(this).prop('checked')) {
            getCheckAll().prop('checked', false);
          } else {
            if (data.length === _this.find(':checked').length) {
              getCheckAll().prop('checked', true);
            }
          }
        });

        // 6.4 监听全选checkbox的点击事件
        getCheckAll().on('click', function () {
          _this.find(':checkbox').prop('checked', $(this).prop('checked'));
        });
      }

      // 6.5 监听窗口resize事件
      $(w).on('resize', function () {
        calcWidth();
        setWidth(false);
        calcHeight();
        setHeight();
      });

      // 6.6 监听数据内点击事件
      _this.on('click', '.grid-button', function (e) {
        e.stopPropagation();
        var tr = $(this).parents('tr');
        if (!tr) return;
        tr.trigger('click');

        var func = $(this).data('func');
        if (!func || !handlers[func]) return;
        handlers[func](selectedItem);
      });

      // 6.7 监听分页事件
      if (isPager) {
        pager.addEventListener(function () {
          _this.pull()
        });
      }
    }

    // 7. 分页
    function Pager(domTBody, pagesize, cssClass) {
      this.pageSize = pagesize || 20;
      this.pageCount = 0;
      this.recordCount = 0;
      this.pageIndex = 1;
      var pagerClass = opts.pagerClass || 'grid-pager pager';

      var pagerDom = $('<div class="' + pagerClass + '"></div>');
      domTBody.after(pagerDom);
      var buttondomTBody = $('<div class="buttons"></div>');
      var info = $('<div class="info"></div>');
      pagerDom.append(buttondomTBody);
      pagerDom.append(info);
      var firstBtn = $('<a class="disabled"><i class="fa fa-fast-backward"></i></a>');
      buttondomTBody.append(firstBtn);
      var prevBtn = $('<a class="disabled"><i class="fa fa-backward"></i></a>');
      buttondomTBody.append(prevBtn);
      var nextBtn = $('<a class="disabled"><i class="fa fa-forward"></i></a>');
      buttondomTBody.append('<b>第</b>');
      var currentInput = $('<input value="1" type="text" maxlength="4" />');
      buttondomTBody.append(currentInput);
      buttondomTBody.append('<b>页</b>');
      buttondomTBody.append(nextBtn);
      var lastBtn = $('<a class="disabled"><i class="fa fa-fast-forward"></i></a>');
      buttondomTBody.append(lastBtn);
      var pageSize = $('<select name="pageSize"><option value="20">每页20条</option><option value="30">每页30条</option><option value="50">每页50条</option></select>');
      buttondomTBody.append(pageSize);

      this.addEventListener = function (fn) {
        var that = this;
        firstBtn.on('click', function () {
          if ($(this).hasClass('disabled')) return;
          that.pageIndex = 1;
          currentInput.val(that.pageIndex);
          fn(that);
        });
        prevBtn.on('click', function () {
          if ($(this).hasClass('disabled')) return;
          if (that.pageIndex > 1) {
            that.pageIndex--;
          } else {
            that.pageIndex = 1;
          }
          currentInput.val(that.pageIndex);
          fn(that);
        });
        nextBtn.on('click', function () {
          if ($(this).hasClass('disabled')) return;
          that.pageIndex++;
          if (that.pageIndex > that.pageCount) {
            that.pageIndex = that.pageCount;
          }
          currentInput.val(that.pageIndex);
          fn(that);
        });
        lastBtn.on('click', function () {
          if ($(this).hasClass('disabled')) return;
          that.pageIndex = that.pageCount;
          currentInput.val(that.pageIndex);
          fn(that);
        });
        currentInput.on('change', function () {
          var v = Number($(this).val());
          if (!v || v < 0 || v > that.pageCount) return $(this).val(that.pageIndex);
          that.pageIndex = v;
          currentInput.val(that.pageIndex);
          fn(that);
        });
        pageSize.on('change', function () {
          var s = Number($(this).val());
          if (!s || s < 0) return $(this).val(that.pageSize);
          that.pageSize = s;
          pageSize.val(that.pageSize);
          currentInput.val('1');
          that.pageIndex = 1;
          fn(that);
        });
      };

      this.setPager = function (total, start) {
        var that = this;
        this.recordCount = total;
        this.pageCount = Math.ceil(this.recordCount / this.pageSize);
        firstBtn.removeClass('disabled');
        prevBtn.removeClass('disabled');
        nextBtn.removeClass('disabled');
        lastBtn.removeClass('disabled');
        currentInput.val(that.pageIndex);
        if (this.pageIndex === 1) {
          firstBtn.addClass('disabled');
          prevBtn.addClass('disabled');
        }
        if (this.pageIndex >= this.pageCount) {
          nextBtn.addClass('disabled');
          lastBtn.addClass('disabled');
        }
        var msg = '共计' + this.recordCount + '条记录，每页显示' + this.pageSize + '条，共' + this.pageCount + '页，用时' + (new Date().getTime() - start) + '毫秒';
        info.html(msg);
      };
    }

    // 8. 获取查询参数
    function getFilter() {
      var param;
      if (filterFn && $.isFunction(filterFn)) {
        param = filterFn();
      }

      if ($.isArray(param)) {
        if (isPager) {
          param.push({
            'name': 'pageSize',
            'value': pager.pageSize
          });
          param.push({
            'name': 'pageIndex',
            'value': pager.pageIndex
          });
        }
        param.push({
          'r': Math.random()
        });
      } else if ($.isPlainObject(param)) {
        if (isPager) {
          $.extend(true, param, {
            'pageSize': pager.pageSize,
            'pageIndex': pager.pageIndex,
            'r': Math.random()
          });
        } else {
          $.extend(true, param, {
            'r': Math.random()
          });
        }
      } else {
        param = (param ? param + '&r=' : 'r=') + Math.random();
        if (isPager) {
          param += '&pageSize=' + pager.pageSize + '&pageIndex=' + pager.pageIndex;
        }
      }
      return param || {};
    }

    // 9. 网络请求异常的通用处理
    //    9.1 请求成功，但返回数据异常
    function codeError(response) {
      switch (response.code) {
        case 1001:
          // 未登录
          layer.confirm('您尚未登录或登录信息已过期，请重新登录', {
            btn: ['重新登录', '忽略']
          }, function () {
            top.location.href = '~/login';
          });
          break;
        case 1002:
          // 无权限
          layer.confirm('您已登录，但无权访问此接口，请使用其他账号登录或联系管理员', {
            btn: ['重新登录', '忽略']
          }, function () {
            top.location.href = '~/login';
          });
          break;
        case 1003:
          // 无数据权限
          layer.alert('您无权查看此数据', {
            icon: 2
          });
          break;
        case 2001:
          // 没找到页面，应该不会出现在这里
          layer.alert('您请求的接口不存在', {
            icon: 2
          });
          break;
        case 2002:
          // 请求数据不存在
          layer.alert('您请求的数据不存在或已删除', {
            icon: 2
          });
          break;
        case 3001:
          // 请求参数不符
          layer.alert('您提交的数据不合法，请检查后重试', {
            icon: 2
          });
          break;
        case 4001:
          // 提交的数据验证失败
          layer.alert('您提交的数据模型验证失败，请检查后重试', {
            icon: 2
          });
          break;
        default:
          // 其他错误
          layer.alert('异常：' + response.message, {
            icon: 2
          });
          break;
      }
    }

    //    9.2 请求失败，网络异常
    function requestError() {
      layer.alert('网络异常，请稍候再试！若此问题出现多次，请联系管理员', {
        icon: 2
      });
    }

    //    9.3 服务器返回数据异常
    function serverError() {
      layer.alert('系统异常，请联系管理员', {
        icon: 2
      });
    }

    // 10. 公共方法
    //    10.1 解析json，并生成数据
    _this.render = function (d) {
      var html = '';
      var leftHtml = '';
      var rightHtml = '';
      if (d && d.length > 0) {
        data = d;
      }

      if (!data || data.length === 0) {
        doms.bodyTbody.html('<tr class="empty"><td colspan="' + cols.length + '">暂无数据</td></tr>');
      } else {
        $.each(data, function (idx, item) {
          html += renderRow(item, idx);
        });
        getBodyTbody().html(html);
      }

      selectedItem = null;
      selectedItems = [];
    };

    //   10.2 获取选中数据
    _this.getSelectedItem = function () {
      return selectedItem;
    };

    //   10.3 获取选中数据数组
    _this.getSelectedItems = function () {
      var items = [];
      if (!isMulti && selectedItem) {
        items.push(selectedItem);
      } else {
        $.each(_this.find(':checked'), function (idx, item) {
          var index = $(item).val();
          items.push(data[index]);
        });
      }
      return items;
    };

    //   10.6 获取选中数据的值
    _this.getSelectedValue = function () {
      var item = _this.getSelectedItem();
      if (item) {
        return item[keyColumn];
      } else {
        return null;
      }
    };

    //   10.7 获取选中数据的值数组
    _this.getSelectedValues = function () {
      var items = _this.getSelectedItems();
      var temp = [];
      $.each(items, function (idx, item) {
        if (item[keyColumn]) {
          temp.push(item[keyColumn]);
        }
      });
      return temp;
    };

    //   10.4 拉取数据
    _this.pull = function () {
      if (type === 'get' || type === 'GET') {
        _this.get();
      } else if (type === 'post' || type === 'POST') {
        _this.post();
      } else {
        console.log('不受支持的type参数。可选值[get, GET, post, POST]');
      }

      var start = new Date().getTime();
      data = [];
      $.ajax({
        url: api,
        data: getFilter(),
        type: type,
        contentType: 'JSON',
        beforeSend: function () {
          layer.load(2);
          if (ajaxBeforeSendFn && $.isFunction(ajaxBeforeSendFn)) {
            ajaxBeforeSendFn();
          }
        },
        success: function (response) {
          if (response.code === 200) {
            if (dataConvertFn && $.isFunction(dataConvertFn)) {
              data = dataConvertFn(response.body);
            } else {
              data = response.body;
            }
            _this.render(data);
            if (isPager) pager.setPager(response.recordCount, start);
            if (renderCompleteFn && $.isFunction(renderCompleteFn)) renderCompleteFn();
          } else if (response.code === 401) {
            layer.alert('您的登录信息已过期，请重新登录！', {
              icon: 6,
              yes: function () {
                top.location.href = '/Account/Login';
              }
            });
          } else {
            layer.msg(response.message);
          }
        },
        error: function (event, xhr, options, exc) {
          if (ajaxErrorFn && $.isFunction(ajaxErrorFn)) {
            ajaxErrorFn(event, xhr, options, exc);
          } else {
            layer.msg('系统异常，请联系管理员');
          }
        },
        complete: function () {
          layer.closeAll('loading');
          if (ajaxCompleteFn && $.isFunction(ajaxCompleteFn)) {
            ajaxCompleteFn();
          }
        }
      });
    };

    //   10.5 手动设置高度
    _this.resetHeight = function (h) {
      if (h) {
        height = h;
      }
      calcHeight();
      setHeight();
    };

    //   10.8 重新拉取数据
    _this.reload = function () {
      if (api) {
        _this.pull();
      } else {
        _this.render();
      }
    };

    //   10.9 重新拉取数据
    _this.search = function () {
      if (isPager && pager) {
        pager.pageIndex = 1;
      }
      if (api) {
        _this.pull();
      } else {
        _this.render();
      }
    };

    if (isAuto) {
      _this.pull();
    } else {
      _this.render();
    }
    return _this;
  };
})(jQuery, window, layer);

// 树形列表
; (function($) {

  // 交换样式
  $.fn.swapClass = function(c1, c2) {
    return this.removeClass(c1).addClass(c2);
  };

  // 切换样式
  $.fn.switchClass = function(c1, c2) {
    if (this.hasClass(c1)) {
      return this.swapClass(c1, c2);
    } else {
      return this.swapClass(c2, c1);
    }
  };

  $.fn.TreeView = function(settings) {
    var _sets = {
      api: null, // 数据URL
      type: 'GET', // 数据请求方式
      param: null, // 查询参数

      text: 'text', // 项目文本
      value: 'value', // 项目值
      children: 'children', // 下级
      icon: null, // 图标
      enabled: 'enabled', // 是否可以选中
      isMulti: false, // 是否多选

      values: null,

      isDisabledWhenHasChildren: false,

      successFn: null,

      onClick: null, // 单击事件
      onDblClick: null, // 双击事件
      convertSource: null, // 处理数据源的函数
      explandLevel: 100, // 级别小于n的项目展开

      selectModel: [true, true, false, true] // 选择模式，当项目被选中或取消选中时，如何处理关联的上下级
    };

    $.extend(_sets, settings);

    var selectLinkParent = _sets.selectModel[0]; // 选中时关联选中上级
    var selectLinkChildren = _sets.selectModel[1]; // 选中时关联选中下级
    var unSelectLinkParent = _sets.selectModel[2]; // 取消选中时关联取消上级
    var unSelectLinkChildren = _sets.selectModel[3]; // 取消选中时关联取消下级

    var me = $(this);
    var itemIdx = 0;
    var _flatData = [];
    var _parentData = [];

    setItemClickListener();

    function setMainDom(data) {
      var dt = [];
      dt.push('<dl>');
      $.each(data,
        function(i, item) {
          setNode(dt, item, 0, -1);
        });
      dt.push('</dl>');
      me.html(dt.join(''));
    }

    function setNode(arr, nodeData, level, parent) {
      level = level || 0; // 级别

      var t = nodeData[_sets.text]; //
      var v = nodeData[_sets.value]; //
      var a = nodeData[_sets.enabled]; //
      var c = nodeData[_sets.children]; //

      a = (a == null || a == undefined) ? true : a;

      _flatData[itemIdx] = nodeData; // 把数据存入数组
      _parentData[itemIdx] = parent;

      if (c && $.isArray(c) && c.length > 0) {
        arr.push("<dt data-id='", itemIdx, "' data-val='", v, "'");
        if (_sets.isDisabledWhenHasChildren || !a) {
          arr.push(" class='disabled'");
        }
        arr.push("><span class='blank' style='width: ", level * 18, "px'></span>");
        if (_sets.explandLevel && level < _sets.explandLevel) {
          arr.push("<span class='toggle-button'><i class='sj fa fa-caret-down'></i></span>");
        } else {
          arr.push("<span class='toggle-button'><i class='sj fa fa-caret-down fa-caret-right'></i></span>");
        }
        if (_sets.isMulti) {
          arr.push("<input type='checkbox' id='cb", itemIdx, "' value='", itemIdx, "' data-val='", v, "'");
          if (!a) {
            arr.push(" class='disabled'");
          }
          if (_sets.values && _sets.isMulti) {
            if ($.inArray(v, _sets.values) >= 0) {
              arr.push(" checked='checked'");
            }
          }
          arr.push(' /> ');
        } else {
          arr.push("<i class='fa fa-folder fa-folder-open'></i>");
        }
        arr.push(t);
        arr.push('</dt><dd');
        if (_sets.explandLevel != undefined && level >= _sets.explandLevel) {
          arr.push(" style='display: none'");
        }
        arr.push('>');
        var sLevel = level + 1;
        var _p = itemIdx;
        itemIdx += 1;
        arr.push('<dl>');
        $.each(c,
          function(i, node) {
            setNode(arr, node, sLevel, _p);
          });
        arr.push('</dl>');
        arr.push('</dd>')
      } else {
        arr.push('<dt ', (a ? '' : " class='disabled'"), "data-id='", itemIdx, "' data-val='", v, "'>");
        arr.push("<span class='blank' style='width: ", level * 18, "px;'></span>");
        arr.push('<span>|-</span> ');
        if (settings.isMulti) {
          arr.push("<input type='checkbox' id='cb", itemIdx, "' value='", itemIdx, "' data-val='", v, "'");
          if (!a) {
            arr.push(" class='disabled'");
          }
          if (_sets.values && _sets.isMulti) {
            if ($.inArray(v, _sets.values) >= 0) {
              arr.push(" checked='checked'");
            }
          }
          arr.push(' /> ');
        } else {
          arr.push("<i class='fa fa-folder fa-file'></i>");
        }
        arr.push(t);
        arr.push('</dt><dd></dd>');
        itemIdx += 1;
      }
    }

    function setItemClickListener() {
      me.on('click',
        ':checkbox',
        function(e) {
          e.stopPropagation();

          if ($(this).prop('checked')) {
            if (selectLinkChildren) {
              $(this).parent().next('dd').find(':checkbox').prop('checked', true);
            }
            if (selectLinkParent) {
              var c = $(this).val();
              var p = _parentData[c];
              $('#cb' + p).prop('checked', true);
              while (p > 0) {
                c = p;
                p = _parentData[c];
                $('#cb' + p).prop('checked', true);
              }
            }
          } else {
            if (unSelectLinkChildren) {
              $(this).parent().next('dd').find(':checkbox').prop('checked', false);
            }
            if (unSelectLinkParent) {
              var c = $(this).val();
              var p = _parentData[c];
              $('#cb' + p).prop('checked', false);
              while (p > 0) {
                c = p;
                p = _parentData[c];
                $('#cb' + p).prop('checked', false);
              }
            }
          }
        });

      me.on('click',
        '.sj',
        function(e) {
          e.stopPropagation();
          $(this).toggleClass('fa-caret-right').parent().parent().next('dd').toggle();
        });

      me.on('click',
        "dt:not('.disabled')",
        function(e) {
          if (!_sets.isMulti) {
            if (!$(this).hasClass('selected')) {
              me.find('dt').removeClass('selected');
              $(this).addClass('selected');
            }
            var i = $(this).data('id');
            var item = _flatData[i];
            if (_sets.onClick && $.isFunction(_sets.onClick)) {
              _sets.onClick(item);
            }
          } else {
            var cb = $(this).find(':checkbox');
            cb.trigger('click');
          }
        }).on('dblclick',
        "dt:not('.disabled')",
        function(e) {
          if (!_sets.isMulti) {
            var i = $(this).data('id');
            var item = _flatData[i];
            if (_sets.onDblClick && $.isFunction(_sets.onDblClick)) {
              _sets.onDblClick(item);
            }
          } else {
            return false;
          }
        });
    }

    me.flatData = function() {
      return _flatData;
    }

    me.renderDom = function(data) {
      me.data = data;
      setMainDom(data);
    }

    me.render = function() {
      $.ajax({
        url: _sets.api,
        data: _sets.param,
        type: _sets.type,
        success: function(response) {
          var d;
          if (_sets.convertSource && $.isFunction(_sets.convertSource)) {
            d = _sets.convertSource(response);
          } else {
            d = response;
          }
          me.renderDom(d);
          if (_sets.successFn && $.isFunction(_sets.successFn)) {
            _sets.successFn();
          }
        }
      });
    }

    me.getSelectedItem = function() {
      var result = me.getSelectedItems();
      if (result.length > 0) {
        return result[0];
      } else {
        return null;
      }
    }

    me.getSelectedItems = function() {
      var result = [];
      if (_sets.isMulti) {
        $.each(me.find(':checkbox'),
          function(idx, item) {
            if ($(item).prop('checked')) {
              result.push(_flatData[idx]);
            }
          });
      } else {
        var dt = me.find('dt.selected');
        if (dt.length > 0) {
          dt = dt[0];
          var idx = $(dt).data('id');
          result.push(_flatData[idx]);
        }
      }
      return result;
    }

    me.setValue = function(val) {
      if (!_sets.isMulti) {
        me.find('dt').removeClass('selected');
        $.each(me.find('dt'),
          function(idx, item) {
            if ($(item).data('val') == val) {
              $(item).addClass('selected');
            }
          });
      } else {
        if ($.isArray(val)) {
          $.each(me.find(':checkbox'),
            function(idx, item) {
              if ($.inArray($(item).data('val'), val) >= 0) {
                $(item).prop('checked', true);
              } else {
                $(item).prop('checked', false);
              }
            });
        } else {
          $.each(me.find(':checkbox'),
            function(idx, item) {
              if ($(item).data('val') == val) {
                $(item).prop('checked', true);
              } else {
                $(item).prop('checked', false);
              }
            });
        }
      }
    }

    me.getByValue = function(val) {
      if (!_sets.isMulti) {
        var result = null;
        $.each(_flatData,
          function(idx, item) {
            if (item[_sets.value] == val) {
              result = item;
              return false;
            }
          });
        return result;
      }
    };

    me.clearValue = function() {
      if (!_sets.isMulti) {
        me.find('dt').removeClass('selected');
      } else {
        me.find(':checkbox').prop('checked', false);
      }
    }

    return me;
  };

})(jQuery);

// 图片上传
; (function ($, w) {
  $.fn.MultiImageUploader = function (opt) {
    var self = $(this);
    var count = self.data('count') || 1;    // 最多上传图片数量
    var images = [];                        // 已上传的图片
    opt.count = count;

    var uploader = new ImgUploader(self, opt);
    var pathHolder = self.find("input[type='hidden']");
    var thumbs = self.find('.uploader-thumbs').first();

    if (opt.value) {
      images = opt.value.split(',');
      for (var i = 0; i < images.length; i++) {
        if (i < count) {
          addImage(images[i]);
        }
      }

      if (images.length >= count) {
        self.find('.b').hide();
      }
    }

    uploader.doWhen('fileUploadSuccess', function (d) {
      if (d.code == 200) {
        result = d.body;
        images.push(d.body);
        pathHolder.val(images.join(','));
        addImage(d.body);
      } else {
        alert('上传失败:' + d.message);
      }

      if (images.length >= count) {
        self.find('.b').hide();
      } else {
        self.find('.b').show();
      }
    });

    uploader.doWhen('fileUploadError',
      function (e, d) {
        console.log('上传出错');
      });

    uploader.doWhen('fileTooLarge',
      function (e, d) {
        alert('文件太大');
      });

    uploader.doWhen('fileStartUpload', function (e, d) {
      console.log('开始上传');
    });

    function addImage(src) {
      var img = new Image();
      img.src = src;

      img.onload = function () {
        scaleImg(this, 120, 120);
        var b = $("<div class='uploader-thumb'><span>删除</span></div>");
        b.append(this);
        thumbs.append(b);

        b.find('span').on('click', function () {
          $(this).parent().remove();
          removeImage(src);
          freshButtonAndStr();
        });
      }

      img.onerror = function () {
        scaleImg(this, 120, 120);
        var b = $("<div class='uploader-thumb' style='width: 120px; height: 120px;'><span>删除</span></div>");
        b.append(this);
        thumbs.append(b);

        b.find('span').on('click', function () {
          $(this).parent().remove();
          removeImage(src);
          freshButtonAndStr();
        });
      }
    }

    // 缩放图片到合适的大小
    function scaleImg(img, maxW, maxH) {
      var w = img.width, h = img.height;
      var scale_x = w / maxW;
      var scale_y = h / maxH;
      var scale = scale_x > scale_y ? scale_x : scale_y;
      //if (scale > 1) {
      //    img.width = w / scale;
      //    img.height = h / scale;
      //}
      if (scale_x > scale_y) {
        img.width = maxW;
        img.height = h / scale_x;
      } else {
        img.height = maxH;
        img.width = w / scale_y;
      }
    }

    // 删除一张图片
    function removeImage(src) {
      images = $.grep(images, function (v, k) {
        return v != src;
      });
    }

    // 设置按钮是否显示、更新文本框的字符串
    function freshButtonAndStr() {
      pathHolder.val(images.join(','));

      if (images.length >= count) {
        //uploader.fileInput.attr("disabled", "disabled");
        self.find('.b').hide();
      } else {
        //uploader.fileInput.removeAttr("disabled");
        self.find('.b').show();
      }
    }

    self.getImages = function () {
      return images;
    };

    self.setImages = function (imgs) {
      images = imgs;
    }

    self.add = function (src) {
      images.push(src);
      pathHolder.val(images.join(','));
      return addImage(src);
    }

    return self;
  }

  function ImgUploader(wrapper, opts) {
    // 变量
    var fileInput, fileButton, pathInput, thumbs;
    var listener = { noFileSelect: null, fileTooLarge: null, fileSelected: null, fileStartUpload: null, fileUploadSuccess: null, fileUploadError: null };

    var config = {
      wrapperClass: 'uploadWrapper',
      selectClass: 'selectButton',
      buttonClass: opts.buttonClass || 'b btn btn-blue',
      buttonText: opts.buttonText || '本地上传',
      valueFormName: '',
      value: '',
      maxSize: 1024 * 1024,
      autoUpload: true,
    };

    $.extend(true, config, opts);

    fileInput = $("<input type='file' class='b' style='width: 0.1px; height: 0.1px; position: absolute; opacity: 0; z-index: 2;' accept='image/gif,image/png,image/jpg,image/jpeg' />");
    fileButton = $("<a style='display: inline-block; cursor: pointer; z-index: 4' class='b " + config.buttonClass + "'>" + config.buttonText + '</a>');
    pathInput = $("<input type='hidden' value='" + (config.value.length > 0 ? config.value : '') + "' " + (config.valueFormName.length > 0 ? " name='" + config.valueFormName + "'" : '') + ' />');
    thumbs = $("<div class='uploader-thumbs'></div>");

    wrapper.append(fileInput);
    wrapper.append(fileButton);
    wrapper.append(pathInput);
    wrapper.append(thumbs);

    var that = this;

    fileButton.on('click', function (e) {
      fileInput.trigger('click');
    })

    fileInput.on('change', function () {
      var files = $(this).prop('files');
      if (files.length == 0) {
        publish('noFileSelected');
        return;
      }

      file = files[0];
      if (file.size > config.maxSize) {
        publish('fileTooLarge');
        fileInput.val('');
        return;
      }

      if (config.autoUpload) {
        upload(file);
        fileInput.val('');
      } else {
        publish('fileSelect', [files]);
      }
    });

    this.wrapper = wrapper;
    this.fileInput = fileInput;
    this.fileButton = fileButton;
    this.getListener = function () {
      return listener;
    }
    this.doWhen = function (eventName, fn) {
      for (var p in listener) {
        if (p == eventName) {
          if (listener[p]) {
            listener[p] = [].concat.call(listener[p], fn);
          } else {
            listener[p] = fn;
          }
        }
      }
    }

    function publish(eventName, data) {
      var fn = listener[eventName] || null;
      var i, len;
      if (fn instanceof Array) {
        for (i = 0, i < fn.length; i < len; i++) {
          fn[i] && fn[i](data);
        }
      } else if (fn instanceof Function) {
        fn && fn(data);
      }
    }

    // 上传
    function upload(file) {
      uploadSingle(file, function () {
        publish('fileStartUpload');
      }, function (data) {
        publish('fileUploadSuccess', data);
      }, function () {
        publish('fileUploadError');
      });
    }

    // 单文件上传
    function uploadSingle(file, beforeSendCb, successCb, errorCb) {
      var formData = new FormData();
      formData.append('img', file);

      $.ajax({
        url: wrapper.data('url') + '?r=' + (+new Date()),
        type: 'post',
        data: formData,
        //async: false,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        beforeSend: function () {
          fileButton.attr('disabled', 'disabled');
          beforeSendCb();
        },
        success: function (data) {
          //console.log(data);
          fileButton.removeAttr('disabled');
          successCb(data);
        },
        error: function (x) {
          //console.log(x);
          fileButton.removeAttr('disabled');
          errorCb();
        }
      });
    }
  }
})(jQuery, window);

// 初始化指定的dom操作
$(function () {
  // 获取token
  var rvt = $('input[name="__RequestVerificationToken"]');
  if (rvt.length > 0) {
    window.rvtToken = { __RequestVerificationToken: rvt.val() };
  }

  // 初始化按钮
  $('.btn-custom').each(function () {
    $(this).customButton();
  });

  // 初始化下拉按钮
  $('.btn-dropdown').on('mouseenter', function () {
    var dl = $(this).next('.dropdown-children');
    dl.fadeIn();
  }).on('mouseleave', function () {
    var dl = $(this).next('.dropdown-children');
    dl.hide();
  });

  $('.dropdown-children').on('mouseenter', function () {
    $(this).show();
  }).on('mouseleave click', function () {
    $(this).fadeOut();
  });

  // 初始化标签
  $('.tab-title').on('click', function () {
    var index = $(this).data('ref');
    $(this).addClass('active').siblings().removeClass('active');

    $('.tab-content').hide();
    $('#' + index).show();
  });

  // 初始化高级搜索
  $('.search-toggle-button').on('click', function () {
    $('#search-box').toggle();
    window.grid.resetHeight();
  });

  // 弹层选择框
  $('.pop-select-dom').on('dblclick', function () {
    var domId = $(this).data('dom');
    var title = $(this).data('title');
    var w = $(this).data('width');
    var h = $(this).data('height');
    myUI.popDiv(title || '', domId, w, h);
  });

  //　弹层选择框，IFrame
  $('.pop-select-iframe').on('dblclick', function () {
    var url = $(this).data('url');
    var title = $(this).data('title');
    var w = $(this).data('width');
    var h = $(this).data('height');
    myUI.popIframe(url, title || '', 560, 320);
  });

  // 查看缩略图
  //$(".uploader-thumbs").viewer();
});
