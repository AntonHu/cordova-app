import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/commonText.less';

import Home from './pages/Home';
import RsaDemo from './pages/RsaDemo';
import MyData from './pages/User/MyData';
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
