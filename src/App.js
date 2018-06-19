import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/commonText.less';

import Home from './pages/Home';

class App extends React.Component {
  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div className="App">
        <Home></Home>
      </div>
    );
  }
}

export default App;
