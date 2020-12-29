using Kyoeis.Core;
using Kyoeis.IdentityCenter.Service.Cache;
using Kyoeis.IdentityCenter.Service.Data;
using Kyoeis.Utility.Hash;
using System;
using System.Threading.Tasks;
using Kyoeis.Data;

namespace Kyoeis.IdentityCenter.Service
{
    public class UserService : BaseService
    {
        private readonly IFreeSql _db;
        private readonly CacheManager _cache;

        public UserService(CacheManager cache)
        {
            _db = FreeSqlManager.Get();
            _cache = cache;
        }

        #region 增

        public async Task<ReturnModel> CreateAsync(UserEntity entity, Guid userId, string userName)
        {
            entity.Salt = new Random().Next(100000, 999999).ToString();
            entity.Password = Md5Util.Encrypt($"{entity.Password}{entity.Salt}");

            SetCreateAudit(entity, userId, userName);
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Insert(entity).ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.User);
            return ReturnModelUtil.Ok();
        }

        #endregion

        #region 改
        public async Task<ReturnModel> UpdateAsync(UserEntity entity, Guid userId, string userName)
        {
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Update<UserEntity>(entity)
                .IgnoreColumns(x => x.Password)
                .IgnoreColumns(x => x.Salt)
                .ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.User);
            return ReturnModelUtil.Ok();
        }
        #endregion

        #region 删
        public async Task<ReturnModel> DeleteAsync(Guid id)
        {
            var row = await _db.Update<UserEntity>(id)
                .Set(x => x.IsDeleted, true)
                .ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.Clear(CacheKey.User);
            return ReturnModelUtil.Ok();
        }
        #endregion

        #region 查

        public PaginationList<UserEntity> List(int pageIndex = 1, int pageSize = 20)
        {
            var data = _db.Select<UserEntity>()
                .Count(out var total)
                .Page(pageIndex, pageSize)
                .ToList();

            return new PaginationList<UserEntity>
            { Data = data, PageSize = pageSize, PageIndex = pageIndex, Total = total };
        }

        public async Task<UserEntity> LoadAsync(Guid id)
        {
            return await _db.Select<UserEntity>()
                .Where(x => x.Id == id && x.IsDeleted == false)
                .ToOneAsync();
        }

        #endregion
    }
}
