# 说明

## 指令

* `npm i`：安装依赖
* `npm start`：启动项目
* `npm test`：测试项目
* `npm run build`：打包项目

## 说明

* 使用`create-react-app`创建项目，[参考](https://github.com/facebook/create-react-app)

## 相关库

* [material-ui](https://mui.com/material-ui/getting-started/usage/)

## 测试项

在`src/components/test`目录下，有一些测试项，可以用来测试项目的一些功能：

* [TestTree](src/components/test/TestTree.tsx): 树型数据的渲染效率优化
* [TestJsonPath](src/components/test/TestJsonPath.tsx)：递归渲染如何避免父组件重复渲染
  * 测试方法
    * 安装`react-devtools`
    * Components页签 -> 设定 -> 勾选`Highlight updates when components render`
    * 会直接在界面上高亮更新的组件
* [TestArray](src/components/test/TestArray.tsx)：数组的拖动，跳转
* [TestClassProps](src/components/test/TestClassProps.tsx)：props中的class数据
* [TestContextMenu](src/components/test/TestContextMenu.tsx)：右键菜单
* [TestMultiEdit](src/components/test/TestMultiEdit.tsx)：多选编辑
