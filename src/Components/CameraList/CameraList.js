import React, { useState, useEffect } from 'react';
// import sample_cam from '../../assets/svg/sample-cam.svg';
import Webcam from '../Webcam/Webcam.js';
import RecordRTC from 'recordrtc';

export default function CameraList(props) {
  const [availableCams, setAvailableCams] = useState([]);
  const [blobs, saveBlobs] = useState([]);
  const [videoEle, updateVideoEle] = useState(React.createRef());

  function getAvailableWebCams() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
    } else {
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          let videodevices = [];
          devices.map(function(device) {
            // console.log(
            //   device.kind + ': ' + device.label + ' id = ' + device.deviceId
            // );
            if (device.kind === 'videoinput') {
              videodevices.push({
                id: device.deviceId,
                label: device.label
              });
            }
            return null;
          });
          if (availableCams.length === 0) {
            setAvailableCams(videodevices);
          }
          // console.log('getAvailableDevices success!');
        })
        .catch(function(err) {
          console.log(err.name + ': ' + err.message);
        });
    }
  }
  let recordData = (blob, name) => {
    saveBlobs(blobs.push([name, blob]));
  };

  let checkRecordingStatus = () => {
    fetch(props.server_ip + '/check_recording_status')
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson.recording);
        return myJson.recording;
      });
  }

  let startAllCams = () => {
    availableCams.map((cam) => {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 1920,
            height: 1080,
            // deviceId: cam.id
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
          // this.setState({
          //   recorder: recorder,
          //   startTime: this.getCurrentTime()
          // });
          console.log("the lame one", videoEle)
          let video = videoEle;
          video.current.srcObject = camera;
          updateVideoEle(video)
          recorder.startRecording();
          // this.setState({
          //   isRecording: true
          // });
          console.log('start');
        })
        .catch(error => {
          console.error(error);
        });

    });
  };

  useEffect(() => {
    setInterval(() => {
      // checkRecordingStatus();
      // if (checkRecordingStatus()) {
      //   startAllCams();
      // }
    }, 1000);
  })

  let getCams = () => {
    let num_cams = [...Array(10).keys()];
    let cams_list = availableCams.map(cams => {
      return <Webcam key={cams.id} name={'ID: ' + (cams.id.substring(0,15))} videoEle={videoEle} />;
    });
    getAvailableWebCams();
    // console.log(availableCams);

    return (
      <div>
        <button onClick={startAllCams}>start all cams</button>
        <div>
          <div className='cameras'>{cams_list}</div>
        </div>
      </div>
    );
  };

  return getCams();
}
