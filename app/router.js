'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const __jwt = middleware.jwtErr(app.config.jwt.secret); // 生成一个中间件检测token
  router.post('/api/user/register', controller.user.register); // 注册
  router.post('/api/user/login', controller.user.login);// 登录
  router.get('/api/user/test', __jwt, controller.user.test); // 测试
  router.get('/api/user/getUser', __jwt, controller.user.getUserInfo);// 获取用户信息
  router.post('/api/user/editUser', __jwt, controller.user.editUserInfo);// 修改用户信息
  router.post('/api/upload',__jwt , controller.upload.upload); // 上传图片
  router.post('/api/bill/add', __jwt, controller.bill.add); // 添加账单
  router.get('/api/bill/list', __jwt, controller.bill.list); // 获取账单列表
  router.get('/api/bill/detail', __jwt, controller.bill.detail); // 获取账单详情
  router.post('/api/bill/update', __jwt, controller.bill.update); // 修改账单
  router.post('/api/bill/delete', __jwt, controller.bill.delete); // 删除账单
  router.get('/api/bill/data', __jwt, controller.bill.data); // 获取账单总数
  router.get('/api/type/list', __jwt, controller.type.list); // 获取消费类型列表
  router.post('/api/user/modify_pass', __jwt, controller.user.modifyPass); // 修改用户密码
  router.post('/api/user/verify', controller.user.verify); // 验证token
}