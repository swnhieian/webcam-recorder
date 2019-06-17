import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client'

export default function InProcessScreen(props) {
  const [recording, setRecordState] = useState(false);
  const [done_recording, setDoneRecording] = useState(false);
  const namespace = '/tsinghua_606';
  const socket = io(props.server_ip + namespace);

  function sendCmdToServer(cmd) {
    if (cmd === 'Start Recording'){
      console.log('fired')
      socket.emit('FIREEEEE (cams)');
    } else if (cmd === 'Stop Recording') {
      console.log('stop recording!')
      socket.emit('STAHPPPPPP (cams)');
    }
  }

  function updateSentence(data) {
    props.updateSentence(data);
  }

  function getRecordState() {
    if (recording) {
      return 'Done';
    } else if (done_recording) {
      return 'Retry';
    } else {
      return 'Record';
    }
  }
  function record() {
    if (recording) {
      setDoneRecording(true);
      setRecordState(false);
      sendCmdToServer('Stop Recording');
    } else {
      setRecordState(true);
      sendCmdToServer('Start Recording');
    }
  }

  useEffect(() => {
    socket.on('start cams bois!', (res) => {
      console.log('YES SIR!!!');
      // props.startCams();
    });
    socket.on('OK STAHPING', (res) => {
      console.log('OK SIR!!!');
    });
  }, [socket])

  return (
    <div className='test_container'>
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
        disabled={props.curr_sentence_index === 0}
      >
        Prev
      </button>
      <button
        className='btn'
        onClick={() => updateSentence('$next')}
        disabled={
          props.curr_sentence_index === props.data_length - 1 ||
          !done_recording
        }
      >
        Next
      </button>
    </div>
  );
}

InProcessScreen.propTypes = {
  curr_sentence: PropTypes.string.isRequired,
  curr_sentence_index: PropTypes.number.isRequired,
  data_length: PropTypes.number.isRequired,
  updateSentence: PropTypes.func.isRequired,
  server_ip: PropTypes.string.isRequired,
  startCams: PropTypes.func.isRequired
};
