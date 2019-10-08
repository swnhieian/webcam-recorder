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

// util
import ip_util from '../utils/ip'

// chevron
import up_chevron from '../assets/svg/up-chevron.svg'
import down_chevron from '../assets/svg/down-chevron.svg'


class App extends React.Component {
  /**
   * **Basic Configuration**
   */
  sentencesPerPageInTable = 4; // sentences per page of Table
  curr_index = qs('sentence_index'); // extracts the curr index from URL
  ip_address = 'http://192.168.0.103:5000'; // default IP address of server

  /**
   * **CogoToast References to call to hide toasts**
   */
  showNoCamsRef = undefined;
  hideServerOfflineRef = undefined;

  /**
   * **ReactJS Framework Initializing States onCreate**
   * Constructor for main react App Component
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      addCamState: false,
      connectedOrderMap: {},
      connectedToServer: false,
      computerID: -1,
      computerStatus: {},
      currSentence: '',
      currSentenceIndex: this.curr_index ? Number(this.curr_index) : 0,
      currPageInTable: this.curr_index
        ? Math.floor(Number(this.curr_index) / this.sentencesPerPageInTable) + 1
        : 1,
      data: [],
      detectedNumCams: 0,
      debugMode: true,
      ip: this.ip_address,
      numFilesSavedTotal: 0,
      numFilesSavedInd: 0,
      recordProgress: 0,
      recordGreenLight: false,
      remainingWords: 0,
      requiredNumCams: 1,
      sentencesPerPageInTable: this.sentencesPerPageInTable, // sentences per page
      startTime: undefined,
      socket: io(this.ip_address),
      totalTime: [],
      totalWords: 0
    };
  }

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

  componentDidMount() {
    try {
      this.helper_emitInitialSocketMessages();
      this.readTextFile(sentences);
      this.initSocketListeners();
      document.getElementById('debug_mode').checked =
        this.state.requiredNumCams === 1;
      window.addEventListener('keydown', this.handler_keydown);
      window.addEventListener('keyup', this.handler_keyup);
      this.showNoCamsRef = this.helper_showNoCamsConnected();
      setTimeout(() => {
        this.hideServerOfflineRef = this.helper_showServerNotOnline();
      }, 1000);
    } catch (NotYetLoadedException) {
      console.error(NotYetLoadedException)
    }
  }

  handler_hoverMouseOutDebug = () => {
    try {
      document.getElementsByClassName('debug-group')[0].className +=
        ' ' + 'hideDebug';
    } catch (NotYetLoadedException) {
      console.error(NotYetLoadedException);
    }
  };

  handler_hoverMouseOverDebug = () => {
    try {
      document
        .getElementsByClassName('debug-group')[0]
        .classList.remove('hideDebug');
    } catch (NotYetLoadedException) {
      console.error(NotYetLoadedException);
    }
  };

  handler_hoverMouseOutBottom = () => {
    try {
      document.getElementsByClassName('panel_BG')[0].className +=
        ' ' + 'hideBottom';
    } catch (NotYetLoadedException) {
      console.error(NotYetLoadedException);
    }
  };

  handler_hoverMouseOverBottom = () => {
    try {
      document
        .getElementsByClassName('panel_BG')[0]
        .classList.remove('hideBottom');
    } catch (NotYetLoadedException) {
      console.error(NotYetLoadedException);
    }
  };

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
        {/* <span id='debug_hover_area'> */}
          {this.comp_debug()}
        {/* </span> */}
        {this.comp_tester()}
        {/* <span id='bottom_hover_area'> */}
          <div className='contents'>
            </div>
            < div className = "panel_BG hideBottom" >
              <div
                style={{ width: '100%', height: '100%' }}
                onClick={this.helper_toggleHideBottom}
              >
              <img className='chevron' src={down_chevron}></img>
              <div className='panel_container'>
                <div className='left_panel'>{this.comp_dataCollection()}</div>
                <div className='right_panel'>
                  <h3>Cameras</h3>
                  <div className='cameras_container'>
                    {this.comp_cameraList()}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        {/* </span> */}
      </div>
    );
  };

  /**
   * **Component: Admin Page**
   * Renders components for mobile view
   */
  main_adminView = () => {
    return <div style={{ textAlign: 'center' }}>{this.comp_debug()}</div>;
  };

  /**
   * **Component: PlaygroundPage**
   * Renders components for experimental purposes
   */
  main_playground = () => {
    return <Toggle />;
  };

  comp_debugHover = () => {};

  /**
   * **Component: Animation for Study Completion**
   */
  comp_completeAnimation = () => {
    if (this.state.recordProgress + 1 === this.state.data.length) {
      try {
        document.getElementById('testerNextBtn').disabled = true;
      } catch (NotYetLoadedException) {
        //
      }
      return <CompleteAnimation />;
    }
  };

  // * COMPONENT * //
  comp_dataCollection = () => {
    return (
      <DataCollection
        data={this.state.data}
        updateName={this.updateName}
        curr_sentence={this.state.currSentence}
        socket={this.state.socket}
        curr_sentence_index={this.state.currSentenceIndex}
        curr_page={this.state.currPageInTable}
        updatePage={this.updatePage}
        sentencesPerPageInTable={this.state.sentencesPerPageInTable}
      />
    );
  };

  // * COMPONENT * //
  comp_tester = () => {
    return (
      <Tester
        updateSentence={this.updateSentence}
        data={this.state.data}
        curr_sentence_index={this.state.currSentenceIndex}
        data_length={this.state.data.length}
        first_sentence={this.state.data[this.state.currSentenceIndex]}
        curr_sentence={this.state.currSentence}
        socket={this.state.socket}
        recordGreenLight={
          this.state.recordGreenLight &&
          this.state.numFilesSavedTotal % this.state.requiredNumCams === 0
        }
        debugMode={this.state.debugMode}
        numFilesSaved={this.state.numFilesSavedTotal}
        requiredNumCams={this.state.requiredNumCams}
        updateGreenLightStatus={this.updateGreenLightStatus}
        recordedProgress={this.state.recordProgress}
        updateRecordProgress={this.updateRecordProgress}
        totalTime={this.state.totalTime}
        updateTotalTime={this.updateTotalTime}
        showFileSavingLoader={this.disp_showFileSavingLoader}
        connectedToServer={this.state.connectedToServer}
        detectedNumCams={this.state.detectedNumCams}
      />
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
        addCam={this.admin_resetCams}
      />
    );
  };

  // * COMPONENT * //
  comp_status = () => {
    return (
      <Status
        totalWords={this.state.totalWords}
        data_length={this.state.data.length}
        recordedProgress={this.state.recordProgress}
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

  updateDebugMode = () => {
    this.setState({ debugMode: !this.state.debugMode });
  };

  // * COMPONENT * //
  comp_debug = () => {
    return (
      < div className = 'debug-group hideDebug' >
        <label className='debug_label'>Admin: </label>

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
          Add Webcam
        </button>
        <button
          className='debug_button'
          onClick={() => {
            this.helper_toggleModal('resetProgressModal');
          }}
        >
          Reset Progress
        </button>

        <div className='debug_inline_group'>
          <label className='debug_label'>Debug: </label>
          <Toggle
            id='debug_mode'
            onChangeFunc={this.handler_debugToggle}
            checked={this.state.debugMode}
            updateDebugMode={this.updateDebugMode}
          />
        </div>

        <br />
        <div className='debug_inline_group'>
          <label htmlFor='' className='debug_label'>
            Cams:{' '}
          </label>
          <input
            id='numCamsInput'
            type='text'
            className='debug_text_input debug_sm_input warning_message'
            value={this.state.detectedNumCams}
            readOnly
          />
        </div>

        <div className='debug_inline_group'>
            <label htmlFor='' className='debug_label'>
            Server:{' '}
          </label>
          <span className='server_status'></span>
          <input
            id='inputServerIP'
            type='text'
            className='debug_text_input warning_message'
            value={this.state.ip}
            onChange={this.handler_IPOnChange}
          />
          <button
            className='debug_button'
            onClick={this.handler_useThisCompAsServer}
          >
            {' '}
            📡{' '}
          </button>
        </div>


        <div
          style={{ width: '100%', height: '100%' }}
          onClick={this.helper_toggleHideDebug}
        >
          <img className='chevron top-chevron' src={up_chevron}></img>
          <div style={{height: '0.3em'}}></div>
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
          let currSentence = qs('sentence_index')
            ? this.state.data[Number(qs('sentence_index'))]
            : this.state.data[0];
          this.setState({ currSentence }, () => {
            // console.log(this.state.curr_sentence)
          });
          this.setState({
            totalWords: this.state.data.reduce(
              (sum, sentence) => sum + sentence.length,
              0
            )
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
      numFiles % this.state.requiredNumCams === 0
        ? ' (successful)'
        : ' (not all cams saved!!)';
    this.setState({
      numFilesSavedTotal: numFiles
    });
    if (successMessage === ' (successful)') {
      this.updateGreenLightStatus(true);
    }
    try {
      document.getElementById('num_files_saved').innerHTML =
        'Total Files Saved: ' + numFiles + successMessage;
    } catch (NotYetLoadedException) {
      // console.error(NotYetLoadedException);
    }
  };

  handler_useThisCompAsServer = () => {
    ip_util.clientGetIP(ip => {
      console.log(ip);
      if (ip.split('.').length === 4) {
        ip = 'http://' + ip + ':5000';
        cogoToast.loading(ip, {
          position: 'top-right',
          hideAfter: 3,
          onClick: hide => {
            hide();
          }
        });
        this.helper_setServerIP(ip);
        // if (!this.hideServerOfflineRef) {
        //   this.hideServerOfflineRef = this.helper_showServerNotOnline();
        // } else {
        //   this.hideServerOfflineRef();
        // }
      }
    });
    // const [ip_v6, ip_v4] = [temp[0], temp[1]]
    // console.log(ip_v4);
  };

  handler_IPOnChange = e => {
    this.setState({ ip: e.target.value });
  };

  debugCogoToastOnRef = undefined;
  debugCogoToastOffRef = undefined;
  
  showDebugOn = () => {
    return cogoToast.success(<p>Debug on. <br/>Required Cams: 1</p>, { hideAfter: 1, onClick: hide => hide() });
  }

  showDebugOff = () => {
    return cogoToast.warn(<p>Debug off. <br/>Required Cams: 8</p>, { hideAfter: 1, onClick: hide => hide() });
  }

  handler_debugToggle = debugMode => {
    console.log('toggling debug mode');
    this.setState({ debugMode }, () => {
      if (debugMode) {
        this.setState({ requiredNumCams: 1 });
        this.debugCogoToastOnRef = this.showDebugOn();
        {/* if (this.debugCogoToastOffRef) {this.debugCogoToastOffRef()} */}
        {/* console.log(this.debugCogoToastOffRef); */}
        {/* this.helper_removeHoverEventListeners(); */}
      } else {
        this.setState({ requiredNumCams: 8 });
        this.debugCogoToastOffRef = this.showDebugOff();
        {/* if (this.debugCogoToastOnRef) {this.debugCogoToastOnRef()} */}
        {/* console.log(this.debugCogoToastOnRef); */}

        // this.helper_addHoverEventListeners();
        this.handler_hoverMouseOutBottom();
      }
    });
  };

  handler_fileSaveSuccess = numFiles => {
    this.updateFilesSaved(numFiles);
    this.setState(
      {
        numFilesSavedInd: this.state.numFilesSavedInd + 1
      },
      () => {
        console.log('this occured: ' + this.state.numFilesSavedInd + ' times.');
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
                  {
                    hideAfter: 1,
                    onClick: hide => {
                      hide();
                    }
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
                'Completed @ Sentence [' + this.state.recordProgress + ']',
                {
                  hideAfter: 0.75,
                  onClick: hide => {
                    hide();
                  }
                }
              );
            }
          } catch (NotYetLoadedException) {
            console.error(NotYetLoadedException);
          }
        }
      }
    );
  };

  updateDetectedNumCams = detectedNumCams => {
    this.setState({ detectedNumCams });
    this.updateGreenLightStatus(true);
    this.showNoCamsRef();
    try {
      document.getElementsByClassName('debug_sm_input')[0].className +=
        this.state.detectedNumCams > 0 ? ' serverPlaceholderConnected' : '';
      document
        .getElementById('numCamsInput')
        .classList.remove('warning_message');
    } catch (NotYetLoadedException) {
      //
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
      {
        hideAfter: 0,
        onClick: hide => {
          hide();
        }
      }
    );
    // setTimeout(hideLoader, 2000);
    // hideLoader();
    // this.setState({ hideLoader }, () => {
    //   console.log(hideLoader);
    // });
  };


  /**
   * Hides file saved loader
   */
  disp_showFileSavedMessage = () => {
    try {
      this.ref_hideLoader();
    } catch (NotOnPageError) {
      //
    }
  };

  /**
   * Socket Listeners — adds socket listeners to the page to respond to 
   * messages sent from server
   */
  initSocketListeners = () => {
    this.state.socket.on('server: online', () => {
      cogoToast.success('Server is online.', {
        position: 'top-right',
        hideAfter: 0,
        onClick: hide => {
          hide();
        }
      });
      if (this.hideServerOfflineRef) this.hideServerOfflineRef();
      document
        .getElementsByClassName('server_status')[0]
        .classList.add('server_online');
      document
        .getElementById('inputServerIP')
        .classList.add('serverPlaceholderConnected');
      document
        .getElementById('inputServerIP')
        .classList.remove('warning_message');
    });

    if (!this.hideServerOfflineRef) {
      this.hideServerOfflineRef = this.helper_showServerNotOnline();
    } else {
      this.hideServerOfflineRef();
    }

    this.state.socket.on('server: disconnected', () => {
      this.setState({ connectedToServer: false }, () => {
        document
          .getElementsByClassName('server_status')[0]
          .classList.remove('server_online');
        document
          .getElementById('inputServerIP')
          .classList.remove('serverPlaceholderConnected');
      });
    });

    this.state.socket.on('server: connected', computerID => {
      console.log('detected server connected');
      this.setState({ connectedToServer: true, computerID }, () => {
        document
          .getElementById('inputServerIP')
          .classList.add('serverPlaceholderConnected');
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
      this.setState({ recordProgress: progress ? progress : 0 });
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
  updateSentence = currSentence => {
    if (currSentence === '$next') {
      this.setState(
        { currSentenceIndex: this.state.currSentenceIndex + 1 },
        () => {
          this.updateSentence(this.state.data[this.state.currSentenceIndex]);
          this.state.socket.emit('client: update sentence_index', {
            name: qs('name'),
            currSentenceIndex: this.state.currSentenceIndex
          });
        }
      );
    } else if (currSentence === '$prev') {
      this.setState(
        {
          currSentenceIndex: Math.max(this.state.currSentenceIndex - 1, 0)
        },
        () => {
          this.updateSentence(this.state.data[this.state.currSentenceIndex]);
          this.state.socket.emit('client: update sentence_index', {
            name: qs('name'),
            currSentenceIndex: this.state.currSentenceIndex
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
          this.state.currSentenceIndex
      );
      // console.log(curr_sentence);
      this.setState({
        currSentence,
        currPageInTable:
          Math.floor(
            Number(this.state.currSentenceIndex) / this.state.sentencesPerPageInTable
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
      currPageInTable: new_page >= 1 ? new_page : 1
    });
  };

  updateRecordProgress = currSentenceIndex => {
    // { <sentence_index> : <bool: recorded/not> }
    this.setState(
      {
        recordProgress: currSentenceIndex
      },
      () => {
        this.state.socket.emit(
          'client: update recording progress',
          currSentenceIndex
        );
      }
    );
  };

  updateConnectionStatus = recordingStatus => {
    if (this.state.computerStatus[this.state.computerID]) {
      const status = {};
      status[this.state.computerID] = recordingStatus;
      this.setState({ computerStatus: status }, () => {});
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
    // cogoToast.info('Adding Cam', {hideAfter: 1})
    // this.state.socket.emit('client: stop cams');
    // this.updateGreenLightStatus(true);
    this.state.socket.emit('client: reset cams');
    try {
      document.getElementById('addCamBtn').click();
    } catch (NotYetLoadedException) {
      //
    }
    this.state.socket.emit('client: dummy vid, do not save');
    // cogoToast.info('Cams are reset', { hideAfter: 0.3 });
    // setTimeout(() => document.getElementById('resetCamsBtn').classList.remove('btn-active'), 1000);
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
        currSentenceIndex: this.state.currSentenceIndex
      });
    } else {
      this.state.socket.emit('client: ask for recording status');
    }
    this.state.socket.emit('client: check for progress');
    this.state.socket.emit('client: ask for sync id');
  };

  helper_toggleModal = id => {
    document.getElementById(id).click();
  };

  helper_checkIfMobileView = () => {
    return window.location.href.includes('mobile');
  };

  helper_showNoCamsConnected = () => {
    return cogoToast.warn('No Webcams', {
      hideAfter: 0,
      position: 'top-left',
      onClick: this.admin_resetCams
    });
  };

  helper_showServerNotOnline = () => {
    console.log('no server');
    return cogoToast.warn('Server is offline', {
      hideAfter: 0,
      position: 'top-right',
      onClick: hide => {
        this.handler_useThisCompAsServer();
        hide();
      }
    });
  };

  helper_setServerIP = ip => {
    this.state.socket.disconnect();
    try {
      document
        .getElementsByClassName('server_status')[0]
        .classList.remove('server_online');
      document
        .getElementById('inputServerIP')
        .classList.remove('serverPlaceholderConnected');
    } catch (NotYetLoadedException) {
      //
    }
    this.setState({
      socket: io(ip),
      ip: ip
    });
    this.state.socket.emit('client: check server connection');
    // if (hideLoadServer) {hideLoadServer()}
    setTimeout(() => {
      if (
        !document
          .getElementsByClassName('server_status')[0]
          .className.includes('server_online')
      ) {
        this.hideServerOfflineRef = this.helper_showServerNotOnline();
      }
    }, 3000);
    this.initSocketListeners();
  };

  helper_addHoverEventListeners = () => {
    const debugHoverArea = document.getElementById('debug_hover_area');
    const bottomHoverArea = document.getElementById('bottom_hover_area');
    debugHoverArea.addEventListener(
      'mouseout',
      this.handler_hoverMouseOutDebug
    );
    debugHoverArea.addEventListener(
      'mouseover',
      this.handler_hoverMouseOverDebug
    );
    bottomHoverArea.addEventListener(
      'mouseout',
      this.handler_hoverMouseOutBottom
    );
    bottomHoverArea.addEventListener(
      'mouseover',
      this.handler_hoverMouseOverBottom
    );
  };

  helper_removeHoverEventListeners = () => {
    const debugHoverArea = document.getElementById('debug_hover_area');
    const bottomHoverArea = document.getElementById('bottom_hover_area');
    debugHoverArea.removeEventListener(
      'mouseout',
      this.handler_hoverMouseOutDebug
    );
    debugHoverArea.removeEventListener(
      'mouseover',
      this.handler_hoverMouseOverDebug
    );
    bottomHoverArea.removeEventListener(
      'mouseout',
      this.handler_hoverMouseOutBottom
    );
    bottomHoverArea.removeEventListener(
      'mouseover',
      this.handler_hoverMouseOverBottom
    );
    this.handler_hoverMouseOverBottom();
  };

  helper_toggleHideDebug = () => {
    console.log('toggling');
    try {
      if (
        document
          .getElementsByClassName('debug-group')[0]
          .className.includes('hideDebug')
      ) {
        this.handler_hoverMouseOverDebug();
      } else {
        this.handler_hoverMouseOutDebug();
      }
    } catch (NotYetLoadedException) {
      //
    }
  };

  helper_toggleHideBottom = () => {
    console.log('toggling');
    try {
      if (
        document
          .getElementsByClassName('panel_BG')[0]
          .className.includes('hideBottom')
      ) {
        this.handler_hoverMouseOverBottom();
      } else {
        this.handler_hoverMouseOutBottom();
      }
    } catch (NotYetLoadedException) {
      //
    }
  };

  helper_toggleCamState = () => {
    this.setState({ addCamState: !this.state.addCamState });
  };

  handler_keyup() {
    for (const btn of document.getElementsByClassName('debug_button')) {
      btn.classList.remove('btn-active');
    }
  }

  handler_keydown = event => {
    let key = event.key;
    const inputServerIP = document.getElementById('inputServerIP');

    if (
      [' ', 'ArrowLeft', 'ArrowRight', 'Escape', 'Enter', 's'].includes(key)
    ) {
      try {
        if (key === ' ') {
          document.getElementById('testerRecordBtn').click();
          event.preventDefault();
        } else if (key === 'ArrowLeft') {
          if (document.activeElement !== inputServerIP) {
            document.getElementById('testerPrevBtn').click();
            event.preventDefault();
          }
        } else if (key === 'ArrowRight') {
          if (document.activeElement !== inputServerIP) {
            document.getElementById('testerNextBtn').click();
            event.preventDefault();
          }
        } else if (key === 'Escape') {
          document.getElementById('resetCamsBtn').click();
          event.preventDefault();
        } else if (key === 'Enter') {
          console.log('detected enter key');
          if (document.getElementsByClassName('modali-button-destructive')[0]) {
            document
              .getElementsByClassName('modali-button-destructive')[0]
              .click();
            this.admin_resetProgress();
          }
          if (document.activeElement === inputServerIP) {
            this.helper_setServerIP(inputServerIP.value);
            cogoToast.info('Updated IP: ' + inputServerIP.value, {
              onClick: hide => {
                hide();
              }
            });
            event.preventDefault();
          }
        } else if (key === 's') {
          if (document.activeElement.nodeName.toLowerCase() !== 'input')
            this.helper_toggleModal('overallStatus');
        }
      } catch (NotYetLoadedException) {
        // console.error(NotYetLoadedException);
      }
    }
  };
}

export default App;
