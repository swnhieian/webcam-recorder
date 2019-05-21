import React from 'react';
import Webcam from './Webcam';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      availableDevices : [],
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
            if (device.kind === 'videoinput') {
                videodevices.push({
                  id: device.deviceId,
                  label: device.label,
                  active: false
                });
            }
            return null;
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
  removeWebCam(event, deviceId) {
    let a = this.state.availableDevices;
    a.map((data) => {
      if (data.id === deviceId) {
        data.active = false;
      }
      return null;
    });
    console.log(a);
    this.setState({
      availableDevices: a
    });
  }
  addWebCam(event, deviceId) {
    let a = this.state.availableDevices;
    a.map((data) => {
      if (data.id === deviceId) {
        data.active = true;
      }
      return null;
    });
    console.log(a);
    this.setState({
      availableDevices: a
    });
//    this.activeDevices.push(deviceId);
  }
  render() {
    let avaiable = this.state.availableDevices.map((data, i)=>{return (<button key={i} onClick={(e)=>{this.addWebCam(e, data.id)}}>{data.label+ "-" + data.id}</button>)});
    return (
    <div className="App">
    {this.activeDevices}
    <hr/>
    {avaiable}
    {this.state.availableDevices.map((data) => {
      if (data.active) {
      return (<div><Webcam deviceId={data.id}></Webcam><button onClick={(e)=>{this.removeWebCam(e, data.id)}}>Remove</button></div>)
    } else {
      return '';
    }})}
    </div>);
  };
}

export default App;
