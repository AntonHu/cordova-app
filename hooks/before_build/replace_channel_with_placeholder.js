var fs = require('fs');
var path = require('path');
var rootdir = process.env.PWD;
var platformAndroidPath = '/platforms/android/';

var manifestFile = path.join(rootdir, platformAndroidPath, 'AndroidManifest.xml');

if (fs.existsSync(manifestFile)) {
  fs.readFile(manifestFile, 'utf8', function (err, data) {
    if (err) {
      throw new Error('replace_channel_with_placeholder.js：读取AndroidManifest.xml错误: ' + err);
    }

    if (data.indexOf('JPUSH_CHANNEL') > -1) {
      var reg = /<meta-data android:name="JPUSH_CHANNEL" android:value=".*" \/>/;
      var result = data.replace(
        reg,
        '<meta-data android:name="JPUSH_CHANNEL" android:value="${JPUSH_CHANNEL_VALUE}" />'
      );

      fs.writeFile(manifestFile, result, 'utf8', function (err) {
        if (err) {
          throw new Error('replace_channel_with_placeholder.js：写AndroidManifest.xml错误: ' + err);
        }
        console.log('修改AndroidManifest.xml成功!')
      })
    }
  })
}
