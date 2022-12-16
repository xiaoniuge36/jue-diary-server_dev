'use strict';
const { Controller } = require('egg');
const moment = require('moment'); // 时间格式化

class BillController extends Controller {
    // 获取账单列表
    async list() {
        const { ctx, app } = this;
        // 获取，日期 date，分页数据，类型 type_id，这些都是我们在前端传给后端的数据
        const { date, page = 1, page_size = 10, type_id = 'all' } = ctx.query;
        try {
            let user_id
            const token = ctx.request.header.authorization; // 获取token
            const decode = await app.jwt.verify(token, app.config.jwt.secret); // 解密token 获取用户id
            if (!decode) return
            user_id = decode.id // 获取用户id
            console.log(user_id);
            // 调用service拿到当前用户的账单列表
            const list = await ctx.service.bill.list(user_id);
            // 过滤出指定日期的账单 这里时间戳为毫秒，所以要乘以1000或者在前端传过来的时候就乘以1000或者在数据库存的时候就乘以1000
            // moment解析的是毫秒
            console.log(list);
            const _list = list.filter(item => {
                if (type_id != 'all') {
                    return moment(Number(item.date)).format('YYYY-MM') == date && type_id == item.type_id;
                }
                return moment(Number(item.date)).format('YYYY-MM') == date;
            });
            // 格式化数据，将其变成我们之前设置好的对象格式
            // reduce() 第一个参数是一个函数，第二个参数是初始值，这里我们设置初始值为一个空对象 第一个参数的返回值会作为下一次的第二个参数 函数的第一个参数是上一次的返回值，第二个参数是当前的值
            let listMap = _list.reduce((curr, item) => {
                // curr 默认初始值是一个空数组 []
                // 把第一个账单项的时间格式化为 YYYY-MM-DD
                const date = moment(Number(item.date)).format('YYYY-MM-DD');
                // 如果能在累加的数组中找到当前项日期 date，那么在数组中的加入当前项到 bills 数组。
                if (curr && curr.length && curr.findIndex(item => item.date == date) > -1) {
                    const index = curr.findIndex(item => item.date == date);
                    curr[index].bills.push(item);
                }
                // 如果在累加的数组中找不到当前项日期的，那么再新建一项。
                if (curr && curr.length && curr.findIndex(item => item.date == date) == -1) {
                    curr.push({
                        date,
                        bills: [item]
                    })
                }

                if (!curr.length) {
                    curr.push({
                        date,
                        bills: [item]
                    })
                }
                return curr
            }, []).sort((a, b) => moment(b.date) - moment(a.date)) // 时间顺序为倒叙，时间约新的，在越上面
            // 分页处理，listMap.slice((page-1)*page_size,page*page_size) 从第几项开始，到第几项结束
            const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);
            // 计算当月总收入和支出
            // 首先获取当月所有账单列表
            const monthList = list.filter(item => moment(Number(item.date)).format('YYYY-MM') == date);
            // 然后计算当月总支出
            const totalExpense = monthList.reduce((curr, item) => {
                if (item.pay_type == 1) {
                    curr += Number(item.amount)
                    return curr;
                }
                return curr;
            }, 0);
            // 计算当月总收入
            const totalIncome = monthList.reduce((curr, item) => {
                if (item.pay_type == 2) {
                    curr += Number(item.amount)
                    return curr;
                }
                return curr;
            }, 0);
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: {
                    totalExpense, // 总支出
                    totalIncome, // 总收入
                    totalPage: Math.ceil(listMap.length / page_size), // 总分页
                    list: filterListMap || [], // 当月账单列表
                }
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    // 添加账单
    async add() {
        const { ctx, app } = this;
        // 获取参数
        const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
        // 判空处理，这里前端也可以做，但是后端也需要做一层判断。
        if (!amount || !type_id || !type_name || !date || !pay_type) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
        }
        try {
            let user_id
            const token = ctx.request.header.authorization; // 获取token
            const decode = await app.jwt.verify(token, app.config.jwt.secret); // 解密token 获取用户id
            if (!decode) return
            user_id = decode.id // 获取用户id
            // 调用service层
            // user_id 默认添加到每个账单项，作为后续获取指定用户账单的标示。
            // 可以理解为，我登录 A 账户，那么所做的操作都得加上 A 账户的 id，后续获取的时候，就过滤出 A 账户 id 的账单信息。
            const result = await ctx.service.bill.add({
                amount,
                type_id,
                type_name,
                date,
                pay_type,
                remark,
                user_id
            });
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: null
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    // 获取账单详情
    async detail() {
        const { ctx, app } = this;
        // 获取账单id ''是初始化值 query是输入的值
        const { id = '' } = ctx.query;
        // 判空处理
        if (!id) {
            ctx.body = {
                code: 500,
                msg: '订单id不能为空',
                data: null
            }
        }
        //获取用户id 和 token
        let user_id;
        const token = ctx.request.header.authorization;
        const decode = await app.jwt.verify(token, app.config.jwt.secret);
        if (!decode) return;
        user_id = decode.id;
        try {
            // 调用service层
            const result = await ctx.service.bill.detail(id, user_id);
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: result
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }

    }

    // 更新账单
    async update() {
        const { ctx, app } = this;
        // 获取参数
        const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
        // 判空处理
        if (!id || !amount || !type_id || !type_name || !date || !pay_type) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
        }
        try {
            // 获取用户id 和 token
            let user_id;
            const token = ctx.request.header.authorization; // 获取token
            const decode = await app.jwt.verify(token, app.config.jwt.secret); // 解密token 获取用户id
            if (!decode) return;
            user_id = decode.id; // 获取用户id
            // 调用service层
            const result = await ctx.service.bill.update({
                id,
                amount,
                type_id,
                type_name,
                date,
                pay_type,
                remark,
                user_id
            });
            ctx.body = {
                code: 200,
                msg: '修改成功',
                data: null
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    // 删除账单
    async delete() {
        const { ctx, app } = this;
        // 获取账单id
        const { id } = ctx.request.body;
        // 判空处理
        if (!id) {
            ctx.body = {
                code: 500,
                msg: '订单id不能为空',
                data: null
            }
        }
        //获取用户id 和 token
        let user_id;
        const token = ctx.request.header.authorization;
        const decode = await app.jwt.verify(token, app.config.jwt.secret);
        if (!decode) return;
        user_id = decode.id;
        try {
            // 调用service层
            const result = await ctx.service.bill.delete(id, user_id);
            ctx.body = {
                code: 200,
                msg: '删除成功',
                data: null
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }

    // 数据图表
    async data() {
        const { ctx, app } = this;
        const { date = '' } = ctx.query; // 获取日期
        // 获取用户id 和 token
        let user_id;
        const token = ctx.request.header.authorization;
        const decode = await app.jwt.verify(token, app.config.jwt.secret);
        if (!decode) return;
        user_id = decode.id;
        //判空处理
        if (!date) {
            ctx.body = {
                code: 500,
                msg: '日期不能为空',
                data: null
            }
        }
        try {
            // 调用service层
            const result = await ctx.service.bill.list(user_id);
            //开始时间毫秒级别
            const start = moment(date).startOf('month').unix() * 1000;
            //结束时间
            const end = moment(date).endOf('month').unix() * 1000;
            //数据筛选
            const _data = result.filter(item => {
                if (Number(item.date) >= start && Number(item.date) <= end) {
                    console.log(true);
                    return item;
                }
            });
            console.log(_data);
            //总支出
            const total_expense = _data.reduce((arr, cur) => {
                if (cur.pay_type == 1) {
                    arr += Number(cur.amount);
                }
                return arr;
            }, 0);

            //总收入
            const total_income = _data.reduce((arr, cur) => {
                if (cur.pay_type == 2) {
                    arr += Number(cur.amount);
                }
                return arr;
            }, 0);
            //获取收支构成由于生成图表
            //饼状图
            let total_data = _data.reduce((arr, cur) => {
                const index = arr.findIndex(item => item.type_id == cur.type_id); //判断是否存在
                if (index == -1) { //不存在添加
                    arr.push({
                        type_id: cur.type_id,
                        type_name: cur.type_name,
                        pay_type: cur.pay_type,
                        amount: Number(cur.amount)
                    })
                }
                if (index > -1) { //存在累加
                    arr[index].amount += Number(cur.amount);
                }
                return arr;
            }, []);
            total_data = total_data.map(item => { //格式化数据
                item.number = Number(item.amount).toFixed(2); //保留两位小数
                return item;
            });

            // 柱状图数据
            // let bar_data = _data.reduce((curr, arr) => {
            //   const index = curr.findIndex(item => item.date == moment(Number(arr.date)).format('YYYY-MM-DD'))
            //   if (index == -1) {
            //     curr.push({
            //       pay_type: arr.pay_type,
            //       date: moment(Number(arr.date)).format('YYYY-MM-DD'),
            //       number: Number(arr.amount)
            //     })
            //   }
            //   if (index > -1) {
            //     curr[index].number += Number(arr.amount)
            //   }

            //   return curr
            // }, [])

            // bar_data = bar_data.sort((a, b) => moment(a.date).unix() - moment(b.date).unix()).map((item) => {
            //   item.number = Number(item.number).toFixed(2)
            //   return item
            // })
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: {
                    total_expense: Number(total_expense).toFixed(2),
                    total_income: Number(total_income).toFixed(2),
                    total_data: total_data || [],
                    // bar_data: bar_data || [] 
                }
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }
}

module.exports = BillController;