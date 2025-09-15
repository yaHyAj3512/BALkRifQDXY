// 代码生成时间: 2025-09-15 23:44:08
const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');

// 创建服务器实例
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 定义数据模型
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
];

// 创建用户模型
const userSchema = Joi.object({
    id: Joi.number().integer().min(1).required(),
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
});

// 添加用户接口
server.route({
    method: 'POST',
    path: '/users',
    options: {
        handler: async (request, h) => {
            const { name, email } = request.payload;
            const newUser = { id: users.length + 1, name, email };
            users.push(newUser);
            return h.response(newUser).code(201);
        },
        validate: {
            payload: userSchema
        },
        description: 'Add a new user',
        notes: 'This endpoint allows you to add a new user to the system',
        tags: ['api']
    },
});

// 获取用户列表接口
server.route({
    method: 'GET',
    path: '/users',
    options: {
        handler: async (request, h) => {
            return users;
        },
        description: 'List all users',
        notes: 'This endpoint returns a list of all users',
        tags: ['api']
    },
});

// 获取单个用户接口
server.route({
    method: 'GET',
    path: '/users/{id}',
    options: {
        handler: async (request, h) => {
            const { id } = request.params;
            const user = users.find(user => user.id === parseInt(id));
            if (!user) {
                return h.response().code(404);
            }
            return user;
        },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().min(1).required()
            })
        },
        description: 'Get a user by ID',
        notes: 'This endpoint returns a single user by ID',
        tags: ['api']
    },
});

// 更新用户接口
server.route({
    method: 'PUT',
    path: '/users/{id}',
    options: {
        handler: async (request, h) => {
            const { id } = request.params;
            const user = users.find(user => user.id === parseInt(id));
            if (!user) {
                return h.response().code(404);
            }
            const updatedUser = {
                ...user,
                ...request.payload
            };
            const index = users.findIndex(user => user.id === parseInt(id));
            users[index] = updatedUser;
            return updatedUser;
        },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().min(1).required()
            }),
            payload: userSchema
        },
        description: 'Update a user by ID',
        notes: 'This endpoint allows you to update a user by ID',
        tags: ['api']
    },
});

// 删除用户接口
server.route({
    method: 'DELETE',
    path: '/users/{id}',
    options: {
        handler: async (request, h) => {
            const { id } = request.params;
            const index = users.findIndex(user => user.id === parseInt(id));
            if (index === -1) {
                return h.response().code(404);
            }
            const deletedUser = users[index];
            users.splice(index, 1);
            return deletedUser;
        },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().min(1).required()
            })
        },
        description: 'Delete a user by ID',
        notes: 'This endpoint allows you to delete a user by ID',
        tags: ['api']
    },
});

// 启动服务器
async function start() {
    try {
        await server.start();
        console.log('Server running on %s', server.info.uri);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();