import React from 'react';
import './Webcam.scss';
import PropTypes from 'prop-types';

class Webcam extends React.Component {
  constructor() {
    super();
    this.state = {
      isRecording: false,
      recorder: null,
      videoSrc: null,
      videoEle: null,
      startTime: 'time',
    };
    this.video = React.createRef();
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
  
  render() {
    // console.log(this.props.videoRef);
    return (
      <div className='vid_card' onClick={this.startRecording}>
        <video
          className='cam'
          controls
          autoPlay
          playsInline
          muted
          ref={this.props.videoRef}
        />
        <p className='cam_label'>{this.props.name}</p>
      </div>
    );
  }
}

Webcam.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Webcam;
