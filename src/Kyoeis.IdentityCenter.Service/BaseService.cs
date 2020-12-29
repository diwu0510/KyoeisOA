using Kyoeis.Data.Common;
using System;

namespace Kyoeis.IdentityCenter.Service
{
    public class BaseService
    {
        protected void SetCreateAudit(ICreateAudit entity, Guid userId, string userName)
        {
            entity.CreateTime = DateTime.Now;
            entity.CreateBy = userId;
            entity.Creator = userName;
        }

        protected void SetUpdateAudit(IUpdateAudit entity, Guid userId, string userName)
        {
            entity.UpdateTime = DateTime.Now;
            entity.UpdateBy = userId;
            entity.Updater = userName;
        }

        protected void SetUpdateAudit(IDeleteAudit entity, Guid userId, string userName)
        {
            entity.DeleteTime = DateTime.Now;
            entity.DeleteBy = userId;
            entity.Deleter = userName;
        }
    }
}
