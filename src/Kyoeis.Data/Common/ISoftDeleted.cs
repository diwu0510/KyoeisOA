namespace Kyoeis.Data.Common
{
    /// <summary>
    /// 软删除
    /// </summary>
    public interface ISoftDeleted
    {
        /// <summary>
        /// 是否已删除
        /// </summary>
        bool IsDeleted { get; set; }
    }
}
