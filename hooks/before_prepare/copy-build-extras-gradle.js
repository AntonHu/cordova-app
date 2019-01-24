#!/usr/bin/env node

// var fs = require('fs');
// var path = require('path');
//
// console.log('copy build extras')
// if(fs.existsSync(path.resolve(__dirname, '../../platforms/android'))) {
//   fs.createReadStream(path.resolve(__dirname, '../../build-extras.gradle')).pipe(fs.createWriteStream(path.resolve(__dirname, '../../platforms/android/build-extras.gradle')));
// }

var fs = require('fs');
var path = require('path');
var rootdir = process.env.PWD;
var platformAndroidPath = '/platforms/android/';
var srcFile = path.join(rootdir, 'build-extras.gradle');
var destFile = path.join(rootdir, platformAndroidPath, 'build-extras.gradle');
var destDir = path.dirname(destFile);
if (fs.existsSync(srcFile) && fs.existsSync(destDir)) {
  fs.createReadStream(srcFile).pipe(fs.createWriteStream(destFile));
} else {
  throw new Error('Unable to copy build-extras.gradle');
}