import React, { useState } from 'react';
// import sample_cam from '../../assets/svg/sample-cam.svg';
import Webcam from '../Webcam/Webcam.js';

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
        console.log(myJson);
      });
  }


  let getCams = () => {
    let num_cams = [...Array(10).keys()];
    let cams_list = availableCams.map(cams => {
      console.log(cams.id);
      return <Webcam key={cams.id} name={'ID: ' + (cams.id.substring(0,15))} />;
    });
    getAvailableWebCams();
    // console.log(availableCams);

    return (
      <div>
        <button onClick={checkRecordingStatus}>check recording status</button>
        <div>
          <div className='cameras'>{cams_list}</div>
        </div>
      </div>
    );
  };

  return getCams();
}
