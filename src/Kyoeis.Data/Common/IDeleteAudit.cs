using System;

namespace Kyoeis.Data.Common
{
    public interface IDeleteAudit
    {
        /// <summary>
        /// 删除时间
        /// </summary>
        DateTime? DeleteTime { get; set; }

        /// <summary>
        /// 删除人姓名
        /// </summary>
        string Deleter { get; set; }

        /// <summary>
        /// 删除人ID
        /// </summary>
        Guid? DeleteBy { get; set; }
    }
}
