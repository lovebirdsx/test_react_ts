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

### TestVsplay

* 目录：`src/components/test/TestVsplay`
* 功能：测试`vsplay`的使用，包括：
  * 代码分层
  * Service和Store的通讯
  * Layout方案

### TestTree

* [源码文件：TestTree.tsx](src/components/test/TestTree.tsx)
* 树型数据的渲染效率优化

### TestJsonPath

* [源码文件：TestJsonPath.tsx](src/components/test/TestJsonPath.tsx)
* 递归渲染如何避免父组件重复渲染
* 测试方法
  * 安装`react-devtools`
  * Components页签 -> 设定 -> 勾选`Highlight updates when components render`
  * 会直接在界面上高亮更新的组件

### TestArray

* [源码文件：TestArray.tsx](src/components/test/TestArray.tsx)
* 数组的拖动，跳转

### TestClassProps

* [源码文件：TestClassProps.tsx](src/components/test/TestClassProps.tsx)
* props中的class数据

### TestContextMenu

* [源码文件：TestContextMenu.tsx](src/components/test/TestContextMenu.tsx)
* 右键菜单

### TestMultiEdit

* [源码文件：TestMultiEdit.tsx](src/components/test/TestMultiEdit.tsx)
* 多选编辑

### TestSelector

* [源码文件：TestSelector.tsx](src/components/test/TestSelector.tsx)
* 测试redux和zustand的selector触发机制
* 测试方法：点击对应的按钮，查看控制台输出
