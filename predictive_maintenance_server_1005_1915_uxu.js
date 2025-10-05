// 代码生成时间: 2025-10-05 19:15:53
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Joi = require('joi');

// 模拟设备数据
const devices = {
    'device1': {
        id: 'device1',
        name: 'Conveyor Belt',
        lastMaintenance: new Date(new Date() - 10000000000), // 10天前
        nextPredictedMaintenance: new Date(new Date() + 1000000000) // 1天后
    },
    'device2': {
        id: 'device2',
        name: 'Pump',
        lastMaintenance: new Date(new Date() - 5000000000), // 5天前
        nextPredictedMaintenance: new Date(new Date() + 2000000000) // 2天后
    }
};

// 创建服务器
const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    // 定义路由 - 获取设备列表
    server.route({
        method: 'GET',
        path: '/devices',
        handler: async (request, h) => {
            return devices;
        },
        config: {
            validate: {
                query: Joi.object({
                    limit: Joi.number().integer().min(1).default(10)
                })
            }
        }
    });

    // 定义路由 - 获取单个设备的预测维护信息
    server.route({
        method: 'GET',
        path: '/devices/{id}/maintenance',
        handler: async (request, h) => {
            const { id } = request.params;
            const device = devices[id];
            if (!device) {
                throw Boom.notFound(`Device with id ${id} not found`);
            }
            return device;
        },
        config: {
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                })
            }
        }
    });

    // 启动服务器
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

init();
