import React from 'react';
// import logo from './logo.svg';
import './App.css';
import './styles/commonText.less';
import Routes from './router';
import SM2Demo from './pages/SM2Demo';


class App extends React.Component {
  componentWillMount() {}

  componentWillUnmount() {}

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
