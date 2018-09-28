# 打包方法
1、首先确认是否需要修改版本号，如要修改，则需改config.xml中第二行的version（如version="2.1.0"），
以及`src/pages/User/About/index.js`里的`state.appVersion`。两者需要保持一致。

2、运行`npm run build`（不可缺）。

3、运行`npm run codePush`，发布热更新。运行了之后第一个选项选Staging，第二个选项选
android和ios，第三个选项输入修改描述。如果android和ios都发布成功了，应该会提示两个"successfully"

4、打包安卓apk（可选）。运行`cordova build android --release`，打包好的文件会在
platforms/android/build/outputs/apk/armv7/release/目录下。

5、打包ios ipa（可选，仅OS X系统上可操作）。打开platforms/ios/能源星球.xcworkspace，
然后最上方的菜单栏点Product => Archive，等打包好之后点击"Export..."，点击Ad Hoc，一直
点next，找个地方放下这个文件夹。

# 蒲公英账号
账号： luyang@thundersdata.com

密码： sJ31320456（注意大小写）

# 文件目录

src目录下存放源码。

src/components：公共组件

src/iconfont: iconfont字体文件，如要更新iconfont，从http://www.iconfont.cn 上下载字体文件，然后替换到文件夹中，然后重新打包

src/jssign：js加密和签名的代码（目前无用）

src/pages：所有app里的页面 目前分为5个模块：SunCity（太阳城）、Mining（挖宝）、Contract（合约电站）、Apply（应用）、User（用户）

src/router：react-router相关代码。如果要添加新页面，需要在PrimaryRoute.js中添加路径。

src/stores：mobx相关代码，除了页面的5个模块外，还有keyPair（公私钥）、bankCard（银行卡）。每个store都要写onLogout方法，
然后在onLogout.js里调用

src/styles：公用样式文件，其中common.less存放大量样式变量，在新建的.less文件，应该要引用common.less

src/utils：

src/utils/fetch：ajax方法相关

src/utils/variable：存放各种常量

src/utils/methods：存放各种通用方法

src/utils/validate：手机号、密码等输入的校验方法

src/utils/user：用户类User


