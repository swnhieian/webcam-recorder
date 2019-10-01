/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NameField from '../NameField/NameField';
import qs from '../../utils/qs';

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
    props.showFileSavingLoader();
    props.updateSentence('$next');

    props.updateGreenLightStatus(false);
    props.stopTimer();
    markSentenceAsDone(props.curr_sentence_index);
  }

  function markSentenceAsDone(curr_sentence_index) {
    if (curr_sentence_index >= 0 ) props.updateRecordProgress(curr_sentence_index);
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
    const recordedYet =
      props.recordedProgress > props.curr_sentence_index;
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

  function makeEmojiLayout(msg, emoji) {
    return (
      <div className='emoji-layout-container'>
        <div className='emoji-layout-emoji-left'> {emoji}</div>
        <div>
          {msg[0]}
          <br />
          {msg[1]}
        </div>
        <div className='emoji-layout-emoji-right'> {emoji}</div>
      </div>
    );
  }

  function displaySentenceToBeRead() {
    disableNextButtonIfCurrNotRead();
    const recordedYet = 
      (props.curr_sentence_index > 0) ? 
      props.recordedProgress >= props.curr_sentence_index : 
      false;
    const emoji = (recordedYet) ? '✅' : ''
    let sentence = props.data[props.curr_sentence_index];
    if (sentence) {
      const line1 = sentence.substring(0,10)
      const line2 = sentence.substring(10);
      sentence = makeEmojiLayout([line1, line2], emoji);
    }
    // const sentence = recordedMessage + ' ' + props.data[props.curr_sentence_index] + ' ' + recordedMessage;
    const recordedClassName = recordedYet ? 'recorded_sentence_highlight sentence_to_be_read' : 'sentence_to_be_read'
    return (
      <div>
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
        </div>
      );
    } else {
      return (
        <div>
          {displaySentenceToBeRead()}
          <div className='recording_hint'>
            {getRecordState() === 'Done' ? '🔴' : ''}
          </div>
          <div id="record-time-container">
            {props.comp_timer('recording_time')}
          </div>
          <button
            id='testerRecordBtn'
            className={
              getRecordState() === 'Done'
                ? 'btn btn-danger'
                : 'btn_highlight_green'
            }
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
  recordedProgress: PropTypes.number.isRequired,
  updateRecordProgress: PropTypes.func.isRequired,
  showFileSavingLoader: PropTypes.func.isRequired,
  comp_timer: PropTypes.func.isRequired
};
