using FreeSql;
using FreeSql.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Common;
using System.Linq;

namespace Kyoeis.Data
{
    public class FreeSqlOption
    {
        /// <summary>
        /// 从数据库连接字符串
        /// </summary>
        public IEnumerable<string> SlaveDatabases { get; set; }

        /// <summary>
        /// 模型的修改是否自动同步到数据库
        /// </summary>
        public bool AutoSyncStructure { get; set; }

        /// <summary>
        /// 是否开启延时加载
        /// </summary>
        public bool UseLazyLoading { get; set; }

        /// <summary>
        /// SQL参数化
        /// </summary>
        public bool UseGenerateCommandParameterWithLambda { get; set; }

        /// <summary>
        /// 命令执行前的操作
        /// </summary>
        public Action<DbCommand> MonitorBeforeExecute { get; set; }

        /// <summary>
        /// 命令执行后的操作
        /// </summary>
        public Action<DbCommand, string> MonitorAfterExecute { get; set; }

        /// <summary>
        /// AOP配置
        /// </summary>
        public Action<IAop> AopConfigure { get; set; }

        /// <summary>
        /// 全局过滤器
        /// </summary>
        public Action<GlobalFilter> GlobalFilterConfigure { get; set; }

        public IFreeSql Build(DataType dataType, string connectionString)
        {
            if (string.IsNullOrWhiteSpace(connectionString))
                throw new ArgumentNullException(nameof(connectionString));

            if (!Enum.IsDefined(typeof(DataType), dataType))
                throw new InvalidEnumArgumentException(nameof(dataType), (int)dataType, typeof(DataType));

            var builder = new FreeSqlBuilder();

            builder.UseAutoSyncStructure(AutoSyncStructure);

            builder.UseGenerateCommandParameterWithLambda(UseGenerateCommandParameterWithLambda);

            if (MonitorBeforeExecute != null &&
                MonitorAfterExecute != null)
            {
                builder.UseMonitorCommand(MonitorBeforeExecute, MonitorAfterExecute);
            }
            else if (MonitorBeforeExecute != null)
            {
                builder.UseMonitorCommand(MonitorBeforeExecute);
            }
            else if (MonitorAfterExecute != null)
            {
                builder.UseMonitorCommand(null, MonitorAfterExecute);
            }

            if (SlaveDatabases != null && SlaveDatabases.Any())
            {
                builder.UseSlave(SlaveDatabases.ToArray());
            }

            builder.UseLazyLoading(UseLazyLoading);

            builder.UseConnectionString(dataType, connectionString);

            var fs = builder.Build();

            AopConfigure?.Invoke(fs.Aop);

            GlobalFilterConfigure?.Invoke(fs.GlobalFilter);

            return fs;
        }
    }
}
