import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import tsinghua_logo from '../assets/svg/tsinghua.svg';
import collapse from '../assets/svg/collapse-chevron.svg';
// import expand from '../assets/svg/expand-chevron.svg'
import btn_tester from '../assets/svg/tester-button.svg';
import btn_admin from '../assets/svg/admin-button.svg';

export default class NavBar extends Component {
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
                <Link to='/admin'>
                  <img
                    id='btn_admin'
                    className='nav_btn'
                    src={btn_admin}
                    alt=''
                  />
                </Link>
                <Link to='/tester'>
                  <img
                    id='btn_tester'
                    className='nav_btn'
                    src={btn_tester}
                    alt=''
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
