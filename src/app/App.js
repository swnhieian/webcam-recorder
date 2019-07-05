import React from 'react';
import PropTypes from 'prop-types';
import qs from '../utils/qs'
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
      curr_sentence_index: Number(qs['sentence_index']),
      data: [],
    };
  }

  readTextFile(file) {
    return fetch(file)
      .then(response => response.text())
      .then(text => {
        this.setState({data: text.split('\n')}, () => {
          this.setState({ curr_sentence: this.state.data[Number(qs["sentence_index"])] }, () => {
          });
        });
    })
  }

  componentDidMount() {
    this.readTextFile(sentences);    
  }

  updateSentence = curr_sentence => {
    if (curr_sentence === '$next') {
      this.setState(
        {
          curr_sentence_index: this.state.curr_sentence_index + 1
        },
        () => {
          this.updateSentence(this.state.data[this.state.curr_sentence_index]);
          this.props.socket.emit('client: update sentence_index', this.state.curr_sentence_index)
        }
      );
    } else if (curr_sentence === '$prev') {
      this.setState(
        {
          curr_sentence_index: this.state.curr_sentence_index - 1
        },
        () => {
          this.updateSentence(this.state.data[this.state.curr_sentence_index]);
          this.props.socket.emit('client: update sentence_index', this.state.curr_sentence_index)
        }
      );
    } else {
      // let name = document.getElementById("name").value;
      // document.location.search = "?name=" + qs["name"] + "&sentence_index=" + this.state.curr_sentence_index;
      window.history.pushState(null, null, "?name=" + qs["name"] + "&sentence_index=" + this.state.curr_sentence_index);
      // console.log(curr_sentence);
      this.setState({
        curr_sentence
      });
      console.log(curr_sentence);
    }
  };

  dataCollection = () => {
    return (
      <DataCollection
        data={this.state.data}
        updateName={this.updateName}
        curr_sentence={this.state.curr_sentence}
        socket={this.props.socket}
        curr_sentence_index={this.state.curr_sentence_index}
      />
    );
  };

  tester = () => {
    return (
      <Tester
        updateSentence={this.updateSentence}
        data={this.state.data}
        curr_sentence_index={this.state.curr_sentence_index}
        data_length={this.state.data.length}
        first_sentence={this.state.data[this.state.curr_sentence_index]}
        curr_sentence={this.state.curr_sentence}
        socket={this.props.socket}
      />
    );
  };

  cameraList = () => {
    return <CameraList socket={this.props.socket} />;
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

App.propTypes = {
  socket: PropTypes.object.isRequired
}

export default App;
