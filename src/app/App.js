import React from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';

// scss
import './App.scss'

// svgs

// components

import CameraList from '../Components/CameraList/CameraList';
import Tester from '../Components/Tester.js'
import DataCollection from '../Components/DataCollection'
import NavBar from '../Components/NavBar'

// data
import sentences from '../assets/data/sentences.txt'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
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
          <NavBar />
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
