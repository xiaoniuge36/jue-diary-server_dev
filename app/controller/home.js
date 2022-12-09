'use strict';

// const { Controller } = require('egg');
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.body = 'hi, egg';
    //获取输入参数 http://localhost:7001/?id="ng" query 接收的是url中输入的id
    // const { ctx } = this;
    // const { id } = ctx.query;
    // ctx.body = `hi, ${id}`;
    await ctx.render('index.html', {
      title: 'ng'
    });
  }

  async user() {
    console.log(this);
    const { ctx } = this;
    const { id } = ctx.params; //获取路由参数 http://localhost:7001/user/2
    ctx.body = `user: ${id}`;
  }

  async add() {
    const { ctx } = this;
    const { title } = ctx.request.body; //获取post请求参数 title 用postman post请求传过来
    // Egg 框架内置了 bodyParser 中间件来对 POST 请求 body 解析成 object 挂载到 ctx.request.body 上
    ctx.body = {
      title
    };
  }

  async userpost() {
    const { ctx } = this;
    const { name, age } = await ctx.service.home.userpost();
    ctx.body = {
      name,
      age
    }
    await console.log(ctx);
  }

  async mysqluser() { //获取mysql数据
    const { ctx } = this;
    const res = await ctx.service.home.mysqluser();
    ctx.body = res;
  }

  async addmysqluser() { //添加mysql数据
    const { ctx } = this;
    const { name } = ctx.request.body;
    try {
      const res = await ctx.service.home.addmysqluser(name);
      ctx.body = {
        code: 200,
        msg: '添加成功',
        data: res
      }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '添加失败',
        data: error
      }
    }
  }

  async updatemysqluser() { //修改mysql数据
    const { ctx } = this;
    const { id, name } = ctx.request.body;
    try {
      const res = await ctx.service.home.updatemysqluser(id, name);
      ctx.body = {
        code: 200,
        msg: '修改成功',
        data: res
      }
    }
    catch (error) {
      ctx.body = {
        code: 500,
        msg: '修改失败',
        data: error
      }
    }
  }
  
  async deletemysqluser() { //删除mysql数据
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      const res = await ctx.service.home.deletemysqluser(id);
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: res
      }
    }
    catch (error) {
      ctx.body = {
        code: 500,
        msg: '删除失败',
        data: error
      }
    }
  } 

}

module.exports = HomeController;
