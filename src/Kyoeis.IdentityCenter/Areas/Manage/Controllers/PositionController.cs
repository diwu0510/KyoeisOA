using Kyoeis.Core;
using Kyoeis.IdentityCenter.Service;
using Kyoeis.IdentityCenter.Service.Cache;
using Kyoeis.IdentityCenter.Service.Data;
using Kyoeis.IdentityCenter.Service.Dto.Position;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Kyoeis.IdentityCenter.Areas.Manage.Controllers
{
    [Area("manage")]
    public class PositionController : Controller
    {
        private readonly PositionService _service;
        private readonly CacheManager _cache;

        public PositionController(PositionService service, CacheManager cache)
        {
            _service = service;
            _cache = cache;
        }

        #region 首页
        public ActionResult Index()
        {
            var companies = _cache.GetCompanies();
            ViewBag.CompanyList = companies;
            return View();
        }

        public ActionResult Get(PositionQueryDto request)
        {
            var data = _service.List(request);
            return Json(ReturnModelUtil.Ok(body: data));
        }
        #endregion

        #region 增
        public async Task<ActionResult> Create(Guid? companyId)
        {
            if (!companyId.HasValue || companyId.Value == Guid.Empty)
            {
                return BadRequest();
            }

            var maxSort = await _service.GetMaxSort(companyId.Value);

            var entity = new PositionEntity
            {
                CompanyId = companyId.Value,
                Sort = ++maxSort
            };

            return View(entity);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create(PositionEntity entity)
        {
            if (!ModelState.IsValid)
            {
                return Json(ReturnModelUtil.BadRequest());
            }

            var result = await _service.CreateAsync(entity, Guid.NewGuid(), "admin");
            return Json(result);
        }
        #endregion

        #region 改
        public async Task<ActionResult> Edit(Guid id)
        {
            var entity = await _service.LoadAsync(id);
            if (entity == null)
            {
                return Json(ReturnModelUtil.NotFound());
            }

            return View(entity);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit(Guid id, PositionEntity entity)
        {
            if (id != entity.Id || !ModelState.IsValid)
            {
                return Json(ReturnModelUtil.BadRequest());
            }

            var result = await _service.UpdateAsync(entity, Guid.NewGuid(), "admin");
            return Json(result);
        }
        #endregion

        #region 删
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Delete(Guid id)
        {
            var result = await _service.DeleteAsync(id);
            return Json(result);
        }
        #endregion

        #region 初始化界面
        #endregion
    }
}
