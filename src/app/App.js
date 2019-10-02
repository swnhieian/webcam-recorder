/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update'
import qs from '../utils/qs'
import cogoToast from 'cogo-toast';
import { HashRouter as Router, Route } from "react-router-dom";

// scss
import './App.scss';

// app-utils
// import { this.updateFilesSaved } from './app-utils/update.js'

// components
import CameraList from '../components/CameraList/CameraList';
import Tester from '../components/Tester/Tester';
import DataCollection from '../components/Table/DataCollection';
import Modal from '../components/Modal'
import Status from '../components/Status'
import Toggle from '../components/Toggle/Toggle'

// data
import sentences from '../assets/data/sentences.txt';
// import sentences from '../assets/data/sentences-english-test.txt';

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
      numCams: 8,
      recordedProgress: 0,
      addCamState: false,
      totalTime: [],
      startTime: undefined
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

  render() {
    return (
      <Router>
        <Route path='/' exact component={this.main_desktopView} />
        <Route path='/mobile' exact component={this.main_mobileView} />
        {this.comp_modals()}
      </Router>
    );
  }

  componentDidMount() {
    this.readTextFile(sentences);
    this.initSocketListeners();
    // this.pingServer();
    window.addEventListener('keydown', this.downHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.downHandler);
    // window.removeEventListener('beforeunload');
  }

  // * MAIN VIEW * //
  main_desktopView = () => {
    return (
      <div className='container'>
        <Toggle id='debug_mode' />
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

  // * MAIN VIEW * //
  main_mobileView = () => {
    return <div onClick={() => this.getStatus()}>{this.comp_debug()}</div>;
  };

  // * COMPONENT * //
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

  // * COMPONENT * //
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
        totalTime={this.state.totalTime}
        updateTotalTime={this.updateTotalTime}
        showFileSavingLoader={this.disp_showFileSavingLoader}
      />
    );
  };

  // * COMPONENT * //
  comp_userResearchHeader = () => {
    return (
      <div>
        <br />
        <h1>For User Researcher Purpose Only</h1>
        <hr />
      </div>
    );
  };

  // * COMPONENT * //
  comp_cameraList = () => {
    return (
      <CameraList
        socket={this.props.socket}
        computerID={this.state.computerID}
        computerStatus={this.state.computerStatus}
        updateConnectionStatus={this.updateConnectionStatus}
        addCamState={this.state.addCamState}
        toggleCamState={this.helper_toggleCamState}
      />
    );
  };

  // * COMPONENT * //
  comp_status = () => {
    return (
      <Status
        data_length={this.state.data.length}
        recordedProgress={this.state.recordedProgress}
        helper_checkIfMobileView={this.helper_checkIfMobileView}
        recordGreenLight={this.state.recordGreenLight}
        socket={this.props.socket}
      />
    );
  };

  // * COMPONENT * //
  comp_modals = () => {
    return (
      <div>
        <Modal
          modalID={'resetProgressModal'}
          socket={this.props.socket}
          title={'Are you sure?'}
          message={'Resetting progress will be permanent.'}
          buttonCancel={'Cancel'}
          buttonConfirm={'Reset Progress'}
          buttonConfirmId={'resetProgressBtn'}
          toast={'Progress reset'}
          confirmFunc={this.admin_resetProgress}
        />
        <Modal
          modalID={'overallStatus'}
          socket={this.props.socket}
          title={'Status'}
          onLoadFunc={this.getStatus}
          message={this.comp_status()}
          buttonConfirm={'Hide'}
        />
      </div>
    );
  };

  // * COMPONENT * //
  comp_debug = () => {
    return (
      <div style={{ margin: 'auto', textAlign: 'center' }}>
        <button
          onClick={() => {
            this.helper_toggleModal('overallStatus');
            this.getStatus();
          }}
          className='debug_button'
        >
          Status
        </button>
        <button
          id='resetCamsBtn'
          className='debug_button'
          onClick={this.admin_resetCams}
        >
          Reset Cams
        </button>
        <button
          className='debug_button'
          onClick={() => {
            this.helper_toggleModal('resetProgressModal');
          }}
        >
          Reset Progress
        </button>
        <button className='debug_button' onClick={this.admin_refreshAll}>
          Refresh All
        </button>
        <button
          onClick={this.disp_showFileSavedMessage}
          id='showSavedFilesBtn'
          className='hidden_button'
        ></button>

        <pre hidden={this.state.numCams === 8}>
          debug mode, remember to change num cams back to 8
        </pre>
      </div>
    );
  };

  // * UTILITY * //
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

  /**
   * * UPDATE * 
   * 
   */
  updateFilesSaved = numFiles => {
    const successMessage =
      numFiles % this.state.numCams === 0
        ? ' (successful)'
        : ' (not all cams saved!!)';
    this.setState({
      numFilesSavedTotal: numFiles
    });
    try {
      document.getElementById('num_files_saved').innerHTML =
        'Total Files Saved: ' + numFiles + successMessage;
    } catch (NotYetLoadedException) {
      // console.error(NotYetLoadedException);
    }
  };

  /** 
   * * UPDATE *
   * Updates the state computerID with param id
   * @param {string} id 
  */
  updateCompID = id => {
    const status = {};
    this.setState({ computerID: id });
    status[this.state.computerID] = [];
    this.setState({ computerStatus: status }, () => {
      // console.log("init computer status", this.state.computerStatus);
    });
  };

  /**
   * * STYLE *
   * Takes a string and finds a substring and returns a stylized version of it,
   * specifically to add the 🖥 icon in front of the ID.
   * @param {string} str The full string
   * @param {string} find The particular substring to find
   * @returns {string} The stylized string
   */
  style_addThisCpuIcon = (str, find) => {
    var re = new RegExp(find, 'g');
    return str.replace(re, '🖥: ' + find);
  };

  style_makeEmojiToastLayout = (msg, emoji) => {
    return (
      <div className='cogo-toast'>
        <div className='cogo-toast-emoji-left'> {emoji}</div>
        <div>
          {msg[0]}
          <br />
          {msg[1]}
        </div>
        <div className='cogo-toast-emoji-right'> {emoji}</div>
      </div>
    );
  };

  ref_hideLoader = undefined;
  disp_showFileSavingLoader = () => {
    this.ref_hideLoader = cogoToast.loading(
      this.style_makeEmojiToastLayout(['视频正在保存', '请耐心等待'], '⌛️'),
      { hideAfter: 0 }
    );
    // setTimeout(hideLoader, 2000);
    // hideLoader();
    // this.setState({ hideLoader }, () => {
    //   console.log(hideLoader);
    // });
  };

  disp_showFileSavedMessage = () => {
    try {
      this.ref_hideLoader();
    } catch (NotOnPageError) {
      //
    }
  };

  initSocketListeners = () => {
    this.props.socket.on('server: connected sync id', id => {
      if (this.updateCompID) this.updateCompID(id);
      this.updateCompID = null;
    });

    this.props.socket.on('server: reset cams', () => {
      this.updateGreenLightStatus(true);
    });

    this.props.socket.on('server: response for connection status', status => {
      try {
        document.getElementById(
          'connection_status'
        ).innerHTML = this.style_addThisCpuIcon(
          JSON.stringify(status, null, 2),
          this.state.computerID
        );
      } catch (NotOnPageError) {
        //
      }
    });

    this.props.socket.on('server: response for recording status', () => {
      // console.log('beeppppps' + JSON.stringify(status));
    });

    this.props.socket.on('server: response for progress', progress => {
      this.setState({ recordedProgress: progress ? progress : 0 });
    });

    this.props.socket.on('server: response for numFilesSaved', numFiles => {
      this.updateFilesSaved(numFiles);
    });

    this.props.socket.on('server: save files successful', numFiles => {
      this.updateFilesSaved(numFiles);
      this.setState(
        {
          numFilesSavedInd: this.state.numFilesSavedInd + 1
        },
        () => {
          console.log(
            'this occured: ' + this.state.numFilesSavedInd + ' times.'
          );
          try {
            document.getElementById('testerNextBtn').disabled = true;
          } catch (NotYetLoadedException) {
            //
          }
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
                  cogoToast.success(
                    this.style_makeEmojiToastLayout(
                      ['视频已成功保存', '可继续录'],
                      '🔥'
                    ),
                    { hideAfter: 2 }
                  );
                }
              );

              this.updateGreenLightStatus(true);
            } catch (Exception) {
              console.error(Exception);
            }
            try {
              if (this.helper_checkIfMobileView()) {
                // console.log('here here??');
                cogoToast.info(
                  'Completed @ Sentence [' + this.state.recordedProgress + ']',
                  { hideAfter: 0.75 }
                );
              }
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

  updateRecordProgress = curr_sentence_index => {
    // { <sentence_index> : <bool: recorded/not> }
    this.setState(
      {
        recordedProgress: curr_sentence_index
      },
      () => {
        this.props.socket.emit(
          'client: update recording progress',
          curr_sentence_index
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

  updateGreenLightStatus = bool => {
    this.setState({ recordGreenLight: bool });
  };

  updateTotalTime = time => {
    this.setState({ totalTime: time });
  };

  getStatus = () => {
    this.props.socket.emit('client: ping for connection status');
    this.props.socket.emit('client: ping for numFilesSaved');
    this.props.socket.emit('client: ping for progress');
  };

  admin_resetCams = () => {
    // this.props.socket.emit('client: stop cams');
    this.updateGreenLightStatus(true);
    this.props.socket.emit('client: reset cams');
    try {
      document.getElementById('addCamBtn').click();
    } catch (NotYetLoadedException) {
      //
    }
    this.props.socket.emit('client: dummy vid, do not save');
    cogoToast.info('Cams are reset', { hideAfter: 0.3 });
  };

  admin_refreshAll = () => {
    this.props.socket.emit('client: refresh all');
  };

  admin_resetProgress = () => {
    this.props.socket.emit('client: update recording progress', 0);
    this.props.socket.emit('client: delete total time');
    this.props.socket.emit('client: reset total files');
    this.props.socket.emit('client: save total start time', new Date());
    window.location = window.location.origin;
    this.props.socket.emit('client: save total time', [0, 0, 0]);
  };

  helper_toggleModal = id => {
    document.getElementById(id).click();
  };

  helper_checkIfMobileView = () => {
    return window.location.href.includes('mobile');
  };

  helper_toggleCamState = () => {
    this.setState({ addCamState: !this.state.addCamState });
  };

  downHandler(event) {
    let key = event.key;
    if ([' ', 'ArrowLeft', 'ArrowRight', 'Escape', 'Enter'].includes(key)) {
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
        } else if (key === 'Enter') {
          console.log('detected enter key');
          if (document.getElementById('resetProgressBtn')) {
            console.log('reset button exists!');
            document.getElementById('resetProgressBtn').click();
          } else {
            return true;
          }
        }
        event.preventDefault();
      } catch (NotYetLoadedException) {
        console.error(NotYetLoadedException);
      }
    }
  }
}

App.propTypes = {
  socket: PropTypes.object.isRequired
}

export default App;
