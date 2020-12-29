using System;
using System.Collections.Generic;

namespace Kyoeis.IdentityCenter.Service.Dto.Department
{
    public class DepartmentTreeDto
    {
        public Guid Id { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }

        public string Path { get; set; }

        public int Level { get; set; }

        public bool IsLeaf { get; set; }

        public int Sort { get; set; }

        public List<DepartmentTreeDto> Children { get; set; }
    }
}
