import React from 'react';
import RecordRTC from 'recordrtc';

class Webcam extends React.Component {
    constructor(props) {
        super();
        this.state = {
            isRecording: false,
            recorder : null
        };
        this.video = React.createRef();
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
    }
    startRecording(e) {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: {
                width: 1920,
                height: 1080,
                deviceId: this.props.deviceId
            }
        })
        .then(camera => {
            let recorder = RecordRTC(camera, {
                type: 'video',
                framerate: 30,
                desiredSampRate: 16000,
                numberOfAudioChannels: 2
            });
            this.setState({
                recorder: recorder
            });
            this.video.srcObject = camera;
            this.state.recorder.camera = camera;
            this.state.recorder.startRecording();
            this.setState({
                isRecording: true
            });
            console.log("start");
        })
        .catch(error => {console.error(error);});
    }
    
    stopRecording(e) {
        this.state.recorder.stopRecording(()=> {
            this.state.recorder.camera.stop();
            this.state.recorder.destroy();
            this.setState({
                recorder : null
            });
        });
        this.setState({
            isRecording: false
        });
    }
    render() {    
        return (
        <div className="App">
        <button disabled={this.state.isRecording} onClick={this.startRecording}>Start Recording</button>
        <button disabled={!this.state.isRecording} onClick={this.stopRecording}>Stop Recording</button>
        <video controls autoplay playsinline ref={video => {this.video = video}} ></video>
        </div>
        );
    }
}

export default Webcam;
