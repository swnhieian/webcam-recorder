import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import NameField from '../NameField/NameField';
import qs from '../../utils/qs';
import cogoToast from 'cogo-toast';

export default function InProcessScreen(props) {
  const [recording, setRecordState] = useState(false);
  const [done_recording, setDoneRecording] = useState(false);
  const [reset_state, reset] = useState(false);
  const [nameSet, setName] = useState(!!qs('name'));
  const [waitForSave, setWaitForSave] = useState(false); 

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

  function record() {
    if (recording) {
      setDoneRecording(true);
      setRecordState(false);
      props.socket.emit('client: stop cams', 'in process screen');
      reset(false);
      setWaitForSave(true);
      cogoToast.loading('Files are currently saving. Please wait...');
      setTimeout(() => {
        setWaitForSave(false);
      }, 2000)
    } else {
      props.socket.emit('client: start cams', 'in process screen');
      setRecordState(true);
    }
  }

  function downHandler(event) {
    let key = event.key;
    //console.log(e);
    if ([' ', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      if (key === ' ') {
        document.getElementById('testerRecordBtn').click();
      } else if (key === 'ArrowLeft') {
        document.getElementById('testerPrevBtn').click();
      } else if (key === 'ArrowRight') {
        document.getElementById('testerNextBtn').click();
      }
      event.preventDefault();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    if (props.numFilesSaved % props.numCams === 0) {
      cogoToast.success('Files successfully saved.')
    }
      return () => {
        window.removeEventListener('keydown', downHandler);
      };
  });

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
          <div className='testing_content sentence_to_be_read'>
            {props.curr_sentence}
          </div>
          <button
            id='testerRecordBtn'
            className={getRecordState() === 'Done' ? 'btn btn-danger' : 'btn'}
            onClick={record}
            disabled={!props.recordGreenLight || props.numFilesSaved % props.numCams !== 0 || waitForSave}
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
              reset_state ||
              !props.recordGreenLight ||
              props.numFilesSaved % props.numCams !== 0 ||
              waitForSave
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
              !done_recording ||
              reset_state ||
              !props.recordGreenLight ||
              props.numFilesSaved % props.numCams !== 0 || 
              waitForSave
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
  recordGreenLight: PropTypes.bool.isRequired
};
