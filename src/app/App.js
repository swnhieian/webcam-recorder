/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update'
import qs from '../utils/qs'
import cogoToast from 'cogo-toast';
import { Line } from 'rc-progress';
import { HashRouter as Router, Route } from "react-router-dom";

// scss
import './App.scss';

// components
import CameraList from '../components/CameraList/CameraList';
import Tester from '../components/Tester/Tester';
import DataCollection from '../components/Table/DataCollection';
import Modal from '../components/Modal'

// data
// import sentences from '../assets/data/sentences.txt';
import sentences from '../assets/data/sentences-english-test.txt';

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
      numFilesSavedTotal: 0,
      numFilesSavedInd: 0,
      connectedOrderMap: {},
      numCams: 1,
      recordedProgress: {},
      addCamState: false
    };
    if (!this.helper_checkIfMobileView) {
      this.props.socket.emit('client: update sentence_index', {
        name: qs('name'),
        curr_sentence_index: this.state.curr_sentence_index
      });
    } else {
      this.props.socket.emit('client: ask for recording status');
    }

    props.socket.emit('client: check for progress');
    props.socket.emit('client: ask for sync id');
    
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
    this.setState({ computerStatus: status }, () => {
      // console.log("init computer status", this.state.computerStatus);
    });
  };

  boldString = (str, find) => {
    var re = new RegExp(find, 'g');
    return str.replace(re, '🖥: ' + find);
  };

  // helper method
  socket_updateConnectionStatus = status => {
    console.log('updating connection status here!!! ' + JSON.stringify(status));
    this.setState({ computerStatus: status });
  };

  showFileSavedMessage = () => {
    cogoToast.success('Files successfully saved.', { hideAfter: 1.5 });
  };

  initSocketListeners = () => {
    this.props.socket.on('server: connected sync id', id => {
      if (this.socket_getSetCompID) this.socket_getSetCompID(id);
      this.socket_getSetCompID = null;
    });
    
    this.props.socket.on('server: reset cams', () => {
      this.updateGreenLightStatus(true);
    });

    this.props.socket.on('server: response for connection status', status => {
      try {
        document.getElementById('connection_status').innerHTML = this.boldString(JSON.stringify(
          status,
          null,
          2
        ), this.state.computerID);
      } catch (NotOnPageError) {
        //
      }
    });

    this.props.socket.on('server: response for recording status', () => {
      // console.log('beeppppps' + JSON.stringify(status));
    });

    this.props.socket.on('server: response for progress', progress => {
      this.setState({ recordedProgress: progress });
    });

    this.props.socket.on('server: response for numFilesSaved', numFiles => {
      this.helper_updateFilesSaved(numFiles);
    });

    this.props.socket.on('server: save files successful', numFiles => {
      this.helper_updateFilesSaved(numFiles);
      this.setState(
        {
          numFilesSavedInd: this.state.numFilesSavedInd + 1
        },
        () => {
          console.log(
            'this occured: ' + this.state.numFilesSavedInd + ' times.'
          );
          if (this.state.numFilesSavedInd === this.state.numCams) {
            console.log('correct number of files saved');
            try {
              document.getElementById('showSavedFilesBtn').click();
              document.getElementById('showSavedFilesBtn').disabled = true;
              this.setState(
                {
                  numFilesSavedInd: 0
                },
                () => {
                  try {
                    document.getElementById('testerNextBtn').click();
                  } catch (NotOnPageError) {
                    console.error(NotOnPageError);
                  }
                }
              );
              
              this.updateGreenLightStatus(true);
            } catch (Exception) {
              console.error(Exception);
            }
            try {
              if (this.helper_checkIfMobileView()) {
                console.log('here here??');
                cogoToast.info('Completed @ Sentence [' + this.state.curr_sentence_index + ']', {hideAfter: 0.75});
              }
              console.log('clicked??');
            } catch (NotYetLoadedException) {
              console.error(NotYetLoadedException);
            }
          }
        }
      );
    });

    this.props.socket.on('server: computer connected order', connectedOrder => {
      // const id = Object.keys(connectedOrder[0])
      // const order = connectedOrder[id];
      this.setState({
        connectedOrderMap: update(this.state.connectedOrderMap, {
          $merge: connectedOrder
        })
      });
    });

    const refreshRates = [0, 666, 1332];
    this.props.socket.on('server: refresh all', () => {
      const conectedOrderNum = this.state.connectedOrderMap[
        this.state.computerID
      ];
      const indexRefresh = conectedOrderNum % 3;
      const time = refreshRates[indexRefresh];
      setTimeout(() => {
        window.location.reload(false);
      }, time);
    });
  };

  async pingServer() {
    try {
      const serverID = this.props.socket.io.opts.hostname;
      const response = await fetch(serverID, { mode: 'no-cors' });
      if (!response.ok) {
        console.error('no response from server');
      } else {
        console.log('connection successful');
      }
    } catch (ServerPingFailedException) {
      console.error(ServerPingFailedException);
    }
  }
  

  componentDidMount() {
    this.readTextFile(sentences);
    this.initSocketListeners();
    // this.pingServer();
    window.addEventListener('keydown', this.downHandler);
    
  }
  
  componentWillUnmount() {
    window.removeEventListener('keydown', this.downHandler);
    window.removeEventListener('beforeunload');
  }

  comp_progressBar(curr, total, align, strokeWidth) {
    const percent = ((curr / total) * 100).toFixed(2);
    const alignmentStyle = align === 'left' ? { margin: '0' } : {};
    return (
      <div className='progress_bar' style={alignmentStyle}>
        <pre>
          Progress: {curr} / {total} ({percent}%)
        </pre>
        <Line
          percent={percent}
          strokeWidth={strokeWidth}
          trailWidth={strokeWidth}
          strokeColor='#2db7f5'
          trailColor='#D9D9D9'
        />
      </div>
    );
  }

  helper_updateFilesSaved = numFiles => {
    const successMessage =
      numFiles % this.state.numCams === 0
        ? ' (successful)'
        : ' (not all cams saved!!)';
    this.setState({
      numFilesSavedTotal: numFiles
    });
    try {
      document.getElementById('num_files_saved').innerHTML = 'Total Files Saved: ' + numFiles + successMessage;
    } catch (NotYetLoadedException) {
      // console.error(NotYetLoadedException);
    }
  };

  updateSentence = curr_sentence => {
    console.log('update sentence called here beep')
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

  updateRecordProgress = sentence_obj => {
    // { <sentence_index> : <bool: recorded/not> }
    console.log('added to progress ', JSON.stringify(sentence_obj));
    this.setState(
      {
        recordedProgress: update(this.state.recordedProgress, {
          $merge: sentence_obj
        })
      },
      () => {
        this.props.socket.emit(
          'client: update recording progress',
          this.state.recordedProgress
        );
      }
    );
    
  };

  updateConnectionStatus = recordingStatus => {
    if (this.state.computerStatus[this.state.computerID]) {
      const status = {};
      status[this.state.computerID] = recordingStatus;
      this.setState({ computerStatus: status }, () => {
        // console.log(this.state.computerStatus);
      });
      this.props.socket.emit('client: update recording status', status);
    }
    this.getStatus();
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

  updateGreenLightStatus = bool => {
    this.setState({ recordGreenLight: bool });
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
        recordGreenLight={
          this.state.recordGreenLight &&
          this.state.numFilesSavedTotal % this.state.numCams === 0
        }
        numFilesSaved={this.state.numFilesSavedTotal}
        numCams={this.state.numCams}
        updateGreenLightStatus={this.updateGreenLightStatus}
        recordedProgress={this.state.recordedProgress}
        updateRecordProgress={this.updateRecordProgress}
        comp_progressBar={this.comp_progressBar}
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

  getStatus = () => {
    this.props.socket.emit('client: ping for connection status');
    this.props.socket.emit('client: ping for numFilesSaved');
    this.props.socket.emit('client: ping for progress');

  };

  resetCams = () => {
    // this.props.socket.emit('client: stop cams');
    this.props.socket.emit('client: dummy vid, do not save');
    this.updateGreenLightStatus(true);
    this.props.socket.emit('client: reset cams');
    document.getElementById('addCamBtn').click();
    cogoToast.info('Cams are reset');
  };

  refreshAll = () => {
    this.props.socket.emit('client: refresh all');
  };

  comp_cameraList = () => {
    return (
      <CameraList
        socket={this.props.socket}
        computerID={this.state.computerID}
        computerStatus={this.state.computerStatus}
        updateConnectionStatus={this.updateConnectionStatus}
        addCamState={this.state.addCamState}
        toggleCamState={this.toggleCamState}
      />
    );
  };

  toggleModal = id => {
    document.getElementById(id).click();
  };

  helper_checkIfMobileView = () => {
    return window.location.href.includes('mobile')
  }

  comp_overallStatusContent = () => {
    return (
      <div>
        <h4>Connection Status</h4>
        <pre id='connection_status'></pre>
        <pre id='num_files_saved'></pre>
        <pre
          hidden={
            this.state.recordGreenLight ||
            this.helper_checkIfMobileView() ||
            !qs('name')
          }
          className='warning_message'
        >
          Please Click Reset!
        </pre>
        {this.comp_progressBar(
          this.state.curr_sentence_index,
          this.state.data.length - 1,
          'left', 3
        )}
      </div>
    );
  };

  comp_modals = () => {
    return (
      <div>
        <Modal
          modalID={'resetProgressModal'}
          socket={this.props.socket}
          title={'Are you sure?'}
          message={'Resetting progress will be permanent.'}
          buttonCancel={'Cancel'}
          buttonConfirm={'Reset'}
          toast={'Progress reset'}
          confirmFunc={() => {
            this.props.socket.emit('client: update recording progress', {});
          }}
        />
        <Modal
          modalID={'overallStatus'}
          socket={this.props.socket}
          title={'Status'}
          onLoadFunc={this.getStatus}
          message={this.comp_overallStatusContent()}
          buttonConfirm={'Hide'}
        />
      </div>
    );
  };

  toggleCamState = () => {
    this.setState({ addCamState: !this.state.addCamState });
  }

  comp_debug = () => {
    return (
      <div style={{ margin: 'auto', textAlign: 'center' }}>
        <button
          onClick={() => {
            this.toggleModal('overallStatus');
            this.getStatus();
          }}
          className='debug_button'
        >
          Status
        </button>
        <button
          id='resetCamsBtn'
          className='debug_button'
          onClick={this.resetCams}
        >
          Reset Cams
        </button>
        <button
          className='debug_button'
          onClick={() => {
            this.toggleModal('resetProgressModal');
          }}
        >
          Reset Progress
        </button>
        <button className='debug_button' onClick={this.refreshAll}>
          Refresh All
        </button>
        <button id="addCamBtn" className='hidden_button' onClick={this.toggleCamState}>
          Add Cam
        </button>

        <button
          onClick={this.showFileSavedMessage}
          id='showSavedFilesBtn'
          className='hidden_button'
        ></button>
        <pre hidden={this.state.numCams === 8}>
          debug mode, remember to change num cams back to 8
        </pre>
      </div>
    );
  };

  desktopView = () => {
    return (
      <div className='container'>
        {this.comp_debug()}
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
  };

  mobileView = () => {
    return (
      <div onClick={() => this.getStatus()}>
        {this.comp_modals()}
        {/* <button id="mobileStatusBtn" onClick={() => {this.toggleModal('overallStatus');}}>Status</button> */}
        {this.comp_debug()}
      </div>
    )
  };

  downHandler(event) {
    let key = event.key;
    if ([' ', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(key)) {
      try {
        if (key === ' ') {
          document.getElementById('testerRecordBtn').click();
        } else if (key === 'ArrowLeft') {
          document.getElementById('testerPrevBtn').click();
        } else if (key === 'ArrowRight') {
          console.log('detected right arrow key');
          document.getElementById('testerNextBtn').click();
        } else if (key === 'Escape') {
          document.getElementById('resetCamsBtn').click();
        }
        event.preventDefault();
      } catch (NotYetLoadedException) {
        console.error(NotYetLoadedException);
      }
    }
  }

  render() {
    return (
      <Router>
        <Route path='/' exact component={this.desktopView} />
        <Route path='/mobile' exact component={this.mobileView} />
        {this.comp_modals()}
      </Router>
    );
  }
}

App.propTypes = {
  socket: PropTypes.object.isRequired
}

export default App;
