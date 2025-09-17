// 代码生成时间: 2025-09-17 11:44:55
const Hapi = require('@hapi/hapi');
const inert = require('@hapi/inert');
const { sanitize: sanitizeHTML } = require('sanitize-html');

// 创建服务器
const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

// 注册inert插件，用于服务静态文件
await server.register(inert);

// 定义路由，用于接收用户输入并返回
server.route({
  method: 'POST',
  path: '/input',
  handler: async (request, h) => {
    try {
      // 提取用户输入
      const userInput = request.payload;
      
      // 清理XSS攻击
      const sanitizedInput = sanitizeHTML(userInput, {
        allowedTags: [], // 允许的标签
        allowedAttributes: {}, // 允许的属性
        allowedSchemes: ['data'], // 允许的数据URL方案
        allowedSchemesByTag: {},
        selfClosing: [],
        allowIframe: false, // 禁止iframe标签
      });
      
      // 返回清理后的用户输入
      return sanitizedInput;
    } catch (error) {
      // 错误处理
      throw Boom.badRequest('Invalid user input');
    }
  }
});

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

// 错误处理
const Boom = require('@hapi/boom');