# Cordova快速构建App

> 前言：虽然Cordova已经过时，但是本项目设计的web+app自动化构建流程，android/ios打包与上架的完整指南，App热更新实现等，依旧有学习参考的价值。

使用本项目，你可以将已有的web项目快速打包成HybridApp。

只需将Web项目迁移至此，或将打包文件放入本项目，简单的打包指令即可转成HybridApp，通过Cordova还可以支持各种App原生能力，本项目还提供完整的ios，android打包上架流程指导，App热更新方案。

## 项目介绍

主要目录介绍
```
.
├── config ------------------- webpack配置目录
    ├── webpack.config.dev.js  测试环境 webpack 配置
    └── webpack.config.prod.js 生产环境 webpack 配置
├── hooks -------------------- cordova构建过程中使用的一些额外的钩子处理
├── platforms ---------------- 移动端包文件夹
    ├── android -------------- android包文件
    ├── ios ------------------ ios包文件
├── plugins ------------------ 本项目用到的cordova插件，可自行新增删除
├── scripts ------------------ 启动/打包项目的node脚本目录
├── src ---------------------- 主要的开发路径
    ├── index.js ------------- 项目入口文件
├── www ---------------------- web项目打包结果
```

src目录下替换成你自己的web项目，确保入口文件名称为`index.js`

www目录下是打包好的web项目文件，可以通过打包指令，从src下的项目打包输出www文件夹，或者手动复制其他项目打包好的文件

platforms目录下是android和ios两个平台的包文件，一般不需要更改，除非你需要升级自己的App架构

## 打包流程

### 关键流程

一、Web项目打包

二、打包App上架应用市场

三、发布code-push（App热更新）

### 详细打包步骤

#### 一、Web项目打包

在你的Web项目中，执行打包指令获得输出文件。

假设输出文件夹`build`，复制文件夹下所有内容

![md_2](markdown_img/md_1.jpg)

#### 二、打包App

**1、删除本项目中`www/`文件夹下的所有内容，然后把第一步复制的所有内容粘贴到`www/`中：**

![md_2](markdown_img/md_2.jpg)

**2、修改`./config.xml`文件中的版本号，它应该和你的Web项目中的版本号保持一致：**

![md_3](markdown_img/md_3.jpg)

**3、在命令行中运行`cordova prepare`。应先改版本号再prepare，否则改的版本号不会更新到app上。**

![md_4](markdown_img/md_4.jpg)

## Android

**1、检查`./build-extras.gradle`中的`productFlavors`字段，测试环境和生产环境有区别：**

测试环境`productFlavors`应该是空的：

![md_5](markdown_img/md_5.jpg)

生产环境`productFlavors`有各个渠道的配置：

![md_6](markdown_img/md_6.jpg)

**2、运行`cordova build android — release`打包安卓，在`platforms/android/build/outputs/apk/`文件夹下可以找到打包好的apk文件。根据步骤4中`productFlavors`的不同，打包出来的文件数不一样。这里面，`x86`文件夹里的apk是不能用的，所以打完包可以删掉`x86`文件夹。**

生产环境：

![md_7](markdown_img/md_7.jpg)

测试环境：

![md_8](markdown_img/md_8.jpg)

有时候测试环境打包出来也有很多文件夹，那是因为之前的没有清理，实际上更新的只有`arm7`和`x86`。

**到这里，Android的打包就完成了。生产环境中把apk文件夹压缩了发送给运营同学，就可以往各个渠道上发布了**

## IOS

**1、在xcode中打开`platforms/ios/一度店.xcworkspace`文件，打开iOS的工程，选为Generic iOS Device**

![md_9](markdown_img/md_9.jpg)

**2、Product -> Archive打包**

![md_10](markdown_img/md_10.jpg)

**3、打包成功后，点击Distribute App，选择发布方式**

![md_11](markdown_img/md_11.jpg)

**4、生产环境选择iOS App Store，测试环境选择Ad Hoc**

![md_12](markdown_img/md_12.jpg)

![](markdown_img/md_13.jpg)

![](markdown_img/md_14.jpg)

![15](markdown_img/md_15.jpg)

到这里，iOS的打包就算结束了。如果是测试环境，往蒲公英上传打包好的ipa文件就完成了，如果是生产环境，往下看。

**5、在苹果上操作发布app**

打开<https://developer.apple.com/account/>，输入帐号和密码，到达能信苹果帐号主页，点击App Store Connect -> Go to App Store Connect -> 选“我的App” -> 点击进入“一度店”：

![16](markdown_img/md_16.jpg)

![17](markdown_img/md_17.jpg)

![18](markdown_img/md_18.jpg)

**6、在TestFlight里处理合规证明，然后新建Apple Store新版本，关联构建版本**

![](markdown_img/md_19.jpg)

![20](markdown_img/md_20.jpg)

![21](markdown_img/md_21.jpg)

![22](markdown_img/md_22.jpg)

到这里，补上其他的相关信息，就可以提交审核了。审核通过后，就可以发布到App Store了，生产环境app的发布就完成了。

#### 三、发布code-push（生产包需要，测试包不需要）

**1、为什么生产一定要发布code-push？**

因为生产环境的App会在wifi环境下，会在打开App时静默检查code-push和App上的代码是否一致。如果不及时发布code-push，有可能会导致用户下载新版App后，内容却出现倒退的情况。

举个例子，App Store上发布了新版本3.4.2，而之前用户手机里App是3.3.3，code-push上的版本也是3.3.3，当用户更新到3.4.2，在wifi环境下打开App时，触发了code-push的检查，发现3.4.2 !== 3.3.3，于是code-push下载3.3.3版本并更到App上。

**2、发布code-push**

运行`npm run codePush`，并且选择production、选择Android和iOS：

![](markdown_img/md_23.jpg)

![](markdown_img/md_24.jpg)

最后输入版本描述，包括发布时间、版本号、内容：

![](markdown_img/md_25.jpg)

确认后就发布了。仔细看发布的log，有2处successfully，就表明2个平台的code-push都发布成功了:

![](markdown_img/md_26.jpg)

![](markdown_img/md_27.jpg)

**至此，整个生产环境的发布就成功了。**

