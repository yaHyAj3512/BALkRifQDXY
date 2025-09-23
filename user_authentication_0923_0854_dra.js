// 代码生成时间: 2025-09-23 08:54:54
const Hapi = require('hapi');
const Jwt = require('jsonwebtoken');
const Boom = require('boom');
const config = require('./config'); // 假设有一个配置文件用于存放敏感信息

// 用户身份认证插件
function userAuth(server) {
  // 插件注册
  server.auth.scheme('custom', {
    access: function(credentials, callback) {
      try {
        // 验证JWT令牌
        const decoded = Jwt.verify(credentials.token, config.JWT_SECRET);
        // 找到用户并返回
        // 这里假设有一个函数getUserByUsername，你需要自己实现它
        const user = getUserByUsername(decoded.username);
        if (user) {
          credentials.user = user;
          return callback(null, true);
        } else {
          return callback(Boom.unauthorized('User not found'));
        }
      } catch (error) {
        return callback(Boom.unauthorized('Invalid token'));
      }
    }
  });

  // 使用插件
  server.auth.strategy('default', 'custom');
}

// 启动服务器
const server = new Hapi.Server({
  host: 'localhost',
  port: 3000
});

server.register(userAuth);

// 身份认证路由
server.route({
  method: 'GET',
  path: '/api/protected',
  config: {
    auth: 'default',
    handler: (request, h) => {
      return 'You\'re authenticated!';
    }
  }
});

// 辅助函数：根据用户名查找用户
function getUserByUsername(username) {
  // 这里应该从数据库或其他存储中查找用户信息
  // 为了示例简单，我们假设有一个用户列表
  const users = [{
    username: 'testUser',
    password: 'testPass',
    id: 1
  }];
  return users.find(user => user.username === username);
}

// 启动服务器
async function start() {
  try {
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();

// 导出用户身份认证插件
module.exports = userAuth;
