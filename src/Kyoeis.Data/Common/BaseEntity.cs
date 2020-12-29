using System;

namespace Kyoeis.Data.Common
{
    public class BaseEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
    }
}
