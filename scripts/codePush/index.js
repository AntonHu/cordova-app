'use strict';
// TODO：某个Staging发布为Product
// 请选择您要部署环境
// 1. Production
// 2. Staging
//
// 请选择您要部署的平台
// 1. android和ios
// 2. android
// 3. ios
//
// 请输入本次修改的描述
// 回车换行， cmd + s 保存并发布
//
const { makePush } = require('./makePush');
const inquirer = require('inquirer');

const ENV_PARAMS = {
  message: '请选择您要部署环境',
  type: 'list',
  name: 'environment',
  items: {
    1: 'Production',
    2: 'Staging'
  },
  choices: ['Staging', 'Production']
};

const PLATFORM_PARAMS = {
  message: '请选择您要部署的平台',
  type: 'list',
  name: 'platform',
  items: {
    1: 'android和ios',
    2: 'android',
    3: 'ios'
  },
  choices: ['android和ios', 'android', 'ios'],
  // filter: (input) => PLATFORM_PARAMS.choices.indexOf(input)
};

const DES_PARAMS = {
  name: 'description',
  type: 'editor',
  message: '请输入本次修改的描述'
};

const QUESTIONS = [ENV_PARAMS, PLATFORM_PARAMS, DES_PARAMS];

function main (){
  inquirer.prompt(QUESTIONS).then(option => {
    // console.log(option);
    const { description } = option;
    if (description === '') {
      console.error('你没有输入改动描述');
      process.exit(1);
    }
    makePush(option);
  });
}

main();
