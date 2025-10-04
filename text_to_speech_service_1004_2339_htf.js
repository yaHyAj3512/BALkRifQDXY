// 代码生成时间: 2025-10-04 23:39:45
const Hapi = require('@hapi/hapi');
const TextToSpeech = require('node-gtts'); // 引入谷歌语音合成模块
const tts = new TextToSpeech(); // 创建语音合成实例

// 创建Hapi服务器
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

// 语音合成服务
const textToSpeechService = async (request, h) => {
    const { text } = request.payload;
    if (!text) {
        return Boom.badRequest('No text provided');
    }

    try {
        const speech = await tts.save(text, 'speech.mp3', 'en'); // 将文本转换为语音并保存为MP3文件
        return h.response(speech).type('audio/mpeg'); // 返回MP3文件
    } catch (error) {
        return Boom.badImplementation(error.message);
    }
};

// 注册路由
server.route({
    method: 'POST',
    path: '/tts',
    handler: textToSpeechService,
    options: {
        payload: {
            allow: 'application/json',
            parse: true,
            output: 'data'
        },
        description: 'Text to Speech Service',
        notes: 'This service converts text to speech and returns an MP3 file.',
        tags: ['api'],
    },
});

// 启动服务器
async function start() {
    try {
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();