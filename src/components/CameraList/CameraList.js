import React, { Component } from 'react'
// import sample_cam from '../../assets/svg/sample-cam.svg';
import Webcam from '../Webcam.js'

export default class CameraList extends Component {
  render() {
    let num_cams = [...Array(10).keys()];
    let cams_list = num_cams.map((i) => {
      return <Webcam key={i} name={"Camera " + (i + 1)}/>
    });
    return (
      <div>
        <div className='cameras'>
          {cams_list}
        </div>
      </div>
    );
  }
}
