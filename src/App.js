import React from 'react';
// import logo from './logo.svg';
import './App.css';
import './styles/commonText.less';
import Routes from './router';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Routes/>
        {/*<SM2Demo />*/}
        {/*<Home/>*/}
      </div>
    );
  }
}

export default App;
