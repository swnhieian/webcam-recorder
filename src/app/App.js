import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
// scss
import './App.scss';

// components
import CameraList from '../components/CameraList/CameraList';
import Tester from '../components/Tester/Tester';
import DataCollection from '../components/Table/DataCollection';
import NavBar from '../components/NavBar';

// data
import sentences from '../assets/data/sentences.txt';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curr_sentence: '',
      curr_sentence_index: 0,
      first_name: '',
      last_name: '',
      data: this.readTextFile(sentences),
      date: new Date(),
      // server_ip: 'http://192.168.0.100:5000', // todo: see if can better way than adding to state
      // server_ip: 'http://183.172.75.151:5000',
      namespace: '/tsinghua_606',
    };
   
  }

  readTextFile(file) {
    const rawFile = new XMLHttpRequest();
    rawFile.open('GET', file, false);
    let allText = '';
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status === 0) {
          allText = rawFile.responseText;
        }
      }
    };
    rawFile.send(null);
    const data = allText.split('\n')
    return data;
  }

  updateName = (first_name, last_name) => {
    this.setState({
      first_name,
      last_name
    });
  };

  updateSentence = curr_sentence => {
    if (curr_sentence === '$next') {
      this.setState(
        {
          curr_sentence_index: this.state.curr_sentence_index + 1
        },
        () => {
          this.updateSentence(this.state.data[this.state.curr_sentence_index]);
        }
      );
    } else if (curr_sentence === '$prev') {
      this.setState(
        {
          curr_sentence_index: this.state.curr_sentence_index - 1
        },
        () => {
          this.updateSentence(this.state.data[this.state.curr_sentence_index]);
        }
      );
    } else {
      this.setState({
        curr_sentence
      });
    }
  };

  dataCollection = () => {
    return (
      <DataCollection
        data={this.state.data}
        updateName={this.updateName}
        first_name={this.state.first_name}
        last_name={this.state.last_name}
        curr_sentence={this.state.curr_sentence}
      />
    );
  };

  tester = () => {
    return (
      <Tester
        updateSentence={this.updateSentence}
        curr_sentence_index={this.state.curr_sentence_index}
        data_length={this.state.data.length}
        first_sentence={this.state.data[this.state.curr_sentence_index]}
        curr_sentence={this.state.curr_sentence}
        first_name={this.state.first_name}
        last_name={this.state.last_name}
        server_ip={this.state.server_ip}
      />
    );
  };

  cameraList = () => {
    return (
      <CameraList server_ip={this.state.server_ip}/> 
    )
  }

  render() {
    return (
      <div className='container'>
        <Router>
          <Redirect from='/' to='/admin' />
          <NavBar />
          <div className='contents'>
            <div className='left_panel'>
              <Route path='/admin' component={() => this.cameraList()} />
              <Route path='/tester' component={() => this.tester()} />
            </div>
            <div className='right_panel'>
              <Route path='/admin' render={() => this.dataCollection()} />
              <Route path='/tester' render={() => this.dataCollection()} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
