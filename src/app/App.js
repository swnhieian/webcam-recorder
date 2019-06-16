import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

// scss
import './App.scss';

// components
import CameraList from '../Components/CameraList/CameraList';
import Tester from '../Components/Tester.js';
import DataCollection from '../Components/DataCollection';
import NavBar from '../Components/NavBar';

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
      date: new Date()
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
    return allText.split('\n');
  }

  updateName = (first_name, last_name) => {
    this.setState({
      first_name,
      last_name
    });
  };

  updateSentence = (curr_sentence) => {
    if (curr_sentence === "$next") {
      this.setState({
        curr_sentence_index: this.state.curr_sentence_index + 1
      }, () => {
        this.updateSentence(this.state.data[this.state.curr_sentence_index]);
      });
    } else {
      this.setState({
        curr_sentence
      });
    }
  }

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
  }

  tester = () => {
    return (
      <Tester
        updateSentence={this.updateSentence}
        first_sentence={this.state.data[this.state.curr_sentence_index]}
        curr_sentence={this.state.curr_sentence}
        first_name={this.state.first_name}
        last_name={this.state.last_name}
      />
    );
  }

  render() {
    return (
      <div className='container'>
        <Router>
          <NavBar />
          <div className='contents'>
            <div className='left_panel'>
              <Route path='/admin' component={CameraList} />
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
