namespace Kyoeis.Core
{
    /// <summary>
    /// 带返回值的操作结果实体
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ReturnModel<T> : ReturnModel
    {
        public T Result { get; set; }

        public ReturnModel(int code, string message, T body) : base(code, message)
        {
            Result = body;
        }
    }
}
