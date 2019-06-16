import React, {useState} from 'react';
import PropTypes from 'prop-types';

export default function InProcessScreen(props) {
  const [record_state, setRecordState] = useState(false);
  const [done_recording, setDoneRecording] = useState(false);

  function sendCmdToServer(cmd) {
    if (cmd === 'Start Recording'){
      // todo: get appropriate response in console from flask server!
      fetch(props.server_ip + '/start_recording').then(res => {
        console.log(res);
      });
    } else if (cmd === 'Stop Recording') {
      fetch(props.server_ip + '/stop_recording').then(res => {
        console.log(res);
      });
    }
  }

  function updateSentence(data) {
    props.updateSentence(data);
  }

  function recordState() {
    if (record_state) {
      return "Done";
    } else {
      return "Record";
    }
  }
  function record() {
    if (record_state) {
      setDoneRecording(true);
      setRecordState(false);
      sendCmdToServer('Stop Recording');
    } else {
      setRecordState(true);
      sendCmdToServer('Start Recording');
    }
  }

  return (
    <div className='test_container'>
      <div className='testing_content sentence_to_be_read'>
        {props.curr_sentence}
      </div>
      <button className='btn' onClick={record} disabled={done_recording}>
        {recordState()}
      </button>
      <br />
      <button
        className='btn'
        onClick={() => updateSentence('$prev')}
        disabled={props.curr_sentence_index === 0}
      >
        Prev
      </button>
      <button
        className='btn'
        onClick={() => updateSentence('$next')}
        disabled={props.curr_sentence_index === (props.data_length - 1) || !done_recording}
      >
        Next
      </button>
      <br />
      <button className='btn' disabled={!done_recording}>
        Retry
      </button>
    </div>
  );
}

InProcessScreen.propTypes = {
  curr_sentence: PropTypes.string.isRequired,
  curr_sentence_index: PropTypes.number.isRequired,
  data_length: PropTypes.number.isRequired,
  updateSentence: PropTypes.func.isRequired,
  server_ip: PropTypes.string.isRequired
};
