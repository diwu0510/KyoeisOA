using Kyoeis.Core;
using Kyoeis.Data;
using Kyoeis.IdentityCenter.Service.Cache;
using Kyoeis.IdentityCenter.Service.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Kyoeis.IdentityCenter.Service
{
    public class ScopeService : BaseService
    {
        private readonly IFreeSql _db;
        private readonly CacheManager _cache;

        public ScopeService(CacheManager cache)
        {
            _db = FreeSqlManager.Get();
            _cache = cache;
        }

        #region 增

        public async Task<ReturnModel> CreateAsync(ScopeEntity entity, Guid userId, string userName)
        {
            SetCreateAudit(entity, userId, userName);
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Insert(entity).ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Scope);
            return ReturnModelUtil.Ok();
        }

        #endregion

        #region 改
        public async Task<ReturnModel> UpdateAsync(ScopeEntity entity, Guid userId, string userName)
        {
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Update<ScopeEntity>().SetSource(entity).ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Scope);
            return ReturnModelUtil.Ok();
        }
        #endregion

        #region 删
        public async Task<ReturnModel> DeleteAsync(Guid id)
        {
            var row = await _db.Update<ScopeEntity>(id)
                .Set(x => x.IsDeleted, true)
                .ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Scope);
            return ReturnModelUtil.Ok();
        }
        #endregion

        #region 查

        public PaginationList<ScopeEntity> PageList(int pageIndex = 1, int pageSize = 20)
        {
            var data = _db.Select<ScopeEntity>()
                .OrderByDescending(x => x.UpdateTime)
                .Count(out var total)
                .Page(pageIndex, pageSize)
                .ToList();

            return new PaginationList<ScopeEntity>
            { Data = data, PageSize = pageSize, PageIndex = pageIndex, Total = total };
        }

        public List<ScopeEntity> List()
        {
            var data = _db.Select<ScopeEntity>()
                .OrderByDescending(x => x.UpdateTime)
                .ToList();

            return data;
        }

        public async Task<ScopeEntity> LoadAsync(Guid id)
        {
            return await _db.Select<ScopeEntity>()
                .Where(x => x.Id == id && x.IsDeleted == false)
                .ToOneAsync();
        } 

        #endregion
    }
}
