import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import Demo from './pages/Demo';
import GreenButton from './components/GreenButton';
import BlueBox from './components/BlueBox';
import Header from './components/Header';
import { Button } from 'antd-mobile';

class App extends React.Component {
  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    // TODO: 换成less或者sass
    // TODO: 整体的px响应式
    return (
      <div className="App">
        <Header title={'FWCSHHKJL'}/>
        <GreenButton onClick={() => {}}>取消</GreenButton>
        <Button>default</Button>

      </div>
    );
  }
}

export default App;
