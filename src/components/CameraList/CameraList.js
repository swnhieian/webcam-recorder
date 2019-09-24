/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
// import sample_cam from '../../assets/svg/sample-cam.svg';
import Webcam from '../Webcam/Webcam.js';
import RecordRTC, { MediaStreamRecorder } from 'recordrtc';
import qs from '../../utils/qs'
import cogoToast from 'cogo-toast';
// import PropTypes from 'prop-types';

// const matchedDeviceList = {
//   'e202102a3710910e7bec39e5617309c7cd746457bad4cefb974db56703f624be' : '5704662d325421d22cd6ac36a34b0f3bbc122b72826381a3e6963f3ca66021ab',
//   '53e6d1ce5c5155dc835b0670f16924f80b83ef8ab924d56594e743fe8fef9707' : '7ea3a51c084b6ef70972173aec1d541feaa191c1e17410de719d16450137b5b0',
//   'd2f9c06f0fd3c971c33d50d07ada0cf61bd63812c004d948adaaa15c964c94c9' : 'b951f9dcfaa8f2887b629736f230142a9d18b8afc88ae6bd6f3c0946e4fad20f',
//   'b2a6f55d31cda49fe87a1a87dca3eb2939d20b77505d73c5942b3880b18a48bf' : 'dc5ca9d0ff799f2bcc2a2fd131eea5a5307e9616d01de2946d09e73bb887f2a2',
//   '8199fe2c373a8d4456b04e311ed7f98670411c182974def4fd81249e47665de4' : 'e466a62b086d05daadf2afe460d0a207f60cac8613fe82cff45cc6c330a91084',
//   'bcb109e5b537b4b8519fc10797c86d313a22480d194f6b44477aaa45a27c7876' : '1db7be4b7c5815530412e44f8fd7f5f81cddb1ce6f26b8ac2b3e514716247ba6',
//   'f80598a32e03e00858cc7591ff533d205d6e768177d1ab04a3c449b2bd954a08' : '8d742fd8e09d8bca7e53945c6abf2b5149c1cba92e0f743b5975e054ac5ab061',
//   'bebf6b071073727465bb5001223af255af8fa788fbf897aa781a9a7d66ee3222' : '8f8a3a01032c360c96b0f6a8f5770bb43aa07d430d495f35ea46a3af47e079e0',
//   'a37d9289204bc3893f687e01228f2be6021809752a116d8c3ab0a6f76dc2f844' : '785cb91e7331d5d0dddaa04300c767415e0eef26b39ba735aaaccec1e18f9280',
//    'bef0b109c5c3c0bc4bc2d2ed22cfe768c9a11b7b7e29d540ede820c0a6472355' : '81c60d7dcdae0c9b5aec2e716f2d8fc37751ba2d7c7decb44070524c65b7f583',
//    'fe81f26ea9b062d5fe9573c26a13469b6e7c05b6d7293b144e2d11e1020c0444' : 'abdb69a376084814b2927346a721848146b473d16c469f4b164f7777a772fcd2',
//    //'bcb109e5b537b4b8519fc10797c86d313a22480d194f6b44477aaa45a27c7876' : '1db7be4b7c5815530412e44f8fd7f5f81cddb1ce6f26b8ac2b3e514716247ba6',
//    //'f80598a32e03e00858cc7591ff533d205d6e768177d1ab04a3c449b2bd954a08' : '8d742fd8e09d8bca7e53945c6abf2b5149c1cba92e0f743b5975e054ac5ab061',
//    //'bebf6b071073727465bb5001223af255af8fa788fbf897aa781a9a7d66ee3222' : '8f8a3a01032c360c96b0f6a8f5770bb43aa07d430d495f35ea46a3af47e079e0'
// };
   


