using System.Collections.Generic;

namespace Kyoeis.Core
{
    /// <summary>
    /// 操作结果辅助类
    /// </summary>
    public class ReturnModelUtil
    {
        #region 返回不带数据的结果

        /// <summary>
        /// 返回结果，不带返回数据
        /// </summary>
        /// <param name="code">结果码</param>
        /// <param name="message">结果说明</param>
        /// <returns></returns>
        public static ReturnModel Do(int code, string message)
        {
            return new ReturnModel(code, message);
        }

        /// <summary>
        /// 操作成功
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public static ReturnModel Ok(string message = "Ok")
        {
            return Do(200, message);
        }

        /// <summary>
        /// 失败，如数据库操作不成功等
        /// </summary>
        /// <param name="message">结果说明</param>
        /// <returns></returns>
        public static ReturnModel Fail(string message = "Fail")
        {
            return Do(0, message);
        }

        /// <summary>
        /// 数据未找到，如页面、数据不存在或已删除等
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public static ReturnModel NotFound(string message = "Not Found")
        {
            return Do(404, message);
        }

        /// <summary>
        /// 无效请求，如接口参数验证失败等
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public static ReturnModel BadRequest(string message = "Bad Request")
        {
            return Do(400, message);
        }

        /// <summary>
        /// 身份验证失败，如未登录等
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public static ReturnModel AuthenticationFail(string message = "Authentication Fail")
        {
            return Do(401, message);
        }

        /// <summary>
        /// 权限验证失败，如已登录但没有权限访问数据或模块
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public static ReturnModel AuthorizationFail(string message = "Authorization Fail")
        {
            return Do(403, message);
        }

        /// <summary>
        /// 系统异常，500错误
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public static ReturnModel Exception(string message = "Exception")
        {
            return Do(500, message);
        }

        #endregion

        #region 返回带数据的结果

        /// <summary>
        /// 返回结果，不带返回数据
        /// </summary>
        /// <param name="code">结果码</param>
        /// <param name="body">操作结果</param>
        /// <param name="message">结果说明</param>
        /// <returns></returns>
        public static ReturnModel<T> Do<T>(int code, string message, T body)
        {
            return new ReturnModel<T>(code, message, body);
        }

        /// <summary>
        /// 操作成功
        /// </summary>
        /// <param name="body"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public static ReturnModel<T> Ok<T>(string message = "Ok", T body = default)
        {
            return Do(200, message, body);
        }

        /// <summary>
        /// 操作失败
        /// </summary>
        /// <param name="body"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public static ReturnModel<T> Fail<T>(string message = "Fail", T body = default)
        {
            return Do(0, message, body);
        }

        /// <summary>
        /// 数据未找到，如页面、数据不存在或已删除等
        /// </summary>
        /// <param name="message"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static ReturnModel<T> NotFound<T>(string message = "Not Found", T body = default)
        {
            return Do(404, message, body);
        }

        /// <summary>
        /// 无效请求，如接口参数验证失败等
        /// </summary>
        /// <param name="message"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static ReturnModel<T> BadRequest<T>(string message = "Bad Request", T body = default)
        {
            return Do(400, message, body);
        }

        /// <summary>
        /// 身份验证失败，如未登录等
        /// </summary>
        /// <param name="message"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static ReturnModel<T> AuthenticationFail<T>(string message = "Authentication Fail", T body = default)
        {
            return Do(401, message, body);
        }

        /// <summary>
        /// 权限验证失败，如已登录但没有权限访问数据或模块
        /// </summary>
        /// <param name="message"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static ReturnModel<T> AuthorizationFail<T>(string message = "Authorization Fail", T body = default)
        {
            return Do(403, message, body);
        }

        /// <summary>
        /// 系统异常，500错误
        /// </summary>
        /// <param name="message"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static ReturnModel<T> Exception<T>(string message = "Exception", T body = default)
        {
            return Do(500, message, body);
        }

        /// <summary>
        /// 数据列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="message"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        public static ReturnModel<List<T>> List<T>(string message = "ok", List<T> body = default)
        {
            return new ReturnModel<List<T>>(200, message, body);
        }

        /// <summary>
        /// 分页列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="total"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="body"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public static ReturnModel<PaginationList<T>> PaginationList<T>(long total,
            int pageIndex,
            int pageSize,
            IEnumerable<T> body = default,
            string message = "ok")
        {
            var result = new PaginationList<T> {Data = body, PageIndex = pageIndex, PageSize = pageSize, Total = total};
            return new ReturnModel<PaginationList<T>>(200, message, result);
        }

        #endregion
    }
}
