'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  // ejs模板引擎配置 egg里使用前端模板引擎
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  // mysql配置
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  // jwt配置
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  // 跨域配置
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};
