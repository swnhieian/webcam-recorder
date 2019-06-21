import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import tsinghua_logo from '../assets/svg/tsinghua.svg';
import collapse from '../assets/svg/collapse-chevron.svg';
// import expand from '../assets/svg/expand-chevron.svg'
import btn_tester from '../assets/svg/tester-button.svg';
import btn_admin from '../assets/svg/admin-button.svg';

export default class NavBar extends Component {
  adminClick() {
    const camera_list = document.getElementById('camera_list');
    if (camera_list.style.display === '') {
      camera_list.style.display = 'none';
    } else {
      camera_list.style.display = '';
    }
  }
  render() {
    return (
      <div>
        <div className='nav_bar'>
          <div className='nav_left'>
            <div className='logo'>
              <img id='tsinghua_logo' src={tsinghua_logo} alt='' />
            </div>
          </div>
          <div className='nav_right'>
            <div className='item'>
              <img src={collapse} alt='' />
            </div>
            <div className='item'>
              <div className='nav_buttons'>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
