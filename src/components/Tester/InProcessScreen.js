import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import qs from '../../utils/qs'

export default function InProcessScreen(props) {
  const [recording, setRecordState] = useState(false);
  const [done_recording, setDoneRecording] = useState(false);
  const [reset_state, reset] = useState(false)

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
    } else {
      props.socket.emit('client: start cams', 'in process screen');
      setRecordState(true);
    }
  }

  function startTesting() {
    document.location.search = "?name=" + qs["name"] + "&sentence_index=0";
  }

  function downHandler(event) {
    let key = event.key;
    //console.log(e);
    if ([' ', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      if (key === ' ') {
        record();
      } else if (key === 'ArrowLeft') {
        updateSentence('$prev');
      } else if (key === 'ArrowRight') {
        updateSentence('$next');
      }
      event.preventDefault();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    }
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

  function getContents() {
    if (qs["sentence_index"] === undefined) {
      return (
        <div>
          <button className='btn' 
                  onClick={startTesting} 
                  disabled={qs["name"] === undefined || qs["sentence_index"] === undefined}>
            Start
          </button>
          <p className="warning_message">Enter Name Before Starting</p>

        </div>
      )
    } else {
      return (
        <div>
          <div className="recording_hint">
            {getRecordState() === 'Done' ? '录制中...': ''}
          </div>
          <div className='testing_content sentence_to_be_read'>
            {props.curr_sentence}
          </div>
          <button className={getRecordState()==='Done'?'btn btn-danger': 'btn'} onClick={record}>
            {trans(getRecordState())}
          </button>
          <br />
          <button
            className='btn'
            onClick={() => updateSentence('$prev')}
            disabled={props.curr_sentence_index === 0 || reset_state}
          >
            上一句⬅
        </button>
          <button
            className='btn'
            onClick={() => updateSentence('$next')}
            disabled={
              props.curr_sentence_index === props.data_length - 1 ||
              !done_recording || reset_state
            }
          >
            下一句➡
        </button>

        </div>
      )
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
  data: PropTypes.array.isRequired
};
