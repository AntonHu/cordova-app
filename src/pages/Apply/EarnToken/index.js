import React from 'react';
import {ActivityCard, Header} from '../../../components';
import {Link} from 'react-router-dom';
import {ACTIVITIES} from '../constant';
import { observer, inject } from 'mobx-react';
import {VERIFY_STATUS} from '../../../utils/variable';
import './style.less';

@inject('userStore')
@observer
class EarnToken extends React.Component {
  render() {
    return (
      <div id="page-earn-token">
        <Header title="" transparent={true}/>
        <div className="title-bg" />

        <div className="cards-body">
          {
            Object.keys(ACTIVITIES).map(name => {
              const activity = ACTIVITIES[name];
              if (name === 'verify' && this.props.userStore.isKycInChain !== VERIFY_STATUS.UNAUTHORIZED) {
                return null
              }
              return (
                <Link to={activity.path}>
                  <ActivityCard
                    imageSrc={activity.imageSrc}
                    title={activity.title}
                    subTitle={activity.subTitle}
                    info={activity.info}
                  />
                </Link>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default EarnToken;
