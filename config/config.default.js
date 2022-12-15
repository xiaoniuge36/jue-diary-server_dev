/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1669191012103_2837';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: 'app/public/upload'
  };

  //配置白名单
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*'] //配置白名单 * 表示所有默认都通过 也可以配置成 ['http://localhost:3000'] 只允许3000端口访问 
  };

  //配置ejs模板引擎
  config.view = {
    //左边写成.html后缀，会自动渲染.html文件 但是需要改成.html后缀
    //意思是view文件夹下.html文件识别成.ejs
    mapping: {
      '.html': 'ejs',
    },
  };

  //配置mysql
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'root',
      // 数据库名
      database: 'juejue-cost', //数据库名
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  //配置jwt
  config.jwt = {
    secret: 'niuge' //自定义 token 的加密条件字符串
  };

  //配置文件上传
  config.multipart = {
    mode: 'file'
  };

  //配置跨域
  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, // 允许 Cookie 跨域跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  //配置端口号
  config.cluster = {
    listen: {
      path: '',
      port: 8066,
      hostname: '0.0.0.0',
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
