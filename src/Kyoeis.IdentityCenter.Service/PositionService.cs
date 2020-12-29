using Kyoeis.Core;
using Kyoeis.Data;
using Kyoeis.IdentityCenter.Service.Cache;
using Kyoeis.IdentityCenter.Service.Data;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Kyoeis.Data.Utility;
using Kyoeis.IdentityCenter.Service.Dto.Position;

namespace Kyoeis.IdentityCenter.Service
{
    public class PositionService : BaseService
    {
        private readonly IFreeSql _db;
        private readonly CacheManager _cache;

        public PositionService(CacheManager cache)
        {
            _db = FreeSqlManager.Get();
            _cache = cache;
        }

        #region 增

        public async Task<ReturnModel> CreateAsync(PositionEntity entity, Guid userId, string userName)
        {
            SetCreateAudit(entity, userId, userName);
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Insert(entity).ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Position);
            return ReturnModelUtil.Ok();
        }

        #endregion

        #region 改
        public async Task<ReturnModel> UpdateAsync(PositionEntity entity, Guid userId, string userName)
        {
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Update<PositionEntity>().SetSource(entity).ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Position);
            return ReturnModelUtil.Ok();
        }
        #endregion

        #region 删
        public async Task<ReturnModel> DeleteAsync(Guid id)
        {
            var row = await _db.Update<PositionEntity>(id)
                .Set(x => x.IsDeleted, true)
                .ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Position);
            return ReturnModelUtil.Ok();
        }
        #endregion

        #region 查

        public PaginationList<PositionEntity> PageList(int pageIndex = 1, int pageSize = 20)
        {
            var data = _db.Select<PositionEntity>()
                .Count(out var total)
                .Page(pageIndex, pageSize)
                .ToList();

            return new PaginationList<PositionEntity>
            { Data = data, PageSize = pageSize, PageIndex = pageIndex, Total = total };
        }

        public List<PositionEntity> List(PositionQueryDto query)
        {
            var where = ExpressionUtil.True<PositionEntity>();

            if (query.CompanyId.HasValue)
            {
                where = where.And(x => x.CompanyId == query.CompanyId.Value);
            }

            var data = _db.Select<PositionEntity>()
                .Where(where)
                .OrderBy(x => x.Sort)
                .ToList();

            return data;
        }

        public async Task<PositionEntity> LoadAsync(Guid id)
        {
            return await _db.Select<PositionEntity>()
                .Where(x => x.Id == id && x.IsDeleted == false)
                .ToOneAsync();
        }

        public async Task<int> GetMaxSort(Guid? companyId)
        {
            var where = ExpressionUtil.True<PositionEntity>();
            if (companyId.HasValue)
            {
                where = where.And(x => x.CompanyId == companyId.Value);
            }
            return await _db.Select<PositionEntity>()
                .Where(where)
                .MaxAsync(x => x.Sort);
        }

        #endregion
    }
}
