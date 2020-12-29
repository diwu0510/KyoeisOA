using Kyoeis.Data.Common;

namespace Kyoeis.IdentityCenter.Service.Dto.Scope
{
    /// <summary>
    /// 作用域的缓存项
    /// </summary>
    public class ScopeDto : BaseEntity
    {
        public string Code { get; set; }

        public string Name { get; set; }
    }
}
