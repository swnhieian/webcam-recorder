/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
// import sample_cam from '../../assets/svg/sample-cam.svg';
import Webcam from '../Webcam/Webcam.js';
import RecordRTC, { MediaStreamRecorder } from 'recordrtc';
import qs from '../../utils/qs'

import './CameraList.scss';
const matchedDeviceList = {
  'e202102a3710910e7bec39e5617309c7cd746457bad4cefb974db56703f624be' : '5704662d325421d22cd6ac36a34b0f3bbc122b72826381a3e6963f3ca66021ab',
  '53e6d1ce5c5155dc835b0670f16924f80b83ef8ab924d56594e743fe8fef9707' : '7ea3a51c084b6ef70972173aec1d541feaa191c1e17410de719d16450137b5b0',
  'd2f9c06f0fd3c971c33d50d07ada0cf61bd63812c004d948adaaa15c964c94c9' : 'b951f9dcfaa8f2887b629736f230142a9d18b8afc88ae6bd6f3c0946e4fad20f',
  'b2a6f55d31cda49fe87a1a87dca3eb2939d20b77505d73c5942b3880b18a48bf' : 'dc5ca9d0ff799f2bcc2a2fd131eea5a5307e9616d01de2946d09e73bb887f2a2',
  '8199fe2c373a8d4456b04e311ed7f98670411c182974def4fd81249e47665de4' : 'e466a62b086d05daadf2afe460d0a207f60cac8613fe82cff45cc6c330a91084',
  'bcb109e5b537b4b8519fc10797c86d313a22480d194f6b44477aaa45a27c7876' : '1db7be4b7c5815530412e44f8fd7f5f81cddb1ce6f26b8ac2b3e514716247ba6',
  'f80598a32e03e00858cc7591ff533d205d6e768177d1ab04a3c449b2bd954a08' : '8d742fd8e09d8bca7e53945c6abf2b5149c1cba92e0f743b5975e054ac5ab061',
  'bebf6b071073727465bb5001223af255af8fa788fbf897aa781a9a7d66ee3222' : '8f8a3a01032c360c96b0f6a8f5770bb43aa07d430d495f35ea46a3af47e079e0',
  'a37d9289204bc3893f687e01228f2be6021809752a116d8c3ab0a6f76dc2f844' : '785cb91e7331d5d0dddaa04300c767415e0eef26b39ba735aaaccec1e18f9280',
   'bef0b109c5c3c0bc4bc2d2ed22cfe768c9a11b7b7e29d540ede820c0a6472355' : '81c60d7dcdae0c9b5aec2e716f2d8fc37751ba2d7c7decb44070524c65b7f583',
   'fe81f26ea9b062d5fe9573c26a13469b6e7c05b6d7293b144e2d11e1020c0444' : 'abdb69a376084814b2927346a721848146b473d16c469f4b164f7777a772fcd2',
   //'bcb109e5b537b4b8519fc10797c86d313a22480d194f6b44477aaa45a27c7876' : '1db7be4b7c5815530412e44f8fd7f5f81cddb1ce6f26b8ac2b3e514716247ba6',
   //'f80598a32e03e00858cc7591ff533d205d6e768177d1ab04a3c449b2bd954a08' : '8d742fd8e09d8bca7e53945c6abf2b5149c1cba92e0f743b5975e054ac5ab061',
   //'bebf6b071073727465bb5001223af255af8fa788fbf897aa781a9a7d66ee3222' : '8f8a3a01032c360c96b0f6a8f5770bb43aa07d430d495f35ea46a3af47e079e0'
};
   


