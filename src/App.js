import React from 'react';
import Webcam from './Webcam';
import './App.css';
import {Container, Row, Col, ButtonGroup, Button, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      availableDevices : [],
      activeDevices: []
    }
    this.getAvaiableWebCams();
    this.removeWebCam = this.removeWebCam.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
                  label: device.label
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
  removeWebCam(deviceId) {
    let a = this.state.activeDevices.filter((a) => (a !== deviceId));
    console.log(a);
    this.setState({
      activeDevices: a
    });
  }
  handleChange(value) {
    this.setState({
      activeDevices: value
    });
  }
  render() {
    let avaiable = this.state.availableDevices.map((data, i)=>{return (<button key={i} onClick={(e)=>{this.addWebCam(data.id)}}>{data.label+ "-" + data.id}</button>)});
    return (
    <div className="App">
      <Container fluid className="mt-5">
        <Row>
          <Col md="3">
            <ButtonGroup vertical>
              <ToggleButtonGroup
                  vertical
                  type="checkbox"
                  value={this.state.activeDevices}
                  onChange={this.handleChange}
                >
                {this.state.availableDevices.map((data, i) => {
                  return (
                    <ToggleButton variant="success" key={i} value={data.id}>{data.label}</ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </ButtonGroup>
          </Col>
          <Col md="9">
            <Row>
              {this.state.availableDevices.map((data) => {
                if (this.state.activeDevices.includes(data.id)) {
                  return (           
                    <Col md="4">
                      <Webcam deviceId={data.id} remove={this.removeWebCam}></Webcam>
                    </Col>
                  );
              } else {
                return '';
              }})}
            </Row>  
          </Col>
        </Row>
      </Container>
    </div>);
  };
}

export default App;
