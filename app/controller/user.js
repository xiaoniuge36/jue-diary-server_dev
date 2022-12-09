//controller/user.js
'use strict'

//默认头像放在user.js的最外层，避免重复定义
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';

const Controller = require('egg').Controller;

class UserController extends Controller {
    async register() {
        const { ctx } = this;
        const { username, password } = ctx.request.body; //获取前端传过来的数据 获取注册的用户名和密码
        //判断
        if (!username || !password) { //如果用户名或密码为空
            ctx.body = {
                code: 500,
                msg: '用户名或密码不能为空',
                data: null
            }
            return;
        }
        //验证数据库中是否有该用户
        const userInfo = await ctx.service.user.getUserByName(username); //通过用户名获取用户信息 
        if (userInfo && userInfo.id) { //判断是否有该用户
            ctx.body = {
                code: 500,
                msg: '账户已存在，请重新输入',
                data: null
            }
            return;
        }
        //注册
        const result = await ctx.service.user.register({ //调用service层的register方法以下是闯入的数据
            username,
            password,
            ctime: new Date().getTime(),
            signature: '世界和平。',
            avatar: defaultAvatar
        });
        if (result) {
            ctx.body = {
                code: 200,
                msg: '注册成功',
                data: null
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '注册失败',
                data: null
            }
        }
    }

    async login() {
        //登录 1.验证用户名和密码是否正确 2.生成token 3.返回token 4.前端保存token 5.前端每次请求都带上token 6.后端验证token是否正确 7.正确返回数据，错误返回错误信息 
        //app 为全局属性，相当于所有的插件都可以通过app来获取到都被植入到app中
        const { ctx, app } = this;
        const { username, password } = ctx.request.body; //获取前端传过来的数据 获取注册的用户名和密码
        //根据用户名，在数据库中查找用户信息
        const userInfo = await ctx.service.user.getUserByName(username); //通过用户名获取用户信息
        if (!userInfo || !userInfo.id) { //如果没有该用户
            ctx.body = {
                code: 500,
                msg: '账户不存在，请重新输入',
                data: null
            }
            return;
        }
        // 找到用户，并且判断输入密码与数据库中用户密码。
        if (userInfo && password !== userInfo.password) { //如果密码不正确
            ctx.body = {
                code: 500,
                mes: '密码错误，请重新输入',
                data: null
            }
            return;
        }
        // 生成 token 加盐
        // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串，上文已经提到过，为自己在配置文件中配置的。
        console.log(userInfo);
        const token = app.jwt.sign({
            id: userInfo.id,
            username: userInfo.username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) //token过期时间24小时
        }, app.config.jwt.secret); //secret为加密字符串 在config/config.default.js中配置
        ctx.body = { //返回数据
            code: 200,
            msg: '登录成功',
            data: {
                token
            }
        }
    }

    //验证方法
    async test() {
        const { ctx, app } = this;
        //获取token 拿到token后，就可以通过解密token，获取到用户信息
        const token = ctx.request.header.authorization; //获取请求头中的authorization
        console.log(token);
        const decode = await app.jwt.verify(token, app.config.jwt.secret); //解密，获取用户信息
        ctx.body = {
            code: 200,
            msg: '验证成功',
            data: {
                ...decode
            }
        }
    }

    //获取用户信息
    async getUserInfo() {
        const { ctx, app } = this;
        //获取token 拿到token后，就可以通过解密token，获取到用户信息
        const token = ctx.request.header.authorization; //获取请求头中的authorization
        const decode = await app.jwt.verify(token, app.config.jwt.secret); //解密，获取用户信息
        const userInfo = await ctx.service.user.getUserByName(decode.username); //通过用户名获取用户信息
        ctx.body = {
            code: 200,
            msg: '获取用户信息成功',
            data: {
                ...userInfo
            }
            // date: userInfo
        }
    }

    //修改用户信息
    async editUserInfo() {
        const { ctx, app } = this;
        const { signature = '', avatar = '' } = ctx.request.body; //右边是默认值 如果没有传值就是空字符串
        try {
            let user_id
            const token = ctx.request.header.authorization; //获取请求头中的authorization
            const decode = await app.jwt.verify(token, app.config.jwt.secret); //解密，获取用户信息 
            if (!decode) { return }
            user_id = decode.id //获取用户id
            const userInfo = await ctx.service.user.getUserByName(decode.username); //修改用户信息
            const result = await ctx.service.user.editUserInfo({   //调用service中的方法修改用户信息
                ...userInfo,
                signature,
                avatar
            });
            ctx.body = {
                code: 200,
                msg: '修改用户信息成功',
                data: {
                    id: user_id,
                    signature,
                    username: userInfo.username,
                    avatar
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    //修改密码
    async modifyPass() {
        const { ctx, app } = this;
        const { old_pass = '', new_pass = '', new_pass2 = '' } = ctx.request.body

        try {
            let user_id
            const token = ctx.request.header.authorization;
            const decode = await app.jwt.verify(token, app.config.jwt.secret);
            if (!decode) return
            if (decode.username == 'admin') {
                ctx.body = {
                    code: 400,
                    msg: '管理员账户，不允许修改密码！',
                    data: null
                }
                return
            }
            user_id = decode.id
            const userInfo = await ctx.service.user.getUserByName(decode.username)

            if (old_pass != userInfo.password) {
                ctx.body = {
                    code: 400,
                    msg: '原密码错误',
                    data: null
                }
                return
            }

            if (new_pass != new_pass2) {
                ctx.body = {
                    code: 400,
                    msg: '新密码不一致',
                    data: null
                }
                return
            }

            const result = await ctx.service.user.modifyPass({
                ...userInfo,
                password: new_pass,
            })

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
    // 验证token
    async verify() {
        const { ctx, app } = this;
        const { token } = ctx.request.body
        console.log(ctx.state.user)
        const decode = await app.jwt.verify(token, app.config.jwt.secret);
        console.log('decode', decode)
        ctx.body = 'success gays'
    }
}

module.exports = UserController;