import React from 'react';
import { Title, PageWithHeader, Picture } from '../../../components';
import {} from 'antd-mobile';
import './style.less';

const Apps = [
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  },
  {
    text: '积分商城',
    icon: 'avatar'
  }
];

/**
 * 应用
 */
class Comp extends React.PureComponent {
  render() {
    return (
      <div className={'page-apply'}>
        <PageWithHeader leftComponent={null} title={'应用'}>
          <div className="apply-survey" />
          <div className="apply">
            <Title title="应用区" />
            <div className="apply-list">
              {Apps.map((item, index) => {
                return (
                  <div key={index} className="apply-item">
                    <Picture
                      size={100}
                      emptyElement={props => <div style={props.style} className={props.className} />}
                      src="hahahha"
                    />
                    <div>{item.text}</div>
                  </div>
                );
              })}
            </div>
            <div className="recommend">
              <Title title="为你推荐" />
              <div className="recommend-list">
                <div className="recommend-item">
                  <Picture
                    circle={false}
                    size={200}
                    emptyElement={props => <div style={props.style} className={props.className} />}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72yqdE9opUl3aiimoZ-MilU5QdxFkK8AaAN6zUY1yrC2SuDWq"
                  />
                  <div className="recommend-name">得力双层保温盒</div>
                  <div className="recommend-price">121积分</div>
                </div>
                <div className="recommend-item">
                  <Picture
                    circle={false}
                    size={200}
                    emptyElement={props => <div style={props.style} className={props.className} />}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72yqdE9opUl3aiimoZ-MilU5QdxFkK8AaAN6zUY1yrC2SuDWq"
                  />
                  <div className="recommend-name">得力双层保温盒</div>
                  <div className="recommend-price">121积分</div>
                </div>
                <div className="recommend-item">
                  <Picture
                    circle={false}
                    size={200}
                    emptyElement={props => <div style={props.style} className={props.className} />}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR72yqdE9opUl3aiimoZ-MilU5QdxFkK8AaAN6zUY1yrC2SuDWq"
                  />
                  <div className="recommend-name">得力双层保温盒</div>
                  <div className="recommend-price">121积分</div>
                </div>
              </div>
            </div>
          </div>
          <div className="admission">入驻申请</div>
        </PageWithHeader>
      </div>
    );
  }
}

export default Comp;
