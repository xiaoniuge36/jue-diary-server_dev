//service/user.js
'use strict'

const Service = require('egg').Service;

class UserService extends Service {
    //注册
    async register(params) {
        const { app } = this;
        try {
            const result = await app.mysql.insert('user', params); //插入数据
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    //通过用户名获取用户信息
    async getUserByName(username) {
        const { app } = this;
        try {
            const result = await app.mysql.get('user', { username }); //查询user表中的username字段
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    //修改用户信息
    async editUserInfo(params) {
        const { ctx, app } = this;
        try {
            let result = await app.mysql.update('user', { ...params }, { id: params.id }); //修改数据 第一个参数为表名，第二个参数为修改的数据，第三个参数为修改的条件（查询条件）
            return result;
        }catch (error) {
            console.log(error);
            return null;
        }
}
}

module.exports = UserService;