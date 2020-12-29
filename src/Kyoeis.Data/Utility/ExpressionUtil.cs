using System;
using System.Linq.Expressions;

namespace Kyoeis.Data.Utility
{
    public class ExpressionUtil
    {
        public static Expression<Func<TEntity, bool>> True<TEntity>()
        {
            Expression<Func<TEntity, bool>> expr = x => true;
            return expr;
        }

        public static Expression<Func<TEntity, bool>> False<TEntity>()
        {
            Expression<Func<TEntity, bool>> expr = x => false;
            return expr;
        }
    }
}
