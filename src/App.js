import React from 'react';
import Webcam from './Webcam';
import './App.css';
import {Container, Row, Col, ButtonGroup, ToggleButton, ToggleButtonGroup, Button} from 'react-bootstrap';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      availableDevices : [],
      activeDevices: []
    }
    this.getAvailableWebCams();
    this.removeWebCam = this.removeWebCam.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  getAvailableWebCams() {
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
  toggleAll = () => {
    console.log(this.camsOpen());
    if (!this.camsOpen()) {
      const ret = [];
      this.state.availableDevices.forEach(data => {
        ret.push(data.id);
      });
      this.setState({
        activeDevices: ret
      });
      console.log(this.state.activeDevices.length === 0);
    } else {
      this.setState({
        activeDevices: []
      });
    }
  }
  camsOpen = () => {
    return this.state.activeDevices.length !== 0;
  }
  _getBtns = (btnType) => {
    const buttons = []
    if (btnType === 'start') {
      btnType = 0
    } else if (btnType === 'stop') {
      btnType = 1
    } else {
      return buttons;
    }
    if (this.camsOpen() && document.getElementsByClassName('col-md-9')) {
      const numOpen = document.getElementsByClassName('col-md-9')[0].children[0].childElementCount;
      for (let i = 0; i < numOpen; i++) {
        const card = document.getElementsByClassName('col-md-9')[0].children[0].children[i];
        buttons.push(card.children[0].children[2].children[btnType])
      }
    }
    return buttons;
  }

  _clickBtns = (btns) => {
    btns.forEach((data) => {
      data.click();
    });
  }
  _changeRecordBtnLabel = () => {
    const recordBtn = document.getElementById('recordBtn');
    const label = recordBtn.innerHTML;
    recordBtn.innerHTML = (label === 'Start Recording') ? 'Stop Recording' : 'Start Recording'
    // recordBtn.style();
  }
  _startedRecording = () => {
    const recordBtn = document.getElementById('recordBtn');
    const label = recordBtn.innerHTML;
    return (label === 'Stop Recording');
  }
  record = (e) => {
    if (!this._startedRecording()) {
      const startButtons = this._getBtns('start');
      this._clickBtns(startButtons);
    }
    else {
      const stopButtons = this._getBtns('stop');
      this._clickBtns(stopButtons);

    }
    this._changeRecordBtnLabel()

  }

  render() {
    return (
      <div className='App'>
        <Container fluid className='mt-5'>
          <Row>
            <Col md='3'>
              <ButtonGroup vertical>
                <ToggleButtonGroup
                  vertical
                  type='checkbox'
                  value={this.state.activeDevices}
                  onChange={this.handleChange}
                >
                  {this.state.availableDevices.map((data, i) => {
                    return (
                      <ToggleButton
                        variant='success'
                        key={i}
                        value={data.id}
                      >
                        {data.label}
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
                <ButtonGroup>
                  <Button
                    onClick = { this.toggleAll }
                  >
                    Toggle All
                  </Button>
                  <Button id="recordBtn" disabled = { !this.camsOpen() } onClick = { this.record }>Start Recording</Button>
                </ButtonGroup>
              </ButtonGroup>
            </Col>
            <Col md='9'>
              <Row>
                {this.state.availableDevices.map((data, idx) => {
                  if (this.state.activeDevices.includes(data.id)) {
                    return (
                      <Col md='4' key={idx}>
                        <Webcam
                          deviceId={data.id}
                          remove={this.removeWebCam}
                        />
                      </Col>
                    );
                  } else {
                    return '';
                  }
                })}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };
}

export default App;
