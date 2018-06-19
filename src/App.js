import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/commonText.less';

import Home from './pages/Home';
import RsaDemo from './pages/RsaDemo';

class App extends React.Component {
  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div className="App">
        <RsaDemo></RsaDemo>
      </div>
    );
  }
}

export default App;
