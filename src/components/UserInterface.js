import React from 'react';
import commandData from  './commandSet.json.js'

const SPACE_CODE = 32;
const STATUS = {
    'idle': '空闲',
    'ready': '准备中',
    'recording': '录制中',
};
class UserInterface extends React.Component {
  constructor() {
    super();
    this.commandList = [];
    Object.keys(commandData).map(firstCls => {
        Object.keys(commandData[firstCls]).map(secondCls => {
            this.commandList = this.commandList.concat(commandData[firstCls][secondCls]['commands']);
        })
    });
    this.keyHandler = this.keyHandler.bind(this);
    this.getReady = this.getReady.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.state = {
        status: 'idle',
        currentIndex: -1
    };
  }
  
  keyHandler(event) {
      if (event.keyCode === SPACE_CODE) {
          switch (this.state.status) {
              case 'idle':
                  this.startRecording();
                  break;
              case 'ready':
                  this.startRecording();
                  break;
              case 'recording':
                  this.stopRecording();
                  break;
              default:
                  break;
          }
      }

  }

  getReady() {
      this.setState({
          currentIndex: this.state.currentIndex + 1,
          status: 'ready'
      });
  }

  startRecording() {
      this.setState({
          currentIndex: this.state.currentIndex + 1,
          status: 'recording'
      });
  }

  stopRecording() {
      if (this.state.currentIndex + 1 === this.commandList.length) {
          this.setState({currentIndex: -1});
      }
      this.setState({'status': 'idle'});
  }

  componentDidMount() {
      document.addEventListener("keydown", this.keyHandler, false);
  }

  componentWillUnmount() {
      document.removeEventListener("keydown", this.keyHandler, false);
  }

  render() {
    return (
      <div>
          {STATUS[this.state.status]}
          <hr/>
          <h1>{(this.state.status != 'idle')?(this.commandList[this.state.currentIndex]):''}</h1>
      </div>
    );
  }
}

export default UserInterface;
