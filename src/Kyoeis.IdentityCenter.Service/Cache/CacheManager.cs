using Kyoeis.IdentityCenter.Service.Data;
using Kyoeis.IdentityCenter.Service.Dto.Application;
using Kyoeis.IdentityCenter.Service.Dto.Company;
using Kyoeis.IdentityCenter.Service.Dto.Scope;
using Kyoeis.IdentityCenter.Service.Dto.User;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using Kyoeis.Data;
using Kyoeis.IdentityCenter.Service.Dto.Department;

namespace Kyoeis.IdentityCenter.Service.Cache
{
    public class CacheManager
    {
        private readonly IFreeSql _db;

        private readonly IDistributedCache _cache;

        public CacheManager(IDistributedCache cache)
        {
            _db = FreeSqlManager.Get();
            _cache = cache;
        }

        /// <summary>
        /// 清理指定key的缓存
        /// </summary>
        /// <param name="key"></param>
        public void Clear(string key)
        {
            _cache.Remove(key);
        }

        #region Scope 作用域

        public List<ScopeDto> GetScopes()
        {
            var cache = _cache.Get(CacheKey.Scope);

            if (cache != null)
                return JsonConvert.DeserializeObject<List<ScopeDto>>(Encoding.UTF8.GetString(cache));

            var data = _db.Select<ScopeEntity>()
                .ToList(x => new ScopeDto
                {
                    Id = x.Id,
                    Code = x.Code,
                    Name = x.Name
                });

            var option = new DistributedCacheEntryOptions
            {
                AbsoluteExpiration = DateTimeOffset.Now.AddHours(1)
            };

            _cache.Set(CacheKey.Scope, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(data)), option);
            return data;
        }

        #endregion

        #region Application 应用

        public List<ApplicationDto> GetApplications()
        {
            var cache = _cache.Get(CacheKey.Application);

            if (cache != null)
                return JsonConvert.DeserializeObject<List<ApplicationDto>>(Encoding.UTF8.GetString(cache));

            var data = _db.Select<ApplicationEntity>()
                .Where(x => x.IsDeleted == false)
                .ToList(x => new ApplicationDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    ClientId = x.ClientId,
                    ClientSecret = x.ClientSecret,
                    IsEnabled = x.IsEnabled,
                    Remark = x.Remark
                });

            var option = new DistributedCacheEntryOptions
            {
                AbsoluteExpiration = DateTimeOffset.Now.AddHours(1)
            };

            _cache.Set(CacheKey.Application, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(data)), option);
            return data;
        }

        #endregion

        #region Company 公司

        public List<CompanyDto> GetCompanies()
        {
            var cache = _cache.Get(CacheKey.Company);

            if (cache != null)
                return JsonConvert.DeserializeObject<List<CompanyDto>>(Encoding.UTF8.GetString(cache));

            var data = _db.Select<CompanyEntity>()
                .OrderByDescending(x => x.UpdateTime)
                .ToList(x => new CompanyDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Code = x.Code,
                    Address = x.Address,
                    Remark = x.Remark
                });

            var option = new DistributedCacheEntryOptions
            {
                AbsoluteExpiration = DateTimeOffset.Now.AddHours(1)
            };

            _cache.Set(CacheKey.Company, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(data)), option);
            return data;
        }

        #endregion

        #region Department 部门

        public void SetDepartment(Guid id, DepartmentDto dto)
        {
            var key = $"{CacheKey.DepartmentPrefix}{id}";
            _cache.Set(key, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(dto)));
        }

        public DepartmentDto GetDepartment(Guid id)
        {
            var key = $"{CacheKey.DepartmentPrefix}{id}";
            var bytes = _cache.Get(key);
            return bytes == null ? null : JsonConvert.DeserializeObject<DepartmentDto>(Encoding.UTF8.GetString(bytes));
        }

        public void RemoveDepartment(Guid id)
        {
            var key = $"{CacheKey.DepartmentPrefix}{id}";
            _cache.Remove(key);
        }

        public void SetLeader(Guid departmentId, Guid userId)
        {
            var key = $"{CacheKey.DepartmentLeaderPrefix}{departmentId}";
            _cache.Set(key, Encoding.UTF8.GetBytes(userId.ToString()));
        }

        public Guid GetLeader(Guid departmentId)
        {
            var key = $"{CacheKey.DepartmentLeaderPrefix}{departmentId}";
            var bytes = _cache.Get(key);
            return bytes == null ? Guid.Empty : new Guid(Encoding.UTF8.GetString(bytes));
        }

        public void SetManager(Guid departmentId, Guid userId)
        {
            var key = $"{CacheKey.DepartmentManagerPrefix}{departmentId}";
            _cache.Set(key, Encoding.UTF8.GetBytes(userId.ToString()));
        }

        public Guid GetManager(Guid departmentId)
        {
            var key = $"{CacheKey.DepartmentManagerPrefix}{departmentId}";
            var bytes = _cache.Get(key);
            return bytes == null ? Guid.Empty : new Guid(Encoding.UTF8.GetString(bytes));
        }

        public void SetDepartmentList(List<DepartmentTreeDto> departmentList)
        {
            _cache.Set(CacheKey.DepartmentList, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(departmentList)));
        }
        #endregion

        #region User 用户

        public List<UserDto> GetUsers()
        {
            var cache = _cache.Get(CacheKey.User);

            if (cache != null)
                return JsonConvert.DeserializeObject<List<UserDto>>(Encoding.UTF8.GetString(cache));

            var data = _db.Select<UserEntity>()
                .Where(x => x.IsDeleted == false)
                .ToList(x => new UserDto
                {
                    Id = x.Id,
                    Code = x.Code,
                    ChineseName = x.ChineseName,
                    EnglishName = x.EnglishName,
                    DepartmentId = x.DepartmentId,
                    Mobile = x.Mobile,
                    Email = x.Email,
                    Address = x.Address,
                    IsOnJob = x.IsOnJob,
                    PositionId = x.PositionId
                });

            var option = new DistributedCacheEntryOptions
            {
                AbsoluteExpiration = DateTimeOffset.Now.AddHours(1)
            };

            _cache.Set(CacheKey.Scope, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(data)), option);
            return data;
        }

        #endregion
    }
}
