using FreeSql;
using System;
using System.Collections.Concurrent;

namespace Kyoeis.Data
{
    public class FreeSqlManager
    {
        private static readonly ConcurrentDictionary<string, IFreeSql> Dict =
            new ConcurrentDictionary<string, IFreeSql>();

        private static readonly object Obj = new object();

        /// <summary>
        /// 默认数据库类型，默认为 SqlServer
        /// </summary>
        private const string DefaultFreeSqlName = "Default";

        /// <summary>
        /// 添加数据库
        /// </summary>
        /// <param name="name">IFreeSql实例名称</param>
        /// <param name="type">数据库类型</param>
        /// <param name="connectionString">连接字符串</param>
        /// <param name="configure">FreeSql配置</param>
        /// <returns></returns>
        public static void Add(string name, DataType type, string connectionString, Action<FreeSqlOption> configure = null)
        {
            lock (Obj)
            {
                try
                {
                    var options = new FreeSqlOption();
                    configure?.Invoke(options);

                    var instance = options.Build(type, connectionString);

                    if (Dict.ContainsKey(name))
                    {
                        Dict[name] = instance;
                    }

                    Dict.TryAdd(name, instance);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
        }

        public static void Add(DataType type, string connectionString, Action<FreeSqlOption> configure = null)
        {
            Add(DefaultFreeSqlName, type, connectionString, configure);
        }

        /// <summary>
        /// 获取指定名称的IFreeSql实例
        /// </summary>
        /// <param name="dbName"></param>
        /// <returns></returns>
        public static IFreeSql Get(string dbName = DefaultFreeSqlName)
        {
            lock (Obj)
            {
                if (Dict.TryGetValue(dbName, out var result))
                {
                    return result;
                }
            }

            throw new ArgumentNullException(dbName, "该类型数据库未注册");
        }
    }
}
