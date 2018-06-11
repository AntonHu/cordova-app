import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">大海区块链</h1>
        </header>
        <p className="App-intro">
          打完包，发蒲公英。还要集成codePush，jpush，友盟
        </p>
      </div>
    );
  }
}

export default App;
