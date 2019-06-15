import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// scss
import './App.scss'

// svgs
import tsinghua_logo from '../assets/svg/tsinghua.svg'
import collapse from '../assets/svg/collapse-chevron.svg'
// import expand from '../assets/svg/expand-chevron.svg'
import btn_tester from '../assets/svg/tester-button.svg'
import btn_admin from '../assets/svg/admin-button.svg'

// components

import CameraList from '../Components/CameraList/CameraList';
import Tester from './Tester.js'
import DataCollection from '../Components/DataCollection'

// data
import sentences from '../assets/data/sentences.txt'

class App extends React.Component {
  readTextFile(file) {
    const rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    let allText = "";
    rawFile.onreadystatechange = function ()
    {
      if(rawFile.readyState === 4)
      {
        if(rawFile.status === 200 || rawFile.status === 0)
        {
          allText = rawFile.responseText;
        }
      }
    }
    rawFile.send(null);
    return allText.split('\n');
  }

  render() {
    const data = this.readTextFile(sentences);
    return (
      <div className='container'>
        <Router>
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
          <div className='contents'>
            <div className='left_panel'>
              <Route path='/admin' component={CameraList} />
              <Route path='/tester' component={Tester} />
            </div>
            <div className='right_panel'>
              <Route
                path='/admin'
                render={() => <DataCollection data={data} />}
              />
              <Route
                path='/tester'
                render={() => <DataCollection data={data} />}
              />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
