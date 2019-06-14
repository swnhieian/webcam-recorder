import React from 'react';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// scss
import './App.scss'

// svgs
import tsinghua_logo from '../assets/svg/tsinghua.svg'
import collapse from '../assets/svg/collapse-chevron.svg'
// import expand from '../assets/svg/expand-chevron.svg'
import btn_tester from '../assets/svg/tester-button.svg'

// components
import NameField from '../Components/NameField';
import Table from '../Components/Table/Table';
import CameraList from '../Components/CameraList/CameraList';
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
        <div className='left_panel'>
          <div className='logo'>
            <img id='tsinghua_logo' src={tsinghua_logo} alt='' />
          </div>
        <CameraList />
        </div>
        <div className='right_panel'>
          <div className='nav_bar'>
            <div className='item'>
              <img src={collapse} alt='' />
            </div>
            <div className='item'>
              <img id='btn_tester' src={btn_tester} alt='' />
            </div>
          </div>
          <div className='name_field'>
            <NameField />
          </div>
          <div className="data_table">
            <Table data= { data }/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
