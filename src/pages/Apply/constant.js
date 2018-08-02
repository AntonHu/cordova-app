import React from 'react';

export const ACTIVITIES = {
  station: {
    title: '完善电站信息',
    subTitle: '上传电站资料，数据更真实',
    imageSrc: require('../../images/activity_station.png'),
    info: <div>完成<span className="score">+100</span>积分</div>,
    path: '/user/myStation'
  },
  verify: {
    title: '实名认证',
    subTitle: '实名认证，做一个有身份的人',
    imageSrc: require('../../images/activity_verify.png'),
    info: <div>完成<span className="score">+1000</span>积分</div>,
    path: '/user/verifyID'
  },
  invitation: {
    title: '邀请好友',
    subTitle: '真壕友，一起玩',
    imageSrc: require('../../images/activity_invitation.png'),
    info: <div>一级好友<span className="score">+10</span>积分，二级<span className="score">+5</span>积分</div>,
    path: '/user/inviteFriends'
  }
};
