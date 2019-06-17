import React from 'react';
import RecordRTC from 'recordrtc';
import './Webcam.scss';
import PropTypes from 'prop-types';

class Webcam extends React.Component {
  constructor() {
    super();
    this.state = {
      isRecording: false,
      recorder: null,
      videoSrc: null,
      videoEle: React.createRef(),
      startTime: 'time',
    };
    this.video = React.createRef();
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
  }
  // todo: this function no longer works, only cameralist one works
  // todo: need to see if camera list fuction actually starts all
  startRecording() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: 1920,
          height: 1080,
          // deviceId: this.props.deviceId
        }
      })
      .then(camera => {
        let recorder = RecordRTC(camera, {
          type: 'video',
          framerate: 30,
          desiredSampRate: 16000,
          numberOfAudioChannels: 2
        });
        recorder.camera = camera;
        this.setState({
          recorder: recorder,
          startTime: this.getCurrentTime()
        });
        let video = this.state.videoEle;
        video.current.srcObject = camera;
        this.setState({
          videoEle: video
        });
        //this.state.videoEle.current.srcObject = camera;
        this.state.recorder.startRecording();
        this.setState({
          isRecording: true
        });
        console.log('start');
      })
      .catch(error => {
        console.error(error);
      });
  }
  getCurrentTime() {
    let today = new Date();
    let date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    let time = today.getTime(); //today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + '-' + time;
  }
  stopRecording() {
    this.state.recorder.stopRecording(() => {
      let blob = this.state.recorder.getBlob();
      // FileSaver.saveAs(blob, this.state.startTime +'-' + this.state.name);
      console.log(
        '%c recorded data',
        'background: #222; color: #bada55',
        this.props.recordData(
          blob,
          this.state.startTime + '-' + this.state.name
        )
      );

      let video = this.state.videoEle;
      video.current.srcObject = null;
      video.current.src = URL.createObjectURL(blob);
      //this.state.videoEle.current.src =
      this.setState({
        videoEle: video
      });
      this.state.recorder.camera.stop();
      this.state.recorder.destroy();
      this.setState({
        recorder: null
      });
    });
    this.setState({
      isRecording: false
    });
  }
  render() {
    return (
      <div className='vid_card' onClick={this.startRecording}>
        <video
          className='cam'
          controls
          autoPlay
          playsInline
          muted
          ref={this.props.videoEle}
        />

        <p className='cam_label'>{this.props.name}</p>
      </div>
    );
  }
}

Webcam.propTypes = {
  name: PropTypes.string.isRequired,
  videoEle: PropTypes.object.isRequired
};

export default Webcam;
