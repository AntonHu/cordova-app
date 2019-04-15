'use strict';
const shell = require('shelljs');

function makePush ({ environment, platform, description }) {
  const androidCmd = `code-push release-cordova block-chain-android android --deploymentName ${environment} --des "${description}" --targetBinaryVersion "^3.0.0"`;
  const iosCmd = `code-push release-cordova block-chain-ios ios --deploymentName ${environment} --des "${description}" --targetBinaryVersion "^3.0.0"`;
  let finalCmd = '';
  if (platform === 'android和ios') {
    finalCmd = `${androidCmd} && ${iosCmd}`;
  } else if (platform === 'android') {
    finalCmd = androidCmd;
  } else {
    finalCmd = iosCmd;
  }

  shell.exec(finalCmd);
}

module.exports = {
  makePush
};
