import React from 'react';
// import logo from './logo.svg';
import './App.css';
import './styles/commonText.less';

import Routes from './router';

class App extends React.Component {
  componentWillMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="App">
        <Routes />
        {/*<Home/>*/}
      </div>
    );
  }
}

export default App;
