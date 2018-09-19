import React from 'react';
import { BlueBox, PageWithHeader, Header } from '../../../components';
import './style.less';

/**
 * 介绍的一张图
 */
class Introduction extends React.PureComponent {

  render() {
    return (
      <div className={'page-introduction'}>
        <Header title="" transparent={true} fixed={false} />
        <img src={require('../../../images/introduction.png')} width="100%" />
      </div>
    );
  }
}

export default Introduction;
