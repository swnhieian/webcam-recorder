import React from 'react';
import logo from './logo.svg';
import Webcam from './Webcam';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      availableDevices : [],
      activeDevices: []
    }
    this.getAvaiableWebCams();
    this.addWebCam = this.addWebCam.bind(this);
  }
  getAvaiableWebCams() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
    }
    navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          let videodevices = [];
          devices.map(function(device) {
            console.log(device.kind + ": " + device.label +
                " id = " + device.deviceId);
            if (device.kind=='videoinput') {
                videodevices.push(device.deviceId);
            }
          });
          this.setState({
            availableDevices: videodevices
          });
          console.log("getAvailableDevices success!");
        })
        .catch(function(err) {
            console.log(err.name + ": " + err.message);
        });
  }
  addWebCam() {
    this.setState({
      activeDevices: [this.state.availableDevices[0]]
    });
  }
  render() {
    let webcams = this.state.activeDevices.map((data) => {
      return (<Webcam deviceId={data}></Webcam>);
    });
    let avaiable = this.state.availableDevices.map((data)=>{return (<div>{data}</div>)});
    return (
    <div className="App">
    {this.state.activeDevices.map((data)=>{return (data+',')})}<hr/>
    {avaiable}
      <button onClick={this.addWebCam}>add</button>
      {webcams}
    </div>);
  };
}

export default App;
