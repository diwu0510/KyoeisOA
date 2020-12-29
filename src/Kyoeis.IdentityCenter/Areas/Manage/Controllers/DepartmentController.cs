using Kyoeis.Core;
using Kyoeis.IdentityCenter.Service;
using Kyoeis.IdentityCenter.Service.Cache;
using Kyoeis.IdentityCenter.Service.Data;
using Kyoeis.IdentityCenter.Service.Dto.Department;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Kyoeis.IdentityCenter.Areas.Manage.Controllers
{
    [Area("Manage")]
    public class DepartmentController : Controller
    {
        private readonly DepartmentService _service;
        private readonly CacheManager _cache;

        public DepartmentController(DepartmentService service, CacheManager cache)
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

        public ActionResult Get(DepartmentQueryDto request)
        {
            var data = _service.List(request);
            return Json(ReturnModelUtil.Ok(body: data));
        }
        #endregion

        #region 增
        public ActionResult Create(Guid? companyId)
        {
            if (!companyId.HasValue || companyId.Value == Guid.Empty)
            {
                return BadRequest();
            }

            var entity = new DepartmentEntity
            {
                CompanyId = companyId.Value
            };

            var departments = _service.List(new DepartmentQueryDto {CompanyId = companyId.Value});
            ViewBag.Departments = departments.Select(x => new SelectListItem(BuildTreeNodeTitle(x.Name, x.Level), x.Id.ToString())).ToList();
            return View(entity);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create(DepartmentEntity entity)
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

            var departments = _service.List(new DepartmentQueryDto { CompanyId = entity.CompanyId });
            ViewBag.Departments = departments.Select(x => new SelectListItem(BuildTreeNodeTitle(x.Name, x.Level), x.Id.ToString())).ToList();

            return View(entity);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit(Guid id, DepartmentEntity entity)
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
        private string BuildTreeNodeTitle(string name, int level)
        {
            var sb = new StringBuilder();

            if (level > 1)
            {
                for (var i = 0; i < level; i++)
                {
                    sb.Append(HttpUtility.HtmlDecode("&nbsp;&nbsp;&nbsp;&nbsp;"));
                }

                sb.Append("|- ");
            }

            sb.Append(name);
            return sb.ToString();
        }
        #endregion
    }
}
