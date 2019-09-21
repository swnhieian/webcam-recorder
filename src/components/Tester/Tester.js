import React, { useState, useEffect } from 'react';
import './Tester.scss';
import PropTypes from 'prop-types';
import InProcessScreen from './InProcessScreen.js';
import { Line } from 'rc-progress';
import Timer from '../Timer.js'

function Tester(props) {
  const [intervalID, setIntervalID] = useState(undefined);
  
  function comp_inProcessScreen() {
    return (
      <InProcessScreen
        updateSentence={props.updateSentence}
        curr_sentence_index={props.curr_sentence_index}
        data_length={props.data_length}
        socket={props.socket}
        data={props.data}
        curr_sentence={props.curr_sentence}
        recordGreenLight={props.recordGreenLight}
        updateGreenLightStatus={props.updateGreenLightStatus}
        numFilesSaved={props.numFilesSaved}
        numCams={props.numCams}
        stopTimer={stopTimer}
        startTimer={startTimer}
        recordedProgress={props.recordedProgress}
        updateRecordProgress={props.updateRecordProgress}
      />
    );
  }

  function stopTimer() {
    clearInterval(intervalID);
    document.getElementById('record_time_content').innerHTML = '';
  }

  function startTimer() {
    setIntervalID(createInterval(new Date()));
  }

  function createInterval(startTime) {
    return setInterval(() => {
      const start_min = startTime.getMinutes();
      const start_sec = startTime.getSeconds() % 60;

      const curr = new Date();
      const curr_min = curr.getMinutes();
      const curr_sec = curr.getSeconds() % 60;

      const diffMin = ('0' + (curr_min - start_min)).slice(-2);
      const diffSec = ('0' + (curr_sec - start_sec)).slice(-2);
      document.getElementById('record_time_content').innerHTML =
        'recording time—' + diffMin + ':' + diffSec;
    }, 100);
  }


  function comp_Timer() {
    return (
      <div>
        <pre id='record_time_content'></pre>
      </div>
    );
  }

  return (
    <div className='testing_screen'>
      <Timer name={'total_timer'}/>
      {props.comp_progressBar(props.curr_sentence_index, props.data_length)}
      <div className='middle'>
        <div className='inner'>{comp_inProcessScreen(props)}</div>
        {comp_Timer()}
      </div>
      <pre hidden={props.recordGreenLight || props.curr_sentence_index === 0} className='warning_message'>
        There may be an issue with file saves. Please notify research facilitator.
      </pre>
    </div>
  );
}

Tester.propTypes = {
  updateSentence: PropTypes.func.isRequired,
  curr_sentence_index: PropTypes.number.isRequired,
  curr_sentence: PropTypes.string.isRequired,
  data_length: PropTypes.number.isRequired,
  socket: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  recordGreenLight: PropTypes.bool.isRequired,
  updateGreenLightStatus: PropTypes.func.isRequired,
  numFilesSaved: PropTypes.number.isRequired,
  numCams: PropTypes.number.isRequired,
  recordedProgress: PropTypes.object.isRequired,
  updateRecordProgress: PropTypes.func.isRequired,
  comp_progressBar: PropTypes.func.isRequired
};

export default Tester;
