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
    let per_page = 8;
    let curr_index = qs('sentence_index');
    this.state = {
      curr_sentence: '',
      curr_sentence_index: curr_index ? Number(curr_index) : 0,
      data: [],
      per_page: per_page,
      curr_page: curr_index ? Math.floor(Number(curr_index) / per_page) + 1 : 1
    };
    this.props.socket.emit(
      'client: update sentence_index', {
        name: qs('name'),
        curr_sentence_index: this.state.curr_sentence_index
      }      
    );
  }

  readTextFile(file) {    
    return fetch(file)
      .then(response => response.text())
      .then(text => {
        this.setState({ data: text.split('\n') }, () => {
          let curr_sentence = qs('sentence_index')
            ? this.state.data[Number(qs('sentence_index'))]
            : this.state.data[0];
          this.setState(
            { curr_sentence},
            () => {
              // console.log(this.state.curr_sentence)
            }
          );
        });
      });
  }

  componentDidMount() {
    this.readTextFile(sentences);
    this.props.socket.on('computer connected', function(arg) {
      console.log('got it!', arg)
    });
  }

  updateSentence = curr_sentence => {
    //console.log("in updateSentence(" + curr_sentence + "):" + qs('name'));
    if (curr_sentence === '$next') {
      if (this.state.curr_sentence_index+1 === this.state.data.length) {
        alert("实验结束！谢谢您的参与");
      } else {
        this.setState(
          {
            curr_sentence_index: this.state.curr_sentence_index + 1
          },
          () => {
            this.updateSentence(this.state.data[this.state.curr_sentence_index]);
            this.props.socket.emit('client: update sentence_index', {
              name: qs('name'), //qs['name'],
              curr_sentence_index: this.state.curr_sentence_index
            });
          }
        );
      }
    } else if (curr_sentence === '$prev') {
      this.setState(
        {
          curr_sentence_index: Math.max(this.state.curr_sentence_index - 1, 0)
        },
        () => {
          this.updateSentence(this.state.data[this.state.curr_sentence_index]);
          this.props.socket.emit(
            'client: update sentence_index', {
              name: qs('name'),
              curr_sentence_index: this.state.curr_sentence_index
            }            
          );
        }
      );
    } else {
      window.history.pushState(
        null,
        null,
        '?name=' +
          qs('name') +
          '&sentence_index=' +
          this.state.curr_sentence_index
      );
      // console.log(curr_sentence);
      this.setState({
        curr_sentence,
        curr_page: Math.floor(Number(this.state.curr_sentence_index) / this.state.per_page) + 1
      });
    }
  };

  updatePage = new_page => {
    if (new_page === 0) {
      // do nothing
    }
    console.log('update page', new_page);
    this.setState({
      curr_page: new_page >= 1 ? new_page : 1
    });
  };

  comp_dataCollection = () => {
    return (
      <DataCollection
        data={this.state.data}
        updateName={this.updateName}
        curr_sentence={this.state.curr_sentence}
        socket={this.props.socket}
        curr_sentence_index={this.state.curr_sentence_index}
        curr_page={this.state.curr_page}
        updatePage={this.updatePage}
      />
    );
  };

  comp_tester = () => {
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

  comp_userResearchHeader = () => {
    return (
      <div>
        <br />
        <h1>For User Researcher Purpose Only</h1>
        <hr />
      </div>
    )
  }

  comp_cameraStatus = () => {
    return (
      <div className='camera_status'>
        <h1>Camera Status</h1>
      </div> 
    )
  }

  comp_cameraList = () => {
    return <CameraList socket={this.props.socket} />;
  };

  render() {
    return (
      <div className='container'>
        {this.comp_cameraStatus()}
        {this.comp_tester()}
        {this.comp_userResearchHeader()}
        <div className='contents'>
          <div className='left_panel'>{this.comp_dataCollection()}</div>
          <div className='right_panel cameras_container'>{this.comp_cameraList()}</div>
          <div className=''></div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  socket: PropTypes.object.isRequired
}

export default App;
