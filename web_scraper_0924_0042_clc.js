// 代码生成时间: 2025-09-24 00:42:19
const Hapi = require('@hapi/hapi');
const axios = require('axios');
const cheerio = require('cheerio');

// 创建Hapi服务器并启动
async function startServer() {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // 定义路由处理函数
  async function scrapeContent(request, h) {
    try {
      const { url } = request.params;
      // 使用axios抓取网页内容
      const response = await axios.get(url);
      // 使用cheerio解析HTML
      const $ = cheerio.load(response.data);
      // 抓取并返回网页内容
      const content = $('body').html();
      return h.response(content).code(200);
    } catch (error) {
      // 错误处理
      return h.response(error.message).code(500);
    }
  }

  // 添加路由
  server.route({
    method: 'GET',
    path: '/scrape/{url}',
    handler: scrapeContent
  });

  // 启动服务器
  await server.start();
  console.log('Server running on %s', server.info.uri);
}

// 调用startServer函数启动服务器
startServer();

// 注意：确保已经安装了hapi, axios和cheerio库