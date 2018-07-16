import React from 'react';
import PropTypes from 'prop-types';
import './style.less';

class Rank extends React.PureComponent {

  static propTypes = {
    num: PropTypes.number.isRequired
  };

  render() {
    const {num} = this.props;
    if (num > 0 && num < 4) {
      return <img src={require(`../../images/${num}.png`)} className="rank-item img" />
    }
    return <span className="rank-item text">{num}</span>
  }
}

export default Rank;
