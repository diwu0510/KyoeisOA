using Kyoeis.Core;
using Kyoeis.IdentityCenter.Service;
using Kyoeis.IdentityCenter.Service.Cache;
using Kyoeis.IdentityCenter.Service.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Kyoeis.IdentityCenter.Areas.Manage.Controllers
{
    [Area("Manage")]
    public class CompanyController : Controller
    {
        private readonly CompanyService _service;
        private readonly CacheManager _cache;

        public CompanyController(CompanyService service, CacheManager cache)
        {
            _service = service;
            _cache = cache;
        }

        #region 首页
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Get()
        {
            var data = _cache.GetCompanies();
            return Json(ReturnModelUtil.List(body: data));
        }
        #endregion

        #region 增
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create(CompanyEntity entity)
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
        public async Task<ActionResult> Edit(Guid id, CompanyEntity entity)
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
    }
}
