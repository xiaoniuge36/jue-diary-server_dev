'use strict';

const fs = require('fs'); // 引入fs模块 用于读取文件
const path = require('path'); // 引入path模块 用于处理文件路径
const moment = require('moment'); // 引入moment模块 用于处理时间
const mkdirp = require('mkdirp'); // 引入mkdirp模块 用于创建文件夹
const Controller = require('egg').Controller; // 引入egg的Controller模块

class UploadController extends Controller {
    async upload() {
        const { ctx } = this; // 获取上下文对象
        console.log('ctx.request.files', ctx.request.files); // 打印上传的文件信息
        let file = ctx.request.files[0]; // 获取上传的文件信息 // files[0]表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
        let uploadDir = ''; // 定义上传文件的保存路径
        try {
            let f = fs.readFileSync(file.filepath); // 读取上传的文件
            // 1.获取当前日期
            let day = moment(new Date()).format('YYYYMMDD');
            // 2.创建图片保x'x存的路径
            let dir = path.join(this.config.uploadDir, day); // 获取图片保存的路径
            let date = Date.now(); // 毫秒数
            await mkdirp(dir); // 不存在就创建目录
            // 返回图片保存的路径
            uploadDir = path.join(dir, date + path.extname(file.filename)); // 获取图片保存的路径
            // 写入文件夹
            fs.writeFileSync(uploadDir, f); // 将上传的文件写入到指定的路径
        }finally {
            // 清除临时文件
            ctx.cleanupRequestFiles();
        }
        console.log('uploadDir', uploadDir); // 打印图片保存的路径
        ctx.body = {
            code: 200,
            msg: '上传成功',
            data: uploadDir.replace(/app/g, ''),
        }
    }
}

module.exports = UploadController;