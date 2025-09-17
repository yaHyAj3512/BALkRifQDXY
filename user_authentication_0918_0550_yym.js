// 代码生成时间: 2025-09-18 05:50:55
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Jwt = require('jsonwebtoken'); // 使用jsonwebtoken进行JWT令牌管理

// 用户数据模拟，实际应用中应从数据库获取
const users = {
    user1: {
        username: 'user1',
        password: 'password1',
        userId: '1'
    }
};

// JWT密钥
const jwtSecret = 'my_secret_key';

// 创建Hapi服务器
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 路由：用户登录
    server.route({
        method: 'POST',
        path: '/login',
        handler: async (request, h) => {
            const { username, password } = request.payload;
            const user = users[username];

            // 验证用户名和密码
            if (!user || user.password !== password) {
                throw Boom.unauthorized('Invalid username or password');
            }

            // 创建JWT令牌
            const token = Jwt.sign({
                userId: user.userId,
                username: user.username
            }, jwtSecret, { expiresIn: '1h' });

            return { token };
        }
    });

    // 路由：受保护的资源
    server.route({
        method: 'GET',
        path: '/protected',
        handler: async (request, h) => {
            const token = request.headers.authorization && request.headers.authorization.split(' ')[1];

            // 验证JWT令牌
            try {
                const decoded = Jwt.verify(token, jwtSecret);
                return {
                    message: 'You have accessed a protected route!',
                    decoded
                };
            } catch (error) {
                throw Boom.unauthorized('Invalid or expired token');
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// 启动服务器
init().catch(err => {
    console.error(err);
    process.exit(1);
});