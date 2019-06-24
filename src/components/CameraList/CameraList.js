import React, { useState, useEffect } from 'react';
// import sample_cam from '../../assets/svg/sample-cam.svg';
import Webcam from '../Webcam/Webcam.js';
import RecordRTC, { WebAssemblyRecorder } from 'recordrtc';
import qs from '../../utils/qs'

import './CameraList.scss';

export default function CameraList(props) {
  const [availableCams, setAvailableCams] = useState([]);

  function useAvailableWebCams() {
    useEffect(() => {
      
      // console.log(navigator);
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log('enumerateDevices() not supported.');
      } else {
        navigator.mediaDevices
          .enumerateDevices()
          .then(devices => {
            let videodevices = [];
            devices.map(function (device) {
              // console.log(
              //   device.kind + ': ' + device.label + ' id = ' + device.deviceId + ' group id = ' + device.groupId
              // );
              // console.log(device);

              if (device.kind === 'videoinput') {
                videodevices.push({
                  camera_info: {
                    id: device.deviceId,
                    label: device.label,
                    groupId: device.groupId
                  },
                  ref: React.createRef(),
                  recorder: null
                });
              }
              return null;
            });
            setAvailableCams(videodevices);

            // console.log('getAvailableDevices success!');
          })
          .catch(function (err) {
            console.log(err.name + ': ' + err.message);
          });
      }
    }, []);
  }



  let startAllCams = () => {
    availableCams.map(cam => {
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: (cam.mic_info) ? cam.mic_info.id : 'default'
          },
          video: {
            frameRate: {exact: 30, ideal: 30},
            width: {exact: 1920, ideal: 1920},
            height: {exact: 1080, ideal: 1080},
            deviceId: cam['camera_info'].id
          }
        })
        .then(camera => {
          let recorder = RecordRTC(camera, {
            recorderType: WebAssemblyRecorder,
            type: 'video',
            frameRate: 30,
            desiredSampRate: 16000,
            width: 1920,
            height: 1080,
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
      return availableCams;
    });
  };

  let stopAllCams = () => {
    availableCams.map(cam => {
      let recorder = cam['recorder'];
      if (recorder !== null) {
        recorder.stopRecording(() => {
          let blob = recorder.getBlob();
          console.log(
            '%c recorded data',
            'background: #222; color: #bada55',
            blob
          );
          props.socket.emit('client: save data', {
            name: qs["name"],
            sentence_index: qs["sentence_index"],
            camera_id: cam['camera_info'].id,
            blob: blob
          });
          let video = cam['ref'];
          video.current.srcObject = null;
          video.current.src = URL.createObjectURL(blob);
          cam['ref'] = video;
          recorder.camera.stop();
          recorder.destroy();
          cam['recorder'] = null;
        });
      }
      return availableCams;
    });
  };

  useAvailableWebCams();

  props.socket.on('server: start cams', function () {
    startAllCams();
  });

  props.socket.on('server: stop cams', function () {
    stopAllCams();
  });

  let findMatchingAudio = () => {
    availableCams.map(cam => {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.map(device => {
          if (device.kind === 'audioinput' && 
              device.groupId === cam.camera_info.groupId) {
            cam.mic_info = {id: device.deviceId, label: device.label}
          }
          return device;
        });
      });
      return cam;
    });
  }

  let renderCams = () => {
    findMatchingAudio();

    let cams_list = availableCams.map(cam => {
      return (
        <Webcam
          key={cam['camera_info'].id}
          name={'ID: ' + cam['camera_info'].id.substring(0, 15)}
          videoRef={cam['ref']}
        />
      );
    });


    return (
      <div id='camera_list'>
        <button onClick={startAllCams}>start all cams</button>
        <button onClick={stopAllCams}>stop all cams</button>

        <div>
          <div className='cameras'>{cams_list}</div>
        </div>
      </div>
    );
  };



  return renderCams();
}
