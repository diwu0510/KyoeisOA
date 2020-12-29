using Kyoeis.Core;
using Kyoeis.Data;
using Kyoeis.IdentityCenter.Service.Cache;
using Kyoeis.IdentityCenter.Service.Data;
using Kyoeis.IdentityCenter.Service.Dto.Application;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Kyoeis.IdentityCenter.Service
{
    public class ApplicationService : BaseService
    {
        private readonly IFreeSql _db;
        private readonly CacheManager _cache;

        public ApplicationService(CacheManager cache)
        {
            _db = FreeSqlManager.Get();
            _cache = cache;
        }

        #region 增

        public async Task<ReturnModel> CreateAsync(ApplicationEntity entity, Guid userId, string userName)
        {
            SetCreateAudit(entity, userId, userName);
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Insert(entity).ExecuteAffrowsAsync();

            if (row <= 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Application);
            return ReturnModelUtil.Ok();
        }

        #endregion

        #region 改

        public async Task<ReturnModel> UpdateAsync(ApplicationEntity entity, Guid userId, string userName)
        {
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Update<ApplicationEntity>()
                .SetSource(entity).ExecuteAffrowsAsync();

            if (row <= 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Application);
            return ReturnModelUtil.Ok();
        }

        #endregion

        #region 删

        public async Task<ReturnModel> DeleteAsync(Guid id)
        {
            var row = await _db.Update<ApplicationEntity>(id)
                .Set(x => x.IsDeleted, true)
                .ExecuteAffrowsAsync();

            if (row <= 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.Application);
            return ReturnModelUtil.Ok();
        }

        #endregion

        #region 查

        public PaginationList<ApplicationEntity> List(int pageIndex = 1, int pageSize = 20)
        {
            var data = _db.Select<ApplicationEntity>()
                .Count(out var total)
                .Page(pageIndex, pageSize)
                .ToList();

            return new PaginationList<ApplicationEntity>
            { Data = data, PageSize = pageSize, PageIndex = pageIndex, Total = total };
        }

        public async Task<ApplicationEntity> LoadAsync(Guid id)
        {
            return await _db.Select<ApplicationEntity>()
                .Where(x => x.Id == id && x.IsDeleted == false)
                .ToOneAsync();
        } 

        #endregion

        #region 验证请求

        public async Task<ReturnModel<ApplicationDto>> CheckClient(CheckClientRequest request)
        {
            // 验证请求
            if (string.IsNullOrWhiteSpace(request.client_id) ||
                string.IsNullOrWhiteSpace(request.client_secret))
            {
                return ReturnModelUtil.BadRequest<ApplicationDto>();
            }

            var entity = _cache.GetApplications()
                .SingleOrDefault(x => x.ClientId == request.client_id && x.ClientSecret == request.client_secret);

            // client 不存在
            if (entity == null)
            {
                return ReturnModelUtil.NotFound<ApplicationDto>();
            }

            // client 被禁用
            if (!entity.IsEnabled)
            {
                return ReturnModelUtil.Fail<ApplicationDto>("The application is disabled");
            }

            // 验证作用域，先拿到该用户所有可用的作用域
            // 遍历请求的每个作用域，如果可用作用域中不包含该作用域，直接返回失败
            var scopeIds = await _db.Select<ApplicationScopeEntity>()
                .Where(x => x.ApplicationId == entity.Id)
                .ToListAsync(x => x.ScopeId);

            var allScopes = _cache.GetScopes()
                .Where(x => scopeIds.Contains(x.Id))
                .Select(x => x.Code)
                .ToList();

            var requestScopes = request.scopes.Split(',');

            if (requestScopes.Any(rs => !allScopes.Contains(rs)))
            {
                return ReturnModelUtil.Fail<ApplicationDto>("The request scope out of range");
            }

            return ReturnModelUtil.Ok(body: entity);
        }
        #endregion
    }
}
