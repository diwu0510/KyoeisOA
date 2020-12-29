using Kyoeis.Core;
using Kyoeis.IdentityCenter.Service.Cache;
using Kyoeis.IdentityCenter.Service.Data;
using System;
using System.Threading.Tasks;
using Kyoeis.Data;

namespace Kyoeis.IdentityCenter.Service
{
    public class CompanyService : BaseService
    {
        private readonly IFreeSql _db;
        private readonly CacheManager _cache;

        public CompanyService(CacheManager cache)
        {
            _db = FreeSqlManager.Get();
            _cache = cache;
        }

        #region 增

        public async Task<ReturnModel> CreateAsync(CompanyEntity entity, Guid userId, string userName)
        {
            SetCreateAudit(entity, userId, userName);
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Insert(entity).ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Company);
            return ReturnModelUtil.Ok();
        }

        #endregion

        #region 改
        public async Task<ReturnModel> UpdateAsync(CompanyEntity entity, Guid userId, string userName)
        {
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Update<CompanyEntity>()
                .SetSource(entity)
                .ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Company);
            return ReturnModelUtil.Ok();
        }
        #endregion

        #region 删
        public async Task<ReturnModel> DeleteAsync(Guid id)
        {
            var row = await _db.Update<CompanyEntity>(id)
                .Set(x => x.IsDeleted, true)
                .ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Company);
            return ReturnModelUtil.Ok();
        }
        #endregion

        #region 查

        public PaginationList<CompanyEntity> List(int pageIndex = 1, int pageSize = 20)
        {
            var data = _db.Select<CompanyEntity>()
                .Count(out var total)
                .Page(pageIndex, pageSize)
                .ToList();

            return new PaginationList<CompanyEntity>
            { Data = data, PageSize = pageSize, PageIndex = pageIndex, Total = total };
        }

        public async Task<CompanyEntity> LoadAsync(Guid id)
        {
            return await _db.Select<CompanyEntity>()
                .Where(x => x.Id == id)
                .ToOneAsync();
        }

        #endregion
    }
}
