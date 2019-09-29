import React, { useState } from 'react';
import './Tester.scss';
import PropTypes from 'prop-types';
import InProcessScreen from './InProcessScreen.js';
import Timer from '../Timer.js'
import qs from '../../utils/qs'

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
    setIntervalID(createInterval());
  }

  function createInterval() {
    let time = [0, 0, 0];
    return setInterval(() => {
      let hour = time[0];
      let min = time[1];
      let sec = time[2];

      if (sec < 60) {
        sec += 1;
      }
      if (sec === 60) {
        min += 1;
        sec = 0;
      }
      if (min === 60) {
        hour += 1;
        min = 0;
      }
      time = [hour, min, sec];
      document.getElementById('record_time_content').innerHTML =
        'Total Recording Time—' +
        ('0' + hour).slice(-2) +
        ':' +
        ('0' + min).slice(-2) +
        ':' +
        ('0' + sec).slice(-2);
    }, 1000);
  }


  function comp_timer() {
    return (
      <div>
        <pre id='record_time_content'></pre>
      </div>
    );
  }

  function comp_totalTimer() {
    if (qs('name')) {
      return (
        <Timer
          name={'total_timer'}
          socket={props.socket}
          totalTime={props.totalTime}
          updateTotalTime={props.updateTotalTime}
        />
      );
    }
  }

  return (
    <div className='testing_screen'>
      {comp_totalTimer()}
      {props.comp_progressBar(props.recordedProgress, props.data_length - 1, 'center', 2)}
      <div className='middle'>
        <div className='inner'>{comp_inProcessScreen()}</div>
        {comp_timer()}
      </div>
      <pre hidden={(props.recordGreenLight || props.curr_sentence_index === 0) || !qs('name')} className='warning_message'>
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
  recordedProgress: PropTypes.number.isRequired,
  updateRecordProgress: PropTypes.func.isRequired,
  comp_progressBar: PropTypes.func.isRequired,
  totalTime: PropTypes.array.isRequired,
  updateTotalTime: PropTypes.func.isRequired
};

export default Tester;
