using AutoMapper;
using Kyoeis.IdentityCenter.Service.Data;
using Kyoeis.IdentityCenter.Service.Dto.Department;

namespace Kyoeis.IdentityCenter.Service
{
    public class IdentityCenterServiceProfile : Profile
    {
        public IdentityCenterServiceProfile()
        {
            CreateMap<DepartmentEntity, DepartmentDto>();
        }
    }
}