export default function CameraList(props) {
  const [availableCams, setAvailableCams] = useState([]);
  const [recordingStatus, setRecordingStatus] = useState("recording-status-loading...");
  const [availableMics, setAvailableMics] = useState([]);

  const helper_extractRelevantCamInfo = device => {
    return {
      camera_info: {
        id: device.deviceId,
        label: device.label,
        groupId: device.groupId
      },
      ref: React.createRef(),
      recorder: null
    };
  }
  const helper_addToVideoDevices = (device, videodevices) => {
    
    // videoDevice.mic_info = 
    // if (device.deviceId in matchedDeviceList) {
    //   videoDevice.mic_info = {
    //     id: matchedDeviceList[device.deviceId]
    //   };
    // } else {
    // alert("device not match!!!");
    //   console.error('device not match!!!');
    // }
    videodevices.push(helper_extractRelevantCamInfo(device));
  }

  const helper_addToMicDevices = (device, micDevices) => {
    micDevices.push(device);
  }

  const initCams = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
    } else {
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          let videoDevices = [];
          let micDevices = [];
          const numCams = devices.reduce((accumulator, device) => {
            return device.kind === 'videoinput' ? accumulator + 1 : accumulator;
          }, 0);
          console.log("number of cams detected: " + numCams);
          devices.map(function(device) {
            // console.log('%c ' + device.kind,
            // 'background: #222; color: #bada55',
            // device);
            if (device.kind === 'audioinput') {
              // console.log(
              //   '%c' +
              //     device.kind +
              //     ': ' +
              //     device.label +
              //     ' id = ' +
              //     device.deviceId +
              //     ' group id = ' +
              //     device.groupId,
              //   'background: green'
              // );
              if (
                !device.label.toLowerCase().includes('default') &&
                !device.label.toLowerCase().includes('communications')
              ) {
                helper_addToMicDevices(device, micDevices);
              }
            }            
            // console.log(device);
            if (device.kind === 'videoinput') {
              helper_addToVideoDevices(device, videoDevices);
              // console.log(
              //   '%c' +
              //     device.kind +
              //     ': ' +
              //     device.label +
              //     ' id = ' +
              //     device.deviceId +
              //     ' group id = ' +
              //     device.groupId +
              //     ' device ' +
              //     device,
              //   'background: red'
              // );
              // console.log(device);
            }
            return null;
          });
          setAvailableMics(micDevices);
          setAvailableCams(videoDevices);

          document.getElementById('startBtn').click();
          document.getElementById('startBtn').disabled = true;
          // console.log('getAvailableDevices success!');
        })
        .catch(function(err) {
          console.log(err.name + ': ' + err.message);
        });
    }
  }

  const initMics = () => {
    let id = 0;
    availableCams.map(cam => {
      if (availableMics[id]) cam.mic_info = availableMics[id++].deviceId;
    });

  }

  const addNewCamMic = () => {
    let newCamDevice = undefined;
    let newMicID = undefined;

    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
    } else {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        // console.log(devices);
        devices.map(device => {
          if (device.kind === "videoinput") {
            for (const cam of availableCams) {
              if (device.deviceId === cam.camera_info.id) {
                newCamDevice = undefined;
                break;
              } else {
                newCamDevice = helper_extractRelevantCamInfo(device);
              }
            }
          }
          if (
            device.kind === 'audioinput' &&
            (!device.label.toLowerCase().includes('default') &&
              !device.label.toLowerCase().includes('communications'))
          ) {
            // 
            for (const mic of availableMics) {
              if (device.deviceId === mic.deviceId) {
                newMicID = undefined;
                break;
              } else {
                newMicID = device.deviceId;
              }
            }
          }    
        })
      }).then(()=> {
        if (newCamDevice && newMicID) {
          newCamDevice.mic_info = newMicID;
          let temp = availableCams;
          temp.push(newCamDevice);
          setAvailableCams(temp);
          cogoToast.success('New camera: ' + newCamDevice.camera_info.id + ' added.');
          document.getElementById('startBtn').disabled = false;
          initCams();
        }
      });
    }    

  }



  function useAvailableWebCams() {
    //  runs once
    useEffect(() => {
      props.updateConnectionStatus();
      initCams();
      // console.log(props.addCamState);
      addNewCamMic();
    }, [props.addCamState]);
  }

  const initCamsDummy = () => {
    stopAllCams(true);
  }

  const startAllCams = () => {
    const temp =
    recordingStatus === 'recording-status-loading...' ? {} : recordingStatus;
    // goes through all cams array and through each ID, accesses and opens it using navigator
    availableCams.map(cam => {
      // console.log(cam.mic_info);
      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: {exact: (cam.mic_info) ? cam.mic_info : 'default'}
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
            numberOfAudioChannels: 2,
            disableLogs: true
          });
          if (recorder.getState() !== 'recording') {
            recorder.camera = camera;
            cam['recorder'] = recorder;
            let video = cam['ref'];
            video.current.srcObject = camera;
            // resetInitialCams(recorder);
            recorder.startRecording();
          }
          triggerRecordStatusUpdate(temp, recorder, cam);
        })
        .catch(error => {
          console.error(error);
        });
        return availableCams;
    });
  };

  const stopAllCams = (dummy) => {
    const temp =
      recordingStatus === 'recording-status-loading...' ? {} : recordingStatus;
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
          console.log('beep beep boop boop', dummy)
          if (dummy !== true) {
            props.socket.emit('client: save data', {
              name: qs("name"),
              sentence_index: qs("sentence_index"),
              camera_id: cam['camera_info'].id,
              blob: blob
            });
          } else {
            console.log('dummy received, did not save blob');
          }

        });
        triggerRecordStatusUpdate(temp, recorder, cam);
      }
      return availableCams;
    });
  };

  const triggerRecordStatusUpdate = (temp, recorder, cam) => {
    temp[cam['camera_info'].id.substring(0, 15)] = recorder.getState();
    setRecordingStatus(temp);
    props.updateConnectionStatus(temp);
  }

  const resumeAllCams = () => {
    const temp =
      recordingStatus === 'recording-status-loading...' ? {} : recordingStatus;
    availableCams.map(cam => {
      let recorder = cam['recorder'];
      let state = recorder.getState();
      if (state === "paused") {
        recorder.resumeRecording();
      } else if (state === "stopped"){
        recorder.startRecording();
      }
      triggerRecordStatusUpdate(temp, recorder, cam);
      return availableCams;
    });
  }

  useAvailableWebCams();

  // dummy to fix bug of first video
  props.socket.on('server: dummy vid, do not save', function() {
    document.getElementById('dummyBtn').click();
    document.getElementById('dummyBtn').disabled = true;
  });

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

  const debugControls = (debug) => {
    if (debug) {
      return (
        <div>
          {/* <p>Don't click these while actual testing</p> */}
          <button id="dummyBtn" onClick={initCamsDummy}>dummy reset</button>
          <button id="startBtn" onClick={startAllCams}>start and pause all cams</button>
          <button id="resumeBtn" onClick={resumeAllCams}>resume all cams</button>
          <button id="stopBtn" onClick={stopAllCams}>stop all cams</button>
          {/* <button id="setCompID" onClick={getSetCompID}>get set computer ID</button> */}
        </div>
      )
    }
  }

  const renderCams = () => {

    initMics();

    const debug = true;
    let i = 0; 
    const comp_camsList = availableCams.map(cam => {
      return (
        <Webcam
          key={i++}
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