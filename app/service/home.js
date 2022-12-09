//app/service/home.js
'use strict';
// const Service = require('egg').Service;
const { Service } = require('egg');

class HomeService extends Service {
    async userpost() {
        // 假设从数据库获取数据
        return {
            name: 'ng',
            age: 18
        };
    }
    
    async mysqluser() { //获取mysql数据
        const {app, ctx} = this;
        const QUERY_STR = 'id, name';
        let sql = `SELECT ${QUERY_STR} FROM list`; //查询list表的id和name的sql语句
        try {
            // const res = await app.mysql.query(sql);
            const res = await app.mysql.select('list'); //查询list表的所有数据 也可以传入查询条件 columns: ['id', 'name'] 
            // const res = await app.mysql.select('list', { //查询list表name的数据
            //     columns: ['name']
            // });
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
     }

    async addmysqluser(name) { //添加mysql数据
        const {app, ctx} = this;
        try {
            const res = await app.mysql.insert('list', { name });
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    
    async updatemysqluser(id, name) { //修改mysql数据
        const {app, ctx} = this;
        try {
            const res = await app.mysql.update('list', { name }, { where: { id } });
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }   
    
    async deletemysqluser(id) { //删除mysql数据
        const {app, ctx} = this;
        try {
            const res = await app.mysql.delete('list', { id });
            return res;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }    
}
module.exports = HomeService;