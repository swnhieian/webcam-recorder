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
// import sentences from '../assets/data/sentences.txt';
import sentences from '../assets/data/sentences-english-test.txt';
import seedrandom from 'seedrandom'

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
      curr_page: curr_index ? Math.floor(Number(curr_index) / per_page) + 1 : 1,
      computerStatus: {},
      recordGreenLight: false,
      computerID: -1,
      numFilesSaved: 0
    };
    this.props.socket.emit('client: update sentence_index', {
      name: qs('name'),
      curr_sentence_index: this.state.curr_sentence_index
    });

    props.socket.emit('client: ask for sync id');
    props.socket.on('server: connected sync id', id => {
      if (this.socket_getSetCompID) this.socket_getSetCompID(id);
      this.socket_getSetCompID = null;
    });
  }

  readTextFile(file) {
    return fetch(file)
      .then(response => response.text())
      .then(text => {
        this.setState({ data: text.split('\n') }, () => {
          let curr_sentence = qs('sentence_index')
            ? this.state.data[Number(qs('sentence_index'))]
            : this.state.data[0];
          this.setState({ curr_sentence }, () => {
            // console.log(this.state.curr_sentence)
          });
        });
      });
  }

  socket_getSetCompID = id => {
    const status = {};
    this.setState({ computerID: id });
    status[this.state.computerID] = [];
    this.setState({ computerStatus: status });
  };

  boldString = (str, find) => {
    var re = new RegExp(find, 'g');
    return str.replace(re, '<this computer>: ' + find);
  };

  // helper method
  socket_updateConnectionStatusDisplay = status => {
    document.getElementById('camera_status_p').innerText = this.boldString(JSON.stringify(
      status,
      null,
      4
    ), this.state.computerID);
    this.updateNumFilesSaved("num files saved: " + this.state.numFilesSaved);
  };

  componentDidMount() {
    this.readTextFile(sentences);
    this.props.socket.on(
      'server: response for connection status',
      this.socket_updateConnectionStatusDisplay
    );

    this.props.socket.on(
      'server: response for numFilesSaved', numFiles => {
        this.helper_updateFilesSaved(numFiles);
      }
    );
  
    this.props.socket.on('server: save files successful', numFiles => {
      this.helper_updateFilesSaved(numFiles);
    });

    this.props.socket.on('server: refresh all', () => {
      const time = seedrandom(this.state.computerID)() * 5000;
      setTimeout(() => {
        window.location.reload(false)
      }, time)
    });
  }

  helper_updateFilesSaved = numFiles => {
    this.updateNumFilesSaved('num files saved: ' + numFiles);
    this.setState({
      numFilesSaved: numFiles
    });
  }

  updateSentence = curr_sentence => {
    //console.log("in updateSentence(" + curr_sentence + "):" + qs('name'));
    if (curr_sentence === '$next') {
      if (this.state.curr_sentence_index + 1 === this.state.data.length) {
        alert('实验结束！谢谢您的参与');
      } else {
        this.setState(
          {
            curr_sentence_index: this.state.curr_sentence_index + 1
          },
          () => {
            this.updateSentence(
              this.state.data[this.state.curr_sentence_index]
            );
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
          this.props.socket.emit('client: update sentence_index', {
            name: qs('name'),
            curr_sentence_index: this.state.curr_sentence_index
          });
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
        curr_page:
          Math.floor(
            Number(this.state.curr_sentence_index) / this.state.per_page
          ) + 1
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

  updateConnectionStatus = recordingStatus => {
    if (this.state.computerStatus[this.state.computerID]) {
      const status = {};
      status[this.state.computerID] = recordingStatus;
      this.setState({ computerStatus: status });
      this.props.socket.emit('client: update recording status', status);
    }
    this.getConnectionStatus();
  };

  updateNumFilesSaved = numFiles => {
    document.getElementById('num_files_saved').innerHTML = numFiles;
  }

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

  updateGreenLightStatus = () => {
    this.setState({ recordGreenLight : true });
  }

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
        recordGreenLight={this.state.recordGreenLight}
        updateGreenLightStatus={this.updateGreenLightStatus}
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
    );
  };

  getConnectionStatus = () => {
    this.props.socket.emit('client: ping for connection status');
    this.props.socket.emit('client: ping for numFilesSaved');
  };

  resetCams = () => {
    // this.props.socket.emit('client: stop cams');
    this.props.socket.emit('client: dummy vid, do not save');
    this.updateGreenLightStatus();
  };

  refreshAll = () => {
    this.props.socket.emit('client: refresh all');
  }

  comp_cameraStatus = () => {
    return (
      <div className='camera_status'>
        <h1>Connection Status</h1>
        <pre id='camera_status_p'>Server not online</pre>
        <pre id="num_files_saved"></pre>
        <button onClick={this.getConnectionStatus}>Get Status</button>
        <button onClick={this.resetCams}>Reset Cams</button>
        <button onClick={this.refreshAll}>Refresh All</button>
        <p
          hidden={this.state.recordGreenLight || !qs('name')}
          className='warning_message'
        >
          Please Click Reset!
        </p>
      </div>
    );
  };

  comp_cameraList = () => {
    return (
      <CameraList
        socket={this.props.socket}
        computerID={this.state.computerID}
        computerStatus={this.state.computerStatus}
        updateConnectionStatus={this.updateConnectionStatus}
      />
    );
  };

  render() {
    return (
      <div className='container'>
        {this.comp_cameraStatus()}
        {this.comp_tester()}
        {this.comp_userResearchHeader()}
        <div className='contents'>
          <div className='left_panel'>{this.comp_dataCollection()}</div>
          <div className='right_panel cameras_container'>
            {this.comp_cameraList()}
          </div>
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
