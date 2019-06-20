import React from 'react';
import io from 'socket.io-client'; 

// scss
import './App.scss';

// components
import CameraList from '../components/CameraList/CameraList';
import Tester from '../components/Tester/Tester';
import DataCollection from '../components/Table/DataCollection';

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
      socket: io('http://192.168.0.100:5000')
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
        socket={this.state.socket}
      />
    );
  };

  cameraList = () => {
    return <CameraList socket={this.state.socket} />;
  }

  render() {
    return (
      <div className='container'>
        <div className='contents'>
          <div className='left_panel'>{this.tester()}</div>
          <div className='right_panel'>{this.dataCollection()}</div>
        </div>
        <div className='cameras_container'>{this.cameraList()}</div>
      </div>
    );
  }
}

export default App;
