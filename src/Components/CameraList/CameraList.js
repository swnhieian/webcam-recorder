import React, { useState, useEffect } from 'react';
// import sample_cam from '../../assets/svg/sample-cam.svg';
import Webcam from '../Webcam/Webcam.js';
import RecordRTC from 'recordrtc';

export default function CameraList(props) {
  const [availableCams, setAvailableCams] = useState([]);
  const [blobs, saveBlobs] = useState([]);

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
                camera_info: {
                  id: device.deviceId,
                  label: device.label
                },
                ref: React.createRef(),
                recorder: null
              })
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
  
  let checkRecordingStatus = () => {
    fetch(props.server_ip + '/check_recording_status')
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson)
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
            deviceId: cam['camera_info'].id
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
          cam['recorder'] = recorder;
          let video = cam['ref'];
          video.current.srcObject = camera;
          recorder.startRecording();
        })
        .catch(error => {
          console.error(error);
        });
    });
  };

  let stopAllCams = () => {
    availableCams.map(cam =>
      {
        let recorder = cam['recorder']
        recorder.stopRecording(() => {
          let blob = recorder.getBlob();
          console.log(
            '%c recorded data',
            'background: #222; color: #bada55',
            recordData(
              blob,
              new Date().toDateString()
            )
          );
          let video = cam['ref'];
          video.current.srcObject = null;
          video.current.src = URL.createObjectURL(blob);
          cam['ref'] = video;
          recorder.camera.stop();
          recorder.destroy();
          cam['recorder'] = null;
        })
      })
  }

  let recordData = (blob, name) => {
    saveBlobs(blobs.push([name, blob]));
  };

  let renderCams = () => {
    getAvailableWebCams();
    let cams_list = availableCams.map((cam) => {
      return <Webcam key={cam['camera_info'].id} name={'ID: ' + (cam['camera_info'].id.substring(0,15))} videoRef={cam['ref']}/>;
    });
    
    return (
      <div>
        <button onClick={startAllCams}>start all cams</button>
        <button onClick={stopAllCams}>stop all cams</button>
        <button onClick={checkRecordingStatus}>check recording status</button>

        <div>
          <div className='cameras'>{cams_list}</div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setInterval(() => {
      if (checkRecordingStatus()) {
        startAllCams();
      } else {
        stopAllCams();
      }
    }, 1000)
  }, [])

  return renderCams();
}
