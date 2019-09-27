/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NameField from '../NameField/NameField';
import qs from '../../utils/qs';
import cogoToast from 'cogo-toast';

export default function InProcessScreen(props) {
  const [recording, setRecordState] = useState(false);
  const [done_recording, setDoneRecording] = useState(false);
  const [reset_state, reset] = useState(false);
  const [nameSet, setName] = useState(qs('name'));

  function updateSentence(data) {
    reset(true);
    props.updateSentence(data);
  }

  function getRecordState() {
    if (recording) {
      return 'Done';
    } else if (done_recording && !reset_state) {
      return 'Retry';
    } else {
      return 'Record';
    }
  }

  function stopRecording() {
    setDoneRecording(true);
    setRecordState(false);
    props.socket.emit('client: stop cams', 'in process screen');
    reset(false);
    cogoToast
      .loading('Files are currently saving. Please wait...', { hideAfter: 2 });
    props.updateGreenLightStatus(false);
    props.stopTimer();
    markSentenceAsDone(props.curr_sentence_index);
  }

  function markSentenceAsDone(curr_sentence_index) {
    const temp = {}
    temp[curr_sentence_index] = true;
    props.updateRecordProgress(temp);
  }

  function startRecording() {
    props.socket.emit('client: start cams', 'in process screen');
    setRecordState(true);
    props.startTimer();
  }

  function record() {
    document.getElementById('showSavedFilesBtn').disabled = false;
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  
  function disableNextButtonIfCurrNotRead() {
    // console.log(props.recordedProgress)
    // console.log(props.curr_sentence_index);
    const recordedYet = (props.recordedProgress[props.curr_sentence_index]) ? props.recordedProgress[props.curr_sentence_index] : false;
    // console.log(recordedYet);
    try {
      if (recordedYet) {
        document.getElementById('testerNextBtn').disabled = false;
      } else {
        document.getElementById('testerNextBtn').disabled = true;
      }
    } catch (Exception) {
      // console.log(Exception);
    }
  }

  function displaySentenceToBeRead() {
    disableNextButtonIfCurrNotRead();
    const recordedYet = (props.recordedProgress[props.curr_sentence_index]) ? props.recordedProgress[props.curr_sentence_index] : false;
    const recordedMessage = (recordedYet) ? '(录过)' : ''
    const sentence = props.data[props.curr_sentence_index] + ' ' + recordedMessage;
    const recordedClassName = recordedYet ? 'recorded_sentence_highlight sentence_to_be_read' : 'sentence_to_be_read'
    return (
      <div>
        [{props.curr_sentence_index}]
        <br />
        <div className={recordedClassName}>
          {sentence}
        </div>
      </div>
    );
  }

  

  function trans(text) {
    if (text === 'Done') {
      return '结束录制';
    } else if (text === 'Retry') {
      return '重新录制';
    } else if (text === 'Record') {
      return '开始录制'
    } else {
      return text;
    }
  }

  function updateTesterContents() {
    setName(true);
  }

  function getContents() {
    if (!nameSet) {
      return (
        <div>
          <NameField
            socket={props.socket}
            updateTesterContents={updateTesterContents}
            updateGreenLightStatus={props.updateGreenLightStatus}
          />
          <p className='warning_message'>Enter Name Before Starting</p>
        </div>
      );
    } else {
      return (
        <div>
          <div className='recording_hint'>
            {getRecordState() === 'Done' ? '录制中...' : ''}
          </div>
          <div>{displaySentenceToBeRead()}</div>
          <button
            id='testerRecordBtn'
            className={getRecordState() === 'Done' ? 'btn btn-danger' : 'btn'}
            onClick={record}
            disabled={
              !props.recordGreenLight ||
              props.numFilesSaved % props.numCams !== 0
            }
          >
            {trans(getRecordState())}
          </button>
          <br />
          <button
            className='btn'
            id='testerPrevBtn'
            onClick={() => updateSentence('$prev')}
            disabled={
              props.curr_sentence_index === 0 ||
              !props.recordGreenLight ||
              props.numFilesSaved % props.numCams !== 0 ||
              recording
            }
          >
            ⬅上一句
          </button>
          <button
            className='btn'
            id='testerNextBtn'
            onClick={() => updateSentence('$next')}
            disabled={
              props.curr_sentence_index === props.data_length - 1 ||
              !props.recordGreenLight ||
              props.numFilesSaved % props.numCams !== 0 ||
              recording 
    }
  >
    下一句➡
          </button>
        </div>
      );
    }
  }

  return (
    <div className='test_container'>
      {getContents()}
    </div>
  );
}

InProcessScreen.propTypes = {
  curr_sentence_index: PropTypes.number.isRequired,
  curr_sentence: PropTypes.string.isRequired,
  data_length: PropTypes.number.isRequired,
  updateSentence: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  updateGreenLightStatus: PropTypes.func.isRequired,
  recordGreenLight: PropTypes.bool.isRequired,
  numFilesSaved: PropTypes.number.isRequired,
  numCams: PropTypes.number.isRequired,
  stopTimer: PropTypes.func.isRequired,
  startTimer: PropTypes.func.isRequired,
  recordedProgress: PropTypes.object.isRequired,
  updateRecordProgress: PropTypes.func.isRequired
};
