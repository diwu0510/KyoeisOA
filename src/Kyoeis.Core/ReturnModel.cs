namespace Kyoeis.Core
{
    /// <summary>
    /// 操作结果
    /// </summary>
    public class ReturnModel
    {
        /// <summary>
        /// 结果标识
        /// </summary>
        public int Code { get; set; }

        /// <summary>
        /// 结果说明
        /// </summary>
        public string Message { get; set; }

        public ReturnModel(int code, string message)
        {
            Code = code;
            Message = message;
        }
    }
}
