import React from 'react';
// import logo from './logo.svg';
import './App.css';
import './styles/commonText.less';
import Routes from './router';
import {APP_ID} from './utils/variable';
import SM2Demo from './pages/SM2Demo';
import Secp256k1 from './pages/Secp256k1';

class App extends React.Component {

  render() {
    return (
      <div className="App" id={APP_ID}>
        <Routes/>
        {/*<SM2Demo />*/}
        {/*<Secp256k1 />*/}
        {/*<Home/>*/}
      </div>
    );
  }
}

export default App;
