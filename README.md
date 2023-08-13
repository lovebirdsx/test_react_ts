# 说明

## 相关库

* [theme-ui](https://theme-ui.com/getting-started)

## 问题

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
* 在react-scripts中的webpack.config.js中添加`ignoreWarnings: [/Failed to parse source map/]`，如下：

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