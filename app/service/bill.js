'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  //查询账单
  async list(id) {
    const { ctx, app } = this;
    // const QUERY_STR = 'id, type, money, remark, create_time, update_time';
    // let sql = `select ${QUERY_STR} from bill where user_id = ${params.user_id}`;
    // try {
    //     const result = await app.mysql.query(sql);
    //     return result;
    // } catch (error) {
    //     console.log(error);
    //     return false;
    // }
    try {
      const result = await app.mysql.select('bill', {
        where: { user_id: id },
        columns: ['id', 'pay_type', 'amount', 'date', 'type_id', 'type_name', 'remark'],
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //添加账单
  async add(params) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.insert('bill', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //查询账单详情
  async detail(id, user_id) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.get('bill', { id, user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //修改账单
  async update(params) {
    const { ctx, app } = this;
    try {
      // ...是展开运算符，将对象展开，浅拷贝 浅拷贝优点：不会影响原对象，缺点：只能拷贝一层
      const result = await app.mysql.update('bill', {...params}, {
        where: { id: params.id, user_id: params.user_id },
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //删除账单
  async delete(id, user_id) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.delete('bill', { id, user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = BillService;