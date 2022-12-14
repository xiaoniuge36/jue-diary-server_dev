# jue-diary-server_dev



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

### 项目结构

```bash 
├── app
│   ├── controller
│   │   └── home.js
│   ├── extend
│   │   └── helper.js
│   ├── middleware
│   │   └── error_handler.js
│   ├── public
│   │   └── favicon.png
│   ├── router.js
│   └── service
│       └── user.js
├── config
│   ├── config.default.js
│   ├── config.local.js
│   ├── config.prod.js
│   ├── config.test.js
│   ├── plugin.js
│   └── plugin.local.js
├── logs
│   └── egg-web.log
├── package.json
├── README.md
├── run
│   ├── dev
│   │   ├── agent.pid
│   │   ├── app.pid
│   │   └── egg-web.log
│   └── prod
│       ├── agent.pid
│       ├── app.pid
│       └── egg-web.log
├── test
│   └── app
│       ├── controller
│       │   └── home.test.js
│       └── service
│           └── user.test.js
└── yarn.lock
```
