/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
// import sample_cam from '../../assets/svg/sample-cam.svg';
import Webcam from '../Webcam/Webcam.js';
import RecordRTC, { MediaStreamRecorder } from 'recordrtc';
import qs from '../../utils/qs'
import cogoToast from 'cogo-toast';
// import PropTypes from 'prop-types';

export default function CameraList(props) {
  const [availableCams, setAvailableCams] = useState([]);
  const [recordingStatus, setRecordingStatus] = useState("recording-status-loading...");
  const [availableMics, setAvailableMics] = useState([]);
  const [pluggedInDevices, setPluggedInDevices] = useState([]);

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
    device = helper_extractRelevantCamInfo(device);
    // console.log(availableCams);
    const devicePrior = availableCams.filter(cam => {
      return cam.camera_info.id === device.camera_info.id
    })[0];
    // console.log(devicePrior);
    if (devicePrior) {
      // console.log('found prior device');
      device.mic_info = devicePrior.mic_info;
    } else {
      // console.log('using first cam mic!!!')
      device.mic_info = availableMics[0];
    }
    videodevices.push(device);
  }
  const helper_addToMicDevices = (device, micDevices) => {
    if (micDevices.indexOf(device.deviceId) < 0)
      micDevices.push(device);
  }
  const helper_getNumCams = devices => {
    const num = devices.reduce((accumulator, device) => {
      return device.kind === 'videoinput' ? accumulator + 1 : accumulator;
    }, 0);
    props.updateDetectedNumCams(num);
    return num;
  }

  const initCams = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
    } else {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        let videoDevices = [];
        let micDevices = [];
        helper_getNumCams(devices);

        // console.log("number of cams detected: " + numCams);
        devices.map(function(device) {
          if (device.kind === 'audioinput') {
            if (
              !device.label.toLowerCase().includes('default') &&
              !device.label.toLowerCase().includes('communications') && 
              !device.label.toLowerCase().includes('built-in')
            ) {
              helper_addToMicDevices(device, micDevices);
            }
          }            
          if (device.kind === 'videoinput') {
            helper_addToVideoDevices(device, videoDevices);
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
  // const initMics = () => {
  //   let id = 0;
  //   availableCams.map(cam => {
  //     if (availableMics[id]) cam.mic_info = availableMics[id++].deviceId;
  //   });
  // }

  Array.prototype.diff = function(a) {
    return this.filter(function(i) {
      return a.indexOf(i) < 0;
    });
  };

  const getNewMicCam = (newPluggedInID, allDevices) => {
    const newCam = allDevices.filter(device => {
      return (
        newPluggedInID.indexOf(device.deviceId) >= 0 &&
        device.kind === 'videoinput'
      );
    });
    // should only contain one 
    const newMic = allDevices.filter(device => {
      return (
        newPluggedInID.indexOf(device.deviceId) >= 0 &&
        device.kind === 'audioinput'
      ); 
    });
    if (newMic.length > 1) {
      console.error('multiple new mics detected')
    }
    if (newCam.length > 1) {
      console.error('multiple new cams detected');
    }
    const newMicID = newMic[0].deviceId;

    return [newMicID, newCam[0]];
  }

  const checkIfMac = (resolve) => {
    let faceTimeDevice = undefined;
    let defaultMic = undefined;
    return new Promise(() => {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        faceTimeDevice = devices.filter(device => {
          return device.label.toLowerCase().includes('facetime');
        });
        defaultMic = devices.filter(device => {
          return device.deviceId === 'default'
        });
      }).then(()=> {
        resolve(faceTimeDevice[0], defaultMic[0]);
      });
    })
  }

  let isMac = false;

  const startFaceTimeCam = (faceTimeDevice, defaultMic) => {
    if (faceTimeDevice) {
      const device = helper_extractRelevantCamInfo(faceTimeDevice)
      device.mic_info = defaultMic.deviceId;
      setAvailableCams([device]);
      document.getElementById('startBtn').disabled = false;
      document.getElementById('startBtn').click();
      document.getElementById('dummyBtn').disabled = false;
      document.getElementById('dummyBtn').click();
      cogoToast.success('Mac FaceTime Camera started', {
        position: 'top-left',
        hideAfter: 1,
        onClick: hide => {
          hide()
        }
      });
      props.updateDetectedNumCams(1);
      isMac = true;
    }
  }


  const addNewCamMic = () => {
    // let isMac = false;
    try {
      checkIfMac(startFaceTimeCam);
    } catch (Exception) {
      // console.err('not a mac')
    }
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const allDevices = devices.filter(device => {
        return (
          device.label.toLowerCase().includes('aoni') &&
          !device.label.toLowerCase().includes('communication') &&
          !device.label.toLowerCase().includes('default')
          // !device.deviceId.toLowerCase().includes('communication') &&
          // !device.deviceId.toLowerCase().includes('default') && (
          //   device.kind === 'audioinput' || device.kind === 'videoinput'
          // )
        );
      });
      let detectedTwoDevices = false;

      const idAoni = allDevices.map(device => {
        return device.deviceId;
      });
      console.log(idAoni);
      // const newPluggedInPaired = allDevices.map(device => [device.kind, device.deviceId])
      // console.log(newPluggedInPaired);

      const newPluggedInID = idAoni.diff(pluggedInDevices);
      if (newPluggedInID.length === 0) {
        // console.log('no new devices detected');
        if (!isMac) 
          cogoToast.warn('No additional webcams detected.', {hideAfter: 1});
      } else if (newPluggedInID.length === 2) {
        detectedTwoDevices = true;
        // console.log(
        //   'new devices: ' + newPluggedInID.map(d => d.substring(0, 5))
        // );
      }

      if (detectedTwoDevices) {
        let [newMicID, newCamDevice] = getNewMicCam(newPluggedInID, allDevices);
        newCamDevice = helper_extractRelevantCamInfo(newCamDevice);
        const existCamera = availableCams.filter(cam => {
          return cam.camera_info.id === newCamDevice.camera_info.id;
        })[0];
        if (!existCamera) {
          newCamDevice.mic_info = newMicID;
          let temp = availableCams;
          temp.push(newCamDevice);
          setAvailableCams(temp);
          // cogoToast.success(
          //   'New webcam: ' + newCamDevice.camera_info.id.substring(0, 5) + ' added.'
          // ), {
          //   hideAfter: 0.5,
          //   position: 'top-left',
          //   onClick: hide => {
          //     hide();
          //   }
          // };
          cogoToast.success('Webcam: ' + newCamDevice.camera_info.id.substring(0, 5) + ' added.', {
            hideAfter: 1,
            position: 'top-left',
            onClick: hide => hide()
          });
          document.getElementById('startBtn').disabled = false;
          initCams();
          setPluggedInDevices(idAoni);
        }
      }      
    }).then(() => {
        document.getElementById('dummyBtn').disabled = false;
        document.getElementById('dummyBtn').click();
    });
  }

  function useAvailableWebCams() {
    //  runs once
    useEffect(() => {
      props.updateConnectionStatus();
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
      if (!cam.mic_info) {
        console.error('using default microphone...');
      }
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
            try {
              video.current.srcObject = camera;
            } catch (NotYetLoadedException) {
              //
            }
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
    try {
      temp[cam['camera_info'].id.substring(0, 15)] = recorder.getState();
      setRecordingStatus(temp);
      props.updateConnectionStatus(temp);
    } catch (NotYetLoadedException) {
      cogoToast.warn('Camera not yet loaded!', {
        hideAfter: 0,
        onClick: hide => {
          hide()
        }
      });
    }
  }

  const resumeAllCams = () => {
    const temp =
      recordingStatus === 'recording-status-loading...' ? {} : recordingStatus;
    availableCams.map(cam => {
      let recorder = cam['recorder'];
      let state = undefined;
      try {
        state = recorder.getState();
      } catch {
        cogoToast.warn("Camera not yet loaded!", {
          hideAfter: 0,
          onClick: hide => {
            hide()
          }
        });
      }
      if (state === "paused") {
        recorder.resumeRecording();
      } else if (state === "stopped"){
        try {
          recorder.startRecording();
        } catch (NotYetLoadedException) {
          cogoToast.warn('Camera not yet loaded!', {
            hideAfter: 0,
            onClick: hide => {
              hide()
            }
          });
        }
      }
      triggerRecordStatusUpdate(temp, recorder, cam);
      return availableCams;
    });
  }

  useAvailableWebCams();

  // dummy to fix bug of first video
  props.socket.on('server: dummy vid, do not save', function() {
    try {
      document.getElementById('dummyBtn').click();
      document.getElementById('dummyBtn').disabled = true;
    } catch (NotYetLoadedException) {
      console.error(NotYetLoadedException);
    }
  });

  // this is actually what calls start cams
  props.socket.on('server: start cams', function () {
    try {
      document.getElementById("resumeBtn").click();
      document.getElementById("resumeBtn").disabled = true;
      document.getElementById('stopBtn').disabled = false;
    } catch (NotYetLoadedException) {
      console.error(NotYetLoadedException)
    }

  });

  // this is actually what calls stop cams
  props.socket.on('server: stop cams', function () {
    try {
      document.getElementById('stopBtn').click();
      document.getElementById('stopBtn').disabled = true;
      document.getElementById("resumeBtn").disabled = false;
    } catch (NotYetLoadedException) {
      console.error(NotYetLoadedException)
    }
  });

  const debugControls = (debug) => {
    if (debug) {
      return (
        <div>
          {/* <p>Don't click these while actual testing</p> */}
          <button id='dummyBtn' className="hidden_button" onClick={initCamsDummy}>
            dummy reset
          </button>
          <button id='startBtn' className="hidden_button" onClick={startAllCams}>
            start and pause all cams
          </button>
          <button id='resumeBtn' className="hidden_button" onClick={resumeAllCams}>
            resume all cams
          </button>
          <button id='stopBtn' className="hidden_button" onClick={stopAllCams}>
            stop all cams
          </button>
          <button
            id='addCamBtn'
            className='hidden_button'
            onClick={addNewCamMic} 
          >
            Add Cam
          </button>
          {/* <button id="setCompID" onClick={getSetCompID}>get set computer ID</button> */}
        </div>
      );
    }
  }

  const renderCams = addCam => {

    // initMics()
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
          <button className='debug_button' style={{marginBottom: '1em'}} onClick={addCam}>Add Webcam</button>
          <div className='cameras'>{comp_camsList}</div>
        </div>
      </div>
    );
  };
  
  return renderCams(props.addCam);
}