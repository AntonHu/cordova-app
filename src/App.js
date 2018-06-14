import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import Demo from './pages/Demo';
import {BlueBox, GreenButton, Header, PeakBox, Popup} from './components';
import { Button } from 'antd-mobile';

class App extends React.Component {
  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div className="App">
        <Header title={'FWCSHHKJL'}/>
        <BlueBox/>
        <PeakBox>
          <GreenButton size={'big'} onClick={() => {}}>取消</GreenButton>
          <Button>default</Button>
        </PeakBox>
        <Popup />
      </div>
    );
  }
}

export default App;
