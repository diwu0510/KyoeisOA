// 数据验证完整性
$.fn.validate = function () {
  var validateMsg = '';
  var validateFlag = true;
  $(this).find('[isvalid=yes]').each(function () {
    var expression = $(this).attr('checkexpession');
    var errorMsg = $(this).attr('errorMsg');
    if (expression !== undefined) {
      if (errorMsg === undefined) {
        errorMsg = '';
      }
      var value = $(this).val();
      if ($(this).hasClass('ui-select')) {
        value = $(this).attr('data-value');
      }
      switch (expression) {
        case 'NotNull':
          {
            if (isNotNull(value)) {
              validateMsg = errorMsg + '不能为空！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Num':
          {
            if (!isInteger(value)) {
              validateMsg = errorMsg + '必须为数字！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'NumOrNull':
          {
            if (!isIntegerOrNull(value)) {
              validateMsg = errorMsg + '必须为数字！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Email':
          {
            if (!isEmail(value)) {
              validateMsg = errorMsg + '必须为E-mail格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'EmailOrNull':
          {
            if (!isEmailOrNull(value)) {
              validateMsg = errorMsg + '必须为E-mail格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'EnglishStr':
          {
            if (!isEnglishStr(value)) {
              validateMsg = errorMsg + '必须为字符串！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'EnglishStrOrNull':
          {
            if (!isEnglishStrOrNull(value)) {
              validateMsg = errorMsg + '必须为字符串！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'LenNum':
          {
            if (!isLenNum(value, $(this).attr('length'))) {
              validateMsg = errorMsg + '必须为' + $(this).attr('length') + '位数字！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'LenNumOrNull':
          {
            if (!isLenNumOrNull(value, $(this).attr('length'))) {
              validateMsg = errorMsg + '必须为' + $(this).attr('length') + '位数字！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'LenStr':
          {
            if (!isLenStr(value, $(this).attr('length'))) {
              validateMsg = errorMsg + '必须小于' + $(this).attr('length') + '位字符！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'LenStrOrNull':
          {
            if (!isLenStrOrNull(value, $(this).attr('length'))) {
              validateMsg = errorMsg + '必须小于' + $(this).attr('length') + '位字符！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Phone':
          {
            if (!isTelephone(value)) {
              validateMsg = errorMsg + '必须电话格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'PhoneOrNull':
          {
            if (!isTelephoneOrNull(value)) {
              validateMsg = errorMsg + '必须电话格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Fax':
          {
            if (!isTelephoneOrNull(value)) {
              validateMsg = errorMsg + '必须为传真格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Mobile':
          {
            if (!isMobile(value)) {
              validateMsg = errorMsg + '必须为手机格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'MobileOrNull':
          {
            if (!isMobileOrNull(value)) {
              validateMsg = errorMsg + '必须为手机格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'MobileOrPhone':
          {
            if (!isMobileOrPhone(value)) {
              validateMsg = errorMsg + '必须为电话格式或手机格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'MobileOrPhoneOrNull':
          {
            if (!isMobileOrPhoneOrNull(value)) {
              validateMsg = errorMsg + '必须为电话格式或手机格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Uri':
          {
            if (!isUri(value)) {
              validateMsg = errorMsg + '必须为网址格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'UriOrNull':
          {
            if (!isUriOrNull(value)) {
              validateMsg = errorMsg + '必须为网址格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Equal':
          {
            if (!isEqual(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '不相等！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Date':
          {
            if (!isDate(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为日期格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'DateOrNull':
          {
            if (!isDateOrNull(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为日期格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'DateTime':
          {
            if (!isDateTime(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为日期时间格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'DateTimeOrNull':
          {
            if (!isDateTimeOrNull(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为日期时间格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Time':
          {
            if (!isTime(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为时间格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'TimeOrNull':
          {
            if (!isTimeOrNull(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为时间格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'ChineseStr':
          {
            if (!isChinese(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为中文！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'ChineseStrOrNull':
          {
            if (!isChineseOrNull(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为中文！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Zip':
          {
            if (!isZip(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为邮编格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'ZipOrNull':
          {
            if (!isZipOrNull(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为邮编格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Double':
          {
            if (!isDouble(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为小数！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'DoubleOrNull':
          {
            if (!isDoubleOrNull(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为小数！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'IDCard':
          {
            if (!isIDCard(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为身份证格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'IDCardOrNull':
          {
            if (!isIDCardOrNull(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为身份证格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'IsIP':
          {
            if (!isIP(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为IP格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'IPOrNull':
          {
            if (!isIPOrNull(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为IP格式！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'Money':
          {
            if (!isMoney(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为最多两位小数的数字！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        case 'MoneyOrNull':
          {
            if (!isMoneyOrNull(value, $(this).attr('eqvalue'))) {
              validateMsg = errorMsg + '必须为最多两位小数的数字！\n';
              validateFlag = false;
              ValidationMessage($(this), validateMsg); return false;
            }
            break;
          }
        default:
          break;
      }
    }
  });

  if ($(this).find('[fieldexist=yes]').length > 0) {
    return false;
  }
  return validateFlag;

  //验证不为空 notnull
  function isNotNull(val) {
    val = $.trim(val);
    if (val.length === 0) return true;
    return false;
  }

  //验证数字 num
  function isInteger(val) {
    var reg = /^[-+]?\d+$/;
    if (!reg.test(val)) return false;
    return true;
  }

  //验证数字 num  或者null,空
  function isIntegerOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    var reg = /^[-+]?\d+$/;
    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }
  //Email验证 email
  function isEmail(obj) {
    var reg = /^\w{3,}@\w+(\.\w+)+$/;
    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }
  //Email验证 email   或者null,空
  function isEmailOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    var reg = /^\w{3,}@\w+(\.\w+)+$/;
    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }
  // 金额验证
  function isMoney(obj) {
    var reg = /(^-?[1-9](\d+)?(\.\d{1,2})?$)|(^-?0$)|(^-?\d\.\d{1,2}$)/;

    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  // 金额或空
  function isMoneyOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    var reg = /(^-?[1-9](\d+)?(\.\d{1,2})?$)|(^-?0$)|(^-?\d\.\d{1,2}$)/;
    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证只能输入英文字符串
  function isEnglishStr(obj) {
    var reg = /^[a-z,A-Z]+$/;
    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证只能输入英文字符串或者null,空
  function isEnglishStrOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    var reg = /^[a-z,A-Z]+$/;
    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证是否是n位数字字符串编号
  function isLenNum(obj, n) {
    var reg = /^[0-9]+$/;

    obj = $.trim(obj);
    if (obj.length > n)
      return false;

    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证是否是n位数字字符串编号或者null,空
  function isLenNumOrNull(obj, n) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    var reg = /^[0-9]+$/;
    obj = $.trim(obj);
    if (obj.length > n) return false;

    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证是否小于等于n位数的字符串 nchar
  function isLenStr(obj, n) {
    obj = $.trim(obj);
    if (obj.length === 0 || obj.length > n)
      return false;
    else
      return true;
  }

  //验证是否小于等于n位数的字符串 nchar或者null,空
  function isLenStrOrNull(obj, n) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    obj = $.trim(obj);
    if (obj.length > n)
      return false;
    else
      return true;
  }

  //验证是否电话号码 phone
  function isTelephone(obj) {
    var reg = /^(\d{3,4}\-)?[1-9]\d{6,7}$/;

    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证是否电话号码 phone或者null,空
  function isTelephoneOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    var reg = /^(\d{3,4}\-)?[1-9]\d{6,7}$/;
    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证是否手机号 mobile
  function isMobile(obj) {
    var reg = /^(\+\d{2,3}\-)?\d{11}$/;
    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证是否手机号 mobile或者null,空
  function isMobileOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    var reg = /^(\+\d{2,3}\-)?\d{11}$/;
    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证是否手机号或电话号码 mobile phone 
  function isMobileOrPhone(obj) {
    var mobileReg = /^(\+\d{2,3}\-)?\d{11}$/;
    var phoneReg = /^(\d{3,4}\-)?[1-9]\d{6,7}$/;

    if (!mobileReg.test(obj) && !phoneReg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证是否手机号或电话号码 mobile phone或者null,空
  function isMobileOrPhoneOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    var reg = /^(\+\d{2,3}\-)?\d{11}$/;
    var reg2 = /^(\d{3,4}\-)?[1-9]\d{6,7}$/;

    if (!reg.test(obj) && !reg2.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证网址 uri
  function isUri(obj) {
    var reg = /^http:\/\/[a-zA-Z0-9]+\.[a-zA-Z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证网址 uri或者null,空
  function isUriOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    var reg = /^http:\/\/[a-zA-Z0-9]+\.[a-zA-Z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
    if (!reg.test(obj)) {
      return false;
    } else {
      return true;
    }
  }

  //验证两个值是否相等 equals
  function isEqual(obj1, controlObj) {
    if (obj1.length !== 0 && controlObj.length !== 0) {
      if (obj1 === controlObj)
        return true;
      else
        return false;
    }
    return false;
  }

  //判断日期类型是否为YYYY-MM-DD格式的类型 date
  function isDate(obj) {
    if (obj.length !== 0) {
      var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断日期类型是否为YYYY-MM-DD格式的类型 date或者null,空
  function isDateOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    if (obj.length !== 0) {
      var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断日期类型是否为YYYY-MM-DD hh:mm:ss格式的类型 datetime
  function isDateTime(obj) {
    if (obj.length !== 0) {
      var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断日期类型是否为YYYY-MM-DD hh:mm:ss格式的类型 datetime或者null,空
  function isDateTimeOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    if (obj.length !== 0) {
      var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断日期类型是否为hh:mm:ss格式的类型 time
  function isTime(obj) {
    if (obj.length !== 0) {
      var reg = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断日期类型是否为hh:mm:ss格式的类型 time或者null,空
  function isTimeOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    if (obj.length !== 0) {
      var reg = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断输入的字符是否为中文 
  function isChinese(obj) {
    if (obj.length !== 0) {
      var reg = /^[\u0391-\uFFE5]+$/;
      if (!reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断输入的字符是否为中文或者null,空
  function isChineseOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    if (obj.length !== 0) {
      var reg = /^[\u0391-\uFFE5]+$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断输入的邮编(只能为六位)是否正确 zip
  function isZip(obj) {
    if (obj.length !== 0) {
      var reg = /^\d{6}$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断输入的邮编(只能为六位)是否正确 zip或者null,空
  function isZipOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    if (obj.length !== 0) {
      var reg = /^\d{6}$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断输入的字符是否为双精度 double
  function isDouble(obj) {
    if (obj.length !== 0) {
      var reg = /^[-\+]?\d+(\.\d+)?$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断输入的字符是否为双精度 double或者null,空
  function isDoubleOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    if (obj.length !== 0) {
      var reg = /^[-\+]?\d+(\.\d+)?$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断是否为身份证 idcard
  function isIDCard(obj) {
    if (obj.length !== 0) {
      var reg = /^\d{15}(\d{2}[A-Za-z0-9;])?$/;
      if (reg.test(obj))
        return true;
    }
    return false;
  }

  //判断是否为身份证或者null,空
  function isIDCardOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    if (obj.length !== 0) {
      var reg = /^\d{15}(\d{2}[A-Za-z0-9;])?$/;
      if (reg.test(obj)) {
        return true;
      }
    }
    return false;
  }

  //判断是否为IP地址格式
  function isIP(obj) {
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g; //匹配IP地址的正则表达式 
    if (re.test(obj)) {
      if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) return true;
    }
    return false;
  }

  //判断是否为IP地址格式 或者null,空
  function isIPOrNull(obj) {
    var controlObj = $.trim(obj);
    if (controlObj.length === 0) return true;

    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g; //匹配IP地址的正则表达式 
    if (re.test(obj)) {
      if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) return true;
    }
    return false;
  }
}

//提示信息
function ValidationMessage(obj, validateMsg) {
  try {
    removeMessage(obj);
    obj.focus();
    var $poptip_error = $('<div class="poptip"><span class="poptip-arrow poptip-arrow-top"><em>◆</em></span>' + validateMsg + '</div>').css('left', obj.offset().left + 'px').css('top', obj.offset().top + obj.parent().height() + 5 + 'px')
    $('body').append($poptip_error);
    if (obj.hasClass('form-control') || obj.hasClass('ui-select')) {
      obj.parent().addClass('has-error');
    }
    if (obj.hasClass('ui-select')) {
      $('.input-error').remove();
    }
    obj.on('change', function () {
      if (obj.val()) {
        removeMessage(obj);
      }
    });
    if (obj.hasClass('ui-select')) {
      $(document).click(function (e) {
        if (obj.attr('data-value')) {
          removeMessage(obj);
        }
        e.stopPropagation();
      });
    }
    return false;
  } catch (e) {
    alert(e);
    return false;
  }
}

//移除提示
function removeMessage(obj) {
  obj.parent().removeClass('has-error');
  $('.poptip').remove();
  $('.input-error').remove();
}