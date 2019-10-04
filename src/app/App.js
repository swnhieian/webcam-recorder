/* eslint-disable no-console */
import React from 'react';
import update from 'react-addons-update'
import qs from '../utils/qs'
import cogoToast from 'cogo-toast';
import { HashRouter as Router, Route } from "react-router-dom";
import io from 'socket.io-client';

// scss
import './App.scss';

// components
import CameraList from '../components/CameraList/CameraList';
import Tester from '../components/Tester/Tester';
import DataCollection from '../components/Table/DataCollection';
import Modal from '../components/Modal'
import Status from '../components/Status'
import Toggle from '../components/Toggle/Toggle'
import CompleteAnimation from '../components/CompleteAnimation/CompleteAnimation'

// data
import sentences from '../assets/data/sentences.txt';
// import sentences from '../assets/data/sentences-english-test.txt';

import ip_util from '../utils/ip'

class App extends React.Component {
  per_page = 8;
  curr_index = qs('sentence_index');

  /**
   * Constructor for main react App Component
   * @param {object} props 
   */
  constructor(props) {
    super(props);
    this.state = {
      curr_sentence: '',
      curr_sentence_index: this.curr_index ? Number(this.curr_index) : 0,
      data: [],
      per_page: this.per_page,
      curr_page: this.curr_index ? Math.floor(Number(this.curr_index) / this.per_page) + 1 : 1,
      computerStatus: {},
      recordGreenLight: false,
      computerID: -1,
      numFilesSavedTotal: 0,
      numFilesSavedInd: 0,
      connectedOrderMap: {},
      requiredNumCams: 8,
      recordedProgress: 0,
      addCamState: false,
      totalTime: [],
      startTime: undefined,
      totalWords: 0,
      remainingWords: 0,
      debugMode: false,
      socket: io('http://192.168.0.103:5000'),
      ip: 'http://192.168.0.103:5000',
      connectedToServer: false,
      detectedNumCams: 0
    };
  }

  /**
   * **ReactJS Framework Method**  
   */
  render() {
    return (
      <Router>
        <Route path='/' exact component={this.main_userView} />
        <Route path='/admin' exact component={this.main_adminView} />
        <Route path='/playground' exact component={this.main_playground} />
        {this.comp_modals()}
        {this.comp_completeAnimation()}
      </Router>
    );
  }

  /**
   * **ReactJS Framework Method**
   */
  componentDidMount() {
    // console.log(ip.getIP());
    console.log(ip_util);
    this.helper_emitInitialSocketMessages();
    this.readTextFile(sentences);
    this.initSocketListeners();
    try {
      document.getElementById('debug_mode').checked = this.state.requiredNumCams === 1
    } catch (NotYetLoadedException) {
      //
    }
    // this.pingServer();
    window.addEventListener('keydown', this.handler_keydown);
    window.addEventListener('keyup', this.handler_keyup);
  }

