# 说明

## 相关库

* [material-ui](https://mui.com/material-ui/getting-started/usage/)

## 问题

### 浏览器报错：MockServiceWorker.js无法下载

1. 表现

运行`npm start`，浏览器报错：

`Failed to register a ServiceWorker for scope ('http://localhost:3000/') with script ('http://localhost:3000/mockServiceWorker.js'): The script has an unsupported MIME type ('text/html').`

2. 解决

* 拷贝[mockServiceWorker.js](./node_modules/msw/lib/mockServiceWorker.js)到public目录下

### inject中soucemap的问题

1. 表现

运行`npm start`，控制台会出现如下警告：

``` log
WARNING in ./node_modules/inversify/es/utils/js.js
Module Warning (from ./node_modules/source-map-loader/dist/cjs.js):
Failed to parse source map from '\test_react_ts\node_modules\inversify\src\utils\js.ts' file: Error: ENOENT: no such file or directory, open '\test_react_ts\node_modules\inversify\src\utils\js.ts'
```

2. 解决

* [参考](https://github.com/inversify/InversifyJS/issues/1408)
* 打开：[react-scripts中的webpack.config.js](./node_modules/react-scripts/config/webpack.config.js)
* 添加：`ignoreWarnings: [/Failed to parse source map/]`，如下：

``` js

``` diff
diff --git a/node_modules/react-scripts/config/webpack.config.js b/node_modules/react-scripts/config/webpack.config.js
index e465d8e..26ad0fa 100644
--- a/node_modules/react-scripts/config/webpack.config.js
+++ b/node_modules/react-scripts/config/webpack.config.js
@@ -792,5 +792,6 @@ module.exports = function (webpackEnv) {
     // Turn off performance processing because we utilize
     // our own hints via the FileSizeReporter
     performance: false,
+    ignoreWarnings: [/Failed to parse source map/],
   };
 };
```