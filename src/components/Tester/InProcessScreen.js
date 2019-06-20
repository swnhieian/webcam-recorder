import React, { useState } from 'react';
import PropTypes from 'prop-types';

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

  let qs = (function (a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p = a[i].split('=', 2);
      if (p.length == 1)
        b[p[0]] = "";
      else
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(window.location.search.substr(1).split('&'));

  function startTesting() {
    document.location.search = "?name=" + qs["name"] + "&sentence_index=0";
  }

  function getContents() {
    if (qs["sentence_index"] === undefined) {
      return (
        <button className='btn' onClick={startTesting}>
          Start
      </button>
      )
    } else {
      return (
        <div>
          <div className='testing_content sentence_to_be_read'>
            {props.curr_sentence}
          </div>
          <button className='btn' onClick={record}>
            {getRecordState()}
          </button>
          <br />
          <button
            className='btn'
            onClick={() => updateSentence('$prev')}
            disabled={props.curr_sentence_index === 0 || reset_state}
          >
            Prev
        </button>
          <button
            className='btn'
            onClick={() => updateSentence('$next')}
            disabled={
              props.curr_sentence_index === props.data_length - 1 ||
              !done_recording || reset_state
            }
          >
            Next
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
  data_length: PropTypes.number.isRequired,
  updateSentence: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired
};
