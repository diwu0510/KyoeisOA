using AutoMapper;
using Kyoeis.Core;
using Kyoeis.Data;
using Kyoeis.Data.Utility;
using Kyoeis.IdentityCenter.Service.Cache;
using Kyoeis.IdentityCenter.Service.Data;
using Kyoeis.IdentityCenter.Service.Dto.Department;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Kyoeis.IdentityCenter.Service
{
    public class DepartmentService : BaseService
    {
        private readonly IFreeSql _db;
        private readonly CacheManager _cache;
        private readonly IMapper _mapper;
        private static readonly ConcurrentDictionary<Guid, List<DepartmentTreeDto>> Dict = new ConcurrentDictionary<Guid, List<DepartmentTreeDto>>();

        public DepartmentService(CacheManager cache, IMapper mapper)
        {
            _db = FreeSqlManager.Get();
            _cache = cache;
            _mapper = mapper;
        }

        #region 增

        public async Task<ReturnModel> CreateAsync(DepartmentEntity entity, Guid userId, string userName)
        {
            SetCreateAudit(entity, userId, userName);
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Insert(entity).ExecuteAffrowsAsync();
            
            if (row == 0) return ReturnModelUtil.Fail("fail");

            var dto = _mapper.Map<DepartmentDto>(entity);
            _cache.SetDepartment(entity.Id, dto);

            Dict.TryRemove(entity.CompanyId, out _);
            
            return ReturnModelUtil.Ok();
        }

        #endregion

        #region 改
        public async Task<ReturnModel> UpdateAsync(DepartmentEntity entity, Guid userId, string userName)
        {
            SetUpdateAudit(entity, userId, userName);

            var row = await _db.Update<DepartmentEntity>().SetSource(entity).ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            var dto = _mapper.Map<DepartmentDto>(entity);
            _cache.SetDepartment(entity.Id, dto);

            Dict.TryRemove(entity.CompanyId, out _);

            return ReturnModelUtil.Ok();
        }
        #endregion

        #region 删
        public async Task<ReturnModel> DeleteAsync(Guid id)
        {
            var entity = await _db.Select<DepartmentEntity>().Where(x => x.Id == id).ToOneAsync();
            if (entity == null)
            {
                return ReturnModelUtil.NotFound();
            }

            var count = await _db.Select<DepartmentEntity>().Where(x => x.ParentId == id).CountAsync();

            if (count > 0)
            {
                return ReturnModelUtil.BadRequest("下属部门不为空");
            }

            var row = await _db.Update<DepartmentEntity>(id)
                .Set(x => x.IsDeleted, true)
                .ExecuteAffrowsAsync();

            if (row == 0) return ReturnModelUtil.Fail("fail");

            _cache.RemoveDepartment(id);

            Dict.TryRemove(entity.CompanyId, out _);

            return ReturnModelUtil.Ok();
        }
        #endregion

        #region 查

        public PaginationList<DepartmentEntity> PageList(DepartmentQueryDto query, int pageIndex = 1, int pageSize = 20)
        {
            var where = ExpressionUtil.True<DepartmentEntity>();
            if (query.CompanyId.HasValue)
            {
                where = where.And(x => x.CompanyId == query.CompanyId.Value);
            }

            if (!string.IsNullOrWhiteSpace(query.Key))
            {
                query.Key = query.Key.Trim();
                where = where.And(x => x.Name.Contains(query.Key) || x.Code.Contains(query.Key));
            }

            var data = _db.Select<DepartmentEntity>()
                .Where(where)
                .Count(out var total)
                .OrderBy(x => x.CompanyId)
                .OrderBy(x => x.Sort)
                .Page(pageIndex, pageSize)
                .ToList();

            return new PaginationList<DepartmentEntity>
            { Data = data, PageSize = pageSize, PageIndex = pageIndex, Total = total };
        }

        public List<DepartmentTreeDto> List(DepartmentQueryDto query)
        {
            if (query.CompanyId.HasValue)
            {
                if (Dict.ContainsKey(query.CompanyId.Value))
                {
                    return Dict[query.CompanyId.Value];
                }
            }

            Expression<Func<DepartmentEntity, bool>> where = x => true;
            if (query.CompanyId.HasValue)
            {
                where = where.And(x => x.CompanyId == query.CompanyId.Value);
            }

            if (!string.IsNullOrWhiteSpace(query.Key))
            {
                query.Key = query.Key.Trim();
                where = where.And(x => x.Name.Contains(query.Key) || x.Code.Contains(query.Key));
            }

            var data = _db.Select<DepartmentEntity>()
                .Where(where)
                .OrderBy(x => x.CompanyId)
                .OrderBy(x => x.Sort)
                .ToList();

            var treeData = new List<DepartmentTreeDto>();
            BuildTree(data, null, treeData);

            if (!query.CompanyId.HasValue) return treeData;

            if (Dict.ContainsKey(query.CompanyId.Value))
            {
                Dict[query.CompanyId.Value] = treeData;
            }
            else
            {
                Dict.TryAdd(query.CompanyId.Value, treeData);
            }

            return treeData;
        }

        public async Task<DepartmentEntity> LoadAsync(Guid id)
        {
            return await _db.Select<DepartmentEntity>()
                .Where(x => x.Id == id && x.IsDeleted == false)
                .ToOneAsync();
        }

        public async Task<int> GetMaxSort(Guid companyId)
        {
            return await _db.Select<DepartmentEntity>()
                .Where(x => x.ParentId == companyId)
                .MaxAsync(x => x.Sort);
        }

        #endregion

        #region 树形

        public List<DepartmentTreeDto> BuildTree(List<DepartmentEntity> source, Guid? parentId, List<DepartmentTreeDto> result, string path = "", int level = 1)
        {
            var roots = source.Where(x => x.ParentId == parentId)
                .OrderBy(x => x.Sort).ToList();

            foreach (var root in roots)
            {
                var dto = new DepartmentTreeDto
                {
                    Id = root.Id,
                    Name = root.Name,
                    Path = path + "," + root.Id,
                    Code = root.Code,
                    Level = level,
                    Sort = root.Sort
                };

                result.Add(dto);

                if (source.Any(x => x.ParentId == root.Id))
                {
                    dto.IsLeaf = false;
                    level++;
                    BuildTree(source, root.Id, result, dto.Path, level);
                    level--;
                }
                else
                {
                    dto.IsLeaf = true;
                }
            }

            return result;
        }

        #endregion
    }
}