  /**
   * **ReactJS Framework Method** 
   */
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handler_keydown);
  }

  /**
   * **Component: User Page** 
   * Renders components for desktop view
   */
  main_userView = () => {
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

  /**
   * **Component: Admin Page**
   * Renders components for mobile view
   */
  main_adminView = () => {
    return <div style={{textAlign: 'center'}}>{this.comp_debug()}</div>;
  };

  /** 
   * **Component: PlaygroundPage**
   * Renders components for experimental purposes
   */

   main_playground = () => {
     return (
       <Toggle />
     )
   }
  /**
   * **Component: Animation for Study Completion**
   */
  comp_completeAnimation = () => {
    if (this.state.recordedProgress + 1 === this.state.data.length) {
      try {
        document.getElementById('testerNextBtn').disabled = true;
      } catch(NotYetLoadedException) {
        //
      }
      return (
        <CompleteAnimation />
      )
    }
  }

  // * COMPONENT * //
  comp_dataCollection = () => {
    return (
      <DataCollection
        data={this.state.data}
        updateName={this.updateName}
        curr_sentence={this.state.curr_sentence}
        socket={this.state.socket}
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
        socket={this.state.socket}
        recordGreenLight={
          this.state.recordGreenLight &&
          this.state.numFilesSavedTotal % this.state.requiredNumCams === 0
        }
        numFilesSaved={this.state.numFilesSavedTotal}
        numCams={this.state.requiredNumCams}
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
        socket={this.state.socket}
        computerID={this.state.computerID}
        computerStatus={this.state.computerStatus}
        updateConnectionStatus={this.updateConnectionStatus}
        addCamState={this.state.addCamState}
        toggleCamState={this.helper_toggleCamState}
        updateDetectedNumCams={this.updateDetectedNumCams}
      />
    );
  };

  // * COMPONENT * //
  comp_status = () => {
    return (
      <Status
        totalWords={this.state.totalWords}
        data_length={this.state.data.length}
        recordedProgress={this.state.recordedProgress}
        helper_checkIfMobileView={this.helper_checkIfMobileView}
        recordGreenLight={this.state.recordGreenLight}
        socket={this.state.socket}
      />
    );
  };

  // * COMPONENT * //
  comp_modals = () => {
    return (
      <div>
        <Modal
          modalID={'resetProgressModal'}
          socket={this.state.socket}
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
          socket={this.state.socket}
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
      <div className="debug-group">
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
        
        
        <div className="debug_inline_group">
          <label className="debug_label">Debug Mode: </label>
          <Toggle id='debug_mode' onChangeFunc={this.handler_debugToggle} />
        </div>

        <div className="debug_inline_group">
          <label htmlFor="" className="debug_label">Server: </label>
          <span className="server_status"></span>
          <input id="inputServerIP" type="text" className="debug_text_input" value={this.state.ip} onChange={this.handler_IPOnChange}/>
        </div>
        <button className='debug_button' onClick={this.handler_useThisCompAsServer()}>🖥</button>

        <div className="debug_inline_group">
          <label htmlFor="" className="debug_label">Cams: </label>
          <input type="text" className="debug_text_input debug_sm_input" value={this.state.detectedNumCams} readOnly/>
        </div>


        {/* <button className='debug_button' onClick={this.admin_refreshAll}>
          Refresh All
        </button> */}

        <button
          onClick={this.disp_showFileSavedMessage}
          id='showSavedFilesBtn'
          className='hidden_button'
        ></button>

        {/* <pre hidden={this.state.numCams === 8}>
          debug mode, remember to change num cams back to 8
        </pre> */}
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
          this.setState({
            totalWords: this.state.data.reduce((sum, sentence) => sum + sentence.length, 0)
          })
        });
      });
  }

  /**
   * * UPDATE * 
   * 
   */
  updateFilesSaved = numFiles => {
    const successMessage =
      numFiles % this.state.requiredNumCams === 0
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

  handler_useThisCompAsServer = () => {

  }

  handler_IPOnChange = e => {
    this.setState({ip: e.target.value})
  }
  handler_debugToggle = debugMode => {
    this.setState({debugMode}, () => {
      if (debugMode) {
        this.setState({requiredNumCams: 1});
      } else {
        this.setState({requiredNumCams: 8});
      }
    });
  }

  handler_fileSaveSuccess = numFiles => {
    this.updateFilesSaved(numFiles);
    this.setState({
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
        if (this.state.numFilesSavedInd === this.state.requiredNumCams) {
          console.log('correct number of files saved');
          try {
            document.getElementById('showSavedFilesBtn').click();
            document.getElementById('showSavedFilesBtn').disabled = true;
            this.setState({
                numFilesSavedInd: 0
              },
              () => {
                cogoToast.success(
                  this.style_makeEmojiToastLayout(
                    ['视频已成功保存', '可继续录'],
                    '🔥'
                  ), {
                    hideAfter: 2
                  }
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
                'Completed @ Sentence [' + this.state.recordedProgress + ']', {
                  hideAfter: 0.75
                }
              );
            }
          } catch (NotYetLoadedException) {
            console.error(NotYetLoadedException);
          }
        }
      }
    );
  }

  updateDetectedNumCams = detectedNumCams => {
    this.setState({ detectedNumCams });
    try {
      document.getElementsByClassName('debug_sm_input')[0].className += (this.state.detectedNumCams > 0) ? " serverPlaceholderConnected" : ""
    } catch (NotYetLoadedException) {
      //
    }
  }

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

  /**
   * **Socket Listeners**
   * Adds socket listeners to the page to respond to messages sent
   * from server
   */
  initSocketListeners = () => {
    this.state.socket.on('server: online', () => {
      console.log('server online!')
      document.getElementsByClassName('server_status')[0].classList.add('server_online');
      document.getElementById('inputServerIP').classList.add('serverPlaceholderConnected');
    });

    this.state.socket.on('server: disconnected', () => {
      this.setState({ connectedToServer: false}, () => {
        document.getElementsByClassName('server_status')[0].classList.remove('server_online');
        document.getElementById('inputServerIP').classList.remove('serverPlaceholderConnected')
      });
    });

    this.state.socket.on('server: connected', computerID => {
      console.log('detected server connected')
      this.setState({ connectedToServer: true, computerID}, () => {
        document.getElementsByClassName('server_status')[0].classList.add('server_online');
        document.getElementById('inputServerIP').classList.add('serverPlaceholderConnected')
      });
    });
    
    this.state.socket.on('server: connected sync id', id => {
      if (this.updateCompID) this.updateCompID(id);
      this.updateCompID = null;
    });

    this.state.socket.on('server: reset cams', () => {
      this.updateGreenLightStatus(true);
    });

    this.state.socket.on('server: response for connection status', status => {
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

    this.state.socket.on('server: response for progress', progress => {
      this.setState({ recordedProgress: progress ? progress : 0 });
    });

    this.state.socket.on('server: response for numFilesSaved', numFiles => {
      this.updateFilesSaved(numFiles);
    });

    this.state.socket.on('server: save files successful', numFiles => {
      this.handler_fileSaveSuccess(numFiles);
    });

    this.state.socket.on('server: computer connected order', connectedOrder => {
      this.setState({
        connectedOrderMap: update(this.state.connectedOrderMap, {
          $merge: connectedOrder
        })
      });
    });

    const refreshRates = [0, 666, 1332];
    this.state.socket.on('server: refresh all', () => {
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
      const serverID = this.state.socket.io.opts.hostname;
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

  /**
   * **Update: Sentence** 
   * Sent as a prop to components to update app-level state of 
   * curr_sentence_index, and updates server with new index. It also updates 
   * url query without refreshing to reflect current index.
   * @param {string} curr_sentence
   */
  updateSentence = curr_sentence => {
    if (curr_sentence === '$next') {
      this.setState({curr_sentence_index: this.state.curr_sentence_index + 1},
        () => {
          this.updateSentence(
            this.state.data[this.state.curr_sentence_index]
          );
          this.state.socket.emit('client: update sentence_index', {
            name: qs('name'),
            curr_sentence_index: this.state.curr_sentence_index
          });
        }
      );
    } else if (curr_sentence === '$prev') {
      this.setState(
        {
          curr_sentence_index: Math.max(this.state.curr_sentence_index - 1, 0)
        },
        () => {
          this.updateSentence(this.state.data[this.state.curr_sentence_index]);
          this.state.socket.emit('client: update sentence_index', {
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
        this.state.socket.emit(
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
      });
      this.state.socket.emit('client: update recording status', status);
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
    this.state.socket.emit('client: ping for connection status');
    this.state.socket.emit('client: ping for numFilesSaved');
    this.state.socket.emit('client: ping for progress');
  };

  admin_resetCams = () => {
    // this.state.socket.emit('client: stop cams');
    this.updateGreenLightStatus(true);
    this.state.socket.emit('client: reset cams');
    try {
      document.getElementById('addCamBtn').click();
    } catch (NotYetLoadedException) {
      //
    }
    this.state.socket.emit('client: dummy vid, do not save');
    // cogoToast.info('Cams are reset', { hideAfter: 0.3 });

    const resetBtn = document.getElementById('resetCamsBtn');
    if (!resetBtn.className.includes('btn-active')) {
      document.getElementById('resetCamsBtn').className += (' btn-active');
    }
  };

  admin_refreshAll = () => {
    this.state.socket.emit('client: refresh all');
  };

  admin_resetProgress = () => {
    this.state.socket.emit('client: update recording progress', 0);
    this.state.socket.emit('client: delete total time');
    this.state.socket.emit('client: reset total files');
    this.state.socket.emit('client: save total start time', new Date());
    window.location = window.location.origin;
    this.state.socket.emit('client: save total time', [0, 0, 0]);
  };

  helper_emitInitialSocketMessages = () => {
    if (!this.helper_checkIfMobileView) {
      this.state.socket.emit('client: update sentence_index', {
        name: qs('name'),
        curr_sentence_index: this.state.curr_sentence_index
      });
    } else {
      this.state.socket.emit('client: ask for recording status');
    }
    this.state.socket.emit('client: check for progress');
    this.state.socket.emit('client: ask for sync id');
  }

  helper_toggleModal = id => {
    document.getElementById(id).click();
  };

  helper_checkIfMobileView = () => {
    return window.location.href.includes('mobile');
  };

  helper_toggleCamState = () => {
    this.setState({ addCamState: !this.state.addCamState });
  };

  handler_keyup() {
    for (const btn of document.getElementsByClassName('debug_button')) {
      btn.classList.remove('btn-active');
    }
  }

  handler_keydown = (event) => {
    let key = event.key;
    if ([' ', 'ArrowLeft', 'ArrowRight', 'Escape', 'Enter', 's'].includes(key)) {
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
          if (document.getElementsByClassName('modali-button-destructive')[0]) {
            document.getElementsByClassName('modali-button-destructive')[0].click();
            this.admin_resetProgress();
          }
          const inputServerIP = document.getElementById('inputServerIP');
          if (document.activeElement === inputServerIP) {
            this.state.socket.disconnect();
            document.getElementsByClassName('server_status')[0].classList.remove('server_online');
            document.getElementById('inputServerIP').classList.remove('serverPlaceholderConnected');
            console.log(inputServerIP.value);
            this.setState({socket: io(inputServerIP.value), ip: inputServerIP.value});
            this.state.socket.emit('client: check server connection')
          }
        } else if (key === 's') {
          this.helper_toggleModal('overallStatus');
        }
        event.preventDefault();
      } catch (NotYetLoadedException) {
        console.error(NotYetLoadedException);
      }
    }
  }
}

export default App;