export default function CameraList(props) {
  const [availableCams, setAvailableCams] = useState([]);
  const [recordingStatus, setRecordingStatus] = useState("recording-status-loading...");

  const initCams = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
    } else {
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          let videodevices = [];
          devices.map(function(device) {
            // console.log('%c ' + device.kind,
            // 'background: #222; color: #bada55',
            // device);
            // console.log(
            //   device.kind + ': ' + device.label + ' id = ' + device.deviceId + ' group id = ' + device.groupId
            // );
            // console.log(device);
            if (device.kind === 'videoinput') {
              let videoDevice = {
                camera_info: {
                  id: device.deviceId,
                  label: device.label,
                  groupId: device.groupId
                },
                ref: React.createRef(),
                recorder: null
              };
              if (device.deviceId in matchedDeviceList) {
                videoDevice.mic_info = {
                  id: matchedDeviceList[device.deviceId]
                };
              } else {
                // alert("device not match!!!");
                console.error('device not match!!!');
              }
              videodevices.push(videoDevice);
            }
            return null;
          });
          setAvailableCams(videodevices);
          document.getElementById('startBtn').click();
          document.getElementById('startBtn').disabled = true;
          props.socket.emit('client: init cams to remove first vid');
          // console.log('getAvailableDevices success!');
        })
        .catch(function(err) {
          console.log(err.name + ': ' + err.message);
        });
    }
  }

  function useAvailableWebCams() {
    //  runs once
    useEffect(() => {
      props.updateConnectionStatus();
      initCams();
    }, []);

    // runs multiple times
    useEffect(() => {
      console.log('%c' + JSON.stringify(recordingStatus), 'background: #222; color: #bada55');
      props.updateConnectionStatus(recordingStatus);
    }, [recordingStatus])
  }

  const initCamsDummy = () => {
    stopAllCams();
  }

  const startAllCams = () => {
    const temp = {}
    // goes through all cams array and through each ID, accesses and opens it using navigator
    availableCams.map(cam => {
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: {exact: (cam.mic_info) ? cam.mic_info.id : 'default'}
          },
          video: {
            frameRate: {exact: 30, ideal: 30},
            width: {ideal: 1920},
            height: {ideal: 1080},
            deviceId: cam['camera_info'].id
          }
        })
        .then(camera => {
          // console.log(camera.getTracks().forEach(track=> {console.log("track:" + track.label + "," + track.kind)}));
          // console.log("////////////////////////");
          let recorder = RecordRTC(camera, {
            recorderType: MediaStreamRecorder, //WebAssemblyRecorder,
            type: 'video',
            frameRate: 30,
            desiredSampRate: 16000,
            width: 1920,
            height: 1080,
            numberOfAudioChannels: 2
          });
          if (recorder.getState() !== 'recording') {
            recorder.camera = camera;
            cam['recorder'] = recorder;
            let video = cam['ref'];
            video.current.srcObject = camera;
            // resetInitialCams(recorder);
            recorder.startRecording();
            // const camStatus = {};
            // camStatus[cam['camera_info'].id.substring(0, 15)] = recorder.getState();
            // computerStatus[computerID].push(camStatus);
            // console.log('%c' + JSON.stringify(computerStatus), 'background: #222; color: #bada55');
            // recorder.pauseRecording();
          }
          temp[cam['camera_info'].id.substring(0, 15)] = recorder.getState();
          setRecordingStatus(temp);
          console.log('%cstart cams'  + JSON.stringify(temp), 'background: #fff; color:#ff0000')
        })
        .catch(error => {
          console.error(error);
        });
        return availableCams;
    });
  };

  const stopAllCams = () => {
    const temp = {};
    availableCams.map(cam => {
      let recorder = cam['recorder'];
      if (recorder !== null) {
        recorder.stopRecording(() => {
          let blob = recorder.getBlob();
          // console.log(computerStatus[computerID]);
          // computerStatus[computerID] = computerStatus[computerID].map(camera_status => {
          //   console.log(camera_status);
          // });
          // const camStatus = {};
          // camStatus[cam['camera_info'].id.substring(0, 15)] = recorder.getState();
          // computerStatus[computerID].push(camStatus);
          // console.log(
          //   '%c' + JSON.stringify(computerStatus),
          //   'background: #222; color: #bada55'
          // );
          console.log(
            '%c recorded data',
            'background: #222; color: #bada55',
            blob
          );
          
          props.socket.emit('client: save data', {
            name: qs("name"),
            sentence_index: qs("sentence_index"),
            camera_id: cam['camera_info'].id,
            blob: blob
          });

        });
        temp[cam['camera_info'].id.substring(0, 15)] = recorder.getState();
        setRecordingStatus(temp);
        console.log('%cstop cams ' + JSON.stringify(temp), 'background: #fff; color:#ff0000');
      }
      return availableCams;
    });
  };

  const resumeAllCams = () => {
    const temp = {}
    availableCams.map(cam => {
      let recorder = cam['recorder'];
      let state = recorder.getState();
      if (state === "paused") {
        recorder.resumeRecording();
      } else if (state === "stopped"){
        recorder.startRecording();
      }
      temp[cam['camera_info'].id.substring(0, 15)] = recorder.getState();
      setRecordingStatus(temp);
      console.log('%cresume cams'  + JSON.stringify(temp), 'background: #fff; color:#ff0000');
      return availableCams;
    });
  }

  useAvailableWebCams();

  // dummy to fix bug of first video
  props.socket.on('server: init cams to remove first vid', function() {
    document.getElementById("initCams").click();
    document.getElementById("initCams").disabled = true;
    console.log('%cdoes this happen????', 'color:#FF0000');
  })

  // this is actually what calls start cams
  props.socket.on('server: start cams', function () {
    document.getElementById("resumeBtn").click();
    document.getElementById("resumeBtn").disabled = true;
    document.getElementById('stopBtn').disabled = false;

  });

  // this is actually what calls stop cams
  props.socket.on('server: stop cams', function () {
    document.getElementById('stopBtn').click();
    document.getElementById('stopBtn').disabled = true;
    document.getElementById("resumeBtn").disabled = false;
  });


  // let findMatchingAudio = () => {
  //   availableCams.map(cam => {
  //     if (!(cam.camera_info.id in matchedDeviceList)) {
  //       console.log('%c error when find matching audio device',
  //       'background: #222; color: #f00');
  //       alert("error when find matching audio device");
  //       return cam;
  //     }
  //     navigator.mediaDevices.enumerateDevices().then(devices => {
  //       devices.map(device => {
  //         if (device.kind === 'audioinput' && device.deviceId === matchedDeviceList[cam.camera_info.id]) {
  //             //device.groupId === cam.camera_info.groupId) {
  //           cam.mic_info = {id: device.deviceId, label: device.label}
  //         }
  //         return device;
  //       });
  //     });
  //     return cam;
  //   });
  // }

  const debugControls = (debug) => {
    if (debug) {
      return (
        <div>
          {/* <p>Don't click these while actual testing</p> */}
          <button id="initCams" onClick={initCamsDummy}>Init Cams</button>
          <button id="startBtn" onClick={startAllCams}>start and pause all cams</button>
          <button id="resumeBtn" onClick={resumeAllCams}>resume all cams</button>
          <button id="stopBtn" onClick={stopAllCams}>stop all cams</button>
          {/* <button id="setCompID" onClick={getSetCompID}>get set computer ID</button> */}
        </div>
      )
    }
  }

  const renderCams = () => {
    //findMatchingAudio();
    //console.log(availableCams);

    // console.log(computerId);
    
    const debug = true;
    const comp_camsList = availableCams.map(cam => {
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
        {debugControls(debug)}
        <div>
          <div className='cameras'>{comp_camsList}</div>
        </div>
      </div>
    );
  };
  
  return renderCams();
}
