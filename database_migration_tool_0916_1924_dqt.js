// 代码生成时间: 2025-09-16 19:24:58
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const { MongoClient } = require('mongodb');
const { Migrations } = require('hapi-mongodb-migrations');

// 配置数据库连接和迁移
const mongoUri = 'mongodb://localhost:27017';
const dbName = 'myapp';
const client = new MongoClient(mongoUri);

// 异步函数用于初始化数据库和HAPI服务器
async function startServer() {
  try {
    // 连接到数据库
    await client.connect();
    const db = client.db(dbName);
    const migrations = new Migrations(db);

    // 创建一个新的HAPI服务器
    const server = Hapi.server({
      port: 3000,
      host: 'localhost',
    });

    // 注册迁移插件
    await server.register({
      plugin: Migrations.HapiPlugin,
      options: {
        migrations,
        // 定义迁移文件所在的目录
        migrationsDirectory: './migrations',
      },
    });

    // 启动服务器
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

// 调用启动服务器的函数
startServer();

// HAPI服务器停止函数
async function stopServer() {
  try {
    // 停止服务器
    await server.stop({ timeout: 5000 });
    // 断开数据库连接
    await client.close();
    console.log('Server stopped.');
  } catch (error) {
    console.error('Failed to stop server:', error);
  }
}

// 暴露停止服务器的函数
module.exports = {
  startServer,
  stopServer,
};

// 请注意：
// 1. 确保'@hapi/hapi', 'joi', 'mongodb', 和 'hapi-mongodb-migrations' 已经安装。
// 2. 迁移文件需要放置在'migrations'目录下，并且遵循特定的格式。
// 3. 本代码示例不包含具体的迁移文件，需要用户自行创建。
