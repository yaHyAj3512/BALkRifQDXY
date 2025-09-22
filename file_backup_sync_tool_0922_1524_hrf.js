// 代码生成时间: 2025-09-22 15:24:39
const Hapi = require('@hapi/hapi');
const Fs = require('fs');
const Path = require('path');
const Chalk = require('chalk');
const archiver = require('archiver');
const Rsync = require('rsync');

// 定义常量
const PORT = 3000;
const BACKUP_DIRECTORY = 'backup';
const SOURCE_DIRECTORY = 'source';

// 初始化Hapi服务器
const server = Hapi.server({
  port: PORT,
  host: 'localhost',
});

// 检查备份目录是否存在
const checkBackupDirectory = () => {
  if (!Fs.existsSync(BACKUP_DIRECTORY)) {
    Fs.mkdirSync(BACKUP_DIRECTORY);
  }
};

// 创建备份文件
const createBackup = (filePath) => {
  const fileName = Path.basename(filePath);
  const backupFilePath = Path.join(BACKUP_DIRECTORY, fileName);
  const output = Fs.createWriteStream(backupFilePath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output);
  archive.file(filePath, { name: fileName });
  archive.finalize();
};

// 同步文件
const syncFiles = (sourcePath, destinationPath) => {
  const rsync = Rsync.build()
    .source(sourcePath)
    .destination(destinationPath)
    .flags('a') // 归档模式，保留原始文件的权限、时间戳等
    .execute((error, code, cmd) => {
      if (error) {
        console.error(Chalk.red('Error syncing files:'), error);
      } else {
        console.log(Chalk.green('Files synced successfully.'));
      }
    });
};

// Hapi路由：备份文件
server.route({
  method: 'POST',
  path: '/backup',
  handler: async (request, h) => {
    try {
      const { filePath } = request.payload;
      if (!Fs.existsSync(filePath)) {
        return h.response({ status: 'error', message: 'File not found' }).code(404);
      }
      createBackup(filePath);
      return h.response({ status: 'success', message: 'Backup created' }).code(200);
    } catch (error) {
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },
});

// Hapi路由：同步文件
server.route({
  method: 'POST',
  path: '/sync',
  handler: async (request, h) => {
    try {
      const { sourcePath, destinationPath } = request.payload;
      if (!Fs.existsSync(sourcePath)) {
        return h.response({ status: 'error', message: 'Source file not found' }).code(404);
      }
      syncFiles(sourcePath, destinationPath);
      return h.response({ status: 'success', message: 'Files synced' }).code(200);
    } catch (error) {
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },
});

// 启动服务器
const start = async () => {
  await server.start();
  console.log(Chalk.green(`Server running at: ${server.info.uri}`));
};

// 检查备份目录
checkBackupDirectory();

start().catch((err) => {
  console.error(Chalk.red('Server startup failed:'), err);
});
