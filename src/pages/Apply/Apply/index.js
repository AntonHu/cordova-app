import React from 'react';
import { Title, PageWithHeader, Picture } from '../../../components';
import {} from 'antd-mobile';
import './style.less';

const Apps = [
  {
    text: 'AI运营',
    icon: '\ue61b'
  },
  {
    text: '数据金融',
    icon: '\ue688'
  }

];

/**
 * 应用
 */
class Comp extends React.PureComponent {
  render() {
    return (

        <PageWithHeader leftComponent={null} title={'应用'} id="page-apply">
          <div className="apply-survey">
            <img src={require('../../../images/banner_2.png')} width="100%" />
          </div>
          <div className="apply">
            <Title title="应用区" />
            <div className="apply-list">
              {Apps.map((item, index) => {
                return (
                  <div key={index} className="apply-item">
                    <i className="iconfont">{item.icon}</i>
                    <div className="apply-item-text">{item.text}</div>
                    <div className="help-text h5">敬请期待</div>
                  </div>
                );
              })}
            </div>
            {/*<div className="recommend">*/}
              {/*<Title title="为你推荐" />*/}
              {/*<div className="recommend-list">*/}
                {/*<div className="recommend-item">*/}
                  {/*<Picture*/}
                    {/*circle={false}*/}
                    {/*size={200}*/}
                    {/*emptyElement={props => <div style={props.style} className={props.className} />}*/}
                    {/*src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72yqdE9opUl3aiimoZ-MilU5QdxFkK8AaAN6zUY1yrC2SuDWq"*/}
                  {/*/>*/}
                  {/*<div className="recommend-name">得力双层保温盒</div>*/}
                  {/*<div className="recommend-price">121积分</div>*/}
                {/*</div>*/}
                {/*<div className="recommend-item">*/}
                  {/*<Picture*/}
                    {/*circle={false}*/}
                    {/*size={200}*/}
                    {/*emptyElement={props => <div style={props.style} className={props.className} />}*/}
                    {/*src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72yqdE9opUl3aiimoZ-MilU5QdxFkK8AaAN6zUY1yrC2SuDWq"*/}
                  {/*/>*/}
                  {/*<div className="recommend-name">得力双层保温盒</div>*/}
                  {/*<div className="recommend-price">121积分</div>*/}
                {/*</div>*/}
                {/*<div className="recommend-item">*/}
                  {/*<Picture*/}
                    {/*circle={false}*/}
                    {/*size={200}*/}
                    {/*emptyElement={props => <div style={props.style} className={props.className} />}*/}
                    {/*src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72yqdE9opUl3aiimoZ-MilU5QdxFkK8AaAN6zUY1yrC2SuDWq"*/}
                  {/*/>*/}
                  {/*<div className="recommend-name">得力双层保温盒</div>*/}
                  {/*<div className="recommend-price">121积分</div>*/}
                {/*</div>*/}
              {/*</div>*/}
            {/*</div>*/}
          </div>
          <div className="admission">
            <Title title="入驻申请" />
            <img src={require('../../../images/banner_3.png')} width="100%" />
          </div>
        </PageWithHeader>

    );
  }
}

export default Comp;
