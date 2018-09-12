import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Title, PageWithHeader, Picture, Rank } from '../../../components';
import { Icon, Tabs, WhiteSpace } from 'antd-mobile';
import { getLocalStorage } from '../../../utils/storage';
// import PullToRefresh from 'rmc-pull-to-refresh';
import Tloader from 'react-touch-loader';
import PullToRefresh from 'pulltorefreshjs';
import './index.less';

// TODO:项目详情组件

// TODO: 详情页的必有组件：头部、项目简介、受托建造运营方信息、历史项目
// TODO: 头部组件可传入状态文字、可选择active或inactive
// TODO：橙色渐变的Button，可以选渐变方向
